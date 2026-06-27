import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import AboutSection from './components/AboutSection';
import Karya from './components/Karya';
import WhatIDoSection from './components/WhatIDoSection';
import TitleSertif from './components/TitleSertif';
import ProfessionalBackgroundSection from './components/ProfessionalBackgroundSection';
import ContactSection from './components/ContactSection';
import FeedbackSection from './components/FeedbackSection';
import Footer from './components/Footer';

gsap.registerPlugin(ScrollTrigger);

function App() {
  useEffect(() => {
    document.body.style.overflow = '';
    document.body.style.overflowX = 'clip';

    const refresh = () => ScrollTrigger.refresh();
    refresh();
    window.addEventListener('load', refresh);
    window.addEventListener('resize', refresh);

    return () => {
      window.removeEventListener('load', refresh);
      window.removeEventListener('resize', refresh);
    };
  }, []);

  return (
    <div className="app">
      <Navbar />
      <main>
        <LandingPage />
        <AboutSection />
        <TitleSertif />
        <ProfessionalBackgroundSection />
        <WhatIDoSection />
        <Karya />
        <ContactSection />
        <FeedbackSection />
      </main>
      <Footer />
    </div>
  );
}

export default App;
