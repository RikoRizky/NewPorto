import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function WhatIDoSection() {
  const sectionRef = useRef(null);
  const header1 = useRef(null);
  const header2 = useRef(null);
  const header3 = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Timeline 1: X (horizontal) animation
      const tl1 = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'top top',
          scrub: 1,
        },
      });

      tl1.fromTo(header1.current, { xPercent: 100 }, { xPercent: 0, ease: 'none' }, 0)
         .fromTo(header2.current, { xPercent: -100 }, { xPercent: 0, ease: 'none' }, 0)
         .fromTo(header3.current, { xPercent: 100 }, { xPercent: 0, ease: 'none' }, 0);

      // Timeline 2: Pin + Y & Scale animation
      const tl2 = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: `+=${window.innerHeight * 1.2}`,
          pin: true,
          scrub: 1,
          pinSpacing: true,
        },
      });

      // Phase 1: Move header1 & header3 towards center
      tl2.to(header1.current, { yPercent: 100, scale: 1, opacity: 1, ease: 'none' }, 0)
         .to(header3.current, { yPercent: -100, scale: 1, opacity: 1, ease: 'none' }, 0)
         .to(header2.current, { yPercent: 0, scale: 1, opacity: 1, ease: 'none' }, 0);

      // Phase 2: Fade out header1 & header3, scale down header2
      tl2.to(header1.current, { opacity: 0, ease: 'none' }, 0.5)
         .to(header3.current, { opacity: 0, ease: 'none' }, 0.5)
         .to(header2.current, { scale: 0.4, opacity: 1, ease: 'none' }, 0.5);
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <>
      <style>{`
        .whatido-section {
          position: relative;
          width: 100%;
          height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          overflow: hidden;
          background-color: #000000;
          z-index: 10;
        }
        .whatido-header {
          position: relative;
          width: 100%;
          padding: 0 2rem;
          background-color: #000000;
          will-change: transform, opacity;
          transform: translateZ(0);
          backface-visibility: hidden;
        }
        .whatido-header img {
          width: 100%;
          object-fit: contain;
        }
        .whatido-header:nth-child(2) {
          z-index: 2;
        }
      `}</style>
      <section ref={sectionRef} className="whatido-section">
        <div ref={header1} className="whatido-header">
          <img src="/img/whatido.svg" alt="what i do" />
        </div>
        <div ref={header2} className="whatido-header">
          <img src="/img/whatido.svg" alt="what i do" />
        </div>
        <div ref={header3} className="whatido-header">
          <img src="/img/whatido.svg" alt="what i do" />
        </div>
      </section>
    </>
  );
}