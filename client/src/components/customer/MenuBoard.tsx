import { useEffect, useState, useMemo } from "react";
import MenuCard from "./MenuCard";
import { selectRestaurants, addToCart, getAllCustomerAddresses } from "../../services/CustomerService";
import { triggerCartUpdate, useCart } from "../../hooks/useCart";

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

interface CartState {
  [itemKey: string]: {
    loading: boolean;
    message: { type: 'success' | 'error'; text: string } | null;
  };
}

const MenuBoard = ({ restaurantIds } : MenuBoardProps) => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cartStates, setCartStates] = useState<CartState>({});
  const [localQuantities, setLocalQuantities] = useState<{ [key: number]: number }>({});
  const [customerId, setCustomerId] = useState<number | null>(null);
  const { cartItems: globalCartItems } = useCart();

  const isCustomer = (): boolean => {
    try {
      const userStr = localStorage.getItem("user");
      if (!userStr) return false;
      
      const user = JSON.parse(userStr);
      return user.roleType === 'Customer';
    } catch {
      return false;
    }
  };

  // Get customer ID from the addresses endpoint (same pattern as CustomerNav)
  useEffect(() => {
    const getCustomerId = async () => {
      const userStr = localStorage.getItem("user");
      if (!userStr || !isCustomer()) {
        setCustomerId(null);
        return;
      }

      try {
        const user = JSON.parse(userStr);
        const result = await getAllCustomerAddresses(user.id);
        if (result.success && result.data && result.data.customer) {
          setCustomerId(result.data.customer.id);
        } else {
          setCustomerId(null);
        }
      } catch (error) {
        console.error('Error getting customer ID:', error);
        setCustomerId(null);
      }
    };

    getCustomerId();
  }, []);

  const getDisplayQuantity = (item: MenuItem): number => {
    const existing = globalCartItems.find(ci => ci.menu.id === item.id);
    return existing ? existing.quantity : (localQuantities[item.id] || 1);
  };

  const handleLocalQuantityChange = (itemId: number, delta: number) => {
    setLocalQuantities(prev => {
      const current = prev[itemId] || 1;
      const newQuantity = Math.max(1, current + delta);
      return { ...prev, [itemId]: newQuantity };
    });
  };

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

  const getItemKey = (item: MenuItem): string => {
    return `${item.restaurantId}-${item.id}`;
  };

  const handleAddToCart = async (item: MenuItem, quantity?: number) => {
    const itemKey = getItemKey(item);

    // Check authentication first
    if (!isCustomer()) {
      setCartStates(prev => ({
        ...prev,
        [itemKey]: {
          loading: false,
          message: { type: 'error', text: 'Please log in as customer' }
        }
      }));
      
      setTimeout(() => {
        setCartStates(prev => ({
          ...prev,
          [itemKey]: { loading: false, message: null }
        }));
      }, 3000);
      
      return;
    }

    const userStr = localStorage.getItem("user");
    if (!userStr) {
      setCartStates(prev => ({
        ...prev,
        [itemKey]: {
          loading: false,
          message: { type: 'error', text: 'User not found. Please login again.' }
        }
      }));
      return;
    }

    // Check if customerId is available
    if (!customerId) {
      setCartStates(prev => ({
        ...prev,
        [itemKey]: {
          loading: false,
          message: { type: 'error', text: 'Customer profile not found. Please complete your profile first.' }
        }
      }));
      
      setTimeout(() => {
        setCartStates(prev => ({
          ...prev,
          [itemKey]: { loading: false, message: null }
        }));
      }, 4000);
      
      return;
    }

    const finalQuantity = quantity || localQuantities[item.id] || 1;

    setCartStates(prev => ({
      ...prev,
      [itemKey]: { loading: true, message: null }
    }));

    try {
      const response = await addToCart({
        customerId: customerId,
        menuId: item.id,
        quantity: finalQuantity
      });

      if (response.success) {

        // Clear local quantity for this item
        setLocalQuantities(prev => {
          const newState = { ...prev };
          delete newState[item.id];
          return newState;
        });

        // Trigger cart update
        triggerCartUpdate();

        // Set success state
        setCartStates(prev => ({
          ...prev,
          [itemKey]: {
            loading: false,
            message: { type: 'success', text: 'Added!' }
          }
        }));

        // Clear success message after 1.5 seconds
        setTimeout(() => {
          setCartStates(prev => ({
            ...prev,
            [itemKey]: { loading: false, message: null }
          }));
        }, 1500);

      } else {
        
        // Set error state
        setCartStates(prev => ({
          ...prev,
          [itemKey]: {
            loading: false,
            message: { type: 'error', text: response.message || 'Failed to add' }
          }
        }));

        // Clear error message after 4 seconds
        setTimeout(() => {
          setCartStates(prev => ({
            ...prev,
            [itemKey]: { loading: false, message: null }
          }));
        }, 4000);
      }

    } catch (err) {
      
      // Set error state - This was missing before!
      setCartStates(prev => ({
        ...prev,
        [itemKey]: {
          loading: false, // Make sure loading is set to false
          message: { type: 'error', text: 'Network error. Please try again.' }
        }
      }));

      // Clear error message after 4 seconds
      setTimeout(() => {
        setCartStates(prev => ({
          ...prev,
          [itemKey]: { loading: false, message: null }
        }));
      }, 4000);
    }
  };

  const groupedMenu = useMemo(() => {
    const grouped = menuItems.reduce((acc, item) => {
      const category = item.category || "Other";
      if (!acc[category]) acc[category] = [];
      acc[category].push(item);
      return acc;
    }, {} as { [key: string]: MenuItem[] });

    const final: { [key: string]: MenuItem[] } = {};

    for (const [category, items] of Object.entries(grouped)) {
      const shuffled = [...items].sort(() => Math.random() - 0.5);
      final[category] = shuffled.slice(0, 10);
    }

    return final;
  }, [menuItems]);

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
          Explore Our Menu
        </h2>
      </div>

      {Object.entries(groupedMenu).map(([category, items]) => (
        <section key={category} className="mb-12">
          <div className="text-center mb-6">
            <h3 className="text-2xl md:text-3xl font-bold mb-2 text-gray-800 dark:text-white">
              {category}
            </h3>
            <div className={`w-24 h-1 mx-auto rounded-full ${
              category === "Vegetarian" 
                ? "bg-gradient-to-r from-green-400 to-green-600"
                : "bg-gradient-to-r from-red-400 to-red-600"
            }`}></div>
          </div>

          <div className="flex overflow-x-auto gap-6 pb-4 scrollbar-hide">
            {items.map((item) => {
              const itemKey = getItemKey(item);
              const cartState = cartStates[itemKey];

              return (
                <div key={itemKey} className="flex-none w-80 relative">
                  {item.restaurantName && (
                    <div className="absolute top-4 left-4 z-10">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 shadow-sm">
                        {item.restaurantName}
                      </span>
                    </div>
                  )}
                  
                  <MenuCard
                    title={item.name}
                    description={item.description}
                    imageUrl={getImageUrl(item.imageUrl)}
                    price={item.price}
                    isAddingToCart={cartState?.loading || false}
                    addToCartMessage={cartState?.message || null}
                    quantity={getDisplayQuantity(item)}
                    onIncrease={() => handleLocalQuantityChange(item.id, +1)}
                    onDecrease={() => handleLocalQuantityChange(item.id, -1)}
                    onAddToCart={(q) => handleAddToCart(item, q)}
                  />
                </div>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
};

export default MenuBoard;

