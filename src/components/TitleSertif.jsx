import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SectionBackdrop from './SectionBackdrop';

gsap.registerPlugin(ScrollTrigger);

export default function TitleSertif() {
  const ref = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.sertif-reveal', {
        y: 30,
        opacity: 0,
        duration: 0.7,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: ref.current,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
      });
    }, ref);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={ref} className="relative w-full overflow-hidden py-8 sm:py-10 text-center">
      <SectionBackdrop variant="warm" />
      <div className="relative z-10">
        <div className="sertif-reveal flex items-center justify-center gap-4 mb-2">
          <span className="h-px w-10 sm:w-16 bg-gradient-to-r from-transparent to-orange-400/60" />
          <span className="text-[10px] sm:text-xs font-mono tracking-[0.4em] text-orange-400/80 uppercase font-light">
            Sertifikasi
          </span>
          <span className="h-px w-10 sm:w-16 bg-gradient-to-l from-transparent to-orange-400/60" />
        </div>
        <h2 className="sertif-reveal text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight text-white leading-[1.1]">
          Koleksi{' '}
          <span className="bg-gradient-to-r from-amber-300 via-orange-400 to-amber-400 bg-clip-text text-transparent">
            Sertifikat
          </span>
        </h2>
        <p className="sertif-reveal text-[11px] sm:text-xs tracking-[0.3em] text-neutral-500 uppercase font-light mt-2 px-4">
          Scroll untuk jelajahi sertifikat &amp; pencapaian saya
        </p>
      </div>
    </div>
  );
}
