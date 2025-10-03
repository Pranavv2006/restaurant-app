import React, { useEffect, useState } from "react";
import RestaurantCard from "./RestaurantCard";
import {
  getNearbyRestaurants,
  retrieveCustomerAddress,
  checkCustomerProfile,
} from "../../services/CustomerService";
import type { NearbyRestaurant } from "../../services/CustomerService";

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
}

const SearchBoard: React.FC<SearchBoardProps> = ({
  results,
  getImageUrl,
  searching,
  query,
}) => {
  const [nearbyRestaurants, setNearbyRestaurants] = useState<
    NearbyRestaurant[]
  >([]);
  const [loadingNearby, setLoadingNearby] = useState(false);
  const [loadingAddress, setLoadingAddress] = useState(false);
  const [customerAddress, setCustomerAddress] = useState<CustomerAddress>(null);

  useEffect(() => {
    const fetchAddress = async () => {
      // First get the customer ID from the user profile
      const userData = localStorage.getItem("user");
      if (!userData) {
        console.warn("No user data available");
        return;
      }

      const user = JSON.parse(userData);
      const userId = user.id;

      if (!userId) {
        console.warn("No user ID available");
        return;
      }

      setLoadingAddress(true);
      try {
        // Get customer profile first to get customer ID
        const profileResponse = await checkCustomerProfile(userId);

        if (
          !profileResponse.success ||
          !profileResponse.hasProfile ||
          !profileResponse.data
        ) {
          console.warn("Customer profile not found");
          setCustomerAddress(null);
          setLoadingAddress(false);
          return;
        }

        const customerId = profileResponse.data.id;

        // Now get the address using customer ID
        const addressData = await retrieveCustomerAddress(customerId);

        if (addressData && addressData.latitude && addressData.longitude) {
          setCustomerAddress({
            latitude: addressData.latitude,
            longitude: addressData.longitude,
          });
          console.log("Customer Address retrieved successfully:", addressData);
        } else {
          setCustomerAddress(null);
          console.warn(
            "Could not retrieve customer address with coordinates. Using default location."
          );
        }
      } catch (error) {
        console.error("Failed to fetch customer address:", error);
        setCustomerAddress(null);
      } finally {
        setLoadingAddress(false);
      }
    };

    fetchAddress();
  }, []); // Run once on component mount

  useEffect(() => {
    const fetchNearbyRestaurants = async () => {
      const latitude = customerAddress?.latitude || 28.6139;
      const longitude = customerAddress?.longitude || 77.209;

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
  }, [query, customerAddress, loadingAddress]);

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
              <h2 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-300">
                Nearby Restaurants
              </h2>
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
