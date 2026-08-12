const fs = require('fs');
const filePath = '/Users/rikorizky/NewPorto/src/components/ProfessionalBackgroundSection.jsx';
let content = fs.readFileSync(filePath, 'utf8');

const newComponent = `// ============ KOMPONEN UTAMA ============
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

    useEffect(() => {
        if (lightboxOpen) {
            setIframeLoading(true);
        }
    }, [lightboxOpen, selectedExperience, modalViewMode]);

    useEffect(() => {
        experiences.forEach((exp) => {
            const img = new Image();
            img.src = exp.image;
            img.onerror = () => {
                img.src = PLACEHOLDER_IMAGE;
            };
        });
    }, []);

    useEffect(() => {
        const headerEl = headerRef.current;
        const sliderEl = sliderContainerRef.current;
        if (!headerEl || !sliderEl) return;

        const refreshGSAP = () => ScrollTrigger.refresh();
        window.addEventListener('resize', refreshGSAP);
        const timer1 = setTimeout(refreshGSAP, 500);
        const timer2 = setTimeout(refreshGSAP, 1500);

        const ctx = gsap.context(() => {
            const targets = headerEl.querySelectorAll('.sertif-header-reveal');
            if (targets.length) {
                gsap.fromTo(
                    targets,
                    { opacity: 0, y: 30 },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.8,
                        stagger: 0.15,
                        ease: 'power3.out',
                        scrollTrigger: {
                            trigger: headerEl,
                            start: 'top 85%',
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
                        start: 'top 80%',
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

    useEffect(() => {
        if (!lightboxOpen) return;

        const originalBodyOverflow = document.body.style.overflow;
        const originalDocOverflow = document.documentElement.style.overflow;

        document.body.style.overflow = 'hidden';
        document.documentElement.style.overflow = 'hidden';

        const handleKeyDown = (e) => {
            if (e.key === 'Escape' || e.code === 'Escape' || e.keyCode === 27) {
                e.preventDefault();
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
        window.addEventListener('mousemove', handleMouseMove, { passive: true });

        const focusTimer = setTimeout(() => {
            window.focus();
            if (modalRef.current) {
                modalRef.current.focus();
            }
        }, 50);

        document.body.classList.add('lightbox-modal-open');

        return () => {
            clearTimeout(focusTimer);
            document.body.style.overflow = originalBodyOverflow;
            document.documentElement.style.overflow = originalDocOverflow;
            document.body.classList.remove('lightbox-modal-open');

            window.removeEventListener('keydown', handleKeyDown, true);
            document.removeEventListener('keydown', handleKeyDown, true);
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
            className="relative min-h-screen font-sans pt-20 pb-32 flex flex-col justify-center overflow-hidden"
        >
            <SectionBackdrop variant="cool" />

            <style>{\`
                .swiper {
                    padding-bottom: 4rem !important;
                    padding-top: 2rem !important;
                    overflow: visible !important;
                }
                @media (max-width: 100vw) {
                    #experience {
                        overflow-x: clip;
                    }
                }
                .swiper-slide {
                    width: 320px;
                    height: auto; 
                    opacity: 0.4;
                    transition: opacity 0.5s ease;
                }
                .swiper-slide-active {
                    opacity: 1;
                }
                @media (min-width: 640px) {
                    .swiper-slide {
                        width: 400px;
                    }
                }
                .swiper-pagination-bullet {
                    background: rgba(255, 255, 255, 0.2);
                    opacity: 1;
                    width: 8px;
                    height: 8px;
                    transition: all 0.3s ease;
                }
                .swiper-pagination-bullet-active {
                    background: #fff;
                    width: 24px;
                    border-radius: 4px;
                }
                .swiper-button-next, .swiper-button-prev {
                    color: #fff !important;
                    background: rgba(255,255,255,0.05);
                    width: 56px;
                    height: 56px;
                    border-radius: 50%;
                    backdrop-filter: blur(12px);
                    border: 1px solid rgba(255,255,255,0.1);
                    transition: all 0.3s ease;
                }
                .swiper-button-next:after, .swiper-button-prev:after {
                    font-size: 18px !important;
                    font-weight: 500;
                }
                .swiper-button-next:hover, .swiper-button-prev:hover {
                    background: rgba(255,255,255,0.15);
                    border-color: rgba(255,255,255,0.2);
                    transform: scale(1.05);
                }
                body.lightbox-modal-open .navbar-shell {
                    opacity: 0 !important;
                    pointer-events: none !important;
                    transform: translateY(-120%) !important;
                }
            \`}</style>

            <div className="relative z-10 w-full flex flex-col justify-start md:justify-center">
                
                {/* Section Header */}
                <div ref={headerRef} className="relative text-center max-w-2xl mx-auto mb-16 px-4">
                    <div className="sertif-header-reveal inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 mb-6 backdrop-blur-sm">
                        <span className="w-2 h-2 rounded-full bg-white"></span>
                        <span className="text-xs font-medium text-neutral-300 uppercase tracking-widest">
                            Sertifikasi & Lisensi
                        </span>
                    </div>
                    
                    <h2 className="sertif-header-reveal text-4xl sm:text-5xl font-bold text-white mb-6 tracking-tight">
                        Koleksi Sertifikat
                    </h2>
                    
                    <p className="sertif-header-reveal text-neutral-400 text-sm sm:text-base leading-relaxed max-w-lg mx-auto">
                        Pencapaian profesional, sertifikasi keahlian, dan lisensi resmi yang telah diraih untuk mendukung kompetensi industri.
                    </p>
                </div>

                {/* 3D Carousel Swiper */}
                <div ref={sliderContainerRef} className="w-full px-0 sm:px-4 lg:px-8">
                    <Swiper
                        effect={'coverflow'}
                        grabCursor={true}
                        centeredSlides={true}
                        slidesPerView={'auto'}
                        initialSlide={0}
                        loop={true}
                        coverflowEffect={{
                            rotate: 0,
                            stretch: 0,
                            depth: 100,
                            modifier: 2.5,
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
                        {experiences.map((exp) => {
                            const fileId = getGoogleDriveFileId(exp.certificate);

                            return (
                                <SwiperSlide key={exp.id} className="flex h-auto">
                                    <div className="group relative bg-neutral-900/30 hover:bg-neutral-900/50 backdrop-blur-xl border border-white/5 hover:border-white/10 rounded-[2rem] overflow-hidden transition-all duration-500 flex flex-col w-full h-full">
                                        
                                        {/* Image Section */}
                                        <div 
                                            className="relative aspect-[4/3] overflow-hidden bg-neutral-950 cursor-pointer"
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
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                            />
                                            
                                            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-transparent to-transparent" />

                                            {/* Badges */}
                                            <div className="absolute top-4 left-4 flex gap-2">
                                                <span className="px-3 py-1 bg-black/60 backdrop-blur-md rounded-full text-[11px] font-medium text-white/90 border border-white/10">
                                                    {exp.year}
                                                </span>
                                            </div>
                                            <div className="absolute top-4 right-4">
                                                <span className="flex items-center gap-1.5 px-3 py-1 bg-black/60 backdrop-blur-md rounded-full text-[11px] font-medium text-white/90 border border-white/10">
                                                    <i className={\`fas \${exp.icon || 'fa-certificate'} text-[10px] text-neutral-300\`} />
                                                    {exp.category || 'Sertifikat'}
                                                </span>
                                            </div>
                                            
                                            {/* Hover Overlay */}
                                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center pointer-events-none">
                                                <div className="w-14 h-14 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center border border-white/20 transform scale-75 group-hover:scale-100 transition-all duration-500">
                                                    <i className={\`fas \${fileId ? 'fa-file-pdf' : 'fa-expand'} text-white text-lg\`} />
                                                </div>
                                            </div>
                                        </div>
                                        
                                        {/* Content Section */}
                                        <div className="p-6 md:p-8 flex flex-col flex-1">
                                            <h3 className="text-xl font-semibold text-white mb-2 leading-tight">
                                                {exp.title}
                                            </h3>
                                            <p className="text-sm text-neutral-400 font-medium mb-4 flex items-center gap-2">
                                                <i className="fas fa-building-columns text-[10px] opacity-70" />
                                                {exp.role}
                                            </p>
                                            <p className="text-sm text-neutral-500 leading-relaxed mb-8 line-clamp-3">
                                                {exp.description}
                                            </p>
                                            
                                            <div className="mt-auto flex items-center gap-3">
                                                <button 
                                                    onClick={() => handleOpenModal(exp, fileId ? 'pdf' : 'image')}
                                                    className="flex-1 bg-white hover:bg-neutral-200 text-black px-4 py-3 rounded-xl text-sm font-semibold transition-colors duration-300 flex items-center justify-center gap-2"
                                                >
                                                    <i className="fas fa-eye" />
                                                    Lihat Detail
                                                </button>
                                                {exp.certificate && (
                                                    <a 
                                                        href={exp.certificate}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="w-12 h-12 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-colors duration-300"
                                                        title="Buka di tab baru"
                                                    >
                                                        <i className="fas fa-external-link-alt" />
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

            {/* FULL DOCUMENT MODAL LIGHTBOX */}
            {lightboxOpen && (
                <div
                    ref={modalRef}
                    tabIndex={-1}
                    className="fixed inset-0 z-[99999] bg-black/90 backdrop-blur-xl flex items-center justify-center p-2 sm:p-6 outline-none transition-opacity duration-300"
                    onClick={(e) => {
                        if (e.target === modalRef.current) {
                            setLightboxOpen(false);
                        }
                    }}
                >
                    <div
                        className="relative max-w-5xl w-full h-[90vh] bg-neutral-900 border border-white/10 rounded-2xl flex flex-col overflow-hidden shadow-2xl z-[100000]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className="flex items-center justify-between px-6 py-4 bg-neutral-950/50 backdrop-blur-md border-b border-white/5 shrink-0">
                            <div className="flex items-center gap-4 min-w-0">
                                <h3 className="text-base font-semibold text-white truncate">
                                    {currentExp.title}
                                </h3>
                                <span className="hidden sm:inline-block px-2 py-0.5 rounded bg-white/10 text-xs text-neutral-300 font-medium whitespace-nowrap">
                                    {currentExp.year}
                                </span>
                            </div>

                            <div className="flex items-center gap-3 shrink-0">
                                {/* Mode Selector Switcher */}
                                {driveFileId && (
                                    <div className="flex bg-black/50 p-1 rounded-lg border border-white/5 text-xs font-medium">
                                        <button
                                            type="button"
                                            onClick={() => setModalViewMode('pdf')}
                                            className={\`px-3 py-1.5 rounded-md transition-all flex items-center gap-2 \${modalViewMode === 'pdf'
                                                ? 'bg-white text-black shadow'
                                                : 'text-neutral-400 hover:text-white'
                                                }\`}
                                        >
                                            <i className="fas fa-file-pdf" />
                                            <span className="hidden sm:inline">PDF Document</span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setModalViewMode('image')}
                                            className={\`px-3 py-1.5 rounded-md transition-all flex items-center gap-2 \${modalViewMode === 'image'
                                                ? 'bg-white text-black shadow'
                                                : 'text-neutral-400 hover:text-white'
                                                }\`}
                                        >
                                            <i className="fas fa-image" />
                                            <span className="hidden sm:inline">Image Preview</span>
                                        </button>
                                    </div>
                                )}

                                <button
                                    type="button"
                                    onClick={() => setLightboxOpen(false)}
                                    className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white flex items-center justify-center border border-white/5 transition-all"
                                    title="Tutup (ESC)"
                                >
                                    <i className="fas fa-times" />
                                </button>
                            </div>
                        </div>

                        {/* Modal Body Container */}
                        <div className="flex-1 bg-neutral-950 relative overflow-hidden flex items-center justify-center">
                            {modalViewMode === 'pdf' && driveFileId && iframeLoading && (
                                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4">
                                    <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                    <p className="text-sm font-medium text-neutral-400">Loading document...</p>
                                </div>
                            )}

                            {modalViewMode === 'pdf' && driveFileId ? (
                                <iframe
                                    src={\`https://drive.google.com/file/d/\${driveFileId}/preview\`}
                                    className="w-full h-full border-0 relative z-0"
                                    title={currentExp.title}
                                    allow="autoplay"
                                    onLoad={() => setIframeLoading(false)}
                                />
                            ) : (
                                <div className="w-full h-full overflow-y-auto flex items-center justify-center p-6">
                                    <img
                                        src={currentExp.image}
                                        alt={currentExp.title}
                                        onError={(e) => {
                                            if (e.target.src !== PLACEHOLDER_IMAGE && !e.target.src.endsWith(PLACEHOLDER_IMAGE)) {
                                                e.target.src = PLACEHOLDER_IMAGE;
                                            }
                                        }}
                                        className="max-w-full h-auto max-h-full rounded-lg shadow-2xl object-contain"
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
\`;

const targetIdx = content.indexOf('// ============ KOMPONEN UTAMA ============');
if (targetIdx !== -1) {
    content = content.substring(0, targetIdx) + newComponent;
    fs.writeFileSync(filePath, content, 'utf8');
    console.log("Replacement successful.");
} else {
    console.log("Target string not found.");
}
