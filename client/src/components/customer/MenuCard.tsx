import React, { useState } from "react";
import { FaMinus, FaPlus, FaShoppingCart } from "react-icons/fa";

type MenuCardProps = {
  title: string;
  subtitle: string;
  description: string;
  imageUrl: string;
  price?: number;
  onAddToCart?: (quantity: number) => void;
  primaryAction?: { label: string; href: string };
  secondaryAction?: { label: string; href: string };
};

const MenuCard: React.FC<MenuCardProps> = ({
  title,
  subtitle,
  description,
  imageUrl,
  price,
  onAddToCart,
  primaryAction,
  secondaryAction,
}) => {
  const [quantity, setQuantity] = useState(1);

  const handleIncrement = () => {
    setQuantity((prev) => prev + 1);
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart(quantity);
      setQuantity(1);
    }
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
        <span className="block mb-1 text-xs font-semibold uppercase text-blue-600 dark:text-blue-500">
          {subtitle}
        </span>
        <h3 className="text-xl font-semibold text-gray-800 dark:text-neutral-300 group-hover:text-blue-600 dark:group-hover:text-white">
          {title}
        </h3>
        <p className="mt-3 text-gray-500 dark:text-neutral-500">
          {description}
        </p>
        
        {price !== undefined && (
          <div className="mt-3">
            <span className="text-2xl font-bold text-gray-800 dark:text-white">
              ${price.toFixed(2)}
            </span>
          </div>
        )}
      </div>

      {/* Quantity Counter and Add to Cart - Always show when price is defined */}
      {price !== undefined && (
        <div className="mt-auto p-4 md:p-6 pt-0">
          <div className="flex items-center gap-3">
            {/* Quantity Counter */}
            <div className="flex items-center border border-gray-300 rounded-lg dark:border-neutral-600">
              <button
                onClick={handleDecrement}
                className="px-3 py-2 text-gray-600 hover:bg-gray-100 dark:text-neutral-400 dark:hover:bg-neutral-800 transition-colors rounded-l-lg disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={quantity <= 1}
              >
                <FaMinus className="text-sm" />
              </button>
              
              <span className="px-4 py-2 text-lg font-semibold text-gray-800 dark:text-white min-w-[3rem] text-center">
                {quantity}
              </span>
              
              <button
                onClick={handleIncrement}
                className="px-3 py-2 text-gray-600 hover:bg-gray-100 dark:text-neutral-400 dark:hover:bg-neutral-800 transition-colors rounded-r-lg"
              >
                <FaPlus className="text-sm" />
              </button>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              className="flex-1 py-2.5 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors dark:bg-blue-500 dark:hover:bg-blue-600"
            >
              <FaShoppingCart />
              Add to Cart
            </button>
          </div>
          
          <div className="mt-3 text-sm text-gray-600 dark:text-neutral-400 text-right">
            Total: <span className="font-semibold text-gray-800 dark:text-white">${(price * quantity).toFixed(2)}</span>
          </div>
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
