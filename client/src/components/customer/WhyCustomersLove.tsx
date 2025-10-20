import React from "react";

const WhyCustomersLove: React.FC = () => {
  return (
    <section className="relative overflow-hidden">
      {/* Decorative background */}
      <div
        className="absolute inset-0 flex justify-center -z-10"
        aria-hidden="true"
      >
        <div
          className="w-full h-full bg-[url('https://preline.co/assets/svg/examples/squared-bg-element.svg')] dark:bg-[url('https://preline.co/assets/svg/examples-dark/squared-bg-element.svg')] bg-top bg-no-repeat bg-cover opacity-70"
        />
      </div>

      {/* Hero content */}
      <div className="relative max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-10">
        {/* Title */}
        <div className="-mt-7 max-w-xl text-center mx-auto">
          <h1 className="block font-bold text-gray-800 text-4xl md:text-5xl lg:text-6xl dark:text-neutral-200 animate-fade-in-up">
            Why Customers Love <span className="text-violet-700 animate-pulse-slow">DineDash</span>
          </h1>
        </div>

        {/* Subtitle */}
        <div className="mt-5 max-w-3xl text-center mx-auto">
          <p className="text-lg text-gray-600 dark:text-neutral-400 animate-fade-in-up-delay">
            DineDash makes Ordering Effortless, Curated Restaurants, Lightning-Fast Delivery,
            Transparent Tracking and Secure Checkout. From Hungry to Happy in Minutes.
          </p>
        </div>
      </div>

      {/* === Cards Section === */}
      <div className="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* === Fast Delivery Card === */}
          <div className="group flex flex-col h-full bg-white border border-gray-200 shadow-2xs rounded-xl dark:bg-neutral-900 dark:border-neutral-700 dark:shadow-neutral-700/70 animate-slide-in-left">
            <div className="h-52 flex flex-col justify-center items-center bg-blue-600 rounded-t-xl overflow-hidden">
                <img 
                    src="https://www.restroworks.com/blog/wp-content/uploads/2025/04/setup-delivery-feature-.webp" 
                    alt="Delivery" 
                    className="object-contain"
                />
            </div>
            <div className="p-4 md:p-6">
              <h3 className="text-xl font-bold text-violet-600 animate-fade-in-scale">
                Fast Delivery
              </h3>
              <p className="mt-3 text-gray-500 dark:text-neutral-500 animate-fade-in-text">
                Optimized routes and reliable partners ensure your food arrives hot and on time—every time.
              </p>
            </div>
          </div>

          {/* === Real-time Restaurants Card === */}
          <div className="group flex flex-col h-full bg-white border border-gray-200 shadow-2xs rounded-xl dark:bg-neutral-900 dark:border-neutral-700 dark:shadow-neutral-700/70 animate-slide-in-up">
            <div className="h-52 flex flex-col justify-center items-center bg-blue-600 rounded-t-xl overflow-hidden">
                <img 
                    src="https://images.travelandleisureasia.com/wp-content/uploads/sites/7/2025/05/02165503/aesthetic-rest-hero.jpeg?tr=w-1200,q-60" 
                    alt="Restaurant" 
                    className="object-contain"
                />
            </div>
            <div className="p-4 md:p-6">
              <h3 className="text-xl font-bold text-violet-600 animate-fade-in-scale-delay">
                Real-time Restaurants
              </h3>
              <p className="mt-3 text-gray-500 dark:text-neutral-500 animate-fade-in-text-delay">
                See which restaurants are open, how busy they are, and which dishes are available right now.
              </p>
            </div>
          </div>

          {/* === High Quality Food Card === */}
          <div className="group flex flex-col h-full bg-white border border-gray-200 shadow-2xs rounded-xl dark:bg-neutral-900 dark:border-neutral-700 dark:shadow-neutral-700/70 animate-slide-in-right">
            <div className="h-52 flex flex-col justify-center items-center bg-blue-600 rounded-t-xl overflow-hidden">
                <img 
                    src="https://images.pexels.com/photos/1956974/pexels-photo-1956974.jpeg?h=700&w=1200&fit=crop&dpr=1&auto=compress&cs=tinysrgb" 
                    alt="High-Quality" 
                    className="object-contain"
                />
            </div>
            <div className="p-4 md:p-6">
              <h3 className="text-xl font-bold text-violet-600 animate-fade-in-scale-delay-2">
                High Quality Food
              </h3>
              <p className="mt-3 text-gray-500 dark:text-neutral-500 animate-fade-in-text-delay-2">
                We partner with top-rated kitchens and enforce quality checks so every bite tastes exceptional.
              </p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes fadeInText {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes pulseSlow {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.8;
          }
        }

        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
        }

        .animate-fade-in-up-delay {
          animation: fadeInUp 0.8s ease-out 0.3s forwards;
          opacity: 0;
        }

        .animate-fade-in-scale {
          animation: fadeInScale 0.6s ease-out 0.5s forwards;
          opacity: 0;
        }

        .animate-fade-in-scale-delay {
          animation: fadeInScale 0.6s ease-out 0.7s forwards;
          opacity: 0;
        }

        .animate-fade-in-scale-delay-2 {
          animation: fadeInScale 0.6s ease-out 0.9s forwards;
          opacity: 0;
        }

        .animate-fade-in-text {
          animation: fadeInText 0.6s ease-out 0.8s forwards;
          opacity: 0;
        }

        .animate-fade-in-text-delay {
          animation: fadeInText 0.6s ease-out 1s forwards;
          opacity: 0;
        }

        .animate-fade-in-text-delay-2 {
          animation: fadeInText 0.6s ease-out 1.2s forwards;
          opacity: 0;
        }

        .animate-slide-in-left {
          animation: slideInLeft 0.8s ease-out 0.4s forwards;
          opacity: 0;
        }

        .animate-slide-in-up {
          animation: slideInUp 0.8s ease-out 0.6s forwards;
          opacity: 0;
        }

        .animate-slide-in-right {
          animation: slideInRight 0.8s ease-out 0.8s forwards;
          opacity: 0;
        }

        .animate-pulse-slow {
          animation: pulseSlow 3s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
};

export default WhyCustomersLove;