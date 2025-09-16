const CustomerHero = () => {
  return (
    <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
        {/* Left Content */}
        <div>
          <h1 className="block text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 dark:text-white">
            Start your foodie journey with{" "}
            <span className="text-violet-600">DineDash</span>
          </h1>

          {/* Buttons */}
          <div className="mt-7 grid gap-3 w-full sm:inline-flex">
            <a
              href="#"
              className="inline-flex justify-center items-center gap-x-3 text-center bg-violet-600 hover:bg-violet-700 border border-transparent text-white text-sm font-medium rounded-lg focus:outline-hidden focus:bg-violet-700 disabled:opacity-50 disabled:pointer-events-none px-4 py-3"
            >
              Start Ordering
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
          </div>
        </div>

        {/* Right Side Video */}
        <div className="relative">
          <video
            className="w-full h-64 object-cover rounded-lg"
            autoPlay
            loop
            muted
          >
            <source src="/Assets/HomePage_Video.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
    </div>
  );
};

export default CustomerHero;
