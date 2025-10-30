import AITools from "../components/AITools"
import Footer from "../components/Footer"
import Hero from "../components/Hero"
// import HowItWorks from "../components/AIInAction"
import Navbar from "../components/Navbar"
import Plan from "../components/Plan"
import Testimonial from "../components/Testimonials"
 import TrustedCompanies from "../components/TrustedCompanies"


const Home = () => {
  return (
    <>
    <Navbar/>
    <Hero/>
    <TrustedCompanies/>
    <AITools/>
    <Testimonial/>
    <Plan/>
    <Footer/>
    </>
  )
}

export default Home