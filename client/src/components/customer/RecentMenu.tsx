import React from "react";
import MenuCard from "./MenuCard";

const RecentMenu: React.FC = () => {
  const items = [
    {
      title: "Margherita Pizza",
      subtitle: "Italian Classic",
      description: "Fresh mozzarella, basil, and tomato sauce.",
      imageUrl: "https://source.unsplash.com/400x300/?pizza",
      primaryAction: { label: "Order Now", href: "#" },
      secondaryAction: { label: "View Details", href: "#" },
    },
    {
      title: "Chicken Biryani",
      subtitle: "Spicy & Flavorful",
      description: "Authentic Hyderabadi chicken biryani with raita.",
      imageUrl: "https://source.unsplash.com/400x300/?biryani",
      primaryAction: { label: "Order Now", href: "#" },
      secondaryAction: { label: "View Details", href: "#" },
    },
    {
      title: "Sushi Platter",
      subtitle: "Japanese Delight",
      description: "Assorted sushi with fresh salmon and tuna.",
      imageUrl: "https://source.unsplash.com/400x300/?sushi",
      primaryAction: { label: "Order Now", href: "#" },
      secondaryAction: { label: "View Details", href: "#" },
    },
  ];

  return (
    <div className="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item, idx) => (
          <MenuCard key={idx} {...item} />
        ))}
      </div>
    </div>
  );
};

export default RecentMenu;
