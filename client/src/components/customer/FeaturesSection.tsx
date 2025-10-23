import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faStore,
  faUsers,
  faShoppingCart,
  faClock
} from '@fortawesome/free-solid-svg-icons';

const FeaturesSection: React.FC = () => {
  return (
    <div className="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
      <div className="w-full max-h-[400px] overflow-hidden rounded-xl mb-10">
        <img
          className="w-full h-full object-cover"
          src="https://brownliving.in/cdn/shop/articles/vegan-meal-ideas-for-special-occasions-and-celebrations-8497649.png?v=1760155561"
          alt="Restaurant system overview"
        />
      </div>

      {/* Grid */}
      <div className="mt-5 lg:mt-16 grid lg:grid-cols-3 gap-8 lg:gap-12">
        {/* Left Column */}
        <div className="lg:col-span-1">
          <h2 className="font-bold text-2xl md:text-3xl text-gray-800 dark:text-neutral-200">
            Powerful features for your restaurant business
          </h2>
          <p className="mt-2 md:mt-4 text-gray-500 dark:text-neutral-500">
            From merchant tools to customer experience and robust architecture — this platform covers everything you need to manage and scale your restaurant app.
          </p>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-2">
          <div className="grid sm:grid-cols-2 gap-8 md:gap-12">
            {/* Feature 1 */}
            <div className="flex gap-x-5">
              <FontAwesomeIcon icon={faStore} className="shrink-0 mt-1 text-violet-600 dark:text-violet-500 w-7 h-7" />
              <div className="grow">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                  Complete Restaurant Management
                </h3>
                <p className="mt-1 text-gray-600 dark:text-neutral-400">
                  Create, edit, and delete restaurants, add/edit menu items with image uploads, track weekly orders & revenue — all in one dashboard.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex gap-x-5">
              <FontAwesomeIcon icon={faUsers} className="shrink-0 mt-1 text-violet-600 dark:text-violet-500 w-7 h-7" />
              <div className="grow">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                  Customer Experience
                </h3>
                <p className="mt-1 text-gray-600 dark:text-neutral-400">
                  Browse restaurants by cuisine or location, view interactive menus with images, manage cart in real-time, and handle profiles & addresses effortlessly.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="flex gap-x-5">
              <FontAwesomeIcon icon={faShoppingCart} className="shrink-0 mt-1 text-violet-600 dark:text-violet-500 w-7 h-7" />
              <div className="grow">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                  Easy & Smart Ordering
                </h3>
                <p className="mt-1 text-gray-600 dark:text-neutral-400">
                  Add items to your cart with quantity controls, place orders seamlessly and enjoy a friction-free checkout experience.
                </p>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="flex gap-x-5">
              <FontAwesomeIcon icon={faClock} className="shrink-0 mt-1 text-violet-600 dark:text-violet-500 w-7 h-7" />
              <div className="grow">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                  Real-time Order Updates
                </h3>
                <p className="mt-1 text-gray-600 dark:text-neutral-400">
                  Stay informed at every step – from preparation to delivery – with live updates and minimal wait times.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturesSection;
