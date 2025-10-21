import FeaturesSection from '../Components/FeaturesSection'
import Header from '../Components/Header'
import HeroSection from '../Components/HeroSection'

const LandingPage = () => {
  return (
    <div className="flex flex-col items-center w-full">
      <Header />
      <HeroSection />   
      <FeaturesSection/>
    </div>
  )
}

export default LandingPage
