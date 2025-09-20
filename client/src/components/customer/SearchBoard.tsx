import React from "react";
import RestaurantCard from "./RestaurantCard";

interface SearchBoardProps {
  results: any[];
  getImageUrl: (url?: string) => string;
  searching: boolean;
  query: string;
}

const SearchBoard: React.FC<SearchBoardProps> = ({
  results,
  getImageUrl,
  searching,
  query,
}) => {
  return (
    <div
      className={`mt-12 transition-all duration-700 ease-out transform ${
        results.length > 0 || searching || query
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-10"
      }`}
    >
      {searching && (
        <div className="text-center text-gray-500 dark:text-gray-400">
          Searching...
        </div>
      )}

      {!searching && results.length > 0 && (
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

      {!searching && results.length === 0 && query && (
        <div className="text-center text-gray-500 dark:text-gray-400 mt-8">
          No restaurants found.
        </div>
      )}
    </div>
  );
};

export default SearchBoard;
