import Navbar from "../components/common/Navbar";
import Hero from "../components/common/Hero";   
import Footer from "../components/common/Footer";
import AboutUs from "../components/landing/AboutUs";
import Register from "../components/auth/Register";
import Login from "../components/auth/Login";
import UserCreation from "../components/auth/UserCreation";
import { useState } from "react";

const Landing = () => {
    const [isRegisterOpen, setIsRegisterOpen] = useState(false);
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [isUserCreationOpen, setIsUserCreationOpen] = useState(false); // ✅ Add success modal state
    const [registeredUserName, setRegisteredUserName] = useState(''); // ✅ Store user name

    const handleRegisterClick = () => {
        setIsRegisterOpen(true);
    };

    const handleLoginClick = () => {
        setIsLoginOpen(true);
    };

    const handleSwitchToLogin = () => {
        setIsRegisterOpen(false);
        setIsLoginOpen(true);
    };

    const handleSwitchToRegister = () => {
        setIsLoginOpen(false);
        setIsRegisterOpen(true);
    };

    // ✅ Handle successful registration
    const handleRegistrationSuccess = (userName: string) => {
        setRegisteredUserName(userName);
        setIsUserCreationOpen(true);
        // Register modal will close itself via onClose
    };

    // ✅ Handle success modal close
    const handleUserCreationClose = () => {
        setIsUserCreationOpen(false);
        setRegisteredUserName('');
        // Optionally switch to login after success modal closes
        setTimeout(() => {
            setIsLoginOpen(true);
        }, 500);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
            <Navbar onRegisterClick={handleRegisterClick} onLoginClick={handleLoginClick} />

            <Hero />

            <AboutUs />

            <Footer />

            {/* Register Modal */}
            {isRegisterOpen && (
                <Register 
                    onClose={() => setIsRegisterOpen(false)} 
                    onSwitchToLogin={handleSwitchToLogin}
                    onSuccess={handleRegistrationSuccess} // ✅ Pass success handler
                />
            )}

            {/* Login Modal */}
            {isLoginOpen && (
                <Login 
                    onClose={() => setIsLoginOpen(false)} 
                    onSwitchToRegister={handleSwitchToRegister} 
                />
            )}

            {/* Success Modal */}
            {isUserCreationOpen && (
                <UserCreation 
                    isOpen={isUserCreationOpen}
                    onClose={handleUserCreationClose}
                    userName={registeredUserName}
                />
            )}
        </div>
    );
};

export default Landing;
