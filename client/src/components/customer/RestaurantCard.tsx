import React from "react";
import { useNavigate } from "react-router-dom"; // <-- Add this import

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
  id,
  name,
  location,
  cuisine,
  imageUrl,
  index = 0,
}) => {
  const navigate = useNavigate(); // <-- Initialize navigate

  const handleClick = () => {
    navigate(`/customer/RestaurantPage`); // <-- Navigate to restaurant page
  };

  return (
    <div
      className="bg-white dark:bg-neutral-800 rounded-2xl shadow-md overflow-hidden transform transition-all duration-700 ease-out opacity-0 animate-fadeInUp cursor-pointer hover:shadow-lg"
      style={{ animationDelay: `${index * 150}ms` }}
      onClick={handleClick} // <-- Add onClick handler
      tabIndex={0}
      role="button"
      onKeyPress={(e) => {
        if (e.key === "Enter" || e.key === " ") handleClick();
      }}
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
