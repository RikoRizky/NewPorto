import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SectionBackdrop from './SectionBackdrop';

// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

// import required modules
import { EffectCoverflow, Pagination, Navigation } from 'swiper/modules';

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
        return `https://images.weserv.nl/?url=${encodeURIComponent(directUrl)}&w=800&h=600&fit=cover`;
    }
    return url;
};

// ============ DATA ============
export const rawExperiences = [
    // ── Tier 1: Lisensi & Sertifikasi Resmi Pemerintah ──
    {
        id: 0,
        title: 'Sertifikat HKI',
        role: 'Hak Atas Kekayaan Intelektual',
        issuer: 'Kementerian Hukum & HAM RI',
        category: 'Lisensi & HKI',
        icon: 'fa-shield-halved',
        tags: ['Hak Cipta', 'Inovasi Digital', 'SILADATA'],
        description: 'Pengakuan resmi Hak Cipta atas inovasi software SILADATA (Sistem Layanan Dokumen Akreditasi) terdaftar di Kemenkumham RI.',
        year: '2026',
        certificate: 'https://drive.google.com/file/d/1ZHm_D_ajLQtBQiuUYI6U84aOnoYEoJ4L/view?usp=drive_link',
    },
    {
        id: 2,
        title: 'Sertifikat BNSP',
        role: 'Badan Nasional Sertifikasi Profesi',
        issuer: 'BNSP Republik Indonesia',
        category: 'Sertifikasi Profesi',
        icon: 'fa-award',
        tags: ['Kompetensi Nasional', 'Teknologi Informasi'],
        description: 'Sertifikasi kompetensi profesional nasional bidang Teknologi Informasi dengan standar industri yang teruji.',
        year: '2025',
        certificate: 'https://drive.google.com/file/d/1rsrf3LQ5EeqACZ4O7PvpAdpmTk8snZ5J/view?pli=1',
        image: '/img/sertif.webp',
    },
    {
        id: 4,
        title: 'Sertifikat UKK',
        role: 'Uji Kompetensi Keahlian RPL',
        issuer: 'Kemendikbud & Industri RPL',
        category: 'Uji Kompetensi',
        icon: 'fa-code',
        tags: ['Rekayasa Perangkat Lunak', 'Pemrograman Web'],
        description: 'Uji kompetensi teknis Rekayasa Perangkat Lunak dalam pengembangan aplikasi web & analisis sistem.',
        year: '2024',
        certificate: 'https://drive.google.com/file/d/1XY4nEWlOES9m9tWEgYsDiRC1YbGAQbeO/view',
    },
    {
        id: 3,
        title: 'Sertifikat PKL',
        role: 'Badan Pusat Statistik Kota Cirebon',
        issuer: 'BPS Kota Cirebon',
        category: 'Pengalaman Kerja',
        icon: 'fa-building-columns',
        tags: ['Pengolahan Data', 'Digitalisasi Instansi'],
        description: 'Praktik kerja lapangan di instansi pemerintah, mengelola & menganalisis data statistik kependudukan.',
        year: '2024',
        certificate: 'https://drive.google.com/file/d/1y3VN-N-0SqDUHNsEDsHt1PVmCTZDOTvk/view',
    },
    // ── Tier 2: Sertifikasi Teknologi Profesional ──
    {
        id: 'cert-new-4',
        title: 'Sertifikat Oracle Academy',
        role: 'For Satisfactory Completion of All Coursework',
        issuer: 'Oracle Academy',
        category: 'Sertifikasi',
        icon: 'fa-award',
        tags: ['Java', 'Pemrograman Berorientasi Objek'],
        description: 'Sertifikat kelulusan dan penyelesaian program For Satisfactory Completion of All Coursework.',
        year: '2026',
        certificate: 'https://drive.google.com/file/d/1xG4ZQwUDS6XOqpd0TXyYaTtqQLetmdVo/view?usp=sharing',
    },
    {
        id: 1,
        title: 'Sertifikat Oracle Academy',
        role: 'Java Fundementals',
        issuer: 'Oracle Academy',
        category: 'Java Fundementals',
        icon: 'fa-user-tie',
        tags: ['Java', 'Pemrograman Berorientasi Objek'],
        description: 'Penguasaan dasar pemrograman Java, struktur kontrol, dan konsep OOP dasar untuk pembuatan aplikasi sederhana.',
        year: '2026',
        certificate: 'https://drive.google.com/file/d/12aGyNGVBcDi-tmMzTKTOAckF4JDRNhFZ/view?usp=sharing',
    },
    // ── Tier 3: Pelatihan & Kursus Online ──
    {
        id: 'cert-js',
        title: 'Sertifikat Dicoding',
        role: 'Belajar Dasar Pemrograman JavaScript',
        issuer: 'Dicoding',
        category: 'Belajar Dasar Pemrograman JavaScript',
        icon: 'fa-js',
        tags: ['JavaScript', 'Pemrograman Web', 'Dasar Coding'],
        description: 'Sertifikat kelulusan Sertifikat Kompetensi Kelulusan kelas Belajar Dasar Pemrograman JavaScript dari Dicoding Academy.',
        year: '2026',
        certificate: 'https://drive.google.com/file/d/1hg0A45EwjA7j1GAH9M84KCQJyhRZAqPe/view?usp=sharing',
    },
    {
        id: 'cert-new-2',
        title: 'Sertifikat Dicoding',
        role: 'Belajar Dasar Pemrograman Web',
        issuer: 'Dicoding',
        category: 'Belajar Dasar Pemrograman Web',
        icon: 'fa-certificate',
        tags: ['HTML', 'CSS', 'JavaScript'],
        description: 'Sertifikat penyelesaian pelatihan Belajar Dasar Pemrograman Web.',
        year: '2026',
        certificate: 'https://drive.google.com/file/d/1ppwkXqvlRJ67rl_vPV0lh1tSZpUzZ-GO/view?usp=sharing',
    },
    {
        id: 'cert-new-1',
        title: 'Sertifikat Dicoding',
        role: 'Introduction to Financial Literacy',
        issuer: 'Dicoding',
        category: 'Introduction to Financial Literacy',
        icon: 'fa-certificate',
        tags: ['Literasi Keuangan', 'Finansial'],
        description: 'Sertifikat penyelesaian pelatihan Introduction to Financial Literacy.',
        year: '2026',
        certificate: 'https://drive.google.com/file/d/1I5pkz1SOur4efirMGvld2OLaWMSf_e1n/view?usp=share_link',
    },
    {
        id: 'cert-selfdev',
        title: 'Sertifikat Dicoding',
        role: 'Belajar Strategi Pengembangan Diri',
        issuer: 'Dicoding',
        category: 'Belajar Strategi Pengembangan Diri',
        icon: 'fa-brain',
        tags: ['Pengembangan Diri', 'Soft Skills', 'Growth Mindset'],
        description: 'Sertifikat kelulusan Sertifikat Kompetensi Kelulusan kelas Belajar Strategi Pengembangan Diri dari Dicoding Academy.',
        year: '2026',
        certificate: 'https://drive.google.com/file/d/1Wxg8xqGn8P2izfZuyzia96MF80ZtX0J3/view?usp=sharing',
    },
    // ── Tier 4: Pelatihan Soft Skills & Pengembangan Karier ──
    {
        id: 5,
        title: 'Sertifikat Karier.mu',
        role: 'Menjadi Talenta Siap Bisnis',
        issuer: 'Karier.mu Platform',
        category: 'Pelatihan Professional',
        icon: 'fa-briefcase',
        tags: ['Kesiapan Kerja', 'Soft Skills', 'Wirausaha'],
        description: 'Pelatihan pengembangan soft skills, kepemimpinan, dan komunikasi efektif persiapan kerja & bisnis.',
        year: '2024',
        certificate: 'https://drive.google.com/file/d/1hc3UhB86SjkcyUJMYuN7oXKLtHxiYmWF/view',
    },
    {
        id: 'cert-new-5',
        title: 'Sertifikat Sekolah.mu',
        role: 'Kelas Persiapan Kerja',
        issuer: 'Sekolah.mu / Karier.mu',
        category: 'Kelas Persiapan Kerja',
        icon: 'fa-briefcase',
        tags: ['Teknik Presentasi', 'Komunikasi Efektif', 'Kesiapan Kerja'],
        description: 'Sertifikat penyelesaian program pelatihan Kelas Persiapan Kerja.',
        year: '2024',
        certificate: 'https://drive.google.com/file/d/1WzoQ1v3kiRnrtr1sMtMU70NYpPksqGy2/view?usp=sharing',
    },
    // ── Tier 5: Partisipasi & Kunjungan ──
    {
        id: 6,
        title: 'Sertifikat Partisipasi',
        role: 'Kunjungan Industri GAMELAB',
        issuer: 'GAMELAB Indonesia',
        category: 'Kunjungan Industri',
        icon: 'fa-gamepad',
        tags: ['Game Development', 'Industri Kreatif'],
        description: 'Wawasan pengembangan game profesional dan industri teknologi kreatif di GAMELAB Indonesia.',
        year: '2023',
        certificate: 'https://drive.google.com/file/d/1hdLfWs4pNjjCx3a6fEe50F0vT1R_DTYT/view',
    },
];

// ============ MAPPING GAMBAR ============
const PLACEHOLDER_IMAGE = '/img/cert_placeholder.webp';

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
    const [selectedExperience, setSelectedExperience] = useState(experiences[0]);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [modalViewMode, setModalViewMode] = useState('pdf'); // 'pdf' | 'image'
    const [iframeLoading, setIframeLoading] = useState(true);

    const headerRef = useRef(null);
    const modalRef = useRef(null);
    const sliderContainerRef = useRef(null);

    const currentExp = selectedExperience || experiences[0];
    const driveFileId = getGoogleDriveFileId(currentExp.certificate);

    // Reset loading state for iframe when modal opens or view changes
    useEffect(() => {
        if (lightboxOpen) {
            setIframeLoading(true);
        }
    }, [lightboxOpen, selectedExperience, modalViewMode]);

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

    // Header GSAP Reveal Animation & Refresh Trigger
    useEffect(() => {
        const headerEl = headerRef.current;
        const sliderEl = sliderContainerRef.current;
        if (!headerEl || !sliderEl) return;

        // Mencegah bug GSAP salah kalkulasi offset yang menyebabkan section melompat (ilang)
        const refreshGSAP = () => ScrollTrigger.refresh();
        window.addEventListener('resize', refreshGSAP);
        const timer1 = setTimeout(refreshGSAP, 500);
        const timer2 = setTimeout(refreshGSAP, 1500);

        const ctx = gsap.context(() => {
            const targets = headerEl.querySelectorAll('.sertif-header-reveal');
            if (targets.length) {
                gsap.fromTo(
                    targets,
                    { opacity: 0, y: 24, scale: 0.96 },
                    {
                        opacity: 1,
                        y: 0,
                        scale: 1,
                        duration: 0.8,
                        stagger: 0.12,
                        ease: 'power3.out',
                        scrollTrigger: {
                            trigger: headerEl,
                            start: 'top 90%',
                            toggleActions: 'play none none reverse',
                        },
                    }
                );
            }

            gsap.fromTo(
                sliderEl,
                { opacity: 0, y: 40 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 1,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: sliderEl,
                        start: 'top 85%',
                        toggleActions: 'play none none reverse',
                    },
                }
            );
        });

        return () => {
            window.removeEventListener('resize', refreshGSAP);
            clearTimeout(timer1);
            clearTimeout(timer2);
            ctx.revert();
        };
    }, []);

    // Prevent main page scrolling when modal preview is open & ESC to close
    useEffect(() => {
        if (!lightboxOpen) return;

        // Lock document & body overflow
        const originalBodyOverflow = document.body.style.overflow;
        const originalDocOverflow = document.documentElement.style.overflow;

        document.body.style.overflow = 'hidden';
        document.documentElement.style.overflow = 'hidden';

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
        };
    }, [lightboxOpen]);

    const handleOpenModal = (exp, mode = 'pdf') => {
        setSelectedExperience(exp);
        setModalViewMode(mode);
        setLightboxOpen(true);
    };

    return (
        <div
            id="experience"
            className="relative md:min-h-screen font-sans selection:bg-orange-400/30 pt-8 sm:pt-1 pb-8 sm:pb-16 sm:py-20 flex flex-col justify-start overflow-hidden"
        >
            <SectionBackdrop variant="cool" />

            <style>{`
                .swiper {
                    padding-bottom: 2.5rem !important;
                    padding-top: 2rem !important;
                    overflow: visible !important; /* Mencegah card terpotong efek coverflow */
                }
                @media (min-width: 640px) {
                    .swiper {
                        padding-bottom: 5rem !important;
                    }
                }
                /* Memastikan swiper tidak membuat horizontal scrollbar di layar */
                @media (max-width: 100vw) {
                    #experience {
                        overflow-x: clip;
                    }
                }
                .swiper-wrapper {
                    align-items: stretch;
                }
                .swiper-slide {
                    width: 340px;
                    height: auto; 
                }
                .cert-card {
                    min-height: 460px; /* Memastikan card cukup tinggi untuk memuat tombol di bawah */
                }
                @media (min-width: 640px) {
                    .swiper-slide {
                        width: 380px;
                    }
                    .cert-card {
                        min-height: 480px;
                    }
                }
                .swiper-slide-active .cert-card {
                    border-color: rgba(249, 115, 22, 0.6);
                    box-shadow: 0 10px 30px -10px rgba(249, 115, 22, 0.3);
                }
                .swiper-pagination-bullet {
                    background: rgba(255, 255, 255, 0.3);
                    opacity: 1;
                }
                .swiper-pagination-bullet-active {
                    background: #f97316;
                    box-shadow: 0 0 10px rgba(249, 115, 22, 0.8);
                }
                .swiper-button-next, .swiper-button-prev {
                    color: rgba(255,255,255,0.7) !important;
                    background: rgba(0,0,0,0.5);
                    width: 44px;
                    height: 44px;
                    border-radius: 50%;
                    backdrop-filter: blur(8px);
                    border: 1px solid rgba(255,255,255,0.1);
                    transition: all 0.3s;
                }
                .swiper-button-next:after, .swiper-button-prev:after {
                    font-size: 18px !important;
                    font-weight: bold;
                }
                .swiper-button-next:hover, .swiper-button-prev:hover {
                    color: #fff !important;
                    background: rgba(249, 115, 22, 0.8);
                    border-color: rgba(249, 115, 22, 0.9);
                    transform: scale(1.1);
                }
            `}</style>

            <div className="relative z-10 w-full flex flex-col justify-start md:justify-center">

                {/* Section Header */}
                <div ref={headerRef} className="relative text-center max-w-3xl mx-auto mb-8 sm:mb-12 space-y-3 sm:space-y-4 selection:bg-orange-500/30 px-4 sm:px-6">
                    {/* Ambient Glow behind Header */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] sm:w-[520px] h-[120px] sm:h-[180px] bg-gradient-to-r from-orange-600/25 via-amber-500/20 to-orange-500/15 blur-[95px] rounded-full pointer-events-none -z-10" />

                    {/* Top Badge */}
                    {/* <div className="sertif-header-reveal inline-flex items-center gap-2 px-3 py-1 sm:px-4 sm:py-1.5 rounded-full bg-neutral-900/90 border border-orange-500/35 backdrop-blur-xl shadow-lg shadow-orange-500/15 hover:border-orange-500/60 hover:shadow-orange-500/30 transition-all duration-300 transform hover:scale-105 group cursor-default">
                        <span className="relative flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-gradient-to-tr from-orange-600 to-amber-400"></span>
                        </span>
                        <span className="text-[10px] sm:text-xs font-mono tracking-widest text-orange-300 font-bold uppercase group-hover:text-amber-200 transition-colors">
                            Sertifikasi &amp; Lisensi Resmi
                        </span>
                    </div> */}

                    {/* Main Heading */}
                    <h2 className="sertif-header-reveal text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
                        Koleksi{' '}
                        <span className="bg-gradient-to-r from-amber-200 via-orange-400 to-amber-300 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(249,115,22,0.4)] animate-gradient-text">
                            Sertifikat
                        </span>
                    </h2>

                    {/* Subtitle */}
                    <p className="sertif-header-reveal text-[13px] sm:text-sm text-neutral-300/90 max-w-2xl mx-auto leading-relaxed font-normal">
                        Geser (swipe) untuk menelusuri pencapaian dan sertifikasi. Klik untuk melihat dokumen penuh.
                    </p>
                </div>

                {/* 3D Carousel Swiper */}
                <div ref={sliderContainerRef} className="w-full px-0 sm:px-4 lg:px-8 pb-4 sm:pb-12">
                    <Swiper
                        effect={'coverflow'}
                        grabCursor={true}
                        centeredSlides={true}
                        slidesPerView={'auto'}
                        initialSlide={0}
                        loop={true}
                        coverflowEffect={{
                            rotate: 20,
                            stretch: 0,
                            depth: 250,
                            modifier: 1,
                            slideShadows: false,
                        }}
                        pagination={{
                            clickable: true,
                            dynamicBullets: true,
                        }}
                        navigation={true}
                        modules={[EffectCoverflow, Pagination, Navigation]}
                        className="w-full max-w-7xl mx-auto"
                    >
                        {experiences.map((exp, idx) => {
                            const fileId = getGoogleDriveFileId(exp.certificate);

                            return (
                                <SwiperSlide key={exp.id} className="flex h-auto">
                                    <div className="cert-card bg-neutral-950/90 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden transition-all duration-300 flex flex-col w-full h-full">

                                        {/* Thumbnail Container */}
                                        <div
                                            className="relative aspect-[16/10] overflow-hidden cursor-pointer bg-neutral-900 border-b border-white/10 group"
                                            onClick={() => handleOpenModal(exp, fileId ? 'pdf' : 'image')}
                                        >
                                            <img
                                                src={exp.image}
                                                alt={exp.title}
                                                loading="lazy"
                                                decoding="async"
                                                onError={(e) => {
                                                    if (e.target.src !== PLACEHOLDER_IMAGE && !e.target.src.endsWith(PLACEHOLDER_IMAGE)) {
                                                        e.target.src = PLACEHOLDER_IMAGE;
                                                    }
                                                }}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                            />

                                            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/90 via-neutral-950/20 to-transparent opacity-80" />

                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
                                                <div className="w-12 h-12 rounded-full bg-orange-500/90 text-white flex items-center justify-center shadow-lg backdrop-blur-md transform scale-75 group-hover:scale-100 transition-transform duration-300">
                                                    <i className={`fas ${fileId ? 'fa-file-pdf' : 'fa-expand'} text-lg`} />
                                                </div>
                                            </div>

                                            {/* Badge Tahun */}
                                            <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-full border border-orange-400/30 text-[10px] font-mono font-bold text-orange-300 shadow-sm flex items-center gap-1.5 z-10">
                                                <i className="far fa-calendar-alt text-orange-400/80" />
                                                {exp.year}
                                            </div>

                                            {/* Kategori Badge */}
                                            <div className="absolute top-3 right-3 bg-neutral-900/80 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10 text-[10px] font-mono font-medium text-neutral-300 shadow-sm flex items-center gap-1.5 z-10">
                                                <i className={`fas ${exp.icon || 'fa-certificate'} text-[10px] text-neutral-400`} />
                                                {exp.category || 'Sertifikat'}
                                            </div>
                                        </div>

                                        {/* Content Container */}
                                        <div className="p-5 flex flex-col flex-1">
                                            <div className="flex-1 space-y-3">
                                                <div>
                                                    <h3 className="text-lg font-bold text-white leading-tight line-clamp-2">
                                                        {exp.title}
                                                    </h3>
                                                    <p className="text-xs text-orange-400/90 font-medium mt-1 flex items-center gap-1.5">
                                                        <i className="fas fa-award text-[10px]" />
                                                        {exp.role}
                                                    </p>
                                                </div>

                                                <p className="text-[13px] text-neutral-400 leading-relaxed line-clamp-3">
                                                    {exp.description}
                                                </p>
                                            </div>

                                            <div className="h-px w-full bg-gradient-to-r from-white/10 via-white/5 to-transparent my-4" />

                                            <div className="flex items-center gap-2.5 mt-auto">
                                                <button
                                                    onClick={() => handleOpenModal(exp, fileId ? 'pdf' : 'image')}
                                                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-orange-500/10 hover:bg-orange-500 text-orange-400 hover:text-white border border-orange-500/30 hover:border-orange-500 text-[13px] font-bold transition-all duration-300"
                                                >
                                                    <i className="fas fa-eye text-xs" />
                                                    <span>Lihat Preview</span>
                                                </button>

                                                {exp.certificate && (
                                                    <a
                                                        href={exp.certificate}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="w-10 h-10 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-white/10 hover:border-white/20 text-neutral-400 hover:text-white flex items-center justify-center transition-all duration-300"
                                                        title="Buka Drive Tab Baru"
                                                    >
                                                        <i className="fas fa-external-link-alt text-[13px]" />
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </SwiperSlide>
                            );
                        })}
                    </Swiper>
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
                                                className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1.5 cursor-pointer ${modalViewMode === 'pdf'
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
                                                className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1.5 cursor-pointer ${modalViewMode === 'image'
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