import React from "react";
import { useNavigate } from "react-router-dom";
import CustomerNav from "../components/customer/CustomerNav";
import OrderSection from "../components/customer/OrderSection";
import useAuth from "../hooks/useAuth";

const OrdersPage: React.FC = () => {
    const { isAuthenticated, user, loading: authLoading } = useAuth();
    const navigate = useNavigate();
    const isCustomer = () => {
        return isAuthenticated && user?.roleType === 'Customer';
    };

    const handleLoginClick = () => {
        alert("Please use the login button in the navigation bar above.");
    };

    if (authLoading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-neutral-900">
                <CustomerNav />
                <div className="container mx-auto px-4 py-8">
                    <div className="flex flex-col items-center justify-center h-64">
                        <div className="animate-spin rounded-full h-16 w-16 border-4 border-violet-500 border-t-transparent mb-4"></div>
                        <p className="text-xl font-semibold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent animate-pulse">
                            Loading your orders...
                        </p>
                    </div>
                </div>
            </div>
        );
    }
    if (!isCustomer()) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-neutral-900">
                <CustomerNav />
                <div className="container mx-auto px-4 py-8">
                    <div className="max-w-2xl mx-auto text-center py-16">
                        <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-lg p-8">
                            {/* Icon */}
                            <div className="text-violet-500 mb-6">
                                <svg className="w-20 h-20 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                </svg>
                            </div>

                            {/* Header */}
                            <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                                Access Your Orders
                            </h1>

                            {/* Message */}
                            <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg">
                                {!isAuthenticated 
                                    ? "Please log in as a customer to view your orders."
                                    : "Only customers can access order history."
                                }
                            </p>

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                {!isAuthenticated ? (
                                    <>
                                        <button
                                            onClick={() => {
                                                handleLoginClick();
                                            }}
                                            className="bg-gradient-to-r from-violet-600 to-purple-600 text-white px-8 py-3 rounded-lg hover:from-violet-700 hover:to-purple-700 transition-all duration-300 font-medium shadow-lg hover:shadow-xl"
                                        >
                                            Login as Customer
                                        </button>
                                        <button
                                            onClick={() => navigate('/')}
                                            className="border border-violet-600 text-violet-600 px-8 py-3 rounded-lg hover:bg-violet-50 dark:hover:bg-violet-900/20 transition-all duration-300 font-medium"
                                        >
                                            Browse Restaurants
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        onClick={() => navigate('/')}
                                        className="bg-gradient-to-r from-violet-600 to-purple-600 text-white px-8 py-3 rounded-lg hover:from-violet-700 hover:to-purple-700 transition-all duration-300 font-medium shadow-lg hover:shadow-xl"
                                    >
                                        Browse Restaurants
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-neutral-900">
            <CustomerNav />

            {/* Orders Section */}
            <div className="container mx-auto px-4 pb-8">
                <OrderSection userId={user?.id} />
            </div>

            {/* Quick Actions */}
            <div className="bg-white dark:bg-neutral-800 border-t border-gray-200 dark:border-neutral-700 py-8">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                            Ready for Your Next Meal?
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400">
                            Discover new restaurants and reorder your favorites
                        </p>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
                        <button
                            onClick={() => navigate('/')}
                            className="bg-gradient-to-r from-violet-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-violet-700 hover:to-purple-700 transition-all duration-300 font-medium shadow-lg hover:shadow-xl flex items-center justify-center"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            Browse Restaurants
                        </button>
                        
                        <button
                            onClick={() => navigate('/checkout')}
                            className="border border-violet-600 text-violet-600 px-6 py-3 rounded-lg hover:bg-violet-50 dark:hover:bg-violet-900/20 transition-all duration-300 font-medium flex items-center justify-center"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a1 1 0 01-1 1H9a1 1 0 01-1-1v-6m8 0V9a1 1 0 00-1-1H9a1 1 0 00-1-1v8" />
                            </svg>
                            View Cart
                        </button>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes fade-in {
                    0% {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    100% {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .animate-fade-in {
                    animation: fade-in 0.6s ease-out;
                }

                @keyframes gradient {
                    0%, 100% {
                        background-position: 0% 50%;
                    }
                    50% {
                        background-position: 100% 50%;
                    }
                }

                .animate-gradient {
                    background-size: 200% 200%;
                    animation: gradient 3s ease infinite;
                }
            `}</style>
        </div>
    );
};

export default OrdersPage;