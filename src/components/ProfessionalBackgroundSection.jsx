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
export const rawExperiences = [
    {
        id: 0,
        title: 'Sertifikat HKI',
        role: 'Hak Atas Kekayaan Intelektual',
        description:
            'Pengakuan resmi atas karya intelektual yang telah didaftarkan, memberikan hak eksklusif untuk memanfaatkan dan melindungi inovasi, desain, atau penemuan dalam bidang teknologi dan kreatif.',
        year: '2026',
        certificate: 'https://drive.google.com/file/d/1ZHm_D_ajLQtBQiuUYI6U84aOnoYEoJ4L/view?usp=drive_link',
    },
    {
        id: 1,
        title: 'Sertifikat BNSP',
        role: 'Badan Nasional Sertifikasi Profesi',
        description:
            'Sertifikasi kompetensi profesional yang diakui secara nasional, menjadi bukti penguasaan keahlian di bidang Teknologi Informasi dengan standar industri yang telah teruji.',
        year: '2025',
        certificate: 'https://drive.google.com/file/d/1rsrf3LQ5EeqACZ4O7PvpAdpmTk8snZ5J/view?pli=1',
        image: '/img/sertif.png',
    },
    {
        id: 2,
        title: 'Sertifikat PKL',
        role: 'Badan Pusat Statistik Kota Cirebon',
        description:
            'Pengalaman praktik kerja industri di instansi pemerintahan, mengelola dan menganalisis data statistik dengan standar profesional, serta berkontribusi dalam proyek digitalisasi data kependudukan.',
        year: '2024',
        certificate: 'https://drive.google.com/file/d/1y3VN-N-0SqDUHNsEDsHt1PVmCTZDOTvk/view',
    },
    {
        id: 3,
        title: 'Sertifikat UKK',
        role: 'Uji Kompetensi Keahlian RPL',
        description:
            'Uji kompetensi keahlian Rekayasa Perangkat Lunak yang mengukur kemampuan teknis dalam pengembangan aplikasi, pemrograman, dan analisis sistem sesuai standar industri teknologi informasi.',
        year: '2024',
        certificate: 'https://drive.google.com/file/d/1XY4nEWlOES9m9tWEgYsDiRC1YbGAQbeO/view',
    },
    {
        id: 4,
        title: 'Sertifikat Karier.mu',
        role: 'Menjadi Talenta Siap Bisnis',
        description:
            'Pelatihan intensif pengembangan diri dan soft skills untuk mempersiapkan talenta muda menjadi profesional siap kerja dan berwirausaha, dengan fokus pada kepemimpinan dan komunikasi efektif.',
        year: '2024',
        certificate: 'https://drive.google.com/file/d/1hc3UhB86SjkcyUJMYuN7oXKLtHxiYmWF/view',
    },
    {
        id: 5,
        title: 'Sertifikat Karier.mu',
        role: 'Kelas Persiapan Kerja',
        description:
            'Program pembekalan karir komprehensif yang mencakup pembuatan CV profesional, teknik wawancara kerja, serta pengenalan budaya kerja di perusahaan-perusahaan terkemuka Indonesia.',
        year: '2024',
        certificate: 'https://drive.google.com/file/d/1hb91N-07A9gE-jXKM2ubNV0v_HxtaF75/view',
    },
    {
        id: 6,
        title: 'Sertifikat Partisipasi',
        role: 'Kunjungan Industri GAMELAB Indonesia',
        description:
            'Partisipasi aktif dalam kunjungan industri ke GAMELAB Indonesia, memperoleh wawasan tentang proses pengembangan game profesional dan teknologi kreatif di industri hiburan digital.',
        year: '2023',
        certificate: 'https://drive.google.com/file/d/1hdLfWs4pNjjCx3a6fEe50F0vT1R_DTYT/view',
    },
];

// ============ MAPPING GAMBAR ============
const PLACEHOLDER_IMAGE = 'https://picsum.photos/seed/cert/800/600';

const experiences = rawExperiences.map((exp) => {
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

    // ScrollTrigger pin — timeline items highlight via activeIndex
    useEffect(() => {
        const section = sectionRef.current;
        if (!section) return;

        const st = ScrollTrigger.create({
            trigger: section,
            start: 'top top',
            end: `+=${totalItems * 60}%`,
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
        if (roleRef.current) roleRef.current.textContent = `${exp.role} — ${exp.year}`;
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
            className="relative min-h-[100vh] font-sans selection:bg-orange-400/30 overflow-hidden py-4 sm:py-8"
        >
            <SectionBackdrop variant="cool" />

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-4 sm:py-6 pb-12 sm:pb-20">
                
                {/* Mobile Chip Selector */}
                <div className="flex md:hidden overflow-x-auto no-scrollbar gap-2 pb-3 mb-4 -mx-4 px-4">
                    {experiences.map((exp, idx) => (
                        <button
                            key={exp.id}
                            onClick={() => setActiveIndex(idx)}
                            className={`shrink-0 px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-300 border flex items-center gap-2 ${
                                idx === activeIndex
                                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white border-orange-400/50 shadow-md shadow-orange-500/20 font-semibold'
                                    : 'bg-neutral-900/80 text-neutral-400 border-white/10 hover:text-white'
                            }`}
                        >
                            <span className={`w-1.5 h-1.5 rounded-full ${idx === activeIndex ? 'bg-white animate-pulse' : 'bg-neutral-500'}`} />
                            {exp.title}
                        </button>
                    ))}
                </div>

                {/* Grid: 1 kolom mobile, 2 kolom tablet+ */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 lg:gap-12 items-start">
                    
                    {/* ===== KOLOM KIRI (Visual Card & Detail Card) ===== */}
                    <div className="md:col-span-5 lg:col-span-5 space-y-4 md:sticky md:top-20 self-start">
                        
                        {/* Image Card */}
                        <div className="relative overflow-hidden rounded-2xl bg-neutral-950 shadow-2xl shadow-orange-500/10 aspect-[4/3] border border-white/15 group hover:border-orange-500/30 transition-all duration-500">
                            {experiences.map((exp, idx) => (
                                <img
                                    key={exp.id}
                                    ref={(el) => (imageRefs.current[idx] = el)}
                                    src={exp.image}
                                    alt={exp.title}
                                    loading="lazy"
                                    decoding="async"
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
                            
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/20 to-transparent pointer-events-none" />
                            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-transparent to-transparent pointer-events-none" />
                            <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-orange-500/20 rounded-full blur-3xl pointer-events-none animate-pulse" />

                            {/* Badge Tahun */}
                            <div className="absolute top-3 left-3 bg-black/75 backdrop-blur-md px-3 py-1 rounded-full border border-orange-400/30 text-xs font-mono font-semibold text-orange-300 shadow-lg flex items-center gap-1.5">
                                <i className="far fa-calendar-alt text-orange-400 text-xs" />
                                {experiences[activeIndex]?.year}
                            </div>

                            {/* Badge Counter */}
                            <div className="absolute bottom-3 right-3 bg-black/75 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-xs font-mono tracking-widest text-neutral-300 shadow-lg">
                                <span className="text-orange-400 font-bold">{String(activeIndex + 1).padStart(2, '0')}</span> / {String(totalItems).padStart(2, '0')}
                            </div>
                        </div>

                        {/* Detail Card */}
                        <div
                            ref={cardRef}
                            className="bg-neutral-900/70 backdrop-blur-xl rounded-2xl p-5 sm:p-6 border border-white/10 shadow-2xl shadow-orange-500/5 transition-all duration-300 hover:border-orange-400/30 relative overflow-hidden group"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full blur-2xl pointer-events-none group-hover:bg-orange-500/10 transition-colors" />

                            <div className="space-y-1">
                                <h3
                                    ref={titleRef}
                                    className="text-lg sm:text-2xl font-extrabold text-white leading-tight tracking-tight"
                                >
                                    {experiences[activeIndex]?.title}
                                </h3>
                                <p
                                    ref={roleRef}
                                    className="text-xs sm:text-sm text-orange-400 font-semibold tracking-wide flex items-center gap-1.5"
                                >
                                    <i className="fas fa-award text-xs text-orange-400/80" />
                                    {experiences[activeIndex]?.role} — {experiences[activeIndex]?.year}
                                </p>
                            </div>

                            <div className="w-12 h-0.5 bg-gradient-to-r from-orange-400 to-amber-300/20 my-3 rounded-full" />
                            
                            <p
                                ref={descTextRef}
                                className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-light mb-4"
                            >
                                {experiences[activeIndex]?.description}
                            </p>

                            {/* Tombol Lihat Sertifikat */}
                            {experiences[activeIndex]?.certificate && (
                                <a
                                    href={experiences[activeIndex]?.certificate}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2.5 px-4.5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500/20 via-amber-500/20 to-orange-500/10 hover:from-orange-500/35 hover:to-amber-500/35 border border-orange-400/30 hover:border-orange-400/70 text-orange-300 hover:text-white font-semibold text-xs sm:text-sm transition-all duration-300 shadow-lg shadow-orange-500/10 group/btn"
                                >
                                    <span>Buka Document Sertifikat</span>
                                    <i className="fas fa-external-link-alt text-xs transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                                </a>
                            )}
                        </div>

                        {/* Dot Navigation */}
                        <div className="flex justify-center gap-2 pt-1">
                            {experiences.map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setActiveIndex(idx)}
                                    className={`group relative h-2 rounded-full transition-all duration-500 cursor-pointer focus:outline-none focus:ring-2 focus:ring-orange-400/50 ${
                                        idx === activeIndex
                                            ? 'w-8 sm:w-10 bg-gradient-to-r from-orange-400 to-amber-400 shadow-[0_0_20px_rgba(255,140,56,0.6)]'
                                            : 'w-2 bg-neutral-700 hover:bg-neutral-500 hover:scale-125'
                                    }`}
                                    aria-label={`Go to experience ${idx + 1}`}
                                >
                                    <span
                                        className={`absolute -bottom-5 left-1/2 -translate-x-1/2 text-[8px] font-mono tracking-wider transition-all duration-300 ${
                                            idx === activeIndex
                                                ? 'opacity-100 text-orange-400 font-bold'
                                                : 'opacity-0 group-hover:opacity-60 text-neutral-500'
                                        }`}
                                    >
                                        {String(idx + 1).padStart(2, '0')}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* ===== TIMELINE KANAN (Desktop Compact List) ===== */}
                    <div className="hidden md:block md:col-span-7 pl-2 md:pl-4 lg:pl-6 relative">
                        
                        {/* Header Mini Timeline */}
                        <div className="flex items-center justify-between mb-4 pb-2.5 border-b border-white/10">
                            <span className="text-xs font-mono uppercase tracking-widest text-neutral-400 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" />
                                Daftar Sertifikat ({totalItems})
                            </span>
                            <span className="text-[10px] font-mono text-neutral-500 flex items-center gap-1.5">
                                <i className="fas fa-mouse-pointer text-orange-400/70 text-[9px]" /> Klik item untuk memilih
                            </span>
                        </div>

                        {/* Timeline List Items (Rapi & Kompak) */}
                        <div className="space-y-3 relative pl-6 lg:pl-8">
                            {/* Vertical Line background */}
                            <div className="absolute left-2.5 lg:left-3 top-2 bottom-2 w-0.5 bg-neutral-800 rounded-full" />
                            
                            {/* Vertical Line progress */}
                            <div
                                className="absolute left-2.5 lg:left-3 top-2 w-0.5 bg-gradient-to-b from-orange-400 via-amber-400 to-orange-500/20 transition-all duration-500 shadow-[0_0_12px_rgba(255,140,56,0.5)] rounded-full"
                                style={{ height: `${((activeIndex + 1) / totalItems) * 92}%` }}
                            />

                            {experiences.map((exp, idx) => {
                                const isActive = idx === activeIndex;

                                return (
                                    <div
                                        key={exp.id}
                                        ref={(el) => (itemRefs.current[idx] = el)}
                                        onClick={() => setActiveIndex(idx)}
                                        className={`group relative p-3.5 sm:p-4 rounded-xl transition-all duration-300 cursor-pointer border flex items-center justify-between gap-3 ${
                                            isActive
                                                ? 'bg-gradient-to-r from-orange-500/20 via-neutral-900/90 to-neutral-900/80 border-orange-400/50 shadow-lg shadow-orange-500/10 translate-x-1.5'
                                                : 'bg-neutral-900/40 border-white/5 hover:bg-neutral-900/70 hover:border-white/15 hover:translate-x-1'
                                        }`}
                                    >
                                        {/* Dot Indicator */}
                                        <div
                                            className={`absolute left-[-20px] lg:left-[-22px] top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full transition-all duration-500 flex items-center justify-center ${
                                                isActive
                                                    ? 'bg-orange-400 shadow-[0_0_16px_rgba(255,140,56,0.9)] scale-125 ring-4 ring-orange-400/20'
                                                    : 'bg-neutral-700 group-hover:bg-orange-400/60'
                                            }`}
                                        >
                                            {isActive && <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
                                        </div>

                                        <div className="space-y-0.5 pr-2">
                                            <h3
                                                className={`text-sm sm:text-base font-bold transition-all duration-300 ${
                                                    isActive ? 'text-white' : 'text-neutral-400 group-hover:text-neutral-200'
                                                }`}
                                            >
                                                {exp.title}
                                            </h3>
                                            <p
                                                className={`text-xs font-mono transition-all duration-300 ${
                                                    isActive ? 'text-orange-400 font-medium' : 'text-neutral-500 group-hover:text-neutral-400'
                                                }`}
                                            >
                                                {exp.role}
                                            </p>
                                        </div>

                                        <span
                                            className={`shrink-0 px-2.5 py-0.5 rounded-full text-xs font-mono border transition-all duration-300 ${
                                                isActive
                                                    ? 'bg-orange-400/20 border-orange-400/40 text-orange-300 font-bold'
                                                    : 'bg-neutral-800/80 border-white/5 text-neutral-500 group-hover:text-neutral-400'
                                            }`}
                                        >
                                            {exp.year}
                                        </span>
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