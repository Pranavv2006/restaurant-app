import React, { useState, useRef, useEffect } from "react";
import {
  FaShoppingCart,
  FaSignOutAlt,
  FaMapMarkerAlt,
  FaHistory,
} from "react-icons/fa";
import { useCart } from "../../hooks/useCart";
import { useNavigate } from "react-router-dom";
import { ChevronDown } from "lucide-react";

interface QuickMenuDropdownProps {
  onCartClick: () => void;
  onAddressClick: () => void;
  onLogoutClick: () => void;
  customerName?: string;
}

const QuickMenuDropdown: React.FC<QuickMenuDropdownProps> = ({
  onCartClick,
  onAddressClick,
  onLogoutClick,
  customerName = "User",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { cartItemCount } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleItemClick = (action: () => void) => {
    action();
    setIsOpen(false);
  };

  const handleOrdersClick = () => {
    navigate('/orders-history');
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 py-2 px-3 text-sm font-medium rounded-lg text-gray-800 shadow-sm focus:outline-none dark:text-white transition-colors duration-200"
      >
        <div className="w-8 h-8 bg-gradient-to-r from-violet-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
          {customerName.charAt(0).toUpperCase()}
        </div>
        <span className="hidden sm:block">{customerName}</span>
        <ChevronDown
          className={`w-4 h-4 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-neutral-800 rounded-lg shadow-xl border border-gray-200 dark:border-neutral-700 z-50 animate-dropdown-enter">
          <div className="py-2">
            {/* Cart */}
            <button
              onClick={() => handleItemClick(onCartClick)}
              className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors duration-150"
            >
              <div className="relative">
                <FaShoppingCart className="text-green-500" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                    {cartItemCount > 99 ? '99+' : cartItemCount}
                  </span>
                )}
              </div>
              <span>View Cart {cartItemCount > 0 && `(${cartItemCount})`}</span>
            </button>

            {/* Order History */}
            <button
              onClick={() => handleItemClick(handleOrdersClick)}
              className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors duration-150"
            >
              <FaHistory className="text-blue-500" />
              <span>Order History</span>
            </button>

            {/* Manage Addresses */}
            <button
              onClick={() => handleItemClick(onAddressClick)}
              className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors duration-150"
            >
              <FaMapMarkerAlt className="text-violet-500" />
              <span>Manage Addresses</span>
            </button>

            {/* Divider */}
            <div className="my-1 border-t border-gray-100 dark:border-neutral-700"></div>

            {/* Logout */}
            <button
              onClick={() => handleItemClick(onLogoutClick)}
              className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-150"
            >
              <FaSignOutAlt className="text-red-500" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes dropdown-enter {
          0% {
            opacity: 0;
            transform: translateY(-4px) scale(0.95);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .animate-dropdown-enter {
          animation: dropdown-enter 0.15s ease-out;
        }
      `}</style>
    </div>
  );
};

export default QuickMenuDropdown;
