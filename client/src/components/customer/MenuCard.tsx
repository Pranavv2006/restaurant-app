import { useState, useEffect } from "react";
import { FaMinus, FaPlus, FaShoppingCart } from "react-icons/fa";

type MenuCardProps = {
  title: string;
  description: string;
  imageUrl: string;
  price?: number;
  primaryAction?: { label: string; href: string };
  secondaryAction?: { label: string; href: string };
  onAddToCart?: (quantity: number) => void;
  isAddingToCart?: boolean;
  addToCartMessage?: { type: 'success' | 'error'; text: string } | null;
  quantity?: number;
  onIncrease?: () => void;
  onDecrease?: () => void;
};

const MenuCard = ({
  title,
  description,
  imageUrl,
  price,
  primaryAction,
  secondaryAction,
  onAddToCart,
  isAddingToCart = false,
  addToCartMessage,
  quantity: externalQuantity,
  onIncrease,
  onDecrease,
} : MenuCardProps) => {
  const [internalQuantity, setInternalQuantity] = useState(1);

  // Use external quantity if provided, otherwise use internal
  const currentQuantity = externalQuantity !== undefined ? externalQuantity : internalQuantity;

  // Sync internal quantity with external when external changes
  useEffect(() => {
    if (externalQuantity !== undefined) {
      setInternalQuantity(externalQuantity);
    }
  }, [externalQuantity]);

  const handleIncrement = () => {
    if (onIncrease) {
      onIncrease();
    } else {
      setInternalQuantity((prev) => prev + 1);
    }
  };

  const handleDecrement = () => {
    if (onDecrease) {
      onDecrease();
    } else if (internalQuantity > 1) {
      setInternalQuantity((prev) => prev - 1);
    }
  };

  const handleAddToCart = () => {
    
    if (onAddToCart && !isAddingToCart) {
      onAddToCart(currentQuantity);
    }
  };

  const getButtonContent = () => {
    if (isAddingToCart) {
      return (
        <>
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
          <span className="ml-2">Adding...</span>
        </>
      );
    }

    if (addToCartMessage?.type === 'success') {
      return (
        <>
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          <span className="ml-2">Added!</span>
        </>
      );
    }

    if (addToCartMessage?.type === 'error') {
      return (
        <>
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <span className="ml-2">Retry</span>
        </>
      );
    }

    return (
      <>
        <FaShoppingCart />
        <span className="ml-2">Add to Cart</span>
      </>
    );
  };

  const getButtonStyle = () => {
    if (addToCartMessage?.type === 'success') {
      return "bg-green-600 hover:bg-green-700 focus:ring-green-500";
    }
    if (addToCartMessage?.type === 'error') {
      return "bg-red-600 hover:bg-red-700 focus:ring-red-500";
    }
    return "bg-violet-600 hover:bg-violet-700 focus:ring-violet-500";
  };

  return (
    <div className="group flex flex-col h-full bg-white border border-gray-200 shadow-2xs rounded-xl dark:bg-neutral-900 dark:border-neutral-700 dark:shadow-neutral-700/70">
      {/* Image */}
      <div className="h-52 flex justify-center items-center rounded-t-xl overflow-hidden">
        <img
          src={imageUrl}
          alt={title}
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Content */}
      <div className="p-4 md:p-6">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-neutral-300 group-hover:text-violet-600 dark:group-hover:text-white">
          {title}
        </h3>
        <p className="mt-3 text-gray-500 dark:text-neutral-500 text-sm line-clamp-2">
          {description}
        </p>
        
        {price !== undefined && (
          <div className="mt-4">
              <span className="text-2xl font-bold text-gray-800 dark:text-white text-center">
                ₹{price.toFixed(0)}
              </span>
          </div>
        )}
      </div>

      {/* Quantity Counter and Add to Cart */}
      {price !== undefined && (
        <div className="mt-auto p-4 md:p-6 pt-0">
          <div className="flex items-center gap-3">
            {/* Quantity Counter */}
            <div className="flex items-center border border-gray-300 rounded-lg dark:border-neutral-600 bg-gray-50 dark:bg-neutral-800">
              <button
                onClick={handleDecrement}
                disabled={currentQuantity <= 1 || isAddingToCart}
                className="px-3 py-2 text-gray-600 hover:bg-gray-200 dark:text-neutral-400 dark:hover:bg-neutral-700 transition-colors rounded-l-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FaMinus className="text-sm" />
              </button>
              
              <span className="px-4 py-2 text-lg font-semibold text-gray-800 dark:text-white min-w-[3rem] text-center bg-white dark:bg-neutral-900">
                {currentQuantity}
              </span>
              
              <button
                onClick={handleIncrement}
                disabled={isAddingToCart}
                className="px-3 py-2 text-gray-600 hover:bg-gray-200 dark:text-neutral-400 dark:hover:bg-neutral-700 transition-colors rounded-r-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FaPlus className="text-sm" />
              </button>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              disabled={isAddingToCart}
              className={`flex-1 py-3 px-4 inline-flex justify-center items-center text-sm font-semibold rounded-lg text-white focus:outline-none focus:ring-2 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed transform hover:scale-105 disabled:hover:scale-100 ${getButtonStyle()}`}
            >
              {getButtonContent()}
            </button>
          </div>
          
          {/* Success/Error Message */}
          {addToCartMessage && (
            <div className={`mt-3 text-center text-sm font-medium p-2 rounded-lg ${
              addToCartMessage.type === 'success' 
                ? 'text-green-700 bg-green-50 dark:text-green-400 dark:bg-green-900/20' 
                : 'text-red-700 bg-red-50 dark:text-red-400 dark:bg-red-900/20'
            }`}>
              {addToCartMessage.text}
            </div>
          )}
        </div>
      )}

      {/* Original Actions (if provided) */}
      {(primaryAction || secondaryAction) && !price && (
        <div className="mt-auto flex border-t border-gray-200 divide-x divide-gray-200 dark:border-neutral-700 dark:divide-neutral-700">
          {primaryAction && (
            <a
              href={primaryAction.href}
              className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-es-xl bg-white text-gray-800 shadow-2xs hover:bg-gray-50 focus:outline-hidden focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
            >
              {primaryAction.label}
            </a>
          )}
          {secondaryAction && (
            <a
              href={secondaryAction.href}
              className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-ee-xl bg-white text-gray-800 shadow-2xs hover:bg-gray-50 focus:outline-hidden focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
            >
              {secondaryAction.label}
            </a>
          )}
        </div>
      )}
    </div>
  );
};

export default MenuCard;
