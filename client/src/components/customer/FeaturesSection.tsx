import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faStore,
  faUsers,
  faShoppingCart,
  faClock
} from '@fortawesome/free-solid-svg-icons';
import CarouselSlides from "./CarouselSlides";

const FeaturesSection: React.FC = () => {
  const images = [
    "https://www.tasteandflavors.com/wp-content/uploads/2021/03/what-to-cook-on-sundays-landscape.gif",
    "https://www.tastingtable.com/img/gallery/12-indigenous-people-in-food-who-are-changing-the-culinary-landscape/l-intro-1663429409.jpg",
    "https://i.pinimg.com/1200x/39/5b/62/395b62e48d968805c4b4f51c6c0f2032.jpg",
    "https://i.pinimg.com/1200x/a9/cc/51/a9cc5175db9327a5b5065de33cdde151.jpg",
    "https://i.pinimg.com/736x/24/bd/33/24bd339c122b87d2c210e95802482c3c.jpg"
  ]

  return (
    <div className="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
      <div className="w-full max-w-6xl mx-auto h-96 md:h-[32rem] relative rounded-xl mb-10">
        <CarouselSlides slides={images}/>
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
