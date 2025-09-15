const CustomerHero = () => {
  const renderStars = (count: number) =>
    [...Array(5)].map((_, i) => (
      <svg
        key={i}
        className={`w-4 h-4 ${
          i < count ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
        }`}
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          fillRule="evenodd"
          d="M12 .587l3.668 7.429 8.2 1.193-5.934 5.782 1.402 8.177L12 18.896l-7.336 3.862 1.402-8.177L.132 9.209l8.2-1.193z"
        />
      </svg>
    ));

  return (
    <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
        {/* Left Content */}
        <div>
          <h1 className="block text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 dark:text-white">
            Start your foodie journey with{" "}
            <span className="text-violet-600">DineDash</span>
          </h1>
          <p className="mt-3 text-lg text-gray-800 dark:text-neutral-400">
            Hand-picked professionals and expertly crafted components, designed
            for any kind of entrepreneur.
          </p>

          {/* Buttons */}
          <div className="mt-7 grid gap-3 w-full sm:inline-flex">
            <a
              href="#"
              className="inline-flex justify-center items-center gap-x-3 text-center bg-violet-600 hover:bg-violet-700 border border-transparent text-white text-sm font-medium rounded-lg focus:outline-hidden focus:bg-violet-700 disabled:opacity-50 disabled:pointer-events-none px-4 py-3"
            >
              Get started
              <svg
                className="shrink-0 size-4"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
                />
              </svg>
            </a>

            <a
              href="#"
              className="inline-flex justify-center items-center gap-x-3 text-center border border-gray-200 shadow-sm text-gray-800 hover:bg-gray-50 focus:outline-hidden focus:bg-gray-50 text-sm font-medium rounded-lg px-4 py-3 dark:bg-neutral-800 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
            >
              Contact sales team
            </a>
          </div>

          {/* Reviews */}
          <div className="mt-6 lg:mt-10 grid grid-cols-2 gap-x-5">
            <div>
              <div className="flex gap-x-1">{renderStars(5)}</div>
              <p className="mt-2 text-sm text-gray-600 dark:text-neutral-200">
                <span className="font-bold">4.9</span> / 5 – from 3k reviews
              </p>
            </div>

            <div>
              <div className="flex gap-x-1">{renderStars(4)}</div>
              <p className="mt-2 text-sm text-gray-600 dark:text-neutral-200">
                <span className="font-bold">4.6</span> / 5 – from 12k reviews
              </p>
            </div>
          </div>
        </div>

        {/* Right Side Placeholder (Image/Video/etc.) */}
        <div className="relative">
          <div className="w-full h-64 bg-gray-200 dark:bg-neutral-700 rounded-lg flex items-center justify-center">
            <span className="text-gray-500 dark:text-gray-300">
              Right-side content
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerHero;
