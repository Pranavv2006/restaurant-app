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
