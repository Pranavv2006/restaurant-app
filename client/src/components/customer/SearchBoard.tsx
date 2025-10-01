import React, { useEffect, useState } from "react";
import RestaurantCard from "./RestaurantCard";
import { getNearbyRestaurants } from "../../services/CustomerService"; // adjust path
import type { NearbyRestaurant } from "../../services/CustomerService";

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

  useEffect(() => {
    const fetchNearbyRestaurants = async () => {
      try {
        setLoadingNearby(true);

        const response = await getNearbyRestaurants({
          latitude: 12.9716,
          longitude: 77.5946,
          radiusKm: 5,
        });

        if (response.success && response.data) {
          setNearbyRestaurants(response.data);
        }
      } catch (err) {
        console.error("Failed to fetch nearby restaurants", err);
      } finally {
        setLoadingNearby(false);
      }
    };

    // 🔑 Trigger when typing field is empty
    if (!query.trim()) {
      fetchNearbyRestaurants();
    } else {
      setNearbyRestaurants([]); // clear nearby if user starts typing
    }
  }, [query]);

  return (
    <div
      className={`mt-12 transition-all duration-700 ease-out transform ${
        results.length > 0 || searching || query
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-10"
      }`}
    >
      {searching && query.trim() && (
        <div className="text-center text-gray-500 dark:text-gray-400">
          Searching...
        </div>
      )}

      {/* Search Results */}
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

      {/* Nearby Restaurants (when typing field is empty) */}
      {!searching && !query.trim() && (
        <div>
          {loadingNearby ? (
            <div className="text-center text-gray-500 dark:text-gray-400 mt-8">
              Loading nearby restaurants...
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

      {/* No Results for Search */}
      {!searching && query.trim() && results.length === 0 && (
        <div className="text-center text-gray-500 dark:text-gray-400 mt-8">
          No restaurants found.
        </div>
      )}
    </div>
  );
};

export default SearchBoard;
