import React, { useState, useEffect, useRef } from 'react';

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
  const [scrollOffset, setScrollOffset] = useState(0);
  const itemRefs = useRef([]);
  const containerRef = useRef(null);

  // Effect untuk Intersection Observer
  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.3, // lebih sensitif
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = Number(entry.target.getAttribute('data-index'));
          if (!isNaN(index)) {
            setActiveIndex(index);
          }
        }
      });
    }, options);

    const currentRefs = itemRefs.current;
    currentRefs.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      currentRefs.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, []);

  // Effect untuk parallax scroll (geser gambar)
  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const offset = rect.top + window.scrollY;
        const currentScroll = window.scrollY;
        // hitung selisih dari posisi awal
        const delta = currentScroll - offset;
        setScrollOffset(delta * 0.2); // kecepatan parallax
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // inisialisasi

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div
      ref={containerRef}
      className="bg-black text-white min-h-screen flex flex-col justify-between p-8 md:p-16 relative selection:bg-neutral-700 font-sans"
    >
      <div className="max-w-6xl mx-auto w-full my-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-2">
            View My Related Experience
          </h1>
          <p className="text-xs tracking-[0.3em] text-neutral-500 uppercase font-light">
            Professional Background
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Kolom Kiri - Sticky dengan efek parallax */}
          <div className="lg:col-span-5 sticky top-8 self-start">
            <div className="relative overflow-hidden rounded-2xl bg-neutral-900 transition-all duration-700 ease-in-out">
              <div
                className="w-full h-64 md:h-80 bg-neutral-800 overflow-hidden"
                style={{
                  transform: `translateY(${scrollOffset}px) scale(${1 + 0.01 * activeIndex})`,
                  transition: 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                }}
              >
                <img
                  src={experiences[activeIndex]?.image}
                  alt={experiences[activeIndex]?.title}
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Overlay deskripsi */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6 md:p-8">
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
            {/* Indikator */}
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

          {/* Kolom Kanan - Timeline */}
          <div className="lg:col-span-7 pl-4 md:pl-8 border-l border-neutral-800 relative space-y-8">
            {experiences.map((exp, idx) => (
              <div
                key={exp.id}
                ref={(el) => (itemRefs.current[idx] = el)}
                data-index={idx}
                className="relative group cursor-pointer transition-all duration-300"
              >
                {/* Dot indikator */}
                <div
                  className={`absolute -left-[21px] md:-left-[37px] top-1.5 w-3 h-3 rounded-full transition-all duration-500 ${
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

            {/* View More */}
            <div className="relative group cursor-pointer pt-2">
              <div className="absolute -left-[21px] md:-left-[37px] top-3.5 w-3 h-3 bg-neutral-700 rounded-full group-hover:bg-neutral-400 transition"></div>
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

      {/* Logo N */}
      <div className="absolute bottom-8 left-8 w-8 h-8 rounded-full border border-neutral-800 flex items-center justify-center text-xs font-bold text-neutral-400 cursor-pointer hover:border-neutral-500 hover:text-white transition">
        N
      </div>

      {/* Tombol ke atas */}
      <button
        onClick={scrollToTop}
        className="absolute bottom-8 right-8 w-12 h-12 bg-white text-black rounded-full flex items-center justify-center shadow-lg hover:bg-neutral-200 transition transform hover:-translate-y-1"
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