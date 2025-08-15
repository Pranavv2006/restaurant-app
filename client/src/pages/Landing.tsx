import Navbar from "../components/common/Navbar";
import Hero from "../components/common/Hero";   
import Footer from "../components/common/Footer";
import AboutUs from "../components/landing/AboutUs";
import Register from "../components/auth/Register";
import Login from "../components/auth/Login";
import { useState } from "react";

const Landing = () => {
    const [isRegisterOpen, setIsRegisterOpen] = useState(false);
    const [isLoginOpen, setIsLoginOpen] = useState(false);

    const handleRegisterClick = () => {
        setIsRegisterOpen(true);
    };

    const handleLoginClick = () => {
        setIsLoginOpen(true);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
            <Navbar onRegisterClick={handleRegisterClick} onLoginClick={handleLoginClick} />

            <Hero />

            <AboutUs />

            <Footer />

            {isRegisterOpen && <Register onClose={() => setIsRegisterOpen(false)} />}
            {isLoginOpen && <Login onClose={() => setIsLoginOpen(false)} />}
        </div>
    );
};

export default Landing;
