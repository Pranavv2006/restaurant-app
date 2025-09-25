import { useEffect, useState } from "react";

interface MenuItem {
  id: number;
  restaurantId: number;
  name: string;
  description: string | null;
  price: number;
  imageUrl: string | null;
  category: string;
}

const MenuListings = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fallbackImage = "/Images/restaurant-placeholder.png";

  const fetchMenuData = async (): Promise<MenuItem[]> => {
    return [
      {
        id: 1,
        restaurantId: 1,
        name: "Beija Flor",
        description: "Hazelnut, Grape, Milk Chocolate",
        price: 5.5,
        imageUrl: "../assets/img/pro/coffee-shop/img1.png",
        category: "Coffee",
      },
      {
        id: 2,
        restaurantId: 1,
        name: "El Mirador",
        description: "Red Apple, Caramel, Almond",
        price: 7.5,
        imageUrl: "../assets/img/pro/coffee-shop/img2.png",
        category: "Coffee",
      },
      {
        id: 3,
        restaurantId: 1,
        name: "Pedra Branca",
        description: "Red Apple, Walnut, Milk Chocolate",
        price: 2.1,
        imageUrl: "../assets/img/pro/coffee-shop/img5.png",
        category: "Coffee",
      },
      {
        id: 4,
        restaurantId: 1,
        name: "Espresso",
        description: "A strong, full-bodied coffee shot.",
        price: 3.0,
        imageUrl: null,
        category: "Coffee",
      },
    ];
  };

  useEffect(() => {
    const getMenuData = async () => {
      try {
        const data = await fetchMenuData();
        setMenuItems(data);
      } catch (err) {
        setError("Failed to fetch menu items.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    getMenuData();
  }, []);

  if (loading) {
    return (
      <div className="text-center p-10">
        <p>Loading menu...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-10 text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-[85rem] px-4 sm:px-6 lg:px-8 py-12 lg:py-24 mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
        {menuItems.map((item) => (
          <div
            key={item.id}
            className="flex flex-col bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-2xl shadow-md overflow-hidden transition hover:shadow-lg"
          >
            <div className="aspect-[4/3] overflow-hidden">
              <img
                className="w-full h-48 object-cover"
                src={item.imageUrl || fallbackImage}
                alt={item.name}
                onError={(e) => (e.currentTarget.src = fallbackImage)}
              />
            </div>
            <div className="flex-1 flex flex-col p-5">
              <h3 className="font-semibold text-lg text-gray-800 dark:text-white mb-1">
                {item.name}
              </h3>
              <p className="font-bold text-yellow-600 dark:text-yellow-400 mb-2">
                ${item.price.toFixed(2)}
              </p>
              {item.description && (
                <div className="text-sm text-gray-600 dark:text-neutral-300 mb-2">
                  <span className="font-medium">Description:</span>{" "}
                  {item.description}
                </div>
              )}
              <div className="flex justify-between text-xs text-gray-500 dark:text-neutral-400 mb-4">
                <span>
                  <span className="font-medium">Category:</span> {item.category}
                </span>
              </div>
              <div className="mt-auto">
                <button className="w-full py-2 px-3 rounded-xl bg-yellow-400 hover:bg-yellow-500 text-black font-medium transition focus:outline-none focus:ring-2 focus:ring-yellow-300">
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MenuListings;
