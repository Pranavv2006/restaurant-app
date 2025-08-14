import Navbar from "../components/common/Navbar";
import Hero from "../components/common/Hero";   
import Footer from "../components/common/Footer";
import AboutUs from "../components/landing/AboutUs";

const Landing = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
            {/* Navbar */}
            <Navbar />

            {/* Hero Section */}
            <Hero />

            {/* Testimonials Section */}
            <AboutUs />

            {/* Footer */}
            <Footer />
        </div>
    );
};

export default Landing;
