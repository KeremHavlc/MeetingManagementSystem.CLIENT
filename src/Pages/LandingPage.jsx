import { useState } from "react";
import Header from "../Components/LandingPageComponents/Header";
import HeroSection from "../Components/LandingPageComponents/HeroSection";
import WhyUsSection from "../Components/LandingPageComponents/WhyUsSection";
import FeaturesSection from "../Components/LandingPageComponents/FeaturesSection";
import Footer from "../Components/LandingPageComponents/Footer";
import LoginModal from "../Components/AuthComponents/LoginModal";
import RegisterModal from "../Components/AuthComponents/RegisterModal";

const LandingPage = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  return (
    <div className="flex flex-col items-center w-full">
      <Header
        onLoginClick={() => {
          setIsLoginOpen(true);
          setIsRegisterOpen(false);
        }}
        onRegisterClick={() => {
          setIsRegisterOpen(true);
          setIsLoginOpen(false);
        }}
      />
      <HeroSection
        onRegisterClick={() => {
          setIsRegisterOpen(true);
          setIsLoginOpen(false);
        }}
      />
      <WhyUsSection />
      <FeaturesSection />
      <Footer />
      {/* Modallar */}
      {isLoginOpen && <LoginModal onClose={() => setIsLoginOpen(false)} />}
      {isRegisterOpen && (
        <RegisterModal onClose={() => setIsRegisterOpen(false)} />
      )}
    </div>
  );
};

export default LandingPage;
