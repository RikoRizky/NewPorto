import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const experiences = [
    {
        id: 0,
        title: 'Cyber Physical Systems Laboratory',
        role: 'Research Assistant',
        description:
            'I mentored over 100 students in advanced networking concepts, including TCP/IP and socket programming, while serving as PIC for major laboratory projects. My role involved leading 15+ teams through successful project completions and maintaining rigorous academic standards through comprehensive evaluation.',
        image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=600&auto=format&fit=crop',
    },
    {
        id: 1,
        title: 'HUMIC Engineering',
        role: 'AI Developer Intern',
        description:
            'Developed and deployed machine learning models for predictive analytics, optimized data pipelines, and collaborated with cross-functional teams to integrate AI solutions into existing products.',
        image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=600&auto=format&fit=crop',
    },
    {
        id: 2,
        title: 'Informatics Laboratory, Telkom University',
        role: 'Computer Network Practicum Assistant',
        description:
            'Assisted in teaching networking fundamentals, conducted lab sessions for 100+ students, and designed evaluation materials. Also served as PIC for lab equipment maintenance and inventory.',
        image: 'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?q=80&w=600&auto=format&fit=crop',
    },
    {
        id: 3,
        title: 'Digistar Club by Telkom Indonesia',
        role: 'Chief Committee',
        description:
            'Led a team of 20+ members to organize tech workshops, hackathons, and community events. Managed budgets, secured sponsorships, and increased club membership by 40% within a year.',
        image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=600&auto=format&fit=crop',
    },
    {
        id: 4,
        title: 'Food and Agriculture Office of Bandung City',
        role: 'Data Entry Assistant',
        description:
            'Managed and digitized agricultural data, ensuring accuracy and consistency. Collaborated with government officials to streamline data reporting processes.',
        image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=600&auto=format&fit=crop',
    },
];

export default function RelatedExperience() {
    const [activeIndex, setActiveIndex] = useState(0);
    const sectionRef = useRef(null);
    const itemRefs = useRef([]);
    const imageRefs = useRef([]);
    const titleRef = useRef(null);
    const roleRef = useRef(null);
    const descTextRef = useRef(null);
    const cardRef = useRef(null);
    const progressRef = useRef(null);

    const totalItems = experiences.length;

    // Preload images
    useEffect(() => {
        experiences.forEach((exp) => {
            const img = new Image();
            img.src = exp.image;
        });
    }, []);

    // ScrollTrigger dengan scrub super cepat dan threshold tinggi (dari kode pertama)
    useEffect(() => {
        const section = sectionRef.current;
        if (!section) return;

        const items = itemRefs.current;

        items.forEach((el) => {
            if (el) gsap.set(el, { opacity: 0, x: -10 });
        });

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: section,
                start: 'top top',
                end: 'bottom bottom',
                pin: true,
                scrub: 0.2, // sangat responsif
                anticipatePin: 1,
                id: 'mainPin',
                onUpdate: (self) => {
                    // Threshold +0.6 agar indeks berubah lebih awal
                    const raw = self.progress * totalItems;
                    const index = Math.min(Math.floor(raw + 0.6), totalItems - 1);
                    if (index !== activeIndex) setActiveIndex(index);
                },
            },
        });

        // Animasi timeline item dengan durasi pendek
        items.forEach((el, i) => {
            if (!el) return;
            const startPos = i / totalItems;
            const endPos = (i + 1) / totalItems;
            tl.fromTo(
                el,
                { opacity: 0, x: -10 },
                { opacity: 1, x: 0, duration: 0.15, ease: 'power1.out' },
                startPos
            );
            tl.to(el, { opacity: 1, x: 0, duration: 0.05 }, endPos - 0.01);
        });

        return () => {
            tl.kill();
            ScrollTrigger.getAll().forEach((st) => {
                if (st.vars.id === 'mainPin') st.kill();
            });
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Efek ganti konten (instan + animasi ringan) dari kode pertama, ditambah update progress bar
    useEffect(() => {
        const exp = experiences[activeIndex];
        if (!exp) return;

        // Update teks secara langsung
        if (titleRef.current) titleRef.current.textContent = exp.title;
        if (roleRef.current) roleRef.current.textContent = exp.role;
        if (descTextRef.current) descTextRef.current.textContent = exp.description;

        // Crossfade gambar cepat (0.2s) – seperti di kode pertama
        imageRefs.current.forEach((img, idx) => {
            if (img) {
                img.style.opacity = idx === activeIndex ? '1' : '0';
                img.style.transform = idx === activeIndex ? 'scale(1)' : 'scale(1.01)';
                img.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
            }
        });

        // Animasi teks masuk sangat cepat
        const textEls = [titleRef.current, roleRef.current, descTextRef.current].filter(Boolean);
        gsap.set(textEls, { opacity: 0, y: 6 });
        gsap.to(textEls, {
            opacity: 1,
            y: 0,
            duration: 0.15,
            ease: 'power1.out',
            stagger: 0.03,
        });

        // Update progress bar (dari kode kedua)
        if (progressRef.current) {
            gsap.to(progressRef.current, {
                width: `${((activeIndex + 1) / totalItems) * 100}%`,
                duration: 0.4,
                ease: 'power2.out',
            });
        }
    }, [activeIndex, totalItems]);

    return (
        <div
            ref={sectionRef}
            className="relative min-h-screen overflow-hidden bg-[#0a0a0a] font-sans"
            style={{ minHeight: `${totalItems * 100}vh` }}
        >
            {/* Background efek dari kode pertama */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(163,230,53,0.04),transparent_60%),radial-gradient(ellipse_at_bottom_left,_rgba(163,230,53,0.02),transparent_50%)] pointer-events-none" />

            <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 py-8 sm:py-12 lg:py-16">
                {/* Header - dari kode pertama */}
                <div className="sticky top-0 z-20 bg-[#0a0a0a]/70 backdrop-blur-xl border-b border-white/5 py-5 sm:py-7 mb-10 sm:mb-14 text-center">
                    <div className="flex items-center justify-center gap-3 mb-1.5">
                        <span className="h-px w-8 sm:w-12 bg-gradient-to-r from-transparent to-lime-400/50" />
                        <span className="text-[10px] sm:text-xs font-mono tracking-[0.35em] text-lime-400/70 uppercase font-light">
                            Career Path
                        </span>
                        <span className="h-px w-8 sm:w-12 bg-gradient-to-l from-transparent to-lime-400/50" />
                    </div>
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight text-white">
                        Related{' '}
                        <span className="bg-gradient-to-r from-lime-300 to-lime-500 bg-clip-text text-transparent">
                            Experience
                        </span>
                    </h1>
                    <p className="text-[11px] sm:text-xs tracking-[0.25em] text-neutral-500 uppercase font-light mt-1.5">
                        Scroll to explore my professional journey
                    </p>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 xl:gap-16 items-start">
                    {/* Kiri */}
                    <div className="lg:col-span-5 space-y-5 lg:sticky lg:top-36 self-start">
                        {/* Gambar - dari kode pertama */}
                        <div className="relative overflow-hidden rounded-2xl bg-neutral-900/50 shadow-2xl shadow-lime-500/5 aspect-[4/3] sm:aspect-[16/10] lg:aspect-[4/3] border border-white/5">
                            {experiences.map((exp, idx) => (
                                <img
                                    key={exp.id}
                                    ref={(el) => (imageRefs.current[idx] = el)}
                                    src={exp.image}
                                    alt={exp.title}
                                    className="absolute inset-0 w-full h-full object-cover will-change-transform"
                                    style={{
                                        opacity: idx === activeIndex ? 1 : 0,
                                        transform: idx === activeIndex ? 'scale(1)' : 'scale(1.01)',
                                        transition: 'opacity 0.2s ease, transform 0.2s ease',
                                    }}
                                />
                            ))}
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/70 via-transparent to-transparent pointer-events-none" />
                            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-lime-500/10 rounded-full blur-3xl pointer-events-none" />
                        </div>

                        {/* Card deskripsi - dari kode pertama */}
                        <div
                            ref={cardRef}
                            className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 sm:p-7 border border-white/10 shadow-xl shadow-lime-500/5 transition-all duration-300 hover:border-lime-400/20"
                        >
                            <h3
                                ref={titleRef}
                                className="text-xl sm:text-2xl lg:text-3xl font-bold text-white leading-tight tracking-tight"
                            >
                                {experiences[activeIndex]?.title}
                            </h3>
                            <p
                                ref={roleRef}
                                className="text-xs sm:text-sm text-lime-400 font-medium mt-1 tracking-wide"
                            >
                                {experiences[activeIndex]?.role}
                            </p>
                            <div className="w-12 h-0.5 bg-gradient-to-r from-lime-400 to-transparent mt-3 mb-4" />
                            <p
                                ref={descTextRef}
                                className="text-sm sm:text-base text-neutral-300 leading-relaxed font-light"
                            >
                                {experiences[activeIndex]?.description}
                            </p>
                        </div>

                        {/* Dots - dari kode pertama */}
                        <div className="flex justify-center gap-2 pt-1">
                            {experiences.map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setActiveIndex(idx)}
                                    className={`group relative h-1.5 rounded-full transition-all duration-500 cursor-pointer ${
                                        idx === activeIndex
                                            ? 'w-8 bg-lime-400 shadow-[0_0_20px_rgba(163,230,53,0.5)]'
                                            : 'w-1.5 bg-neutral-700 hover:bg-neutral-500'
                                    }`}
                                    aria-label={`Go to experience ${idx + 1}`}
                                >
                                    <span
                                        className={`absolute -bottom-5 left-1/2 -translate-x-1/2 text-[8px] font-mono tracking-wider text-neutral-600 transition-opacity duration-300 ${
                                            idx === activeIndex ? 'opacity-100' : 'opacity-0 group-hover:opacity-60'
                                        }`}
                                    >
                                        {String(idx + 1).padStart(2, '0')}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Kanan - Timeline (dari kode pertama) */}
                    <div className="lg:col-span-7 pl-6 sm:pl-8 lg:pl-10 relative mt-4 lg:mt-0">
                        <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-lime-400/30 via-neutral-700/50 to-transparent" />
                        <div
                            className="absolute left-0 top-0 w-px h-full bg-gradient-to-b from-lime-400/60 to-transparent opacity-0 transition-opacity duration-700"
                            style={{ opacity: activeIndex / totalItems }}
                        />

                        <div className="space-y-10 sm:space-y-12">
                            {experiences.map((exp, idx) => {
                                const isActive = idx === activeIndex;
                                const isPast = idx < activeIndex;

                                return (
                                    <div
                                        key={exp.id}
                                        ref={(el) => (itemRefs.current[idx] = el)}
                                        className="relative group cursor-default pl-6 sm:pl-8"
                                    >
                                        <div
                                            className={`absolute left-[-6px] sm:left-[-6px] top-1.5 w-3.5 h-3.5 rounded-full transition-all duration-500 ${
                                                isActive
                                                    ? 'bg-lime-400 shadow-[0_0_24px_rgba(163,230,53,0.6)] scale-110'
                                                    : isPast
                                                    ? 'bg-lime-400/40 shadow-[0_0_12px_rgba(163,230,53,0.15)]'
                                                    : 'bg-neutral-700 group-hover:bg-neutral-500'
                                            }`}
                                        >
                                            <span
                                                className="absolute inset-0 rounded-full bg-lime-400/20 animate-ping"
                                                style={{ display: isActive ? 'block' : 'none' }}
                                            />
                                        </div>

                                        <div
                                            className={`absolute left-[3px] sm:left-[3px] top-5 w-px h-[calc(100%+8px)] transition-colors duration-700 ${
                                                isActive || isPast ? 'bg-lime-400/20' : 'bg-neutral-800'
                                            }`}
                                        />

                                        <div>
                                            <h3
                                                className={`text-base sm:text-lg font-semibold transition-colors duration-300 ${
                                                    isActive
                                                        ? 'text-white'
                                                        : isPast
                                                        ? 'text-neutral-400'
                                                        : 'text-neutral-600 group-hover:text-neutral-400'
                                                }`}
                                            >
                                                {exp.title}
                                            </h3>
                                            <p
                                                className={`text-[10px] sm:text-xs tracking-[0.2em] uppercase font-mono transition-colors duration-300 ${
                                                    isActive
                                                        ? 'text-lime-400/80'
                                                        : isPast
                                                        ? 'text-neutral-500/60'
                                                        : 'text-neutral-700'
                                                }`}
                                            >
                                                {exp.role}
                                            </p>
                                            <div
                                                className={`h-px w-8 mt-2 transition-all duration-700 ${
                                                    isActive ? 'bg-lime-400/60 w-12' : 'bg-transparent'
                                                }`}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="h-12" />
                    </div>
                </div>
            </div>

            {/* Progress bar bawah - dari kode kedua (dengan ref) */}
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3 bg-black/60 backdrop-blur-lg px-4 py-2 rounded-full border border-white/5 shadow-xl">
                <span className="text-[10px] font-mono tracking-widest text-neutral-500">
                    {String(activeIndex + 1).padStart(2, '0')} / {String(totalItems).padStart(2, '0')}
                </span>
                <span className="w-24 h-0.5 bg-neutral-800 rounded-full overflow-hidden">
                    <span
                        ref={progressRef}
                        className="block h-full bg-gradient-to-r from-lime-400 to-lime-500 rounded-full transition-all duration-500"
                        style={{ width: `${((activeIndex + 1) / totalItems) * 100}%` }}
                    />
                </span>
            </div>
        </div>
    );
}