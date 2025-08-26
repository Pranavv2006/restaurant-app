import { useState, useEffect } from "react";
import merchantService from "../../services/MerchantService";

interface Restaurant {
  id: number;
  name: string;
  location: string;
  phone: string;
  cuisine: string;
}

interface MerchantData {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  restaurants: Restaurant[];
}

const MerchantProfile = () => {
  const [merchantData, setMerchantData] = useState<MerchantData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const merchantId = user.id;

  useEffect(() => {
    const fetchMerchantProfile = async () => {
      try {
        setLoading(true);
        console.log("Fetching merchant profile..." + merchantId);
        const response = await merchantService.getMerchantProfile(merchantId);

        if (response.success && response.data) {
          setMerchantData(response.data);
        } else {
          setError(response.error || "Failed to load profile");
        }
      } catch (err: any) {
        console.error("Error fetching merchant profile:", err);
        setError("Failed to load merchant profile");
      } finally {
        setLoading(false);
      }
    };

    fetchMerchantProfile();
  }, [merchantId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <strong>Error:</strong> {error}
          </div>
        </div>
      </div>
    );
  }

  if (!merchantData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">No profile data available</p>
        </div>
      </div>
    );
  }

  const fullName = `${merchantData.firstName} ${merchantData.lastName}`;
  const hasRestaurant =
    merchantData.restaurants && merchantData.restaurants.length > 0;
  const restaurant = hasRestaurant ? merchantData.restaurants[0] : null;

  return (
    <section className="relative pt-36 pb-24">
      <img
        src="https://pagedone.io/asset/uploads/1705471739.png"
        alt="cover-image"
        className="w-full absolute top-0 left-0 z-0 h-60 object-cover"
      />
      <div className="w-full max-w-7xl mx-auto px-6 md:px-8">
        <div className="flex items-center justify-center relative z-10 mb-2.5">
          <img
            src="https://pagedone.io/asset/uploads/1705471668.png"
            alt="user-avatar-image"
            className="border-4 border-solid border-white rounded-full object-cover"
          />
        </div>

        <div className="flex flex-col sm:flex-row max-sm:gap-5 items-center justify-between mb-5">
          <ul className="flex items-center gap-5">
            <li>
              <a
                href="/merchant"
                className="flex items-center gap-2 cursor-pointer group"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12.5 14.0902L7.5 14.0902M2.5 9.09545V14.0902C2.5 15.6976 2.5 16.5013 2.98816 17.0006C3.47631 17.5 4.26198 17.5 5.83333 17.5H14.1667C15.738 17.5 16.5237 17.5 17.0118 17.0006C17.5 16.5013 17.5 15.6976 17.5 14.0902V10.9203C17.5 9.1337 17.5 8.24039 17.1056 7.48651C16.7112 6.73262 15.9846 6.2371 14.5313 5.24606L11.849 3.41681C10.9528 2.8056 10.5046 2.5 10 2.5C9.49537 2.5 9.04725 2.80561 8.151 3.41681L3.98433 6.25832C3.25772 6.75384 2.89442 7.0016 2.69721 7.37854C2.5 7.75548 2.5 8.20214 2.5 9.09545Z"
                    stroke="black"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                </svg>
                <span className="font-medium text-base leading-7 text-gray-900">
                  Home
                </span>
              </a>
            </li>
            <li>
              <a
                href="/merchant"
                className="flex items-center gap-2 cursor-pointer group"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="5"
                  height="20"
                  viewBox="0 0 5 20"
                  fill="none"
                >
                  <path
                    d="M4.12567 1.13672L1 18.8633"
                    stroke="#E5E7EB"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                </svg>
                <span className="font-medium text-base leading-7 text-gray-400">
                  Dashboard
                </span>
              </a>
            </li>
            <li>
              <a
                href="#"
                className="flex items-center gap-2 cursor-pointer group"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="5"
                  height="20"
                  viewBox="0 0 5 20"
                  fill="none"
                >
                  <path
                    d="M4.12567 1.13672L1 18.8633"
                    stroke="#E5E7EB"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                </svg>
                <span className="font-semibold text-base leading-7 text-indigo-600">
                  Profile
                </span>
                <span className="rounded-full py-1.5 px-2.5 bg-indigo-50 flex items-center justify-center font-medium text-xs text-indigo-600">
                  Current
                </span>
              </a>
            </li>
          </ul>

          <div className="flex items-center gap-4">
            {!hasRestaurant && (
              <button
                className="rounded-full border border-solid border-indigo-600 bg-indigo-600 py-3 px-4 text-sm font-semibold text-white whitespace-nowrap shadow-sm shadow-transparent transition-all duration-500 hover:shadow-gray-200 hover:bg-indigo-700 hover:border-indigo-700"
                onClick={() => (window.location.href = "/create-restaurant")}
              >
                Create Restaurant
              </button>
            )}
            {hasRestaurant && (
              <button
                className="rounded-full border border-solid border-green-600 bg-green-600 py-3 px-4 text-sm font-semibold text-white whitespace-nowrap shadow-sm shadow-transparent transition-all duration-500 hover:shadow-gray-200 hover:bg-green-700 hover:border-green-700"
                onClick={() => (window.location.href = "/merchant/add-menu")}
              >
                Manage Menu
              </button>
            )}
          </div>
        </div>

        <h3 className="text-center font-manrope font-bold text-3xl leading-10 text-gray-900 mb-3">
          {fullName}
        </h3>
        <p className="font-normal text-base leading-7 text-gray-500 text-center mb-2">
          Restaurant Merchant • {merchantData.email}
        </p>

        {hasRestaurant && restaurant && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mx-auto max-w-md mb-8">
            <h4 className="font-semibold text-lg text-gray-900 mb-3 text-center">
              Restaurant Details
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Name:</span>
                <span className="font-medium text-gray-900">
                  {restaurant.name}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Location:</span>
                <span className="font-medium text-gray-900">
                  {restaurant.location}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Phone:</span>
                <span className="font-medium text-gray-900">
                  {restaurant.phone}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Cuisine:</span>
                <span className="font-medium text-gray-900">
                  {restaurant.cuisine}
                </span>
              </div>
            </div>
          </div>
        )}

        {!hasRestaurant && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mx-auto max-w-md mb-8">
            <p className="text-yellow-800 text-center text-sm">
              <span className="font-medium">No restaurant registered yet.</span>
              <br />
              Create your restaurant to start managing your business!
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default MerchantProfile;
