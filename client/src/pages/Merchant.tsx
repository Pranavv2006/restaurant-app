import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavbarMerchant from "../components/merchant/NavbarMerchant";
import RestaurantCreationToast from "../components/merchant/RestaurantCreationToast";
import CreateRestaurant from "../components/merchant/CreateRestaurant";
import merchantService from "../services/MerchantService";
import axiosInstance from "../api/axiosConfig";
import MenuBoard from "../components/merchant/MenuBoard";

const Merchant = () => {
  const navigate = useNavigate();
  const [hasRestaurant, setHasRestaurant] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [merchantId, setMerchantId] = useState<number | null>(null);
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

  useEffect(() => {
    const checkRestaurant = async () => {
      if (!merchantId) return;

      try {
        setLoading(true);
        const result = await merchantService.checkRestaurant({ merchantId });

        if (result.success) {
          setHasRestaurant(result.hasRestaurant || false);
        } else {
          console.error("Failed to check restaurant:", result.error);
          setHasRestaurant(false);
        }
      } catch (error) {
        console.error("Error checking restaurant:", error);
        setHasRestaurant(false);
      } finally {
        setLoading(false);
      }
    };

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

  const handleRestaurantCreated = () => {
    setShowCreateModal(false);
    setHasRestaurant(true);
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
    <div>
      <NavbarMerchant handleLogout={handleLogout} />
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
        {hasRestaurant === false && (
          <div className="fixed top-4 right-4 z-50">
            <RestaurantCreationToast
              onCreateRestaurant={handleCreateRestaurant}
              onDismiss={handleDismissToast}
            />
          </div>
        )}

        {showCreateModal && (
          <CreateRestaurant
            onClose={handleCloseModal}
            onSuccess={handleRestaurantCreated}
          />
        )}

        {hasRestaurant === true ? (
          <MenuBoard />
        ) : (
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-800 mb-4">
                Merchant Dashboard
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                Welcome to your restaurant management panel
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Merchant;
