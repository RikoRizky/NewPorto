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
      // Animasi X (horizontal)
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top bottom',
        end: 'top top',
        scrub: 1,
        onUpdate: (self) => {
          gsap.set(header1.current, { x: `${100 - self.progress * 100}%` });
          gsap.set(header2.current, { x: `${-100 + self.progress * 100}%` });
          gsap.set(header3.current, { x: `${100 - self.progress * 100}%` });
        },
      });

      // Pin + efek Y & scale (menyatukan + mengecil, jarak rapat)
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: `+=${window.innerHeight * 1.2}`, // 🔽 lebih pendek agar jarak ke karya rapat
        pin: true,
        scrub: 1,
        pinSpacing: true,
        onUpdate: (self) => {
          if (self.progress <= 0.5) {
            const yProgress = self.progress / 0.5;
            gsap.set(header1.current, { y: `${yProgress * 100}%`, scale: 1 });
            gsap.set(header3.current, { y: `${yProgress * -100}%`, scale: 1 });
            gsap.set(header2.current, { y: '0%', scale: 1, opacity: 1 });
          } else {
            const scaleProgress = (self.progress - 0.5) / 0.5;
            const finalScale = 0.4; // 🔽 lebih kecil dari sebelumnya (0.6 → 0.4)
            const scale = 1 - scaleProgress * (1 - finalScale);
            // 🔽 Y offset lebih kecil (0% = tetap di tengah vertikal, tidak naik terlalu tinggi)
            const yOffset = 0; // bisa diubah -5% jika ingin agak naik sedikit

            gsap.set(header1.current, { opacity: 0 });
            gsap.set(header3.current, { opacity: 0 });
            gsap.set(header2.current, {
              scale: scale,
              y: `${yOffset}%`,
              opacity: 1,
            });
          }
        },
      });
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
          background-color: #1a1a1a;
          z-index: 10;
        }
        .whatido-header {
          position: relative;
          width: 100%;
          padding: 0 2rem;
          background-color: #1a1a1a;
          will-change: transform;
        }
        .whatido-header img {
          width: 100%;
          object-fit: contain;
        }
        .whatido-header:nth-child(1),
        .whatido-header:nth-child(3) {
          transform: translateX(100%) translateY(0%);
        }
        .whatido-header:nth-child(2) {
          transform: translateX(-100%) translateY(0%);
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