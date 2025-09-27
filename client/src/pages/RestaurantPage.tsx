import React, { useState, useEffect, useMemo } from "react";
import {
  FaShoppingCart,
  FaInfoCircle,
  FaArrowLeft,
  FaUtensils,
} from "react-icons/fa";
import { selectRestaurants, addToCart } from "../services/CustomerService";
import { useParams } from "react-router-dom";
import AddToCartToast from "../components/customer/AddToCartToast";

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

  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [restaurantName, setRestaurantName] =
    useState<string>("Restaurant Menu");

  // Toast states
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // Animation entrance effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // --- useMemo to group items by the string category ("Veg" or "Non-Veg") ---
  const groupedMenu = useMemo(() => {
    // 1. Filter Veg items
    const veg = menu.filter((item) => item.category === "Vegetarian");
    // 2. Filter Non-Veg items
    const nonVeg = menu.filter((item) => item.category === "Non-Vegetarian");

    return { veg, nonVeg };
  }, [menu]);

  // Add to cart handler
  const handleAddToCart = async (item: MenuItem) => {
    try {
      // Get customerId from localStorage or user context
      const customerId = 1; // Replace with actual customer ID from authentication

      const result = await addToCart({
        customerId,
        menuId: item.id,
        quantity: 1,
      });

      if (result.success) {
        setToastMessage(`${item.name} added to cart!`);
        setShowToast(true);

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

  const MenuCard: React.FC<{ item: MenuItem; index: number }> = ({
    item,
    index,
  }) => (
    <div
      className={`bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:rotate-1 group cursor-pointer animate-bounce-in ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
      }`}
      style={{
        animationDelay: `${index * 150}ms`,
        background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
      }}
    >
      <div className="relative overflow-hidden">
        <img
          src={item.imageUrl}
          alt={item.name}
          className="w-full h-48 object-cover transition-transform duration-700 group-hover:scale-110"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src =
              "https://images.unsplash.com/photo-1495195134817-aeb325a55b65";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
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
        <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-violet-600 transition-colors duration-300">
          {item.name}
        </h3>

        <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-2 group-hover:text-gray-700 transition-colors duration-300">
          {item.description}
        </p>

        <div className="flex justify-between items-center">
          <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-green-500 bg-clip-text text-transparent">
            ${item.price.toFixed(2)}
          </span>

          <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-300">
            <button
              onClick={() => {
                setSelectedItem(item);
                setShowModal(true);
              }}
              className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 py-2 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 text-sm shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <FaInfoCircle className="inline mr-1" /> Details
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleAddToCart(item);
              }}
              className="bg-gradient-to-r from-green-500 to-green-600 text-white px-3 py-2 rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 text-sm shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <FaShoppingCart className="inline mr-1" /> Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const Modal: React.FC<{ item: MenuItem }> = ({ item }) => (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-white rounded-2xl max-w-2xl w-full mx-4 shadow-2xl transform animate-modal-enter">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
              {item.name}
            </h2>
            <button
              onClick={() => setShowModal(false)}
              className="text-gray-400 hover:text-gray-600 text-3xl transform hover:rotate-90 transition-transform duration-300"
            >
              ×
            </button>
          </div>

          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mb-4 ${
              item.category === "Vegetarian"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {item.category === "Vegetarian"
              ? "🟢 Vegetarian"
              : "🔴 Non-Vegetarian"}
          </span>

          <div className="relative overflow-hidden rounded-xl mb-4">
            <img
              src={item.imageUrl}
              alt={item.name}
              className="w-full h-64 object-cover transition-transform duration-500 hover:scale-105"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src =
                  "https://images.unsplash.com/photo-1495195134817-aeb325a55b65";
              }}
            />
          </div>

          <p className="text-gray-600 leading-relaxed mb-6">
            {item.description}
          </p>

          <div className="flex justify-between items-center">
            <p className="text-3xl font-bold bg-gradient-to-r from-green-600 to-green-500 bg-clip-text text-transparent">
              ${item.price.toFixed(2)}
            </p>
            <button
              onClick={() => setShowModal(false)}
              className="bg-gradient-to-r from-violet-500 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-violet-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );

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
            ...item, // item.price is treated as 'any' (or string) here, and is converted to a number
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
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="flex flex-col items-center justify-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-violet-500 border-t-transparent mb-4"></div>
          <p className="text-xl font-semibold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent animate-pulse">
            Loading {restaurantName} Menu...
          </p>
          <FaUtensils className="text-4xl text-violet-400 animate-bounce mt-2" />
        </div>
      </div>
    );
  }

  if (error && menu.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="bg-red-50 border border-red-200 rounded-xl p-8 animate-shake">
          <p className="text-red-600 text-xl font-semibold">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div
          className={`flex items-center mb-12 transform transition-all duration-1000 ${
            isVisible ? "translate-y-0 opacity-100" : "-translate-y-8 opacity-0"
          }`}
        >
          <button
            onClick={() => window.history.back()}
            className="text-gray-600 hover:text-violet-600 transition-all duration-300 transform hover:scale-110 hover:-translate-x-1 mr-4"
          >
            <FaArrowLeft className="text-2xl" />
          </button>
          <h1 className="text-4xl md:text-5xl font-bold text-center flex-1 bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient">
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
              <p className="text-gray-500 text-lg">
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
              <p className="text-gray-500 text-lg">
                No non-vegetarian items available at the moment.
              </p>
            </div>
          )}
        </section>

        {/* Empty State */}
        {menu.length === 0 && !loading && !error && (
          <div className="text-center py-16 animate-fade-in">
            <FaUtensils className="text-6xl text-gray-300 mx-auto mb-4" />
            <p className="text-xl text-gray-500">
              No menu items found for this restaurant.
            </p>
          </div>
        )}

        {/* Modal */}
        {showModal && selectedItem && <Modal item={selectedItem} />}

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
      </div>

      <style>{`
        @keyframes bounce-in {
          0% {
            opacity: 0;
            transform: translateY(30px) scale(0.9);
          }
          50% {
            transform: translateY(-10px) scale(1.05);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
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
