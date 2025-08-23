import React from "react";
import { useNavigate } from "react-router-dom";
import NavbarMerchant from "../components/merchant/NavbarMerchant";
import axiosInstance from "../api/axiosConfig";

const Merchant: React.FC = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        
        try {
            delete axiosInstance.defaults.headers.common['Authorization'];
        } catch (error) {
            console.log('Axios cleanup failed:', error);
        }
        
        navigate('/');
    };

    return (
        <div>
            <NavbarMerchant handleLogout={handleLogout} />
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-red-50">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-gray-800 mb-4">Merchant Dashboard</h1>
                    <p className="text-lg text-gray-600">Welcome to your restaurant management panel</p>
                </div>
            </div>
        </div>
    );
};

export default Merchant;