import React from "react";

const OrderHero: React.FC = () => {
  return (
    <div className="relative overflow-hidden">
      <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-24">
        <div className="text-center">
          <h1 className="text-4xl sm:text-6xl font-bold text-gray-800 dark:text-neutral-200">
            Welcome to FlavorTown
          </h1>

          <p className="mt-3 text-gray-600 dark:text-neutral-400">
            Discover flavors from top chefs & restaurants near you.
          </p>

          <div className="mt-7 sm:mt-12 mx-auto max-w-xl relative">
            {/* Search Form */}
            <form>
              <div className="relative z-10 flex gap-x-3 p-3 bg-white border border-gray-200 rounded-lg shadow-lg shadow-gray-100 dark:bg-neutral-900 dark:border-neutral-700 dark:shadow-gray-900/20">
                <div className="w-full">
                  <label
                    htmlFor="restaurant-search"
                    className="block text-sm text-gray-700 font-medium dark:text-white"
                  >
                    <span className="sr-only">Search dishes</span>
                  </label>
                  <input
                    type="text"
                    name="restaurant-search"
                    id="restaurant-search"
                    className="py-2.5 px-4 block w-full border-transparent rounded-lg focus:border-red-500 focus:ring-red-500 dark:bg-neutral-900 dark:border-transparent dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                    placeholder="Search for dishes, cuisines..."
                  />
                </div>
                <div>
                  <button
                    type="submit"
                    className="size-11 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-violet-600 text-white hover:bg-violet-700 focus:outline-hidden focus:bg-violet-700 disabled:opacity-50 disabled:pointer-events-none"
                  >
                    <svg
                      className="shrink-0 size-5"
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
                      <circle cx="11" cy="11" r="8" />
                      <path d="m21 21-4.3-4.3" />
                    </svg>
                  </button>
                </div>
              </div>
            </form>
            {/* End Search Form */}

            {/* Decorative SVGs */}
            <div className="hidden md:block absolute top-0 end-0 -translate-y-12 translate-x-20">
              <svg
                className="w-16 h-auto text-yellow-500"
                width="121"
                height="135"
                viewBox="0 0 121 135"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5 16.4754C11.7688 27.4499 21.2452 57.3224 5 89.0164"
                  stroke="currentColor"
                  strokeWidth="10"
                  strokeLinecap="round"
                />
                <path
                  d="M33.6761 112.104C44.6984 98.1239 74.2618 57.6776 83.4821 5"
                  stroke="currentColor"
                  strokeWidth="10"
                  strokeLinecap="round"
                />
                <path
                  d="M50.5525 130C68.2064 127.495 110.731 117.541 116 78.0874"
                  stroke="currentColor"
                  strokeWidth="10"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            <div className="hidden md:block absolute bottom-0 start-0 translate-y-10 -translate-x-32">
              <svg
                className="w-40 h-auto text-green-500"
                width="347"
                height="188"
                viewBox="0 0 347 188"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4 82.4591C54.7956 92.8751 30.9771 162.782 68.2065 181.385C112.642 203.59 127.943 78.57 122.161 25.5053C120.504 2.2376 93.4028 -8.11128 89.7468 25.5053C85.8633 61.2125 130.186 199.678 180.982 146.248L214.898 107.02C224.322 95.4118 242.9 79.2851 258.6 107.02C274.299 134.754 299.315 125.589 309.861 117.539L343 93.4426"
                  stroke="currentColor"
                  strokeWidth="7"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>

          {/* Categories */}
          <div className="mt-10 sm:mt-20">
            {[
              { label: "Starters", icon: "🥗" },
              { label: "Main Course", icon: "🍛" },
              { label: "Desserts", icon: "🍰" },
              { label: "Drinks", icon: "🍹" },
              { label: "Vegan", icon: "🥑" },
              { label: "Specials", icon: "🍽️" },
            ].map((cat) => (
              <a
                key={cat.label}
                className="m-1 py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-2xs hover:bg-gray-50 focus:outline-hidden focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
                href="#"
              >
                <span>{cat.icon}</span>
                {cat.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderHero;
