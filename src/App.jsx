import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
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
import NotFound from './components/NotFound';

gsap.registerPlugin(ScrollTrigger);

// Prevent mobile URL bar expand/collapse resize from triggering heavy ScrollTrigger recalculations during scroll
ScrollTrigger.config({ ignoreMobileResize: true });

function MainPage() {
  return (
    <>
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
    </>
  );
}

function App() {
  useEffect(() => {
    document.body.style.overflow = '';
    document.body.style.overflowX = 'clip';

    const refresh = () => ScrollTrigger.refresh();
    refresh();

    let resizeTimer;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        refresh();
      }, 150);
    };

    window.addEventListener('load', refresh);
    window.addEventListener('resize', handleResize, { passive: true });

    return () => {
      clearTimeout(resizeTimer);
      window.removeEventListener('load', refresh);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
