import React from "react";
import { FaCreditCard, FaFileDownload, FaShoppingCart, FaTruck } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";

interface FinalOrderItems {
    id: number;
    name: string;
    quantity: number;
    price: number;
    image?: string;
}

interface OrderDetails {
    items: FinalOrderItems[];
    phone: string;
    address: string;
    instructions?: string;
    paymentMethod: string;
    orderIds: number[];
    deliveryFee?: number;
    tax?: number;
} 

const OrderConfirmationPage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const orderData = location.state as OrderDetails;

    // Redirect to home if no order data
    if (!orderData) {
        navigate('/');
        return null;
    }

    const calculateSubtotal = () => {
        return orderData.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    };

    const calculateTotal = () => {
        return calculateSubtotal() + (orderData.deliveryFee || 3.00) + (orderData.tax || 2.15);
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    {/* Order Header */}
                    <div className="border-b border-gray-200 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Order Confirmation</h1>
                                <div className="flex items-center mt-2">
                                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Order placed successfully!</p>
                                        {orderData.orderIds.length > 0 && (
                                            <p className="text-xs text-gray-500 font-mono">Order ID: #{orderData.orderIds[0]}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-gray-500">Order Time</p>
                                <p className="text-sm font-medium text-gray-900">{new Date().toLocaleString()}</p>
                            </div>
                        </div>
                    </div>

                    {/* Order Status */}
                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mx-6 mt-6">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-yellow-800">Order Status: Preparing</h3>
                                <p className="text-sm text-yellow-700 mt-1">Your order is being prepared and will be delivered soon.</p>
                            </div>
                        </div>
                    </div>

                    {/* Product Details */}
                    <div className="p-6">
                        <h2 className="text-lg font-medium text-gray-900 mb-4">Order Items</h2>
                        <div className="space-y-4">
                            {orderData.items.map((item) => (
                                <div key={item.id} className="flex items-center p-4 bg-gray-50 rounded-lg">
                                    <img
                                        src={item.image || "https://images.unsplash.com/photo-1560393464-5c69a73c5770"}
                                        alt={item.name}
                                        className="h-16 w-16 object-cover rounded-lg"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1560393464-5c69a73c5770";
                                        }}
                                    />
                                    <div className="ml-6 flex-1">
                                        <h3 className="text-base font-medium text-gray-900">{item.name}</h3>
                                        <div className="flex items-center justify-between mt-2">
                                            <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                                            <div className="text-right">
                                                <p className="text-sm text-gray-500">₹{item.price.toFixed(2)} each</p>
                                                <p className="text-sm font-medium text-gray-900">₹{(item.price * item.quantity).toFixed(2)}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Delivery Information */}
                    <div className="border-t border-gray-200 p-6">
                        <h2 className="text-lg font-medium text-gray-900 mb-4">Delivery Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Contact</h3>
                                <p className="mt-1 text-sm text-gray-900">{orderData.phone}</p>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Delivery Address</h3>
                                <p className="mt-1 text-sm text-gray-900">{orderData.address}</p>
                            </div>
                            {orderData.instructions && (
                                <div className="md:col-span-2">
                                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Special Instructions</h3>
                                    <p className="mt-1 text-sm text-gray-900">{orderData.instructions}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Price Breakdown */}
                    <div className="bg-gray-50 p-6">
                        <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>
                        <div className="space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Subtotal</span>
                                <span className="text-gray-900">₹{calculateSubtotal().toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Delivery Fee</span>
                                <span className="text-gray-900">₹{(orderData.deliveryFee || 3.00).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Tax</span>
                                <span className="text-gray-900">₹{(orderData.tax || 2.15).toFixed(2)}</span>
                            </div>
                            <div className="pt-3 border-t border-gray-200">
                                <div className="flex justify-between text-lg font-medium text-gray-900">
                                    <span>Total Paid</span>
                                    <span>₹{calculateTotal().toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Payment Information */}
                    <div className="border-t border-gray-200 p-6">
                        <h2 className="text-lg font-medium text-gray-900 mb-4">Payment Information</h2>
                        <div className="flex items-center">
                            <FaCreditCard className="h-6 w-6 text-gray-400" />
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-900">
                                    {orderData.paymentMethod === 'cash' ? 'Cash on Delivery' : orderData.paymentMethod}
                                </p>
                                <p className="text-sm text-gray-500">Payment will be collected upon delivery</p>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="border-t border-gray-200 p-6 bg-gray-50">
                        <div className="flex flex-wrap gap-4">
                            <button 
                                onClick={() => {
                                    // Implement download invoice functionality
                                    console.log('Download invoice clicked');
                                }}
                                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                <FaFileDownload className="mr-2 h-4 w-4" />
                                Download Invoice
                            </button>
                            <button 
                                onClick={() => {
                                    // Implement track order functionality
                                    console.log('Track order clicked');
                                }}
                                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                            >
                                <FaTruck className="mr-2 h-4 w-4" />
                                Track Order
                            </button>
                            <button 
                                onClick={() => navigate('/')}
                                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                <FaShoppingCart className="mr-2 h-4 w-4" />
                                Continue Shopping
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderConfirmationPage;