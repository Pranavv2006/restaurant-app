import React from "react";
import CustomerHero from "../components/customer/CustomerHero";
import CustomerNav from "../components/customer/CustomerNav";
import RecentMenu from "../components/customer/RecentMenu";

const Customer: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-neutral-900">
      {/* Navbar */}
      <CustomerNav />

      {/* Hero Section */}
      <section className="py-10">
        <CustomerHero />
      </section>

      {/* Menu Section */}
      <section className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          Popular Dishes
        </h2>
        <RecentMenu />
      </section>
    </div>
  );
};

export default Customer;
