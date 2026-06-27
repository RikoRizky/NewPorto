import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SectionBackdrop from './SectionBackdrop';

gsap.registerPlugin(ScrollTrigger);

// ============ HELPER GOOGLE DRIVE + PROXY ============
const getGoogleDriveThumbnail = (url) => {
    const match = url.match(/\/d\/(.+?)\//);
    if (match) {
        const fileId = match[1];
        const directUrl = `https://drive.google.com/uc?export=view&id=${fileId}`;
        return `https://images.weserv.nl/?url=${encodeURIComponent(directUrl)}&w=800&h=600&fit=cover`;
    }
    return url;
};

// ============ DATA ============
const rawExperiences = [
    {
        id: 0,
        title: 'Sertifikat BNSP',
        role: 'Badan Nasional Sertifikasi Profesi - 2025',
        description:
            'Sertifikasi kompetensi profesional yang diakui secara nasional, menjadi bukti penguasaan keahlian di bidang Teknologi Informasi dengan standar industri yang telah teruji.',
        year: '2025',
        certificate: 'https://drive.google.com/file/d/1rsrf3LQ5EeqACZ4O7PvpAdpmTk8snZ5J/view?pli=1',
        image: '/img/sertif.png',
    },
    {
        id: 1,
        title: 'Sertifikat PKL',
        role: 'Badan Pusat Statistik Kota Cirebon - 2024',
        description:
            'Pengalaman praktik kerja industri di instansi pemerintahan, mengelola dan menganalisis data statistik dengan standar profesional, serta berkontribusi dalam proyek digitalisasi data kependudukan.',
        year: '2024',
        certificate: 'https://drive.google.com/file/d/1y3VN-N-0SqDUHNsEDsHt1PVmCTZDOTvk/view',
    },
    {
        id: 2,
        title: 'Sertifikat UKK',
        role: 'Uji Kompetensi Keahlian RPL - 2024',
        description:
            'Uji kompetensi keahlian Rekayasa Perangkat Lunak yang mengukur kemampuan teknis dalam pengembangan aplikasi, pemrograman, dan analisis sistem sesuai standar industri teknologi informasi.',
        year: '2024',
        certificate: 'https://drive.google.com/file/d/1XY4nEWlOES9m9tWEgYsDiRC1YbGAQbeO/view',
    },
    {
        id: 3,
        title: 'Sertifikat Karier.mu',
        role: 'Menjadi Talenta Siap Bisnis - 2024',
        description:
            'Pelatihan intensif pengembangan diri dan soft skills untuk mempersiapkan talenta muda menjadi profesional siap kerja dan berwirausaha, dengan fokus pada kepemimpinan dan komunikasi efektif.',
        year: '2024',
        certificate: 'https://drive.google.com/file/d/1hc3UhB86SjkcyUJMYuN7oXKLtHxiYmWF/view',
    },
    {
        id: 4,
        title: 'Sertifikat Karier.mu',
        role: 'Kelas Persiapan Kerja - 2024',
        description:
            'Program pembekalan karir komprehensif yang mencakup pembuatan CV profesional, teknik wawancara kerja, serta pengenalan budaya kerja di perusahaan-perusahaan terkemuka Indonesia.',
        year: '2024',
        certificate: 'https://drive.google.com/file/d/1hb91N-07A9gE-jXKM2ubNV0v_HxtaF75/view',
    },
    {
        id: 5,
        title: 'Sertifikat Partisipasi',
        role: 'Kunjungan Industri GAMELAB Indonesia - 2023',
        description:
            'Partisipasi aktif dalam kunjungan industri ke GAMELAB Indonesia, memperoleh wawasan tentang proses pengembangan game profesional dan teknologi kreatif di industri hiburan digital.',
        certificate: 'https://drive.google.com/file/d/1hdLfWs4pNjjCx3a6fEe50F0vT1R_DTYT/view',
    },
];

// ============ MAPPING GAMBAR ============
const PLACEHOLDER_IMAGE = 'https://picsum.photos/seed/cert/800/600';

const experiences = rawExperiences.map((exp) => {
    // Jika ada gambar lokal (bukan drive)
    if (exp.image && !exp.image.includes('drive.google.com')) {
        return { ...exp, image: exp.image };
    }
    const driveLink = exp.certificate || exp.image;
    if (driveLink) {
        return {
            ...exp,
            image: getGoogleDriveThumbnail(driveLink),
        };
    }
    return { ...exp, image: PLACEHOLDER_IMAGE };
});

// ============ KOMPONEN UTAMA ============
export default function RelatedExperience() {
    const [activeIndex, setActiveIndex] = useState(0);
    const sectionRef = useRef(null);
    const itemRefs = useRef([]);
    const imageRefs = useRef([]);
    const titleRef = useRef(null);
    const roleRef = useRef(null);
    const descTextRef = useRef(null);
    const cardRef = useRef(null);

    const totalItems = experiences.length;

    // Preload images
    useEffect(() => {
        experiences.forEach((exp) => {
            const img = new Image();
            img.src = exp.image;
            img.onerror = () => {
                img.src = PLACEHOLDER_IMAGE;
            };
        });
    }, []);

    // ScrollTrigger pin — timeline items always visible, highlight via activeIndex
    useEffect(() => {
        const section = sectionRef.current;
        if (!section) return;

        const st = ScrollTrigger.create({
            trigger: section,
            start: 'top top',
            end: `+=${totalItems * 80}%`,
            pin: true,
            scrub: 0.5,
            anticipatePin: 1,
            id: 'mainPin',
            onUpdate: (self) => {
                const progress = self.progress;
                const idx = Math.min(Math.floor(progress * totalItems), totalItems - 1);
                setActiveIndex(idx);
            },
        });

        return () => {
            st.kill();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Update konten saat activeIndex berubah
    useEffect(() => {
        const exp = experiences[activeIndex];
        if (!exp) return;

        if (titleRef.current) titleRef.current.textContent = exp.title;
        if (roleRef.current) roleRef.current.textContent = exp.role;
        if (descTextRef.current) descTextRef.current.textContent = exp.description;

        imageRefs.current.forEach((img, idx) => {
            if (img) {
                img.style.opacity = idx === activeIndex ? '1' : '0';
                img.style.transform = idx === activeIndex ? 'scale(1)' : 'scale(1.05)';
                img.style.transition =
                    'opacity 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            }
        });

        const textEls = [titleRef.current, roleRef.current, descTextRef.current].filter(Boolean);
        gsap.set(textEls, { opacity: 0, y: 12 });
        gsap.to(textEls, {
            opacity: 1,
            y: 0,
            duration: 0.25,
            ease: 'power2.out',
            stagger: 0.05,
        });
    }, [activeIndex]);

    return (
        <div
            ref={sectionRef}
            id="experience"
            className="relative min-h-[100vh] font-sans selection:bg-orange-400/30 overflow-hidden"
        >
            <SectionBackdrop variant="cool" />

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-6 sm:py-10 lg:py-16 pb-16 sm:pb-24">
                {/* Grid: 1 kolom mobile, 2 kolom tablet+ */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 lg:gap-12 xl:gap-16 items-start">
                    
                    {/* ===== KOLOM KIRI (selalu tampil) ===== */}
                    <div className="md:col-span-5 space-y-5 md:space-y-6 md:sticky md:top-20 self-start">
                        {/* Image Card – rasio aspek responsif */}
                        <div className="relative overflow-hidden rounded-2xl bg-neutral-800 shadow-2xl shadow-orange-500/10 aspect-[3/4] sm:aspect-[4/3] md:aspect-[4/3] lg:aspect-[4/3] border border-white/10 group">
                            {experiences.map((exp, idx) => (
                                <img
                                    key={exp.id}
                                    ref={(el) => (imageRefs.current[idx] = el)}
                                    src={exp.image}
                                    alt={exp.title}
                                    onError={(e) => {
                                        e.target.src = PLACEHOLDER_IMAGE;
                                    }}
                                    className="absolute inset-0 w-full h-full object-cover will-change-transform"
                                    style={{
                                        opacity: idx === activeIndex ? 1 : 0,
                                        transform: idx === activeIndex ? 'scale(1)' : 'scale(1.05)',
                                        transition:
                                            'opacity 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                                    }}
                                />
                            ))}
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/80 via-transparent to-transparent pointer-events-none" />
                            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-transparent to-transparent pointer-events-none" />
                            <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-orange-500/15 rounded-full blur-3xl pointer-events-none animate-pulse" />
                            <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10 text-[8px] sm:text-[10px] font-mono tracking-widest text-orange-400/80">
                                {String(activeIndex + 1).padStart(2, '0')} /{' '}
                                {String(totalItems).padStart(2, '0')}
                            </div>
                        </div>

                        {/* Detail Card */}
                        <div
                            ref={cardRef}
                            className="bg-white/5 backdrop-blur-xl rounded-2xl p-5 sm:p-6 md:p-7 border border-white/10 shadow-xl shadow-orange-500/5 transition-all duration-300 hover:border-orange-400/30 hover:shadow-orange-500/10"
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <h3
                                        ref={titleRef}
                                        className="text-lg sm:text-2xl lg:text-3xl font-bold text-white leading-tight tracking-tight"
                                    >
                                        {experiences[activeIndex]?.title}
                                    </h3>
                                    <p
                                        ref={roleRef}
                                        className="text-xs sm:text-sm text-orange-400 font-medium mt-1 tracking-wide"
                                    >
                                        {experiences[activeIndex]?.role}
                                    </p>
                                </div>
                                <a
                                    href={experiences[activeIndex]?.certificate}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="shrink-0 w-8 h-8 rounded-full bg-orange-400/10 border border-orange-400/20 flex items-center justify-center hover:bg-orange-400/20 hover:border-orange-400/40 transition-all duration-300 cursor-pointer text-orange-400/70 hover:text-amber-300 text-sm sm:text-base"
                                    title="Buka Sertifikat"
                                >
                                    <i className="fas fa-external-link-alt"></i>
                                </a>
                            </div>
                            <div className="w-12 h-0.5 bg-gradient-to-r from-orange-400 to-transparent mt-3 mb-3 sm:mb-4 rounded-full" />
                            <p
                                ref={descTextRef}
                                className="text-sm sm:text-base text-neutral-300 leading-relaxed font-light"
                            >
                                {experiences[activeIndex]?.description}
                            </p>
                        </div>

                        {/* Dot Navigation */}
                        <div className="flex justify-center gap-2 sm:gap-3 pt-1 sm:pt-2">
                            {experiences.map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setActiveIndex(idx)}
                                    className={`group relative h-2 rounded-full transition-all duration-500 cursor-pointer focus:outline-none focus:ring-2 focus:ring-orange-400/50 ${
                                        idx === activeIndex
                                            ? 'w-8 sm:w-10 bg-orange-400 shadow-[0_0_24px_rgba(255,140,56,0.5)]'
                                            : 'w-2 bg-neutral-700 hover:bg-neutral-500 hover:scale-125'
                                    }`}
                                    aria-label={`Go to experience ${idx + 1}`}
                                >
                                    <span
                                        className={`absolute -bottom-5 sm:-bottom-6 left-1/2 -translate-x-1/2 text-[7px] sm:text-[8px] font-mono tracking-wider text-neutral-600 transition-all duration-300 ${
                                            idx === activeIndex
                                                ? 'opacity-100 text-orange-400/80'
                                                : 'opacity-0 group-hover:opacity-60'
                                        }`}
                                    >
                                        {String(idx + 1).padStart(2, '0')}
                                    </span>
                                </button>
                            ))}
                        </div>

                        {/* Mobile timeline — semua teks tampil, nyala saat aktif */}
                        <div className="md:hidden relative pl-4 border-l border-neutral-800 space-y-4 pt-2">
                            {experiences.map((exp, idx) => {
                                const isActive = idx === activeIndex;
                                const isPast = idx < activeIndex;
                                return (
                                    <div
                                        key={`mobile-${exp.id}`}
                                        className={`relative pl-4 transition-all duration-500 ${
                                            isActive ? 'cert-timeline-item--active' : 'cert-timeline-item--dim'
                                        }`}
                                    >
                                        <div
                                            className={`absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full transition-all duration-500 ${
                                                isActive
                                                    ? 'bg-orange-400 shadow-[0_0_16px_rgba(255,140,56,0.5)]'
                                                    : isPast
                                                      ? 'bg-orange-400/40'
                                                      : 'bg-neutral-700'
                                            }`}
                                        />
                                        <h3
                                            className={`text-sm font-semibold transition-all duration-500 ${
                                                isActive ? 'text-white' : isPast ? 'text-neutral-500' : 'text-neutral-600'
                                            }`}
                                        >
                                            {exp.title}
                                        </h3>
                                        <p
                                            className={`text-[9px] tracking-[0.2em] uppercase font-mono transition-all duration-500 ${
                                                isActive ? 'text-orange-400' : 'text-neutral-700/80'
                                            }`}
                                        >
                                            {exp.role}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* ===== KOLOM KANAN – Timeline (hanya tampil di tablet+) ===== */}
                    <div className="hidden md:block md:col-span-7 pl-4 md:pl-6 lg:pl-10 relative mt-0">
                        {/* Vertical line */}
                        <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-orange-400/30 via-neutral-700/40 to-transparent" />
                        <div
                            className="absolute left-0 top-0 w-px h-full bg-gradient-to-b from-orange-400/70 to-orange-400/20 transition-all duration-700"
                            style={{ height: `${((activeIndex + 1) / totalItems) * 100}%` }}
                        />

                        <div className="space-y-10 sm:space-y-12 lg:space-y-14 mb-16">
                            {experiences.map((exp, idx) => {
                                const isActive = idx === activeIndex;
                                const isPast = idx < activeIndex;

                                return (
                                    <div
                                        key={exp.id}
                                        ref={(el) => (itemRefs.current[idx] = el)}
                                        className={`relative pl-5 sm:pl-6 lg:pl-8 cursor-default transition-all duration-500 ${
                                            isActive ? 'cert-timeline-item--active' : 'cert-timeline-item--dim'
                                        }`}
                                    >
                                        {/* Dot */}
                                        <div
                                            className={`absolute left-[-7px] sm:left-[-7px] top-1.5 w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full transition-all duration-500 ${
                                                isActive
                                                    ? 'bg-orange-400 shadow-[0_0_32px_rgba(255,140,56,0.6)] scale-110 ring-4 ring-orange-400/20'
                                                    : isPast
                                                      ? 'bg-orange-400/50 shadow-[0_0_16px_rgba(255,140,56,0.2)]'
                                                      : 'bg-neutral-700 group-hover:bg-neutral-500 group-hover:scale-125'
                                            }`}
                                        >
                                            <span
                                                className="absolute inset-0 rounded-full bg-orange-400/30 animate-ping"
                                                style={{ display: isActive ? 'block' : 'none' }}
                                            />
                                        </div>

                                        {/* Connector line */}
                                        <div
                                            className={`absolute left-[3px] sm:left-[3px] top-6 w-px transition-colors duration-700 ${
                                                isActive || isPast ? 'bg-orange-400/30' : 'bg-neutral-800'
                                            }`}
                                            style={{ height: idx === totalItems - 1 ? '0' : 'calc(100% + 8px)' }}
                                        />

                                        <div className="space-y-0.5 sm:space-y-1">
                                            <h3
                                                className={`text-sm sm:text-base lg:text-lg font-semibold transition-all duration-500 ${
                                                    isActive
                                                        ? 'text-white scale-[1.02] origin-left'
                                                        : isPast
                                                          ? 'text-neutral-500'
                                                          : 'text-neutral-600'
                                                }`}
                                            >
                                                {exp.title}
                                            </h3>
                                            <p
                                                className={`text-[9px] sm:text-[10px] lg:text-xs tracking-[0.2em] sm:tracking-[0.25em] uppercase font-mono transition-all duration-500 ${
                                                    isActive
                                                        ? 'text-orange-400'
                                                        : isPast
                                                          ? 'text-neutral-600/70'
                                                          : 'text-neutral-700/80'
                                                }`}
                                            >
                                                {exp.role}
                                            </p>
                                            <div
                                                className={`h-px rounded-full transition-all duration-700 ${
                                                    isActive
                                                        ? 'w-8 sm:w-12 bg-gradient-to-r from-orange-400 to-orange-400/20'
                                                        : 'w-0 bg-transparent'
                                                }`}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}