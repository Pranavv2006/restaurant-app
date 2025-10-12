import Navbar from "../components/common/navbar";
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
  const [isUserCreationOpen, setIsUserCreationOpen] = useState(false);
  const [registeredUserName, setRegisteredUserName] = useState("");

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

  const handleRegistrationSuccess = (userName: string) => {
    setRegisteredUserName(userName);
    setIsUserCreationOpen(true);
  };

  const handleUserCreationClose = () => {
    setIsUserCreationOpen(false);
    setRegisteredUserName("");
    setTimeout(() => {
      setIsLoginOpen(true);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
      <Navbar
        onRegisterClick={handleRegisterClick}
        onLoginClick={handleLoginClick}
      />

      <Hero />

      <AboutUs />

      <Footer />

      {isRegisterOpen && (
        <Register
          onClose={() => setIsRegisterOpen(false)}
          onSwitchToLogin={handleSwitchToLogin}
          onSuccess={handleRegistrationSuccess}
        />
      )}

      {isLoginOpen && (
        <Login
          onClose={() => setIsLoginOpen(false)}
          onSwitchToRegister={handleSwitchToRegister}
        />
      )}

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
