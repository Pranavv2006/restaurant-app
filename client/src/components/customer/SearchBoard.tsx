import React, { useEffect, useState } from "react";
import RestaurantCard from "./RestaurantCard";
import {
  getAllCustomerAddresses,
} from "../../services/CustomerService";
import { getNearbyRestaurants } from "../../services/HomeService";
import type { NearbyRestaurant } from "../../services/HomeService";

type CustomerAddress = {
  latitude: number;
  longitude: number;
} | null;

interface SearchBoardProps {
  results: any[];
  getImageUrl: (url?: string) => string;
  searching: boolean;
  query: string;
  hasSearched: boolean;
  googlePlacesCoords?: {
    latitude: number;
    longitude: number;
  };
  onRestaurantsUpdate?: (restaurants: any[]) => void;
}

const SearchBoard: React.FC<SearchBoardProps> = ({
  results,
  getImageUrl,
  searching,
  query,
  googlePlacesCoords,
  onRestaurantsUpdate,
}) => {
  const [nearbyRestaurants, setNearbyRestaurants] = useState<
    NearbyRestaurant[]
  >([]);
  const [loadingNearby, setLoadingNearby] = useState(false);
  const [loadingAddress, setLoadingAddress] = useState(false);
  const [customerAddress, setCustomerAddress] = useState<CustomerAddress>(null);

  useEffect(() => {
    const fetchAddress = async () => {
      const userData = localStorage.getItem("user");
      if (!userData) {
        console.warn("No user data available");
        return;
      }

      const user = JSON.parse(userData);
      const userId = user.id;
      const userRole = user.roleType;

      if (!userId) {
        console.warn("No user ID available");
        return;
      }

      if (userRole !== 'Customer') {
        console.log("Skipping customer data fetch - user is not a customer");
        setCustomerAddress(null);
        setLoadingAddress(false);
        return;
      }

      setLoadingAddress(true);
      try {
        const addressResponse = await getAllCustomerAddresses(userId);

        if (!addressResponse.success || !addressResponse.data || addressResponse.data.totalAddresses === 0) {
          console.warn("Customer has no addresses");
          setCustomerAddress(null);
          setLoadingAddress(false);
          return;
        }

        const defaultAddress = addressResponse.data.defaultAddress;

        if (defaultAddress && defaultAddress.latitude && defaultAddress.longitude) {
          setCustomerAddress({
            latitude: defaultAddress.latitude,
            longitude: defaultAddress.longitude,
          });
          console.log("Customer default address retrieved successfully:", defaultAddress);
        } else {
          setCustomerAddress(null);
          console.warn(
            "Could not retrieve customer default address with coordinates. Using default location."
          );
        }
      } catch (error) {
        console.error("Failed to fetch customer addresses:", error);
        setCustomerAddress(null);
      } finally {
        setLoadingAddress(false);
      }
    };

    fetchAddress();
  }, []);

  useEffect(() => {
    const fetchNearbyRestaurants = async () => {
      const latitude = googlePlacesCoords?.latitude || customerAddress?.latitude || 28.6139;
      const longitude = googlePlacesCoords?.longitude || customerAddress?.longitude || 77.209;
      
      const usingGooglePlaces = googlePlacesCoords?.latitude !== undefined;
      console.log(`Fetching nearby restaurants using ${usingGooglePlaces ? 'Google Places' : 'customer/default'} coordinates:`, { latitude, longitude });

      try {
        setLoadingNearby(true);

        const response = await getNearbyRestaurants({
          latitude: latitude,
          longitude: longitude,
          radiusKm: 20,
        });

        if (response.success && response.data) {
          setNearbyRestaurants(response.data);
          console.log(
            `Found ${response.data.length} nearby restaurants using ${
              customerAddress ? "customer location" : "default location"
            }`
          );
        } else {
          setNearbyRestaurants([]);
        }
      } catch (err) {
        console.error("Failed to fetch nearby restaurants", err);
        setNearbyRestaurants([]);
      } finally {
        setLoadingNearby(false);
      }
    };

    if (!query.trim()) {
      if (!loadingAddress) {
        fetchNearbyRestaurants();
      }
    } else {
      setNearbyRestaurants([]);
    }
  }, [query, customerAddress, loadingAddress, googlePlacesCoords]);

  useEffect(() => {
    const currentRestaurants = query.trim() ? results : nearbyRestaurants;
    if (onRestaurantsUpdate) {
      onRestaurantsUpdate(currentRestaurants);
    }
  }, [results, nearbyRestaurants, query, onRestaurantsUpdate]);

  return (
    <div
      className={`mt-12 transition-all duration-700 ease-out transform ${
        results.length > 0 ||
        searching ||
        query ||
        nearbyRestaurants.length > 0 ||
        loadingNearby ||
        loadingAddress
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-10"
      }`}
    >
      {searching && query.trim() && (
        <div className="text-center text-gray-500 dark:text-gray-400">
          Searching...
        </div>
      )}

      {!searching && query.trim() && results.length > 0 && (
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 animate-fadeInUp">
            {results.map((restaurant, idx) => (
              <RestaurantCard
                key={restaurant.id}
                id={restaurant.id}
                name={restaurant.name}
                location={restaurant.location}
                cuisine={restaurant.cuisine}
                imageUrl={getImageUrl(restaurant.imageUrl)}
                index={idx}
              />
            ))}
          </div>
        </div>
      )}

      {!searching && !query.trim() && (
        <div>
          {loadingAddress || loadingNearby ? (
            <div className="text-center text-gray-500 dark:text-gray-400 mt-8">
              {loadingAddress
                ? "Finding your address..."
                : "Loading nearby restaurants..."}
            </div>
          ) : nearbyRestaurants.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 animate-fadeInUp">
                {nearbyRestaurants.map((restaurant, idx) => (
                  <RestaurantCard
                    key={restaurant.id}
                    id={restaurant.id}
                    name={restaurant.name}
                    location={restaurant.location}
                    cuisine={restaurant.cuisine}
                    imageUrl={getImageUrl(restaurant.imageUrl)}
                    index={idx}
                  />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center text-gray-500 dark:text-gray-400 mt-8">
              No nearby restaurants found.
            </div>
          )}
        </div>
      )}

      {!searching && query.trim() && results.length === 0 && (
        <div className="text-center text-gray-500 dark:text-gray-400 mt-8">
          No restaurants found for your search.
        </div>
      )}
    </div>
  );
};

export default SearchBoard;
