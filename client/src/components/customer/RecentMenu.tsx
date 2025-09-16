import React from "react";
import MenuCard from "./MenuCard";

const RecentMenu: React.FC = () => {
  const items = [
    {
      title: "Margherita Pizza",
      subtitle: "Italian Classic",
      description: "Fresh mozzarella, basil, and tomato sauce.",
      imageUrl:
        "https://simplyhomecooked.com/wp-content/uploads/2023/04/Margherita-Pizza-3.jpg",
      primaryAction: { label: "Order Now", href: "#" },
      secondaryAction: { label: "View Details", href: "#" },
    },
    {
      title: "Chicken Biryani",
      subtitle: "Spicy & Flavorful",
      description: "Authentic Hyderabadi chicken biryani with raita.",
      imageUrl:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTPcdlgGqTXb-qtbAK_WgscTy2TimgPjzn9fw&s",
      primaryAction: { label: "Order Now", href: "#" },
      secondaryAction: { label: "View Details", href: "#" },
    },
    {
      title: "Sushi Platter",
      subtitle: "Japanese Delight",
      description: "Assorted sushi with fresh salmon and tuna.",
      imageUrl:
        "https://media.istockphoto.com/id/1224916255/photo/sushi-maki-with-salmon-shrimp-cucumber.jpg?s=612x612&w=0&k=20&c=qIu0V_qKpP1R2xWMxID0tRGPDhOivHQ9CJFiZLcXpI8=",
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
