import React, { useState, useEffect } from "react";
import {
  FaShoppingCart,
  FaTimes,
  FaPlus,
  FaMinus,
  FaTrash,
} from "react-icons/fa";
import {
  retrieveCart,
  updateCartItem,
  removeCartItem,
} from "../../services/CustomerService";
import { triggerCartUpdate } from "../../hooks/useCart";

interface CartItem {
  id: number;
  quantity: number;
  unitPrice: number;
  menu: {
    id: number;
    name: string;
    description: string;
    imageUrl: string;
    category: string;
    restaurant: {
      id: number;
      name: string;
    };
  };
}

interface CartData {
  id: number;
  customerId: number;
  createdAt: string;
  updatedAt: string;
  cartItems: CartItem[];
}

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  customerId: number;
  onCartUpdate?: () => void;
  onProceedToCheckout?: (cartItems: any[]) => void;
}

const CartModal: React.FC<CartModalProps> = ({
  isOpen,
  onClose,
  customerId,
  onCartUpdate,
  onProceedToCheckout,
}) => {
  const [cartData, setCartData] = useState<CartData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && customerId) {
      fetchCart();
    }
  }, [isOpen, customerId]);

  const fetchCart = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await retrieveCart(customerId);

      if (result.success && result.data) {
        setCartData(result.data);
      } else {
        setError(result.message || "Failed to fetch cart");
        setCartData(null);
      }
    } catch (err) {
      setError("An error occurred while fetching cart");
      setCartData(null);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = () => {
    if (!cartData?.cartItems) return 0;
    return cartData.cartItems.reduce((total, item) => {
      return total + item.quantity * parseFloat(item.unitPrice.toString());
    }, 0);
  };

  const handleUpdateQuantity = async (itemId: number, newQuantity: number) => {
    if (newQuantity < 1) {
      handleRemoveItem(itemId);
      return;
    }

    try {
      const result = await updateCartItem({
        cartItemId: itemId,
        quantity: newQuantity,
      });

      if (result.success) {
        // Update local cart state
        setCartData((prevData) => {
          if (!prevData) return null;
          return {
            ...prevData,
            cartItems: prevData.cartItems.map((item) =>
              item.id === itemId ? { ...item, quantity: newQuantity } : item
            ),
          };
        });

        // Notify parent component to update cart counter
        if (onCartUpdate) {
          onCartUpdate();
        }
        // Trigger global cart update for other components
        triggerCartUpdate();
      } else {
        setError(result.message || "Failed to update item quantity");
      }
    } catch (err) {
      setError("An error occurred while updating item quantity");
    }
  };

  const handleRemoveItem = async (itemId: number) => {
    try {
      const result = await removeCartItem(itemId);

      if (result.success) {
        // Update local cart state
        setCartData((prevData) => {
          if (!prevData) return null;
          return {
            ...prevData,
            cartItems: prevData.cartItems.filter((item) => item.id !== itemId),
          };
        });

        // Notify parent component to update cart counter
        if (onCartUpdate) {
          onCartUpdate();
        }
        // Trigger global cart update for other components
        triggerCartUpdate();
      } else {
        setError(result.message || "Failed to remove item");
      }
    } catch (err) {
      setError("An error occurred while removing item");
    }
  };

  const handleProceedToCheckout = () => {
    if (
      cartData?.cartItems &&
      cartData.cartItems.length > 0 &&
      onProceedToCheckout
    ) {
      // Transform cart items to match CheckoutModal expected format
      const checkoutItems = cartData.cartItems.map((item) => ({
        id: item.id,
        quantity: item.quantity,
        menu: {
          id: item.menu.id,
          name: item.menu.name,
          description: item.menu.description,
          price: parseFloat(item.unitPrice.toString()),
          imageUrl: item.menu.imageUrl,
        },
        restaurant: {
          id: item.menu.restaurant.id,
          name: item.menu.restaurant.name,
        },
      }));

      onProceedToCheckout(checkoutItems);
      onClose(); // Close cart modal when proceeding to checkout
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-white dark:bg-neutral-800 rounded-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden shadow-2xl transform animate-modal-enter">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-neutral-700">
          <div className="flex items-center gap-3">
            <FaShoppingCart className="text-2xl text-violet-600" />
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
              Your Cart
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-2xl transform hover:rotate-90 transition-transform duration-300"
          >
            <FaTimes />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto max-h-[60vh]">
          {loading ? (
            <div className="flex flex-col items-center justify-center p-12">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-violet-500 border-t-transparent mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">
                Loading cart...
              </p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center p-12">
              <p className="text-red-600 text-center mb-4">{error}</p>
              <button
                onClick={fetchCart}
                className="bg-violet-600 text-white px-4 py-2 rounded-lg hover:bg-violet-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : !cartData?.cartItems || cartData.cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12">
              <FaShoppingCart className="text-6xl text-gray-300 mb-4" />
              <p className="text-xl text-gray-500 text-center">
                Your cart is empty
              </p>
              <p className="text-gray-400 text-center mt-2">
                Add some delicious items to get started!
              </p>
            </div>
          ) : (
            <div className="p-6">
              {cartData.cartItems.map((item, index) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-neutral-700 rounded-xl mb-4 transform transition-all duration-300 hover:shadow-md"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Item Image */}
                  <div className="flex-shrink-0">
                    <img
                      src={item.menu.imageUrl}
                      alt={item.menu.name}
                      className="w-16 h-16 object-cover rounded-lg"
                      onError={(e) => {
                        e.currentTarget.src =
                          "https://images.unsplash.com/photo-1495195134817-aeb325a55b65";
                      }}
                    />
                  </div>

                  {/* Item Details */}
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 dark:text-white">
                      {item.menu.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1">
                      {item.menu.description}
                    </p>
                    <p className="text-sm font-medium text-violet-600 dark:text-violet-400">
                      ₹{parseFloat(item.unitPrice.toString()).toFixed(2)} each
                    </p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        handleUpdateQuantity(
                          item.id,
                          Math.max(1, item.quantity - 1)
                        )
                      }
                      className="w-8 h-8 rounded-full bg-gray-200 dark:bg-neutral-600 flex items-center justify-center hover:bg-gray-300 dark:hover:bg-neutral-500 transition-colors"
                    >
                      <FaMinus className="text-xs" />
                    </button>
                    <span className="w-8 text-center font-semibold text-gray-800 dark:text-white">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        handleUpdateQuantity(item.id, item.quantity + 1)
                      }
                      className="w-8 h-8 rounded-full bg-gray-200 dark:bg-neutral-600 flex items-center justify-center hover:bg-gray-300 dark:hover:bg-neutral-500 transition-colors"
                    >
                      <FaPlus className="text-xs" />
                    </button>
                  </div>

                  {/* Item Total */}
                  <div className="text-right">
                    <p className="font-bold text-gray-800 dark:text-white">
                      ₹
                      {(
                        item.quantity * parseFloat(item.unitPrice.toString())
                      ).toFixed(2)}
                    </p>
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="text-red-500 hover:text-red-700 transition-colors mt-1"
                    >
                      <FaTrash className="text-sm" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cartData?.cartItems && cartData.cartItems.length > 0 && (
          <div className="border-t border-gray-200 dark:border-neutral-700 p-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-xl font-semibold text-gray-800 dark:text-white">
                Total:
              </span>
              <span className="text-2xl font-bold text-violet-600 dark:text-violet-400">
                ₹{calculateTotal().toFixed(2)}
              </span>
            </div>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 bg-gray-200 dark:bg-neutral-700 text-gray-800 dark:text-white py-3 rounded-xl hover:bg-gray-300 dark:hover:bg-neutral-600 transition-colors font-medium"
              >
                Continue Shopping
              </button>
              <button
                onClick={handleProceedToCheckout}
                className="flex-1 bg-gradient-to-r from-violet-600 to-purple-600 text-white py-3 rounded-xl hover:from-violet-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-medium"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes modal-enter {
          0% {
            opacity: 0;
            transform: scale(0.8) translateY(20px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }

        .animate-modal-enter {
          animation: modal-enter 0.3s ease-out;
        }

        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default CartModal;
