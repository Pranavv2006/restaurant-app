import React from "react";

interface RestaurantCardProps {
  id: number;
  name: string;
  location?: string;
  cuisine?: string;
  phone?: string;
  imageUrl?: string;
  index?: number; // for staggered animation
}

const RestaurantCard: React.FC<RestaurantCardProps> = ({
  name,
  location,
  cuisine,
  imageUrl,
  index = 0,
}) => {
  return (
    <div
      className="bg-white dark:bg-neutral-800 rounded-2xl shadow-md overflow-hidden transform transition-all duration-700 ease-out opacity-0 animate-fadeInUp"
      style={{ animationDelay: `${index * 150}ms` }}
    >
      <img
        src={imageUrl}
        alt={name}
        onError={(e) => {
          e.currentTarget.src = "/Images/restaurant-placeholder.png";
        }}
        className="w-full h-40 object-cover"
      />
      <div className="p-4 text-left">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
          {name}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {cuisine || "Cuisine not specified"}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-500">
          {location || "Location unavailable"}
        </p>
      </div>
    </div>
  );
};

export default RestaurantCard;
