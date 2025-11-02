const CustomerHero = () => {
  return (
    <div className="flex flex-row justify-center items-center">
      <video width="1200" height="1600" autoPlay loop className="rounded-2xl opacity-60">
        <source src="../../../Assets/Hero_Project.mp4" type="video/mp4"/>
      </video>
      <div className="absolute top-23 left-21">
        <h1 className="block text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 dark:text-white">
          Start your Foodie Journey with 
        </h1>
        <h1 className="block text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 dark:text-white text-center">
          <span className="text-violet-600">DineDash</span>
        </h1>
      </div>
    </div>
  );
};

export default CustomerHero;
