import React from "react";
import CustomerHero from "../components/customer/CustomerHero";
import CustomerNav from "../components/customer/CustomerNav";
import WhyCustomersLove from "../components/customer/WhyCustomersLove";
import ReviewSection from "../components/customer/ReviewSection";
import FeaturesSection from "../components/customer/FeaturesSection";
import PartnerWithUs from "../components/merchant/PartnerWithUs";

const RestaurantHome: React.FC = () => {
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
        <WhyCustomersLove />
      </section>

      <section className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8">
        <FeaturesSection />
      </section>

      <section className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8">
        <ReviewSection
          title="What Our Customers Say"
          options={{ loop: true }}
        />
      </section>

      <section className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8">
        <PartnerWithUs />
      </section>
    </div>
  );
};

export default RestaurantHome;