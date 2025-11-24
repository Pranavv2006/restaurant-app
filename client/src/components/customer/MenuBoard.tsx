import { useEffect, useState } from "react";
import MenuCard from "./MenuCard";
import { selectRestaurants } from "../../services/CustomerService";

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  restaurantId?: number;
  restaurantName?: string;
}

interface MenuBoardProps {
  restaurantIds: number[];
  onAddToCart?: (item: MenuItem, quantity: number) => void;
}

const MenuBoard: React.FC<MenuBoardProps> = ({ restaurantIds, onAddToCart }) => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMenuItems = async () => {
      if (restaurantIds.length === 0) {
        setMenuItems([]);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const allMenuItems: MenuItem[] = [];

        for (const restaurantId of restaurantIds) {
          const response = await selectRestaurants({ restaurantId });

          if (response.success && response.data) {
            const restaurantData = response.data;
            
            if (restaurantData.menu && restaurantData.menu.length > 0) {
              const itemsWithRestaurant = restaurantData.menu.map((item: any) => ({
                ...item,
                price: parseFloat(item.price),
                restaurantId,
                restaurantName: restaurantData.restaurantName,
              }));
              
              allMenuItems.push(...itemsWithRestaurant);
            }
          }
        }

        setMenuItems(allMenuItems);
      } catch (err) {
        console.error("Error fetching menu items:", err);
        setError("Failed to load menu items");
      } finally {
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, [restaurantIds]);

  const getImageUrl = (url?: string) => {
    if (!url) return "https://images.unsplash.com/photo-1546069901-ba9599a7e63c";
    if (url.startsWith("http")) return url;
    return `http://localhost:3000${url}`;
  };

  const isVeg = (category: string) =>
    category.toLowerCase().includes("veg");

  const groupedMenuRaw = menuItems.reduce((acc, item) => {
    const category = item.category || "Other";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {} as { [key: string]: MenuItem[] });

  const groupedMenu: { [key: string]: MenuItem[] } = {};

  for (const [category, items] of Object.entries(groupedMenuRaw)) {
    const shuffled = items.sort(() => Math.random() - 0.5);

    if (isVeg(category)) {
      groupedMenu[category] = shuffled.slice(0, 10);
    } else {
      groupedMenu[category] = shuffled.slice(0, 10);
    }
  }

  if (loading) {
    return (
      <div className="py-12">
        <div className="flex flex-col items-center justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-500 border-t-transparent mb-4"></div>
          <p className="text-xl font-semibold text-gray-600 dark:text-gray-400 animate-pulse">
            Loading delicious menu items...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-12 text-center">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    );
  }

  if (menuItems.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-gray-500 dark:text-gray-400 text-lg">
          No menu items available from the selected restaurants.
        </p>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-600 to-green-500 bg-clip-text text-transparent">
          🍽️ Explore Our Menu
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Showing {menuItems.length} delicious items from {restaurantIds.length} restaurant(s)
        </p>
      </div>

      {Object.entries(groupedMenu).map(([category, items]) => (
        <section key={category} className="mb-12">
          <div className="text-center mb-6">
            <h3 className="text-2xl md:text-3xl font-bold mb-2 text-gray-800 dark:text-white">
              {category === "Vegetarian" ? "🌱" : "🍖"} {category}
            </h3>
            <div className={`w-24 h-1 mx-auto rounded-full ${
              category === "Vegetarian" 
                ? "bg-gradient-to-r from-green-400 to-green-600"
                : "bg-gradient-to-r from-red-400 to-red-600"
            }`}></div>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              ({items.length} items)
            </p>
          </div>

          <div className="flex overflow-x-auto gap-6 pb-4 scrollbar-hide">
            {items.map((item) => (
              <div key={`${item.restaurantId}-${item.id}`} className="flex-none w-80 relative">
                {item.restaurantName && (
                  <div className="absolute top-4 left-4 z-10">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 shadow-sm">
                      🏪 {item.restaurantName}
                    </span>
                  </div>
                )}
                
                <MenuCard
                  title={item.name}
                  subtitle={item.category}
                  description={item.description}
                  imageUrl={getImageUrl(item.imageUrl)}
                  price={item.price}
                  onAddToCart={(quantity) => {
                    if (onAddToCart) {
                      onAddToCart(item, quantity);
                    }
                  }}
                />
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
};

export default MenuBoard;

