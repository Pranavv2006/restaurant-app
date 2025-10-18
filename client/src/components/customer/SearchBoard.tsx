import React, { useEffect, useState } from "react";
import RestaurantCard from "./RestaurantCard";
import {
  retrieveCustomerAddress,
  checkCustomerAddress,
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
}

const cuisines = [
  { name: "Indian", emoji: "🍛" },
  { name: "Italian", emoji: "🍕" },
  { name: "Korean", emoji: "🍜" },
  { name: "Chinese", emoji: "🥢" },
  { name: "Mexican", emoji: "🌮" },
  { name: "Japanese", emoji: "🍣" },
];

const SearchBoard: React.FC<SearchBoardProps> = ({
  results,
  getImageUrl,
  searching,
  query,
  googlePlacesCoords,
}) => {
  const [nearbyRestaurants, setNearbyRestaurants] = useState<
    NearbyRestaurant[]
  >([]);
  const [loadingNearby, setLoadingNearby] = useState(false);
  const [loadingAddress, setLoadingAddress] = useState(false);
  const [customerAddress, setCustomerAddress] = useState<CustomerAddress>(null);
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>([]);

  const toggleCuisine = (cuisine: string) => {
    setSelectedCuisines((prev) =>
      prev.includes(cuisine)
        ? prev.filter((c) => c !== cuisine)
        : [...prev, cuisine]
    );
  };

  const filterRestaurants = (restaurants: NearbyRestaurant[]) => {
    if (selectedCuisines.length === 0) return restaurants;
    return restaurants.filter((restaurant) =>
      selectedCuisines.some((cuisine) =>
        restaurant.cuisine.toLowerCase().includes(cuisine.toLowerCase())
      )
    );
  };

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
      const userRole = user.roleType;

      if (!userId) {
        console.warn("No user ID available");
        return;
      }

      // Only fetch customer data for actual customers, not merchants
      if (userRole !== 'Customer') {
        console.log("Skipping customer data fetch - user is not a customer");
        setCustomerAddress(null);
        setLoadingAddress(false);
        return;
      }

      setLoadingAddress(true);
      try {
        // Get customer address first to get customer ID
        const addressResponse = await checkCustomerAddress(userId);

        if (
          !addressResponse.success ||
          !addressResponse.hasAddress ||
          !addressResponse.data
        ) {
          console.warn("Customer address not found");
          setCustomerAddress(null);
          setLoadingAddress(false);
          return;
        }

        const customerId = addressResponse.data.id;

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
      // Priority: Google Places coordinates > Customer address > Default coordinates
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

  const filteredResults =
    selectedCuisines.length > 0
      ? results.filter((restaurant) =>
          selectedCuisines.some((cuisine) =>
            restaurant.cuisine.toLowerCase().includes(cuisine.toLowerCase())
          )
        )
      : results;

  const filteredNearbyRestaurants = filterRestaurants(nearbyRestaurants);

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
      {/* Cuisine Filter Bubbles */}
      <div className="mb-6">
        <div className="flex flex-wrap justify-center gap-3">
          {cuisines.map((cuisine) => (
            <button
              key={cuisine.name}
              onClick={() => toggleCuisine(cuisine.name)}
              className={`px-4 py-2 rounded-full border-2 transition-all duration-300 transform hover:scale-105 ${
                selectedCuisines.includes(cuisine.name)
                  ? "bg-red-500 text-white border-red-500 shadow-lg"
                  : "bg-white dark:bg-neutral-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-neutral-600 hover:border-red-300 dark:hover:border-red-400"
              }`}
            >
              <span className="mr-2">{cuisine.emoji}</span>
              {cuisine.name}
            </button>
          ))}
        </div>
        {selectedCuisines.length > 0 && (
          <div className="text-center mt-3">
            <button
              onClick={() => setSelectedCuisines([])}
              className="text-sm text-red-500 hover:text-red-700 underline transition-colors duration-200"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
      {searching && query.trim() && (
        <div className="text-center text-gray-500 dark:text-gray-400">
          Searching...
        </div>
      )}

      {!searching && query.trim() && filteredResults.length > 0 && (
        <div>
          {selectedCuisines.length > 0 && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Showing {filteredResults.length} restaurant(s) for:{" "}
              {selectedCuisines.join(", ")}
            </p>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 animate-fadeInUp">
            {filteredResults.map((restaurant, idx) => (
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
          ) : filteredNearbyRestaurants.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 animate-fadeInUp">
                {filteredNearbyRestaurants.map((restaurant, idx) => (
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
              {selectedCuisines.length > 0
                ? `No ${selectedCuisines.join(", ")} restaurants found nearby.`
                : "No nearby restaurants found."}
            </div>
          )}
        </div>
      )}

      {!searching &&
        query.trim() &&
        filteredResults.length === 0 &&
        results.length > 0 && (
          <div className="text-center text-gray-500 dark:text-gray-400 mt-8">
            No restaurants found matching the selected cuisine filters.
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
