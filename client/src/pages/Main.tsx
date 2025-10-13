import React from "react";
import CustomerNav from "../components/customer/CustomerNav";
import OrderHero from "../components/customer/OrderHero";
import useAuth from "../hooks/useAuth";

const Main: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-neutral-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-900">
      {/* Navbar */}
      <CustomerNav />

      {/* Hero Section */}
      <OrderHero />
      
      {/* Optional: Show a subtle indicator for unauthenticated users */}
      {!isAuthenticated && (
        <div className="fixed bottom-4 right-4 bg-violet-100 dark:bg-violet-900 text-violet-800 dark:text-violet-200 px-4 py-2 rounded-lg shadow-lg z-50">
          <p className="text-sm">
            <span className="font-medium">👋 Welcome!</span> 
            <a href="/auth" className="ml-2 underline hover:text-violet-600">
              Sign in
            </a> for personalized features
          </p>
        </div>
      )}
    </div>
  );
};

export default Main;
