import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavbarMerchant from "../components/merchant/NavbarMerchant";
import RestaurantCreationToast from "../components/merchant/RestaurantCreationToast";
import CreateRestaurant from "../components/merchant/CreateRestaurant";
import MerchantSidebar from "../components/merchant/MerchantSidebar";
import merchantService from "../services/MerchantService";
import axiosInstance from "../api/axiosConfig";
import MenuBoard from "../components/merchant/MenuBoard";
import VisitorsCard from "../components/merchant/WeeklyOrders";
import RestaurantBoard from "../components/merchant/RestaurantBoard";

const Merchant = () => {
  const navigate = useNavigate();
  const [hasRestaurant, setHasRestaurant] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [merchantId, setMerchantId] = useState<number | null>(null);
  const [restaurantId, setRestaurantId] = useState<number | null>(null);
  const [restaurantData, setRestaurantData] = useState<any>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activePage, setActivePage] = useState<string>("dashboard"); // Add navigation state

  useEffect(() => {
    try {
      const userDataString = localStorage.getItem("user");
      if (userDataString) {
        const userData = JSON.parse(userDataString);
        if (userData && userData.id) {
          const id =
            typeof userData.id === "string"
              ? parseInt(userData.id)
              : userData.id;
          setMerchantId(id);
        }
      }
    } catch (error) {
      console.error("Error parsing user data:", error);
    }
  }, []);

  const checkRestaurant = async () => {
    if (!merchantId) return;

    try {
      setLoading(true);
      const result = await merchantService.checkRestaurant({ merchantId });

      if (result.success) {
        setHasRestaurant(result.hasRestaurant || false);

        if (result.hasRestaurant && result.data) {
          setRestaurantId(result.data.id);
          setRestaurantData(result.data);
          // Store restaurant ID in localStorage
          localStorage.setItem("restaurantId", result.data.id.toString());
          console.log("Restaurant found:", result.data);
        } else {
          setRestaurantId(null);
          setRestaurantData(null);
          localStorage.removeItem("restaurantId");
        }
      } else {
        console.error("Failed to check restaurant:", result.error);
        setHasRestaurant(false);
        setRestaurantId(null);
        setRestaurantData(null);
        localStorage.removeItem("restaurantId");
      }
    } catch (error) {
      console.error("Error checking restaurant:", error);
      setHasRestaurant(false);
      setRestaurantId(null);
      setRestaurantData(null);
      localStorage.removeItem("restaurantId");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (merchantId) {
      checkRestaurant();
    }
  }, [merchantId]);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");

    try {
      delete axiosInstance.defaults.headers.common["Authorization"];
    } catch (error) {
      console.log("Axios cleanup failed:", error);
    }

    navigate("/");
  };

  const handleCreateRestaurant = () => {
    setShowCreateModal(true);
  };

  const handleDismissToast = () => {
    setHasRestaurant(true);
  };

  const handleCloseModal = () => {
    setShowCreateModal(false);
  };

  const handleRestaurantCreated = (newRestaurantData?: any) => {
    setShowCreateModal(false);
    setHasRestaurant(true);

    if (newRestaurantData && newRestaurantData.id) {
      setRestaurantId(newRestaurantData.id);
      setRestaurantData(newRestaurantData);
      // Store restaurant ID in localStorage
      localStorage.setItem("restaurantId", newRestaurantData.id.toString());
      console.log("New restaurant created:", newRestaurantData);
    } else {
      console.log("Restaurant created, but no data passed. Refetching...");
      if (merchantId) {
        checkRestaurant();
      }
    }
  };

  // Handle sidebar navigation
  const handleNavigation = (page: string) => {
    setActivePage(page);
  };

  // Render content based on active page and restaurant status
  const renderContent = () => {
    // If no restaurant exists, show creation prompt
    if (hasRestaurant === false) {
      return (
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              Merchant Dashboard
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Welcome to your restaurant management panel
            </p>
            <p className="text-sm text-gray-500">
              Create a restaurant to start managing your menu
            </p>
          </div>
        </div>
      );
    }

    // If restaurant exists but no restaurant ID yet
    if (!restaurantId) {
      return (
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              Merchant Dashboard
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Welcome to your restaurant management panel
            </p>
            <p className="text-sm text-gray-500">Loading restaurant data...</p>
          </div>
        </div>
      );
    }

    // Restaurant exists, show content based on active page
    switch (activePage) {
      case "dashboard":
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="col-span-1">
              <div className="text-center lg:text-left">
                <h1 className="text-4xl font-bold text-gray-800 mb-4">
                  Merchant Dashboard
                </h1>
                <p className="text-lg text-gray-600 mb-8">
                  Welcome to your restaurant management panel
                </p>
                {restaurantData && (
                  <div className="bg-white p-6 rounded-lg shadow-sm border">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      {restaurantData.name}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {restaurantData.location} • {restaurantData.cuisine}
                    </p>
                  </div>
                )}
              </div>
            </div>
            <div className="col-span-1">
              <VisitorsCard restaurantId={restaurantId} />
            </div>
          </div>
        );

      case "menu":
        return (
          <div className="min-h-screen bg-white">
            {/* Full-size MenuBoard */}
            {merchantId !== null && (
              <MenuBoard
                restaurantId={restaurantId}
                restaurantData={restaurantData}
                merchantId={merchantId}
              />
            )}
          </div>
        );

      case "restaurants":
        return (
          <div className="min-h-screen bg-white">
            <RestaurantBoard merchantId={merchantId!} />
          </div>
        );

      case "categories":
        return (
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-800 mb-4">
                Categories
              </h1>
              <p className="text-gray-600">
                Categories management coming soon...
              </p>
            </div>
          </div>
        );

      case "active-orders":
        return (
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-800 mb-4">
                Active Orders
              </h1>
              <p className="text-gray-600">Active orders page coming soon...</p>
            </div>
          </div>
        );

      case "order-history":
        return (
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-800 mb-4">
                Order History
              </h1>
              <p className="text-gray-600">Order history page coming soon...</p>
            </div>
          </div>
        );

      case "analytics":
        return (
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-800 mb-4">
                Analytics
              </h1>
              <p className="text-gray-600">Analytics page coming soon...</p>
            </div>
          </div>
        );

      case "profile":
        return (
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-800 mb-4">Profile</h1>
              <p className="text-gray-600">Profile page coming soon...</p>
            </div>
          </div>
        );

      default:
        return (
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-800 mb-4">
                Merchant Dashboard
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                Welcome to your restaurant management panel
              </p>
            </div>
          </div>
        );
    }
  };

  if (loading) {
    return (
      <div>
        <NavbarMerchant handleLogout={handleLogout} />
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-red-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Navbar at the very top */}
      <NavbarMerchant handleLogout={handleLogout} />

      {/* Use MerchantSidebar component with navigation props */}
      <MerchantSidebar
        onNavigate={handleNavigation}
        activePage={activePage} // Pass the handler
      >
        {/* Toast notifications */}
        {hasRestaurant === false && (
          <div className="fixed top-4 right-4 z-50">
            <RestaurantCreationToast
              onCreateRestaurant={handleCreateRestaurant}
              onDismiss={handleDismissToast}
            />
          </div>
        )}

        {/* Create Restaurant Modal */}
        {showCreateModal && (
          <CreateRestaurant
            onClose={handleCloseModal}
            onSuccess={handleRestaurantCreated}
          />
        )}

        {/* Dynamic Content Based on Navigation */}
        {renderContent()}
      </MerchantSidebar>
    </div>
  );
};

export default Merchant;
