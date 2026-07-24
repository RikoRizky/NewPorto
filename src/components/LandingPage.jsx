import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import LandingPageDesktop from '../../LandingPage.png';
import LandingPageMobile from '../../Mobile.png';

gsap.registerPlugin(ScrollTrigger);

const LandingPage = () => {
  const sectionRef = useRef(null);
  const bgRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(bgRef.current, {
        y: 80,
        scale: 1.06,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        },
      });

      gsap.to(contentRef.current, {
        y: -40,
        opacity: 0.15,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative h-screen w-full overflow-hidden" id="beranda">
      <div ref={bgRef} className="absolute inset-0 will-change-transform">
        <img
          src={LandingPageDesktop}
          alt="Landing Page"
          fetchPriority="high"
          className="hidden md:block absolute inset-0 w-full h-full object-cover object-top"
        />
        <img
          src={LandingPageMobile}
          alt="Landing Page Mobile"
          fetchPriority="high"
          className="block md:hidden absolute inset-0 w-full h-full object-cover object-top"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/35 to-black/50" />

      <div
        ref={contentRef}
        className="absolute inset-0 flex items-center justify-center will-change-transform px-4 sm:px-6"
      >
        <div className="text-white z-10 w-full max-w-3xl text-center">
          {/* <p className="text-[10px] sm:text-xs font-mono tracking-[0.35em] text-amber-400/90 uppercase mb-4 animate-fade-in">
            Portfolio · 2025
          </p> */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-5 animate-fade-in tracking-tight !text-center">
            Riko Rizky
          </h1>
          <p className="text-base sm:text-lg md:text-2xl mb-6 sm:mb-8 animate-fade-in-up text-neutral-200 font-light leading-relaxed px-2">
            Turning ideas into interactive websites
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4 animate-fade-in-up">
            <a
              href="#biodata"
              className="w-full sm:w-auto px-8 py-3 bg-[#ff8c38] text-white rounded-full hover:bg-orange-500 transition duration-300 transform hover:scale-105 shadow-lg shadow-orange-500/30 font-medium text-center"
            >
              About Me
            </a>
            <a
              href="#project"
              className="w-full sm:w-auto px-8 py-3 border-2 border-white/80 text-yellow-400 rounded-full hover:bg-white hover:text-black transition duration-300 transform hover:scale-105 font-medium text-center"
            >
              My Projects
            </a>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 sm:bottom-10 left-1/2 -translate-x-1/2 animate-bounce z-10">
        <a href="#biodata" className="text-white/50 hover:text-amber-400 transition-colors text-2xl sm:text-3xl">
          <i className="fas fa-chevron-down" />
        </a>
      </div>
    </section>
  );
};

export default LandingPage;
