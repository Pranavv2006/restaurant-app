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

      <div className="max-w-[85rem] px-4 sm:px-6 lg:px-8 lg:pb-32 mx-auto ml-44">
        <div className="grid gap-6 grid-cols-2 sm:gap-12 lg:grid-cols-3 lg:gap-8">
          <div>
            <h4 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-neutral-200">Orders</h4>
            <p className="-ml-1 text-4xl sm:text-6xl font-bold text-violet-700">100,000+</p>
            <p className="mt-1 text-gray-500 dark:text-neutral-500">Every Single Day</p>
          </div>

          <div>
            <h4 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-neutral-200">Restaurants</h4>
            <p className="text-4xl sm:text-6xl font-bold text-violet-700">2,000+</p>
            <p className="mt-1 text-gray-500 dark:text-neutral-500">partner with DineDash</p>
          </div>

          <div>
            <h4 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-neutral-200">New Dishes</h4>
            <p className="-ml-1 x`text-4xl sm:text-6xl font-bold text-violet-700">100+</p>  
            <p className="mt-1 text-gray-500 dark:text-neutral-500">Added Every single Minute</p>
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