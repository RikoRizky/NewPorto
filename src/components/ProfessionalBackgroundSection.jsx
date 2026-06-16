import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const experiences = [
  {
    id: 0,
    title: "Cyber Physical Systems Laboratory",
    role: "Research Assistant",
    description:
      "I mentored over 100 students in advanced networking concepts, including TCP/IP and socket programming, while serving as PIC for major laboratory projects. My role involved leading 15+ teams through successful project completions and maintaining rigorous academic standards through comprehensive evaluation.",
    image:
      "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: 1,
    title: "HUMIC Engineering",
    role: "AI Developer Intern",
    description:
      "Developed and deployed machine learning models for predictive analytics, optimized data pipelines, and collaborated with cross-functional teams to integrate AI solutions into existing products.",
    image:
      "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: 2,
    title: "Informatics Laboratory, Telkom University",
    role: "Computer Network Practicum Assistant",
    description:
      "Assisted in teaching networking fundamentals, conducted lab sessions for 100+ students, and designed evaluation materials. Also served as PIC for lab equipment maintenance and inventory.",
    image:
      "https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: 3,
    title: "Digistar Club by Telkom Indonesia",
    role: "Chief Committee",
    description:
      "Led a team of 20+ members to organize tech workshops, hackathons, and community events. Managed budgets, secured sponsorships, and increased club membership by 40% within a year.",
    image:
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: 4,
    title: "Food and Agriculture Office of Bandung City",
    role: "Data Entry Assistant",
    description:
      "Managed and digitized agricultural data, ensuring accuracy and consistency. Collaborated with government officials to streamline data reporting processes.",
    image:
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=600&auto=format&fit=crop",
  },
];

export default function RelatedExperience() {
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRef = useRef(null);
  const itemRefs = useRef([]);
  const imageRefs = useRef([]);
  const timelineRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const items = itemRefs.current;
    const totalItems = experiences.length;

    // Set initial state untuk setiap item (tersembunyi)
    items.forEach((el) => {
      if (el) {
        gsap.set(el, { opacity: 0, y: 40 });
      }
    });

    // Buat timeline yang akan di-scrub
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: `+=${totalItems * 120}vh`, // durasi pin berdasarkan jumlah item
        pin: true,
        scrub: 1.5,
        anticipatePin: 1,
        id: 'mainPin',
        onUpdate: (self) => {
          // Hitung progress 0..1
          const progress = self.progress;
          const index = Math.min(
            Math.floor(progress * totalItems),
            totalItems - 1
          );
          if (index !== activeIndex) {
            setActiveIndex(index);
          }
        },
      },
    });

    // Tambahkan tween untuk setiap item secara berurutan
    items.forEach((el, i) => {
      if (!el) return;
      const startPos = i / totalItems;
      const endPos = (i + 1) / totalItems;
      // Dari opacity:0,y:40 ke opacity:1,y:0
      tl.fromTo(
        el,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' },
        startPos
      );
      // Tetap terlihat sampai akhir (opsional)
      tl.to(el, { opacity: 1, y: 0, duration: 0.1 }, endPos - 0.01);
    });

    timelineRef.current = tl;

    // Cleanup
    return () => {
      if (timelineRef.current) {
        timelineRef.current.kill();
        timelineRef.current = null;
      }
      ScrollTrigger.getAll().forEach((st) => {
        if (st.vars.id === 'mainPin') st.kill();
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Efek untuk mengganti gambar (crossfade) saat activeIndex berubah
  useEffect(() => {
    imageRefs.current.forEach((img, idx) => {
      if (img) {
        img.style.opacity = idx === activeIndex ? '1' : '0';
        img.style.transition = 'opacity 0.7s ease';
      }
    });
  }, [activeIndex]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div ref={sectionRef} className="bg-black text-white min-h-screen font-sans relative">
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-12 md:py-16">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-black/80 backdrop-blur-sm py-6 mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            View My Related Experience
          </h1>
          <p className="text-xs tracking-[0.3em] text-neutral-500 uppercase font-light mt-1">
            Professional Background
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Kolom Kiri - Gambar */}
          <div className="lg:col-span-5 sticky top-32 self-start">
            <div className="relative overflow-hidden rounded-2xl bg-neutral-900 shadow-2xl aspect-[4/3]">
              {experiences.map((exp, idx) => (
                <img
                  key={exp.id}
                  ref={(el) => (imageRefs.current[idx] = el)}
                  src={exp.image}
                  alt={exp.title}
                  className="absolute inset-0 w-full h-full object-cover"
                  style={{ opacity: idx === activeIndex ? 1 : 0 }}
                />
              ))}
              {/* Overlay gradasi bawah */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6 md:p-8 pointer-events-none">
                <h3 className="text-xl md:text-2xl font-bold text-white">
                  {experiences[activeIndex]?.title}
                </h3>
                <p className="text-sm text-lime-400 font-medium mt-1">
                  {experiences[activeIndex]?.role}
                </p>
                <p className="text-xs text-neutral-300 mt-2 line-clamp-3 md:line-clamp-4">
                  {experiences[activeIndex]?.description}
                </p>
              </div>
            </div>
            {/* Indikator titik */}
            <div className="flex justify-center mt-4 gap-1.5">
              {experiences.map((_, idx) => (
                <span
                  key={idx}
                  className={`h-1.5 rounded-full transition-all duration-500 ${
                    idx === activeIndex ? 'w-6 bg-lime-400' : 'w-1.5 bg-neutral-600'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Kolom Kanan - Daftar Pengalaman */}
          <div className="lg:col-span-7 pl-4 md:pl-8 relative">
            {/* Garis vertikal timeline */}
            <div className="absolute left-0 top-0 bottom-0 w-px bg-neutral-800"></div>

            <div className="space-y-12">
              {experiences.map((exp, idx) => (
                <div
                  key={exp.id}
                  ref={(el) => (itemRefs.current[idx] = el)}
                  className="relative group cursor-default pl-8"
                >
                  {/* Dot indikator */}
                  <div
                    className={`absolute left-[-5px] top-1.5 w-3 h-3 rounded-full transition-all duration-500 ${
                      idx === activeIndex
                        ? 'bg-lime-400 shadow-[0_0_12px_#a3e635]'
                        : 'bg-neutral-600 group-hover:bg-neutral-400'
                    }`}
                  ></div>
                  <div>
                    <h3
                      className={`text-base md:text-lg font-semibold transition-colors duration-300 ${
                        idx === activeIndex
                          ? 'text-white'
                          : 'text-neutral-300 group-hover:text-white'
                      }`}
                    >
                      {exp.title}
                    </h3>
                    <p className="text-xs tracking-wider text-neutral-500 uppercase mt-0.5">
                      {exp.role}
                    </p>
                  </div>
                </div>
              ))}

              {/* View More (tidak termasuk dalam timeline) */}
              <div className="relative group cursor-pointer pl-8 pt-2">
                <div className="absolute left-[-5px] top-3.5 w-3 h-3 bg-neutral-700 rounded-full group-hover:bg-neutral-400 transition"></div>
                <div>
                  <h3 className="text-base md:text-lg font-semibold text-neutral-400 group-hover:text-white transition">
                    View more
                  </h3>
                  <p className="text-[10px] tracking-wider text-neutral-600 uppercase mt-0.5">
                    Explore all experiences
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigasi */}
      <div className="fixed bottom-8 left-8 z-20">
        <div className="w-8 h-8 rounded-full border border-neutral-800 flex items-center justify-center text-xs font-bold text-neutral-400 cursor-pointer hover:border-neutral-500 hover:text-white transition">
          N
        </div>
      </div>
      <button
        onClick={scrollToTop}
        className="fixed bottom-8 right-8 z-20 w-12 h-12 bg-white text-black rounded-full flex items-center justify-center shadow-lg hover:bg-neutral-200 transition transform hover:-translate-y-1"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="2.5"
          stroke="currentColor"
          className="w-5 h-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18"
          />
        </svg>
      </button>
    </div>
  );
}