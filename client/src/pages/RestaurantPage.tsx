import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  FaShoppingCart,
  FaUtensils,
  FaPlus,
  FaMinus,
} from "react-icons/fa";
import {
  selectRestaurants,
  addToCart,
  getAllCustomerAddresses,
  retrieveCart,
  updateCartItem,
  removeCartItem,
} from "../services/CustomerService";
import CartModal from "../components/customer/CartModal";
import { useParams } from "react-router-dom";
import AddToCartToast from "../components/customer/AddToCartToast";
import ProfileErrorToast from "../components/customer/AddressErrorToast";
import CreateCustomerProfileModal from "../components/customer/ManageCustomerAddressModal";
import useAuth from "../hooks/useAuth";
import CustomerNav from "../components/customer/CustomerNav";
import { triggerCartUpdate } from "../hooks/useCart";

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
}

interface RestaurantDetails {
  restaurantName: string;
  menu: MenuItem[];
}

const RestaurantPage: React.FC = () => {
  const { restaurantId } = useParams<{ restaurantId: string }>();
  const { isAuthenticated, user, loading: authLoading } = useAuth();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [restaurantName, setRestaurantName] =
    useState<string>("Restaurant Menu");

  // Toast states
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // Customer address state
  const [hasAddress, setHasAddress] = useState(false);
  const [customerId, setCustomerId] = useState<number | null>(null);
  const [showAddressError, setShowAddressError] = useState(false);
  const [showCreateAddressModal, setShowCreateAddressModal] = useState(false);

  // Cart state
  const [cartItems, setCartItems] = useState<{ [key: number]: number }>({});
  const [showCartModal, setShowCartModal] = useState(false);

  // Local quantity state for items not yet in cart
  const [localQuantities, setLocalQuantities] = useState<{ [key: number]: number }>({});

  // Animation entrance effect - only play once per page visit
  const hasAnimated = useRef(false);

  // Helper function to check if user is authenticated customer
  const isCustomer = () => {
    return isAuthenticated && user?.roleType === 'Customer';
  };

  useEffect(() => {
    if (!hasAnimated.current) {
      const timer = setTimeout(() => {
        setIsVisible(true);
        hasAnimated.current = true;
      }, 100);
      return () => clearTimeout(timer);
    } else {
      // If animation has already played, set visible immediately
      setIsVisible(true);
    }
  }, []);

  // Check customer address on component mount - only for authenticated customers
  useEffect(() => {
    const checkAddress = async () => {
      // Only check address if user is authenticated and is a customer
      if (!isCustomer()) {
        console.log("User is not an authenticated customer - skipping address check");
        setHasAddress(false);
        setCustomerId(null);
        return;
      }

      const userId = user.id;
      if (!userId) {
        console.error("No user ID found");
        return;
      }

      try {
        const result = await getAllCustomerAddresses(userId);
        if (result.success && result.data && result.data.totalAddresses > 0) {
          setHasAddress(true);
          setCustomerId(result.data.customer.id);
        } else {
          setHasAddress(false);
          setCustomerId(null);
        }
      } catch (error) {
        console.error("Error checking customer addresses:", error);
        setHasAddress(false);
        setCustomerId(null);
      }
    };
    
    // Only run when auth state is resolved
    if (!authLoading) {
      checkAddress();
    }
  }, [isAuthenticated, user, authLoading]);

  // Fetch cart items when customer ID is available and user is authenticated customer
  useEffect(() => {
    if (customerId && isCustomer()) {
      fetchCartItems();
    }
  }, [customerId, isAuthenticated, user]);

  // Handle address creation success
  const handleAddressSuccess = (data: any) => {
    setHasAddress(true);
    setCustomerId(data.customer.id);
    setShowCreateAddressModal(false);
    setShowAddressError(false);
    fetchCartItems(data.customer.id);
  };

  // Fetch cart items to populate counter - only for authenticated customers
  const fetchCartItems = async (customerIdToUse?: number) => {
    // Check if user is authenticated customer before making API call
    if (!isCustomer()) {
      console.log("User is not an authenticated customer - skipping cart fetch");
      setCartItems({});
      return;
    }

    const idToUse = customerIdToUse || customerId;
    if (!idToUse) {
      console.log("No customer ID available - skipping cart fetch");
      return;
    }

    try {
      const result = await retrieveCart(idToUse);
      if (result.success && result.data?.cartItems) {
        const itemCounts: { [key: number]: number } = {};
        result.data.cartItems.forEach((item: any) => {
          itemCounts[item.menuId] = item.quantity;
        });
        setCartItems(itemCounts);
      }
    } catch (error) {
      console.error("Error fetching cart items:", error);
      setCartItems({});
    }
  };

  // --- useMemo to group items by the string category ("Veg" or "Non-Veg") ---
  const groupedMenu = useMemo(() => {
    // 1. Filter Veg items
    const veg = menu.filter((item) => item.category === "Vegetarian");
    // 2. Filter Non-Veg items
    const nonVeg = menu.filter((item) => item.category === "Non-Vegetarian");

    return { veg, nonVeg };
  }, [menu]);

  // Get quantity for display (either from cart or local state)
  const getDisplayQuantity = (itemId: number): number => {
    if (cartItems[itemId]) {
      return cartItems[itemId];
    }
    return localQuantities[itemId] || 1;
  };

  // Handle local quantity changes (before adding to cart)
  const handleLocalQuantityChange = (itemId: number, delta: number) => {
    setLocalQuantities(prev => {
      const current = prev[itemId] || 1;
      const newQuantity = Math.max(1, current + delta);
      return { ...prev, [itemId]: newQuantity };
    });
  };

  // Add to cart handler with quantity
  const handleAddToCart = async (item: MenuItem) => {
    try {
      // Check if user is authenticated customer first
      if (!isCustomer()) {
        setToastMessage("Please log in as a customer to add items to cart");
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
        return;
      }

      // Check if customer address exists
      if (!hasAddress || !customerId) {
        setShowAddressError(true);
        return;
      }

      const quantity = localQuantities[item.id] || 1;

      const result = await addToCart({
        customerId,
        menuId: item.id,
        quantity: quantity,
      });

      if (result.success) {
        setToastMessage(`${quantity} x ${item.name} added to cart!`);
        setShowToast(true);

        // Update local cart state
        setCartItems((prev) => ({
          ...prev,
          [item.id]: quantity,
        }));

        // Reset local quantity for this item
        setLocalQuantities(prev => {
          const newState = { ...prev };
          delete newState[item.id];
          return newState;
        });

        // Trigger global cart update for other components
        triggerCartUpdate();

        // Auto-hide toast after 3 seconds
        setTimeout(() => {
          setShowToast(false);
        }, 3000);
      } else {
        setToastMessage(result.message || "Failed to add item to cart");
        setShowToast(true);
        setTimeout(() => {
          setShowToast(false);
        }, 3000);
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      setToastMessage("An error occurred while adding to cart");
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
      }, 3000);
    }
  };

  // Handle quantity changes for items already in cart
  const handleCartQuantityChange = async (item: MenuItem, newQuantity: number) => {
    // Check if user is authenticated customer first
    if (!isCustomer() || !customerId) {
      console.log("User is not an authenticated customer - cannot modify cart");
      return;
    }

    try {
      // Find cart item ID from cart data
      const cartResult = await retrieveCart(customerId);
      if (cartResult.success && cartResult.data?.cartItems) {
        const cartItem = cartResult.data.cartItems.find(
          (ci: any) => ci.menuId === item.id
        );

        if (cartItem) {
          if (newQuantity === 0) {
            // Remove item
            const removeResult = await removeCartItem(cartItem.id);
            if (removeResult.success) {
              setCartItems((prev) => {
                const newItems = { ...prev };
                delete newItems[item.id];
                return newItems;
              });
              // Trigger global cart update
              triggerCartUpdate();
            }
          } else {
            // Update quantity
            const updateResult = await updateCartItem({
              cartItemId: cartItem.id,
              quantity: newQuantity,
            });
            if (updateResult.success) {
              setCartItems((prev) => ({
                ...prev,
                [item.id]: newQuantity,
              }));
              // Trigger global cart update
              triggerCartUpdate();
            }
          }
        }
      }
    } catch (error) {
      console.error("Error updating cart:", error);
    }
  };

  const MenuCard: React.FC<{ item: MenuItem; index: number }> = ({
    item,
  }) => {
    const isInCart = !!cartItems[item.id];
    const displayQuantity = getDisplayQuantity(item.id);

    return (
      <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-md overflow-hidden">
        <div className="relative overflow-hidden">
          <img
            src={item.imageUrl}
            alt={item.name}
            className="w-full h-48 object-cover"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src =
                "https://images.unsplash.com/photo-1495195134817-aeb325a55b65";
            }}
          />
          <div className="absolute top-2 right-2">
            <span
              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                item.category === "Vegetarian"
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {item.category === "Vegetarian" ? "🟢 Veg" : "🔴 Non-Veg"}
            </span>
          </div>
        </div>

        <div className="p-5">
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
            {item.name}
          </h3>

          <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-4">
            {item.description}
          </p>

          <div className="flex justify-between items-center mb-4">
            <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-green-500 bg-clip-text text-transparent">
              ₹{item.price.toFixed(2)}
            </span>
            {/* Total Price Display */}
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Total: <span className="font-bold text-green-600">₹{(item.price * displayQuantity).toFixed(2)}</span>
            </span>
          </div>

          {/* Always show quantity controls for authenticated customers */}
          {isCustomer() ? (
            <div className="space-y-2">
              {isInCart ? (
                // When in cart - show counter and "In Cart" badge on the right
                <div className="flex items-center justify-end gap-2">
                  {/* Quantity Counter */}
                  <div className="flex items-center bg-gray-50 dark:bg-neutral-700 rounded-lg">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCartQuantityChange(item, displayQuantity - 1);
                      }}
                      className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-neutral-600 rounded-l-lg transition-colors"
                    >
                      <FaMinus className="text-sm" />
                    </button>
                    
                    <span className="px-4 py-1 text-lg font-semibold text-green-600 min-w-[3rem] text-center">
                      {displayQuantity}
                    </span>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCartQuantityChange(item, displayQuantity + 1);
                      }}
                      className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-neutral-600 rounded-r-lg transition-colors"
                    >
                      <FaPlus className="text-sm" />
                    </button>
                  </div>

                  {/* In Cart Badge */}
                  <div className="flex items-center justify-center bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-3 py-2 rounded-lg text-xs font-semibold">
                    <FaShoppingCart className="mr-1.5 text-xl" />
                    In Cart
                  </div>
                </div>
              ) : (
                // Before adding to cart - show counter and "Add to Cart" button on the right
                <div className="flex items-center justify-end gap-2">
                  {/* Quantity Counter */}
                  <div className="flex items-center bg-gray-50 dark:bg-neutral-700 rounded-lg">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLocalQuantityChange(item.id, -1);
                      }}
                      disabled={displayQuantity <= 1}
                      className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-neutral-600 rounded-l-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <FaMinus className="text-sm" />
                    </button>
                    
                    <span className="px-4 py-1 text-lg font-semibold text-green-600 min-w-[3rem] text-center">
                      {displayQuantity}
                    </span>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLocalQuantityChange(item.id, 1);
                      }}
                      className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-neutral-600 rounded-r-lg transition-colors"
                    >
                      <FaPlus className="text-sm" />
                    </button>
                  </div>

                  {/* Add to Cart Button - Made Narrower */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToCart(item);
                    }}
                    className="bg-gradient-to-r from-green-500 to-green-600 text-white px-3 py-2 rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 text-xs font-semibold shadow-lg hover:shadow-xl flex items-center justify-center whitespace-nowrap"
                  >
                    <FaShoppingCart className="mr-1.5 text-xl" />
                    Add
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setToastMessage("Please log in as a customer to add items to cart");
                setShowToast(true);
                setTimeout(() => setShowToast(false), 3000);
              }}
              className="w-full bg-gradient-to-r from-gray-400 to-gray-500 text-white px-3 py-2 rounded-lg hover:from-gray-500 hover:to-gray-600 text-xs font-semibold shadow-lg flex items-center justify-center"
            >
              <FaShoppingCart className="mr-1.5 text-xs" />
              Login to Add
            </button>
          )}
        </div>
      </div>
    );
  };

  useEffect(() => {
    const fetchRestaurantDetails = async () => {
      if (!restaurantId) {
        setError("Invalid restaurant ID in URL.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      const idAsNumber = parseInt(restaurantId);
      if (isNaN(idAsNumber)) {
        setError("Invalid restaurant ID format.");
        setLoading(false);
        return;
      }

      const payload = { restaurantId: idAsNumber };

      try {
        const result = await selectRestaurants(payload);

        if (
          result.success &&
          result.data &&
          result.data.menu &&
          result.data.menu.length > 0
        ) {
          const data = result.data as RestaurantDetails;
          setRestaurantName(data.restaurantName || "Menu");

          const cleanedMenu = data.menu.map((item: any) => ({
            ...item,
            price: parseFloat(item.price),
          }));

          setMenu(cleanedMenu as MenuItem[]);
          setError(null);
        } else {
          setError(
            result.error ||
              result.message ||
              "Failed to fetch restaurant details."
          );
          setMenu([]);
        }
      } catch (err) {
        setError("An unexpected error occurred while fetching data.");
        setMenu([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurantDetails();
  }, [restaurantId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-neutral-900">
        <div className="container mx-auto px-4 py-8 text-center">
          <div className="flex flex-col items-center justify-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-violet-500 border-t-transparent mb-4"></div>
            <p className="text-xl font-semibold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent animate-pulse">
              Loading {restaurantName} Menu...
            </p>
            <FaUtensils className="text-4xl text-violet-500 animate-bounce mt-2" />
          </div>
        </div>
      </div>
    );
  }

  if (error && menu.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-neutral-900">
        <div className="container mx-auto px-4 py-8 text-center">
          <div className="bg-white border border-violet-200 rounded-xl p-8 animate-shake shadow-sm">
            <p className="text-violet-600 text-xl font-semibold">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-neutral-900">
      <CustomerNav />
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div
          className={`flex items-center mb-12 transform transition-all duration-1000 ${
            isVisible ? "translate-y-0 opacity-100" : "-translate-y-8 opacity-0"
          }`}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-center flex-1 bg-gradient-to-r from-violet-600 via-purple-600 to-violet-800 bg-clip-text text-transparent animate-gradient">
            {restaurantName}
          </h1>

          
          
        </div>

        {/* Vegetarian Section */}
        <section
          className={`mb-16 transform transition-all duration-1000 ${
            isVisible ? "translate-x-0 opacity-100" : "-translate-x-8 opacity-0"
          }`}
          style={{ transitionDelay: "200ms" }}
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-green-600 to-green-500 bg-clip-text text-transparent">
              🌱 Vegetarian Delights
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-green-400 to-green-600 mx-auto rounded-full"></div>
            <p className="text-gray-600 mt-2">
              ({groupedMenu.veg.length} delicious items)
            </p>
          </div>

          {groupedMenu.veg.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {groupedMenu.veg.map((item, index) => (
                <MenuCard key={item.id} item={item} index={index} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">
                No vegetarian items available at the moment.
              </p>
            </div>
          )}
        </section>

        {/* Non-Vegetarian Section */}
        <section
          className={`mb-16 transform transition-all duration-1000 ${
            isVisible ? "translate-x-0 opacity-100" : "translate-x-8 opacity-0"
          }`}
          style={{ transitionDelay: "400ms" }}
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent">
              🍖 Non-Vegetarian Specials
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-red-400 to-red-600 mx-auto rounded-full"></div>
            <p className="text-gray-600 mt-2">
              ({groupedMenu.nonVeg.length} mouth-watering items)
            </p>
          </div>

          {groupedMenu.nonVeg.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {groupedMenu.nonVeg.map((item, index) => (
                <MenuCard key={item.id} item={item} index={index} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">
                No non-vegetarian items available at the moment.
              </p>
            </div>
          )}
        </section>

        {/* Empty State */}
        {menu.length === 0 && !loading && !error && (
          <div className="text-center py-16 animate-fade-in">
            <FaUtensils className="text-6xl text-gray-400 mx-auto mb-4" />
            <p className="text-xl text-gray-600">
              No menu items found for this restaurant.
            </p>
          </div>
        )}

        {/* Toast */}
        {showToast && (
          <div className="fixed top-4 right-4 z-50 animate-slide-in">
            <AddToCartToast
              message={toastMessage}
              onUndo={() => {
                // Handle undo logic here if needed
                setShowToast(false);
              }}
              onClose={() => setShowToast(false)}
            />
          </div>
        )}

        {/* Address Error Toast */}
        {showAddressError && (
          <div className="fixed top-4 right-4 z-50 animate-slide-in">
            <ProfileErrorToast
              message="Please add your delivery address before adding items to cart."
              onCreateProfile={() => {
                setShowAddressError(false);
                setShowCreateAddressModal(true);
              }}
              onClose={() => setShowAddressError(false)}
            />
          </div>
        )}

        {/* Create Customer Address Modal - only for authenticated customers */}
        {isCustomer() && (
          <CreateCustomerProfileModal
            isOpen={showCreateAddressModal}
            onClose={() => setShowCreateAddressModal(false)}
            userId={user?.id || 1}
            onSuccess={handleAddressSuccess}
          />
        )}

        {/* Cart Modal - only for authenticated customers */}
        {isCustomer() && customerId && (
          <CartModal
            isOpen={showCartModal}
            onClose={() => setShowCartModal(false)}
            customerId={customerId}
            onCartUpdate={fetchCartItems}
          />
        )}
      </div>

      <style>{`


        @keyframes gradient {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        @keyframes shake {
          0%, 100% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-5px);
          }
          75% {
            transform: translateX(5px);
          }
        }

        .animate-bounce-in {
          animation: bounce-in 0.6s ease-out forwards;
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }

        .animate-modal-enter {
          animation: modal-enter 0.3s ease-out;
        }

        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }

        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }

        @keyframes slide-in {
          0% {
            opacity: 0;
            transform: translateX(100%);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default RestaurantPage;
