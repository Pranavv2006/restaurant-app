import { NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import CartModal from "./CartModal";
import QuickMenuDropdown from "./QuickMenuDropdown";
import CreateCustomerProfileModal from "./CreateCustomerProfileModal";
import EditCustomerProfileModal from "./EditCustomerProfileModal";
import ProfileToast from "./ProfileToast";
import { checkCustomerProfile } from "../../services/CustomerService";

const CustomerNav = () => {
  const [showCartModal, setShowCartModal] = useState(false);
  const [showCreateProfileModal, setShowCreateProfileModal] = useState(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [showProfileToast, setShowProfileToast] = useState(false);
  const [customerData, setCustomerData] = useState<any>(null);
  const [hasProfile, setHasProfile] = useState(false);
  const [customerName, setCustomerName] = useState("User");

  // Get userId from localStorage
  const getUserId = () => {
    const userStr = localStorage.getItem("user");
    if (!userStr) return 1; // fallback
    const user = JSON.parse(userStr);
    return user.id || 1;
  };

  const userId = getUserId();
  const customerId = customerData?.id || 1;

  // Check customer profile on component mount
  useEffect(() => {
    const checkProfile = async () => {
      const result = await checkCustomerProfile(userId);
      if (result.success && result.hasProfile) {
        setHasProfile(true);
        setCustomerData(result.data);
        setCustomerName(result.data.user.firstName);
      } else {
        setHasProfile(false);
        setShowProfileToast(true);
        setTimeout(() => setShowProfileToast(false), 5000);
      }
    };
    checkProfile();
  }, [userId]);

  const handleProfileSuccess = (data: any) => {
    setHasProfile(true);
    setCustomerData(data);
    setCustomerName(data.user.firstName);
  };

  const handleLogout = () => {
    // Implement logout logic here
    localStorage.removeItem("authToken");
    window.location.href = "/";
  };
  return (
    <>
      <header className="flex flex-wrap sm:justify-start sm:flex-nowrap w-full bg-white text-sm py-3 dark:bg-neutral-800">
        <nav className="max-w-[85rem] w-full mx-auto px-4 flex flex-wrap basis-full items-center justify-between">
          {/* Brand */}
          <a
            className="sm:order-1 flex-none text-xl font-semibold dark:text-white focus:outline-hidden focus:opacity-80"
            href="#"
          >
            DineDash
          </a>

          {/* Right side buttons */}
          <div className="sm:order-3 flex items-center gap-x-2">
            {/* Mobile menu toggle */}
            <button
              type="button"
              className="sm:hidden hs-collapse-toggle relative size-9 flex justify-center items-center gap-x-2 rounded-lg border border-gray-200 bg-white text-gray-800 shadow-2xs hover:bg-gray-50 focus:outline-hidden focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-transparent dark:border-neutral-700 dark:text-white dark:hover:bg-white/10 dark:focus:bg-white/10"
              id="hs-navbar-alignment-collapse"
              aria-expanded="false"
              aria-controls="hs-navbar-alignment"
              aria-label="Toggle navigation"
              data-hs-collapse="#hs-navbar-alignment"
            >
              {/* Hamburger Icon */}
              <svg
                className="hs-collapse-open:hidden shrink-0 size-4"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="3" x2="21" y1="6" y2="6" />
                <line x1="3" x2="21" y1="12" y2="12" />
                <line x1="3" x2="21" y1="18" y2="18" />
              </svg>
              {/* Close Icon */}
              <svg
                className="hs-collapse-open:block hidden shrink-0 size-4"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
              <span className="sr-only">Toggle</span>
            </button>

            {/* Quick Menu Dropdown */}
            <QuickMenuDropdown
              onCartClick={() => setShowCartModal(true)}
              onProfileClick={() => setShowCreateProfileModal(true)}
              onEditProfileClick={() => setShowEditProfileModal(true)}
              onLogoutClick={handleLogout}
              hasProfile={hasProfile}
              customerName={customerName}
            />
          </div>

          {/* Navbar links */}
          <div
            id="hs-navbar-alignment"
            className="hs-collapse hidden overflow-hidden transition-all duration-300 basis-full grow sm:grow-0 sm:basis-auto sm:block sm:order-2"
            aria-labelledby="hs-navbar-alignment-collapse"
          >
            <div className="flex flex-col gap-5 mt-5 sm:flex-row sm:items-center sm:mt-0 sm:ps-5">
              <div className="flex flex-col gap-5 mt-5 sm:flex-row sm:items-center sm:mt-0 sm:ps-5">
                <NavLink
                  to="/customer"
                  className={({ isActive }) =>
                    `font-medium focus:outline-hidden ${
                      isActive
                        ? "text-violet-500"
                        : "text-gray-600 hover:text-gray-400 focus:text-gray-400 dark:text-neutral-400 dark:hover:text-neutral-500 dark:focus:text-neutral-500"
                    }`
                  }
                >
                  Home
                </NavLink>
                <NavLink
                  to="/order"
                  className={({ isActive }) =>
                    `font-medium focus:outline-hidden ${
                      isActive
                        ? "text-violet-500"
                        : "text-gray-600 hover:text-gray-400 focus:text-gray-400 dark:text-neutral-400 dark:hover:text-neutral-500 dark:focus:text-neutral-500"
                    }`
                  }
                >
                  Order
                </NavLink>
              </div>
            </div>
          </div>
        </nav>

        {/* Modals and Toasts */}
        <CartModal
          isOpen={showCartModal}
          onClose={() => setShowCartModal(false)}
          customerId={customerId}
        />

        <CreateCustomerProfileModal
          isOpen={showCreateProfileModal}
          onClose={() => setShowCreateProfileModal(false)}
          userId={userId}
          onSuccess={handleProfileSuccess}
        />

        <EditCustomerProfileModal
          isOpen={showEditProfileModal}
          onClose={() => setShowEditProfileModal(false)}
          customerData={customerData}
          onSuccess={handleProfileSuccess}
        />

        {/* Profile Toast */}
        {showProfileToast && (
          <div className="fixed top-4 right-4 z-50 animate-slide-in">
            <ProfileToast
              message="Complete your profile to get started!"
              onCreateProfile={() => {
                setShowProfileToast(false);
                setShowCreateProfileModal(true);
              }}
              onClose={() => setShowProfileToast(false)}
            />
          </div>
        )}
      </header>

      <style>{`
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
    `}</style>
    </>
  );
};

export default CustomerNav;
