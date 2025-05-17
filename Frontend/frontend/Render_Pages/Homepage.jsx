import { Route,Routes } from 'react-router-dom'

// importing all components one by one
import Navbar from "../Homepage_frontend/components/navbar/Navbar";
import MainSlider from "../Homepage_frontend/components/mainSlider/MainSlider";
import GalleryHomepage from "../Homepage_frontend/components/gallery/Gallery";
import LoginBoxes from '../Homepage_frontend/components/loginBoxes/LoginBoxes';
import EducationSection from '../Homepage_frontend/components/educationSection/EducationSection';
import OurAchievers from '../Homepage_frontend/components/ourAchievers/OurAchievers';
import ReviewsSection from '../Homepage_frontend/components/ReviewsSection/ReviewsSection';
import ContactUsSection from '../Homepage_frontend/components/contactUs/ContactUsSection';
import Footer from '../Homepage_frontend/components/footer/Footer';
import TopMarquee from '../Homepage_frontend/components/marqueeLine/TopMarquee';
import BottomMarquee from '../Homepage_frontend/components/marqueeLine/BottomMarquee';
import NAllReviewsPage from '../Homepage_frontend/components/ReviewsSection/NewAllReviews'

// import EducationSection from "../componenets/EducationSection";
// import OurAchievers from "../componenets/OurAchievers";
// import ContactUsSection from "../componenets/ContactUsSection";
// import ReviewsSection from "../componenets/ReviewsSection";
// import Footer from "../componenets/Footer";


function HomePage() {
    return (
      <div>
        <Navbar/>
       
        <MainSlider/>
        <TopMarquee />
        <LoginBoxes/>
        <EducationSection/>
        <BottomMarquee />
        <OurAchievers/>
        <ReviewsSection />
        <ContactUsSection />
        <Footer/>

      <Routes>
        <Route path="/gallery" element={<GalleryHomepage/>} />
        <Route path="/allreviews" element={<NAllReviewsPage/>} />

      </Routes>
  
      </div>
    );
  }
  
  export default HomePage;