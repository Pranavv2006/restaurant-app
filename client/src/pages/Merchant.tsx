import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavbarMerchant from "../components/merchant/NavbarMerchant";
import RestaurantCreationToast from "../components/merchant/RestaurantCreationToast";
import CreateRestaurant from "../components/merchant/CreateRestaurant";
import MerchantSidebar from "../components/merchant/MerchantSidebar";
import merchantService from "../services/MerchantService";
import axiosInstance from "../api/axiosConfig";
import MenuBoard from "../components/merchant/MenuBoard";

const Merchant = () => {
  const navigate = useNavigate();
  const [hasRestaurant, setHasRestaurant] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [merchantId, setMerchantId] = useState<number | null>(null);
  const [restaurantId, setRestaurantId] = useState<number | null>(null);
  const [restaurantData, setRestaurantData] = useState<any>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

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
          console.log("Restaurant found:", result.data);
        } else {
          setRestaurantId(null);
          setRestaurantData(null);
        }
      } else {
        console.error("Failed to check restaurant:", result.error);
        setHasRestaurant(false);
        setRestaurantId(null);
        setRestaurantData(null);
      }
    } catch (error) {
      console.error("Error checking restaurant:", error);
      setHasRestaurant(false);
      setRestaurantId(null);
      setRestaurantData(null);
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
      console.log("New restaurant created:", newRestaurantData);
    } else {
      console.log("Restaurant created, but no data passed. Refetching...");
      if (merchantId) {
        checkRestaurant();
      }
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

      {/* Use MerchantSidebar component properly */}
      <MerchantSidebar>
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

        {/* Main Content */}
        {hasRestaurant === true && restaurantId ? (
          <MenuBoard
            restaurantId={restaurantId}
            restaurantData={restaurantData}
          />
        ) : (
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
        )}
      </MerchantSidebar>
    </div>
  );
};

export default Merchant;
