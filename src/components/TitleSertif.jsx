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
        y: 25,
        opacity: 0,
        duration: 0.8,
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
    <div ref={ref} className="relative w-full overflow-hidden pt-12 pb-6 sm:pt-16 sm:pb-8 text-center select-none">
      <SectionBackdrop variant="warm" />
      
      {/* Ambient Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[550px] h-[200px] bg-gradient-to-r from-orange-600/20 via-amber-500/20 to-orange-500/10 blur-[110px] rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto px-4">
        {/* Top Badge */}
        {/* <div className="sertif-reveal inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-neutral-900/80 border border-orange-500/30 backdrop-blur-xl shadow-lg shadow-orange-500/10 mb-4 hover:border-orange-500/50 transition-colors">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
          </span>
          <span className="text-[11px] sm:text-xs font-mono tracking-widest text-orange-300 font-semibold uppercase">
            Sertifikasi &amp; Lisensi Resmi
          </span>
        </div> */}

        {/* Main Heading */}
        <h2 className="sertif-reveal text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.15] mb-3">
          Koleksi{' '}
          <span className="bg-gradient-to-r from-amber-200 via-orange-400 to-amber-400 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(249,115,22,0.35)]">
            Sertifikat &amp; Pencapaian
          </span>
        </h2>

        {/* Subtitle / Description */}
        <p className="sertif-reveal text-xs sm:text-sm text-neutral-400 max-w-2xl mx-auto leading-relaxed font-normal mb-6">
          Dokumentasi sertifikasi kompetensi nasional, Hak Atas Kekayaan Intelektual (HKI), dan program pelatihan profesional yang telah terverifikasi.
        </p>

        {/* Feature Highlights */}
        <div className="sertif-reveal flex flex-wrap justify-center items-center gap-2.5 sm:gap-4 text-[11px] font-mono text-neutral-300">
          <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-neutral-900/70 border border-white/10 hover:border-orange-500/30 transition-colors backdrop-blur-md">
            <i className="fas fa-shield-halved text-orange-400 text-xs" />
            <span>Terverifikasi BNSP &amp; HKI</span>
          </div>
          <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-neutral-900/70 border border-white/10 hover:border-orange-500/30 transition-colors backdrop-blur-md">
            <i className="fas fa-award text-amber-400 text-xs" />
            <span>7+ Dokumen Resmi</span>
          </div>
          <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-neutral-900/70 border border-white/10 hover:border-orange-500/30 transition-colors backdrop-blur-md">
            <i className="fas fa-building-columns text-orange-400 text-xs" />
            <span>Instansi &amp; Industri</span>
          </div>
        </div>
      </div>
    </div>
  );
}

