import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SectionBackdrop from './SectionBackdrop';

gsap.registerPlugin(ScrollTrigger);
// ============ HELPER GOOGLE DRIVE ============
const getGoogleDriveFileId = (url) => {
    if (!url) return null;
    const match = url.match(/\/d\/(.+?)\//);
    return match ? match[1] : null;
};

const getGoogleDriveThumbnail = (url) => {
    const fileId = getGoogleDriveFileId(url);
    if (fileId) {
        const directUrl = `https://drive.google.com/uc?export=view&id=${fileId}`;
        return `https://images.weserv.nl/?url=${encodeURIComponent(directUrl)}&w=1000&h=750&fit=cover`;
    }
    return url;
};

// ============ DATA ============
export const rawExperiences = [
    {
        id: 0,
        title: 'Sertifikat HKI',
        role: 'Hak Atas Kekayaan Intelektual',
        issuer: 'Kementerian Hukum & HAM RI',
        category: 'Lisensi & HKI',
        icon: 'fa-shield-halved',
        tags: ['Hak Cipta', 'Inovasi Digital', 'SILADATA'],
        description:
            'Pengakuan resmi Hak Cipta atas inovasi software SILADATA (Sistem Layanan Dokumen Akreditasi) terdaftar di Kemenkumham RI.',
        year: '2026',
        certificate: 'https://drive.google.com/file/d/1ZHm_D_ajLQtBQiuUYI6U84aOnoYEoJ4L/view?usp=drive_link',
    },
    {
        id: 1,
        title: 'Sertifikat Oracle Academy',
        role: 'Java Fundementals',
        issuer: 'Oracle Academy',
        category: 'Java Fundementals',
        icon: 'fa-user-tie',
        tags: ['Java', 'Pemrograman Berorientasi Objek'],
        description:
            'Penguasaan dasar pemrograman Java, struktur kontrol, dan konsep OOP dasar untuk pembuatan aplikasi sederhana.',
        year: '2026',
        certificate: 'https://drive.google.com/file/d/1vo2FVZtAf9FVzOK6BSDIBksS3OfeFfXV/view?usp=sharing',
    },
    {
        id: 2,
        title: 'Sertifikat BNSP',
        role: 'Badan Nasional Sertifikasi Profesi',
        issuer: 'BNSP Republik Indonesia',
        category: 'Sertifikasi Profesi',
        icon: 'fa-award',
        tags: ['Kompetensi Nasional', 'Teknologi Informasi'],
        description:
            'Sertifikasi kompetensi profesional nasional bidang Teknologi Informasi dengan standar industri yang teruji.',
        year: '2025',
        certificate: 'https://drive.google.com/file/d/1rsrf3LQ5EeqACZ4O7PvpAdpmTk8snZ5J/view?pli=1',
        image: '/img/sertif.png',
    },
    {
        id: 3,
        title: 'Sertifikat PKL',
        role: 'Badan Pusat Statistik Kota Cirebon',
        issuer: 'BPS Kota Cirebon',
        category: 'Pengalaman Kerja',
        icon: 'fa-building-columns',
        tags: ['Pengolahan Data', 'Digitalisasi Instansi'],
        description:
            'Praktik kerja industri di instansi pemerintah, mengelola & menganalisis data statistik kependudukan.',
        year: '2024',
        certificate: 'https://drive.google.com/file/d/1y3VN-N-0SqDUHNsEDsHt1PVmCTZDOTvk/view',
    },
    {
        id: 4,
        title: 'Sertifikat UKK',
        role: 'Uji Kompetensi Keahlian RPL',
        issuer: 'Kemendikbud & Industri RPL',
        category: 'Uji Kompetensi',
        icon: 'fa-code',
        tags: ['Rekayasa Perangkat Lunak', 'Pemrograman Web'],
        description:
            'Uji kompetensi teknis Rekayasa Perangkat Lunak dalam pengembangan aplikasi web & analisis sistem.',
        year: '2024',
        certificate: 'https://drive.google.com/file/d/1XY4nEWlOES9m9tWEgYsDiRC1YbGAQbeO/view',
    },
    {
        id: 5,
        title: 'Sertifikat Karier.mu',
        role: 'Menjadi Talenta Siap Bisnis',
        issuer: 'Karier.mu Platform',
        category: 'Pelatihan Professional',
        icon: 'fa-briefcase',
        tags: ['Kesiapan Kerja', 'Soft Skills', 'Wirausaha'],
        description:
            'Pelatihan pengembangan soft skills, kepemimpinan, dan komunikasi efektif persiapan kerja & bisnis.',
        year: '2024',
        certificate: 'https://drive.google.com/file/d/1hc3UhB86SjkcyUJMYuN7oXKLtHxiYmWF/view',
    },
    {
        id: 6,
        title: 'Sertifikat Partisipasi',
        role: 'Kunjungan Industri GAMELAB',
        issuer: 'GAMELAB Indonesia',
        category: 'Kunjungan Industri',
        icon: 'fa-gamepad',
        tags: ['Game Development', 'Industri Kreatif'],
        description:
            'Wawasan pengembangan game profesional dan industri teknologi kreatif di GAMELAB Indonesia.',
        year: '2023',
        certificate: 'https://drive.google.com/file/d/1hdLfWs4pNjjCx3a6fEe50F0vT1R_DTYT/view',
    },
];

// ============ MAPPING GAMBAR ============
const PLACEHOLDER_IMAGE = '/img/cert_placeholder.png';

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
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [modalViewMode, setModalViewMode] = useState('pdf'); // 'pdf' | 'image'
    const [iframeLoading, setIframeLoading] = useState(true);

    const sectionRef = useRef(null);
    const itemRefs = useRef([]);
    const imageRefs = useRef([]);
    const titleRef = useRef(null);
    const roleRef = useRef(null);
    const descTextRef = useRef(null);
    const cardRef = useRef(null);
    const chipContainerRef = useRef(null);
    const mainStRef = useRef(null);
    const modalRef = useRef(null);

    const totalItems = experiences.length;
    const currentExp = experiences[activeIndex] || experiences[0];
    const driveFileId = getGoogleDriveFileId(currentExp.certificate);

    // Reset loading state for iframe when modal opens or view changes
    useEffect(() => {
        if (lightboxOpen) {
            setIframeLoading(true);
        }
    }, [lightboxOpen, activeIndex, modalViewMode]);

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

    // Prevent main page scrolling when modal preview is open, disable GSAP ScrollTrigger & ESC to close
    useEffect(() => {
        if (!lightboxOpen) return;

        // 1. Lock document & body overflow
        const originalBodyOverflow = document.body.style.overflow;
        const originalDocOverflow = document.documentElement.style.overflow;

        document.body.style.overflow = 'hidden';
        document.documentElement.style.overflow = 'hidden';

        // 2. Temporarily disable GSAP ScrollTriggers so background pinning/scrolling is paused
        const activeTriggers = ScrollTrigger.getAll();
        activeTriggers.forEach((st) => st.disable(false));

        const handleKeyDown = (e) => {
            if (e.key === 'Escape' || e.code === 'Escape' || e.keyCode === 27) {
                e.preventDefault();
                e.stopPropagation();
                setLightboxOpen(false);
            }
        };

        const handleMouseMove = () => {
            if (document.activeElement && document.activeElement.tagName === 'IFRAME') {
                window.focus();
                if (modalRef.current) {
                    modalRef.current.focus();
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown, true);
        document.addEventListener('keydown', handleKeyDown, true);
        window.addEventListener('keyup', handleKeyDown, true);
        window.addEventListener('mousemove', handleMouseMove, { passive: true });

        // Auto focus window and modal
        const focusTimer = setTimeout(() => {
            window.focus();
            if (modalRef.current) {
                modalRef.current.focus();
            }
        }, 50);

        // Hide navbar while lightbox modal is active
        document.body.classList.add('lightbox-modal-open');

        return () => {
            clearTimeout(focusTimer);
            document.body.style.overflow = originalBodyOverflow;
            document.documentElement.style.overflow = originalDocOverflow;
            document.body.classList.remove('lightbox-modal-open');

            window.removeEventListener('keydown', handleKeyDown, true);
            document.removeEventListener('keydown', handleKeyDown, true);
            window.removeEventListener('keyup', handleKeyDown, true);
            window.removeEventListener('mousemove', handleMouseMove);

            // Re-enable GSAP ScrollTriggers when modal closes
            activeTriggers.forEach((st) => st.enable());
        };
    }, [lightboxOpen]);

    // ScrollTrigger pin
    useEffect(() => {
        const section = sectionRef.current;
        if (!section) return;

        const isMobile = window.innerWidth < 768;

        const st = ScrollTrigger.create({
            trigger: section,
            start: isMobile ? 'top 55px' : 'top top',
            end: `+=${totalItems * (isMobile ? 35 : 55)}%`,
            pin: true,
            scrub: isMobile ? 0.05 : 0.15,
            anticipatePin: 1,
            fastScrollEnd: true,
            preventOverlaps: true,
            id: 'mainPin',
            onUpdate: (self) => {
                const progress = self.progress;
                // Memberikan buffer rentang di akhir agar sertifikat terakhir (Sertifikat Partisipasi) tetap aktif & terkunci pas sampai akhir scroll desktop
                const idx = Math.min(Math.floor(progress * (totalItems - 0.01)), totalItems - 1);
                setActiveIndex((prev) => (prev !== idx ? idx : prev));
            },
        });

        mainStRef.current = st;

        return () => {
            st.kill();
            mainStRef.current = null;
        };
    }, [totalItems]);

    // Synchronize page scroll position with selected certificate
    const handleSelectExperience = (idx) => {
        setActiveIndex(idx);

        const st = mainStRef.current || ScrollTrigger.getById('mainPin');
        if (st && totalItems > 0) {
            const progressRatio = (idx + 0.5) / totalItems;
            const targetScroll = st.start + progressRatio * (st.end - st.start);

            window.scrollTo({
                top: targetScroll,
                behavior: 'smooth',
            });
        }
    };

    // Auto scroll mobile chip & snappy text GSAP (Optimized for smooth mobile scroll)
    useEffect(() => {
        const exp = experiences[activeIndex];
        if (!exp) return;

        const isMobile = window.innerWidth < 768;

        imageRefs.current.forEach((img, idx) => {
            if (img) {
                const isSelected = idx === activeIndex;
                img.style.opacity = isSelected ? '1' : '0';
                img.style.transform = isSelected ? 'scale(1)' : 'scale(1.04)';
                img.style.pointerEvents = isSelected ? 'auto' : 'none';
            }
        });

        if (chipContainerRef.current && chipContainerRef.current.children[activeIndex]) {
            // Pada mobile, gunakan 'auto' untuk menghindari konflik smooth-scroll browser yang menyebabkan lag saat touch-scroll
            chipContainerRef.current.children[activeIndex].scrollIntoView({
                behavior: isMobile ? 'auto' : 'smooth',
                inline: 'center',
                block: 'nearest',
            });
        }

        // Jalankan GSAP text animation hanya di desktop agar scroll di HP ringan & tidak lag
        if (!isMobile) {
            const textEls = [titleRef.current, roleRef.current, descTextRef.current].filter(Boolean);
            gsap.killTweensOf(textEls);
            gsap.fromTo(
                textEls,
                { opacity: 0, y: 4 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.15,
                    ease: 'power2.out',
                    stagger: 0.02,
                }
            );
        }
    }, [activeIndex]);

    const handleOpenModal = (mode = 'pdf') => {
        setModalViewMode(mode);
        setLightboxOpen(true);
    };

    return (
        <div
            ref={sectionRef}
            id="experience"
            className="relative min-h-[100vh] font-sans selection:bg-orange-400/30 overflow-hidden pt-1 pb-4 sm:py-6 flex flex-col justify-start md:justify-center"
        >
            <SectionBackdrop variant="cool" />

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 pt-1 sm:pt-4 pb-6 sm:pb-12 w-full flex flex-col justify-start md:justify-center">
                
                {/* Section Header (Gabungan dari TitleSertif) */}
                <div className="text-center max-w-3xl mx-auto mb-2 sm:mb-6 space-y-1 sm:space-y-2.5">
                    {/* Top Badge */}
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-neutral-900/80 border border-orange-500/30 backdrop-blur-xl shadow-lg shadow-orange-500/10 hover:border-orange-500/50 transition-colors">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
                        </span>
                        <span className="text-[9px] sm:text-xs font-mono tracking-widest text-orange-300 font-semibold uppercase">
                            Sertifikasi &amp; Lisensi Resmi
                        </span>
                    </div>

                    {/* Main Heading */}
                    <h2 className="text-xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
                        Koleksi{' '}
                        <span className="bg-gradient-to-r from-amber-200 via-orange-400 to-amber-400 bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(249,115,22,0.35)]">
                            Sertifikat &amp; Pencapaian
                        </span>
                    </h2>

                    {/* Subtitle */}
                    <p className="text-[11px] sm:text-sm text-neutral-400 max-w-2xl mx-auto leading-relaxed font-normal hidden sm:block">
                        Dokumentasi sertifikasi kompetensi nasional, Hak Atas Kekayaan Intelektual (HKI), dan program pelatihan profesional.
                    </p>
                </div>

                {/* Mobile Chip Selector */}
                <div
                    ref={chipContainerRef}
                    className="flex md:hidden overflow-x-auto no-scrollbar gap-2 pb-2 mb-2.5 -mx-4 px-4 scroll-smooth shrink-0 items-center"
                >
                    {experiences.map((exp, idx) => (
                        <button
                            key={exp.id}
                            onClick={() => handleSelectExperience(idx)}
                            className={`shrink-0 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 border flex items-center gap-1.5 ${
                                idx === activeIndex
                                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white border-orange-400/60 shadow-md shadow-orange-500/30 scale-105'
                                    : 'bg-neutral-900/90 text-neutral-400 border-white/10 hover:text-white'
                            }`}
                        >
                            <i className={`fas ${exp.icon || 'fa-certificate'} text-[10px] ${idx === activeIndex ? 'text-white' : 'text-orange-400'}`} />
                            {exp.title}
                        </button>
                    ))}
                </div>

                {/* Grid: 1 kolom mobile, 12 kolom desktop */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 lg:gap-10 items-center justify-center">
                    
                    {/* ===== KOLOM KIRI (Visual Preview & Compact Detail Card) ===== */}
                    <div className="md:col-span-5 lg:col-span-5 space-y-3 md:sticky md:top-16 self-start max-h-[calc(100vh-5rem)] overflow-y-auto no-scrollbar transform-gpu">
                        
                        {/* Image Showcase Card */}
                        <div className="relative overflow-hidden rounded-xl bg-neutral-950 shadow-xl shadow-orange-500/10 border border-white/15 group hover:border-orange-500/40 transition-all duration-300 transform-gpu">
                            
                            {/* Header Bar OS Style */}
                            <div className="flex items-center justify-between px-3 py-1.5 sm:px-3.5 sm:py-2 bg-neutral-900/90 border-b border-white/10 z-20 relative">
                                <div className="flex items-center gap-1.5">
                                    <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                                    <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                                    <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider ml-1 hidden sm:inline">
                                        CERTIFICATE PREVIEW
                                    </span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-orange-500/20 text-orange-300 border border-orange-500/30 font-bold">
                                        OFFICIAL
                                    </span>
                                    <button
                                        onClick={() => handleOpenModal(driveFileId ? 'pdf' : 'image')}
                                        className="text-neutral-400 hover:text-white transition-colors p-1"
                                        title="Buka Dokumen Full Scroll"
                                    >
                                        <i className="fas fa-expand text-xs" />
                                    </button>
                                </div>
                            </div>

                            {/* Aspect Ratio Container */}
                            <div
                                className="relative aspect-[16/9.5] sm:aspect-[16/10] overflow-hidden cursor-pointer bg-neutral-900"
                                onClick={() => handleOpenModal(driveFileId ? 'pdf' : 'image')}
                            >
                                {experiences.map((exp, idx) => (
                                    <img
                                        key={exp.id}
                                        ref={(el) => (imageRefs.current[idx] = el)}
                                        src={exp.image}
                                        alt={exp.title}
                                        loading="lazy"
                                        decoding="async"
                                        onError={(e) => {
                                            if (e.target.src !== PLACEHOLDER_IMAGE && !e.target.src.endsWith(PLACEHOLDER_IMAGE)) {
                                                e.target.src = PLACEHOLDER_IMAGE;
                                            }
                                        }}
                                        className="absolute inset-0 w-full h-full object-cover will-change-transform transform-gpu group-hover:scale-105 transition-transform duration-300"
                                        style={{
                                            opacity: idx === activeIndex ? 1 : 0,
                                            transform: idx === activeIndex ? 'scale(1)' : 'scale(1.04)',
                                            transition:
                                                'opacity 0.25s cubic-bezier(0.16, 1, 0.3, 1), transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
                                        }}
                                    />
                                ))}

                                {/* Overlay gradient */}
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-black/20 pointer-events-none" />

                                {/* Hover Lens Overlay Hint */}
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-250 flex flex-col items-center justify-center gap-1.5 pointer-events-none">
                                    <div className="w-10 h-10 rounded-full bg-orange-500 text-white flex items-center justify-center shadow-lg backdrop-blur-md">
                                        <i className="fas fa-file-pdf text-base" />
                                    </div>
                                    <span className="text-[11px] font-mono text-white font-medium px-3 py-1 rounded-full bg-black/70 border border-white/20 backdrop-blur-md">
                                        Klik untuk Buka Full Document Scroll
                                    </span>
                                </div>

                                {/* Badge Tahun */}
                                <div className="absolute top-2 left-2 sm:top-2.5 sm:left-2.5 bg-black/85 backdrop-blur-md px-2 py-0.5 sm:px-2.5 rounded-full border border-orange-400/40 text-[10px] sm:text-[11px] font-mono font-bold text-orange-300 shadow-lg flex items-center gap-1">
                                    <i className="far fa-calendar-alt text-orange-400 text-[10px]" />
                                    {currentExp.year}
                                </div>

                                {/* Badge Counter */}
                                <div className="absolute bottom-2 right-2 sm:bottom-2.5 sm:right-2.5 bg-black/85 backdrop-blur-md px-2 py-0.5 sm:px-2.5 rounded-full border border-white/15 text-[10px] sm:text-[11px] font-mono tracking-widest text-neutral-300 shadow-lg">
                                    <span className="text-orange-400 font-bold">{String(activeIndex + 1).padStart(2, '0')}</span> / {String(totalItems).padStart(2, '0')}
                                </div>
                            </div>
                        </div>

                        {/* Detail Card (Kompak & Rapi agar tidak kepotong di HP) */}
                        <div
                            ref={cardRef}
                            className="bg-neutral-950/95 md:bg-neutral-900/85 backdrop-blur-md md:backdrop-blur-xl rounded-xl p-3.5 sm:p-5 border border-white/15 shadow-xl transition-all duration-300 hover:border-orange-400/40 relative overflow-hidden group transform-gpu"
                        >
                            <div className="flex items-center justify-between gap-2 mb-1.5 sm:mb-2">
                                <span className="inline-flex items-center gap-1.5 px-2 sm:px-2.5 py-0.5 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-300 text-[10px] sm:text-[11px] font-mono font-medium">
                                    <i className={`fas ${currentExp.icon || 'fa-certificate'} text-[10px]`} />
                                    {currentExp.category || 'Sertifikat'}
                                </span>
                                {currentExp.issuer && (
                                    <span className="text-[10px] font-mono text-neutral-400 truncate max-w-[160px] sm:max-w-[180px]">
                                        {currentExp.issuer}
                                    </span>
                                )}
                            </div>

                            {/* Title & Role */}
                            <div className="space-y-0.5">
                                <h3
                                    ref={titleRef}
                                    className="text-base sm:text-xl font-extrabold text-white leading-snug tracking-tight font-sans"
                                >
                                    {currentExp.title}
                                </h3>
                                <p
                                    ref={roleRef}
                                    className="text-xs text-orange-400 font-semibold tracking-wide flex items-center gap-1.5"
                                >
                                    <i className="fas fa-award text-[11px] text-orange-400/90" />
                                    {currentExp.role} — {currentExp.year}
                                </p>
                            </div>

                            {/* Skill Tags */}
                            {currentExp.tags && currentExp.tags.length > 0 && (
                                <div className="flex flex-wrap gap-1 my-2 sm:my-2.5">
                                    {currentExp.tags.map((tag, tIdx) => (
                                        <span
                                            key={tIdx}
                                            className="text-[9px] sm:text-[10px] font-mono px-1.5 sm:px-2 py-0.5 rounded bg-neutral-800/90 border border-white/10 text-neutral-300"
                                        >
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            )}

                            <div className="w-full h-px bg-gradient-to-r from-orange-500/40 via-amber-500/20 to-transparent my-2 sm:my-2.5" />
                            
                            {/* Ringkas & Tidak Panjang Panjang */}
                            <p
                                ref={descTextRef}
                                className="text-[11px] sm:text-xs text-neutral-300 leading-relaxed font-normal mb-3 sm:mb-4 line-clamp-3 sm:line-clamp-none"
                            >
                                {currentExp.description}
                            </p>

                            {/* Tombol Action */}
                            <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
                                <button
                                    onClick={() => handleOpenModal(driveFileId ? 'pdf' : 'image')}
                                    className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-400 hover:to-amber-400 text-white font-bold text-[11px] sm:text-xs transition-all duration-200 shadow-md shadow-orange-500/25 hover:shadow-orange-500/40 transform hover:-translate-y-0.5 active:scale-95"
                                >
                                    <i className="fas fa-file-pdf text-xs" />
                                    <span>Buka Preview Full Document</span>
                                </button>

                                {currentExp.certificate && (
                                    <a
                                        href={currentExp.certificate}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white border border-white/10 text-[11px] sm:text-xs transition-all"
                                        title="Buka Drive Tab Baru"
                                    >
                                        <span>Tab Baru</span>
                                        <i className="fas fa-external-link-alt text-[10px]" />
                                    </a>
                                )}
                            </div>
                        </div>

                        {/* Dot Navigation */}
                        <div className="flex justify-center gap-1.5 pt-0.5">
                            {experiences.map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => handleSelectExperience(idx)}
                                    className={`group relative h-1.5 sm:h-2 rounded-full transition-all duration-300 cursor-pointer focus:outline-none ${
                                        idx === activeIndex
                                            ? 'w-6 sm:w-8 bg-gradient-to-r from-orange-400 to-amber-400 shadow-[0_0_12px_rgba(255,140,56,0.6)]'
                                            : 'w-1.5 sm:w-2 bg-neutral-700 hover:bg-neutral-500'
                                    }`}
                                    aria-label={`Go to experience ${idx + 1}`}
                                />
                            ))}
                        </div>
                    </div>

                    {/* ===== TIMELINE KANAN (Desktop Compact Interactive List) ===== */}
                    <div className="hidden md:block md:col-span-7 pl-2 lg:pl-4 relative">
                        
                        {/* Header Mini Timeline */}
                        <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-white/10">
                            <span className="text-xs font-mono uppercase tracking-widest text-neutral-400 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" />
                                Daftar Sertifikat ({totalItems})
                            </span>
                            <span className="text-[10px] font-mono text-neutral-400 flex items-center gap-1.5">
                                <i className="fas fa-hand-pointer text-orange-400/80 text-[10px]" /> Klik item untuk memilih
                            </span>
                        </div>

                        {/* Timeline List Items */}
                        <div className="space-y-2.5 relative pl-7 lg:pl-8">
                            {/* Vertical Line background */}
                            <div className="absolute left-2.5 lg:left-3 top-2 bottom-2 w-0.5 bg-neutral-800/80 rounded-full" />
                            
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
                                        onClick={() => handleSelectExperience(idx)}
                                        className={`group relative p-3 sm:p-3.5 rounded-xl transition-all duration-300 cursor-pointer border flex items-center justify-between gap-3 ${
                                            isActive
                                                ? 'bg-gradient-to-r from-orange-500/20 via-neutral-900/90 to-neutral-900/80 border-orange-400/50 shadow-lg shadow-orange-500/10 translate-x-1.5'
                                                : 'bg-neutral-900/40 border-white/5 hover:bg-neutral-900/70 hover:border-white/15 hover:translate-x-1'
                                        }`}
                                    >
                                        {/* Dot Indicator */}
                                        <div
                                            className={`absolute left-[-22px] lg:left-[-23px] top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full transition-all duration-300 flex items-center justify-center ${
                                                isActive
                                                    ? 'bg-orange-400 shadow-[0_0_14px_rgba(255,140,56,0.9)] scale-125 ring-4 ring-orange-400/20'
                                                    : 'bg-neutral-700 group-hover:bg-orange-400/60'
                                            }`}
                                        >
                                            {isActive && <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
                                        </div>

                                        <div className="space-y-0.5 pr-2 min-w-0">
                                            <h3
                                                className={`text-sm sm:text-base font-bold transition-all duration-300 truncate ${
                                                    isActive ? 'text-white' : 'text-neutral-300 group-hover:text-white'
                                                }`}
                                            >
                                                {exp.title}
                                            </h3>
                                            <p
                                                className={`text-xs font-mono transition-all duration-300 truncate ${
                                                    isActive ? 'text-orange-300 font-medium' : 'text-neutral-400 group-hover:text-neutral-300'
                                                }`}
                                            >
                                                {exp.role}
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-2 shrink-0">
                                            <span
                                                className={`px-2.5 py-0.5 rounded-full text-[11px] font-mono border transition-all duration-300 ${
                                                    isActive
                                                        ? 'bg-orange-400/20 border-orange-400/40 text-orange-300 font-bold'
                                                        : 'bg-neutral-800/80 border-white/5 text-neutral-400 group-hover:text-neutral-300'
                                                }`}
                                            >
                                                {exp.year}
                                            </span>
                                            <i
                                                className={`fas fa-chevron-right text-xs transition-transform duration-300 ${
                                                    isActive ? 'text-orange-400 translate-x-0.5' : 'text-neutral-600 group-hover:text-neutral-400'
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

            {/* FULL DOCUMENT MODAL LIGHTBOX (PDF EMBED / IMAGE SCROLL) */}
            {lightboxOpen && (
                <>
                    <style>{`
                        body.lightbox-modal-open .navbar-shell {
                            opacity: 0 !important;
                            pointer-events: none !important;
                            transform: translateY(-120%) !important;
                            transition: opacity 0.3s ease, transform 0.3s ease !important;
                        }
                    `}</style>
                    <div
                        ref={modalRef}
                        tabIndex={-1}
                        className="fixed inset-0 z-[99999] bg-black/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-6 animate-fadeIn outline-none"
                        onPointerDown={(e) => {
                            if (e.target === modalRef.current) {
                                setLightboxOpen(false);
                            }
                        }}
                        onMouseDown={(e) => {
                            if (e.target === modalRef.current) {
                                setLightboxOpen(false);
                            }
                        }}
                        onClick={(e) => {
                            if (e.target === modalRef.current) {
                                setLightboxOpen(false);
                            }
                        }}
                    >
                        <div
                            className="modal-scrollable relative max-w-5xl w-full h-[90vh] bg-neutral-950 border border-white/20 rounded-2xl flex flex-col overflow-hidden shadow-2xl z-[100000]"
                            onPointerDown={(e) => e.stopPropagation()}
                            onMouseDown={(e) => e.stopPropagation()}
                            onClick={(e) => e.stopPropagation()}
                            onMouseEnter={() => {
                                if (document.activeElement && document.activeElement.tagName === 'IFRAME') {
                                    window.focus();
                                    modalRef.current?.focus();
                                }
                            }}
                            onMouseMove={() => {
                                if (document.activeElement && document.activeElement.tagName === 'IFRAME') {
                                    window.focus();
                                    modalRef.current?.focus();
                                }
                            }}
                        >
                        {/* Modal Header */}
                        <div className="flex items-center justify-between px-4 py-3 bg-neutral-900 border-b border-white/10 shrink-0 relative z-50">
                            <div className="flex items-center gap-2.5 min-w-0 pr-2">
                                <button
                                    type="button"
                                    onPointerDown={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        setLightboxOpen(false);
                                    }}
                                    onMouseDown={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        setLightboxOpen(false);
                                    }}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        setLightboxOpen(false);
                                    }}
                                    className="w-4 h-4 rounded-full bg-red-500 hover:bg-red-600 transition-all flex items-center justify-center group cursor-pointer border-0 p-0 shrink-0 relative z-50"
                                    title="Tutup pratinjau (ESC)"
                                >
                                    <i className="fas fa-times text-[9px] text-white opacity-80 group-hover:opacity-100 transition-opacity pointer-events-none" />
                                </button>
                                <span className="w-3.5 h-3.5 rounded-full bg-yellow-500/90" />
                                <span className="w-3.5 h-3.5 rounded-full bg-green-500/90" />
                                <span className="text-xs font-mono font-bold text-white ml-1.5 truncate">
                                    {currentExp.title} — {currentExp.role} ({currentExp.year})
                                </span>
                            </div>

                            <div className="flex items-center gap-2 shrink-0 relative z-50">
                                {/* Mode Selector Switcher */}
                                {driveFileId && (
                                    <div className="flex bg-neutral-800 p-1 rounded-lg border border-white/10 text-xs font-mono">
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setModalViewMode('pdf');
                                            }}
                                            className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1.5 cursor-pointer ${
                                                modalViewMode === 'pdf'
                                                    ? 'bg-orange-500 text-white font-bold shadow'
                                                    : 'text-neutral-400 hover:text-white'
                                            }`}
                                        >
                                            <i className="fas fa-file-pdf text-xs" />
                                            <span>PDF Scroll</span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setModalViewMode('image');
                                            }}
                                            className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1.5 cursor-pointer ${
                                                modalViewMode === 'image'
                                                    ? 'bg-orange-500 text-white font-bold shadow'
                                                    : 'text-neutral-400 hover:text-white'
                                            }`}
                                        >
                                            <i className="fas fa-image text-xs" />
                                            <span>Foto</span>
                                        </button>
                                    </div>
                                )}

                                {currentExp.certificate && (
                                    <a
                                        href={currentExp.certificate}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={(e) => e.stopPropagation()}
                                        className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-500/20 text-orange-300 border border-orange-500/40 text-xs font-mono hover:bg-orange-500/30 transition-colors"
                                    >
                                        <span>Drive Tab Baru</span>
                                        <i className="fas fa-external-link-alt text-[10px]" />
                                    </a>
                                )}

                                <button
                                    type="button"
                                    onPointerDown={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        setLightboxOpen(false);
                                    }}
                                    onMouseDown={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        setLightboxOpen(false);
                                    }}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        setLightboxOpen(false);
                                    }}
                                    className="w-8 h-8 rounded-lg bg-neutral-800 hover:bg-red-500/80 hover:text-white text-neutral-300 flex items-center justify-center border border-white/10 transition-all cursor-pointer ml-1 active:scale-95 z-50 pointer-events-auto"
                                    aria-label="Tutup pratinjau"
                                    title="Tutup pratinjau (ESC)"
                                >
                                    <i className="fas fa-times text-xs pointer-events-none" />
                                </button>
                            </div>
                        </div>

                        {/* Modal Body Container */}
                        <div className="flex-1 bg-black/90 relative overflow-hidden flex items-center justify-center">
                            {modalViewMode === 'pdf' && driveFileId && iframeLoading && (
                                <div className="absolute inset-0 z-10 bg-neutral-950/90 backdrop-blur-sm flex flex-col items-center justify-center gap-3 p-4 pointer-events-auto">
                                    <div className="w-10 h-10 border-3 border-orange-500/30 border-t-orange-500 rounded-full animate-spin" />
                                    <div className="text-center space-y-1">
                                        <p className="text-xs font-mono font-semibold text-white">Memuat Dokumen Google Drive...</p>
                                        <p className="text-[11px] text-neutral-400">Silakan tunggu sebentar atau tampilkan foto instan</p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setModalViewMode('image');
                                        }}
                                        className="mt-1 px-3.5 py-1.5 rounded-lg bg-orange-500/20 hover:bg-orange-500/30 text-orange-300 border border-orange-500/40 text-xs font-mono transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
                                    >
                                        <i className="fas fa-image text-xs" />
                                        <span>Tampilkan Foto Instan</span>
                                    </button>
                                </div>
                            )}

                            {modalViewMode === 'pdf' && driveFileId ? (
                                <iframe
                                    src={`https://drive.google.com/file/d/${driveFileId}/preview`}
                                    className="w-full h-full rounded-b-xl border-0 relative z-0"
                                    title={currentExp.title}
                                    allow="autoplay"
                                    onLoad={() => setIframeLoading(false)}
                                />
                            ) : (
                                <div className="w-full h-full overflow-y-auto flex items-center justify-center p-4">
                                    <img
                                        src={currentExp.image}
                                        alt={currentExp.title}
                                        onError={(e) => {
                                            if (e.target.src !== PLACEHOLDER_IMAGE && !e.target.src.endsWith(PLACEHOLDER_IMAGE)) {
                                                e.target.src = PLACEHOLDER_IMAGE;
                                            }
                                        }}
                                        className="max-w-full h-auto max-h-none rounded-lg shadow-2xl object-contain"
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </>
        )}
    </div>
);
}