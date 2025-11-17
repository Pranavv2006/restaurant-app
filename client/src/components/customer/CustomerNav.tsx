import { NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import CartModal from "./CartModal";
import QuickMenuDropdown from "./QuickMenuDropdown";
import ManageCustomerAddressModal from "./ManageCustomerAddressModal";
import Login from "../auth/Login";
import Register from "../auth/Register";
import useAuth from "../../hooks/useAuth";
import { getAllCustomerAddresses } from "../../services/CustomerService";
import DarkModeSwitch from "./DarkModeSwitch";


const CustomerNav = () => {
  const { isAuthenticated, user } = useAuth();
  
  const [showCartModal, setShowCartModal] = useState(false);
  const [showManageAddressModal, setShowManageAddressModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [customerId, setCustomerId] = useState<number | null>(null);

  const isCustomer = () => {
    return isAuthenticated && user?.roleType === 'Customer';
  };

  useEffect(() => {
    const getCustomerId = async () => {
      if (!isCustomer() || !user?.id) {
        setCustomerId(null);
        return;
      }

      try {
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
  }, [user?.id, isAuthenticated]);

  const customerName = user?.firstName || "User";

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    window.location.reload();
  };

  const handleProceedToCheckout = () => {
    setShowCartModal(false);
    window.location.href = '/checkout';
  };

  const handleCartUpdate = () => {
    console.log("Cart updated");
  };

  const handleLoginClick = () => {
    setShowLoginModal(true);
  };

  const handleRegisterClick = () => {
    setShowRegisterModal(true);
  };

  const handleSwitchToRegister = () => {
    setShowLoginModal(false);
    setShowRegisterModal(true);
  };

  const handleSwitchToLogin = () => {
    setShowRegisterModal(false);
    setShowLoginModal(true);
  };

  const handleRegisterSuccess = (name: string) => {
    console.log(`Registration successful for ${name}`);
    setShowRegisterModal(false);
  };

  return (
    <>
      <header className="flex flex-wrap sm:justify-start sm:flex-nowrap w-full bg-white text-sm py-3 dark:bg-neutral-800">
        <nav className="max-w-[85rem] w-full mx-auto px-4 flex flex-wrap basis-full items-center justify-between">
          {/* Brand */}
          <NavLink
            to="/"
            className="sm:order-1 flex-none text-xl font-semibold dark:text-white focus:outline-hidden focus:opacity-80 hover:opacity-80"
          >
            DineDash
          </NavLink>

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

            {/* Conditional rendering based on authentication - only show for Customers */}
            {isAuthenticated && user?.roleType === 'Customer' ? (
              <div className="sm:order-3 flex items-center gap-x-2">
                <QuickMenuDropdown
                  onCartClick={() => setShowCartModal(true)}
                  onAddressClick={() => setShowManageAddressModal(true)}
                  onLogoutClick={handleLogout}
                  customerName={customerName}
                />
                <DarkModeSwitch />
              </div>
            ) : (
              <div className="sm:order-3 flex items-center gap-x-2">
                <button 
                  type="button" 
                  className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg bg-violet-700 text-white shadow-2xs hover:bg-violet-400 focus:outline-hidden focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none" 
                  onClick={handleRegisterClick}
                >
                  Register
                </button>
                <button 
                  type="button" 
                  className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg bg-violet-700 text-white shadow-2xs hover:bg-violet-400 focus:outline-hidden focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none" 
                  onClick={handleLoginClick}
                >
                  Login
                </button>
                <DarkModeSwitch />
              </div>
            )}
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
                  to="/home"
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
                  to="/"
                  className={({ isActive }) =>
                    `font-medium focus:outline-hidden ${
                      isActive
                        ? "text-violet-500"
                        : "text-gray-600 hover:text-gray-400 focus:text-gray-400 dark:text-neutral-400 dark:hover:text-neutral-500 dark:focus:text-neutral-500"
                    }`
                  }
                >
                  Browse Restaurants
                </NavLink>
              </div>
            </div>
          </div>
        </nav>

        {/* Modals - Only show for authenticated customers */}
        {isAuthenticated && user?.roleType === 'Customer' && customerId && (
          <>
            <CartModal
              isOpen={showCartModal}
              onClose={() => setShowCartModal(false)}
              customerId={customerId}
              onCartUpdate={handleCartUpdate}
              onProceedToCheckout={handleProceedToCheckout}
            />

            <ManageCustomerAddressModal
              isOpen={showManageAddressModal}
              onClose={() => setShowManageAddressModal(false)}
              userId={user?.id || 1}
              onSuccess={() => {
                console.log("Address updated successfully");
              }}
            />
          </>
        )}

        {/* Login Modal - Show for both authenticated and unauthenticated users */}
        {showLoginModal && (
          <Login
            onClose={() => setShowLoginModal(false)}
            onSwitchToRegister={handleSwitchToRegister}
          />
        )}

        {/* Register Modal - Show for both authenticated and unauthenticated users */}
        {showRegisterModal && (
          <Register
            onClose={() => setShowRegisterModal(false)}
            onSwitchToLogin={handleSwitchToLogin}
            onSuccess={handleRegisterSuccess}
          />
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
