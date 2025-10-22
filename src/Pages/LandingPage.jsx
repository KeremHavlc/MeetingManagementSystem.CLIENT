import FeaturesSection from "../Components/FeaturesSection";
import Footer from "../Components/Footer";
import Header from "../Components/Header";
import HeroSection from "../Components/HeroSection";
import WhyUsSection from "../Components/WhyUsSection";

const LandingPage = () => {
  return (
    <div className="flex flex-col items-center w-full">
      <Header />
      <HeroSection />
      <WhyUsSection />
      <FeaturesSection />
      <Footer />
    </div>
  );
};

export default LandingPage;
