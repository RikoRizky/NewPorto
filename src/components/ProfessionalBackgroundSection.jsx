import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
const getGoogleDriveThumbnail = (url) => {
    const match = url.match(/\/d\/(.+?)\//);
    if (match) {
        const fileId = match[1];
        return `https://drive.google.com/thumbnail?id=${fileId}&sz=w800`;
    }
    return url;
};

// Data mentah
const rawExperiences = [
    {
        id: 0,
        title: 'Sertifikat BNSP',
        role: 'Badan Nasional Sertifikasi Profesi - 2025',
        description:
            'Sertifikasi kompetensi profesional yang diakui secara nasional, menjadi bukti penguasaan keahlian di bidang Teknologi Informasi dengan standar industri yang telah teruji.',
        year: '2025',
        certificate: 'https://drive.google.com/file/d/1rsrf3LQ5EeqACZ4O7PvpAdpmTk8snZ5J/view?pli=1',
        image: '/img/sertif.png', // absolute path
    },
    {
        id: 1,
        title: 'Sertifikat PKL',
        role: 'Badan Pusat Statistik Kota Cirebon - 2024',
        description:
            'Pengalaman praktik kerja industri di instansi pemerintahan, mengelola dan menganalisis data statistik dengan standar profesional, serta berkontribusi dalam proyek digitalisasi data kependudukan.',
        year: '2024',
        certificate: 'https://drive.google.com/file/d/1y3VN-N-0SqDUHNsEDsHt1PVmCTZDOTvk/view',
        // image akan diambil dari certificate
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

// Mapping cerdas: jika image lokal, pakai langsung; jika tidak, buat thumbnail dari certificate atau image
const experiences = rawExperiences.map((exp) => {
    // Jika ada properti image dan bukan link Drive -> anggap lokal
    if (exp.image && !exp.image.includes('drive.google.com')) {
        return { ...exp, image: exp.image };
    }
    // Jika tidak ada image lokal, ambil dari certificate atau image (jika image link drive)
    const driveLink = exp.certificate || exp.image;
    if (driveLink) {
        return {
            ...exp,
            image: getGoogleDriveThumbnail(driveLink),
        };
    }
    // fallback jika tidak ada sama sekali
    return { ...exp, image: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=600&auto=format&fit=crop' };
});

console.log(experiences);

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
        });
    }, []);

    // ScrollTrigger setup
    useEffect(() => {
        const section = sectionRef.current;
        if (!section) return;

        const items = itemRefs.current;

        items.forEach((el) => {
            if (el) gsap.set(el, { opacity: 0, x: -20 });
        });

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: section,
                start: 'top top',
                end: `+=${totalItems * 110}%`,
                pin: true,
                scrub: 0.5,
                anticipatePin: 1,
                id: 'mainPin',
                onUpdate: (self) => {
                    const progress = self.progress;
                    const idx = Math.min(Math.floor(progress * totalItems), totalItems - 1);
                    setActiveIndex(idx);
                },
            },
        });

        items.forEach((el, i) => {
            if (!el) return;
            const startPos = i / totalItems;
            const endPos = (i + 1) / totalItems;
            tl.fromTo(
                el,
                { opacity: 0, x: -20 },
                { opacity: 1, x: 0, duration: 0.2, ease: 'power2.out' },
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
            className="relative min-h-[100vh] bg-[#0a0a0a] font-sans selection:bg-lime-400/30"
        >
            {/* Animated background orbs */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute -top-40 -right-40 w-96 h-96 bg-lime-500/5 rounded-full blur-3xl animate-pulse" />
                <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-lime-400/5 rounded-full blur-3xl animate-pulse delay-1000" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-lime-500/3 rounded-full blur-3xl" />
            </div>

            {/* Subtle grid pattern */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-40 pointer-events-none" />

            <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 py-8 sm:py-12 lg:py-16 pb-96">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 xl:gap-16 items-start">
                    {/* Left Column - sticky dengan top lebih tinggi agar sejajar dengan timeline */}
                    <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-20 self-start">
                        {/* Image Card */}
                        <div className="relative overflow-hidden rounded-2xl bg-neutral-900/50 shadow-2xl shadow-lime-500/10 aspect-[4/3] sm:aspect-[16/10] lg:aspect-[4/3] border border-white/10 group">
                            {experiences.map((exp, idx) => (
                                <img
                                    key={exp.id}
                                    ref={(el) => (imageRefs.current[idx] = el)}
                                    src={exp.image}
                                    alt={exp.title}
                                    onError={(e) => {
                                        e.target.src = 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=600&auto=format&fit=crop';
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
                            <div className="absolute inset-0 bg-gradient-to-br from-lime-500/5 via-transparent to-transparent pointer-events-none" />
                            <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-lime-500/15 rounded-full blur-3xl pointer-events-none animate-pulse" />
                            <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 text-[10px] font-mono tracking-widest text-lime-400/80">
                                {String(activeIndex + 1).padStart(2, '0')} /{' '}
                                {String(totalItems).padStart(2, '0')}
                            </div>
                        </div>

                        {/* Detail Card */}
                        <div
                            ref={cardRef}
                            className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 sm:p-7 border border-white/10 shadow-xl shadow-lime-500/5 transition-all duration-300 hover:border-lime-400/30 hover:shadow-lime-500/10 group/card"
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div>
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
                                </div>
                                <span className="shrink-0 w-8 h-8 rounded-full bg-lime-400/10 border border-lime-400/20 flex items-center justify-center text-[10px] font-mono text-lime-400/70">
                                    {String(activeIndex + 1).padStart(2, '0')}
                                </span>
                            </div>
                            <div className="w-12 h-0.5 bg-gradient-to-r from-lime-400 to-transparent mt-3 mb-4 rounded-full" />
                            <p
                                ref={descTextRef}
                                className="text-sm sm:text-base text-neutral-300 leading-relaxed font-light"
                            >
                                {experiences[activeIndex]?.description}
                            </p>
                        </div>

                        {/* Dot Navigation */}
                        <div className="flex justify-center gap-3 pt-2">
                            {experiences.map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setActiveIndex(idx)}
                                    className={`group relative h-2 rounded-full transition-all duration-500 cursor-pointer focus:outline-none focus:ring-2 focus:ring-lime-400/50 ${
                                        idx === activeIndex
                                            ? 'w-10 bg-lime-400 shadow-[0_0_24px_rgba(163,230,53,0.5)]'
                                            : 'w-2 bg-neutral-700 hover:bg-neutral-500 hover:scale-125'
                                    }`}
                                    aria-label={`Go to experience ${idx + 1}`}
                                >
                                    <span
                                        className={`absolute -bottom-6 left-1/2 -translate-x-1/2 text-[8px] font-mono tracking-wider text-neutral-600 transition-all duration-300 ${
                                            idx === activeIndex
                                                ? 'opacity-100 text-lime-400/80'
                                                : 'opacity-0 group-hover:opacity-60'
                                        }`}
                                    >
                                        {String(idx + 1).padStart(2, '0')}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Right Column - Timeline */}
                    <div className="lg:col-span-7 pl-6 sm:pl-8 lg:pl-10 relative mt-4 lg:mt-0">
                        {/* Vertical line */}
                        <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-lime-400/30 via-neutral-700/40 to-transparent" />
                        <div
                            className="absolute left-0 top-0 w-px h-full bg-gradient-to-b from-lime-400/70 to-lime-400/20 transition-all duration-700"
                            style={{ height: `${((activeIndex + 1) / totalItems) * 100}%` }}
                        />

                        <div className="space-y-12 sm:space-y-14 mb-40">
                            {experiences.map((exp, idx) => {
                                const isActive = idx === activeIndex;
                                const isPast = idx < activeIndex;

                                return (
                                    <div
                                        key={exp.id}
                                        ref={(el) => (itemRefs.current[idx] = el)}
                                        className="relative group cursor-default pl-6 sm:pl-8"
                                    >
                                        {/* Dot */}
                                        <div
                                            className={`absolute left-[-7px] sm:left-[-7px] top-1.5 w-4 h-4 rounded-full transition-all duration-500 ${
                                                isActive
                                                    ? 'bg-lime-400 shadow-[0_0_32px_rgba(163,230,53,0.6)] scale-110 ring-4 ring-lime-400/20'
                                                    : isPast
                                                      ? 'bg-lime-400/50 shadow-[0_0_16px_rgba(163,230,53,0.2)]'
                                                      : 'bg-neutral-700 group-hover:bg-neutral-500 group-hover:scale-125'
                                            }`}
                                        >
                                            <span
                                                className="absolute inset-0 rounded-full bg-lime-400/30 animate-ping"
                                                style={{ display: isActive ? 'block' : 'none' }}
                                            />
                                        </div>

                                        {/* Connector line */}
                                        <div
                                            className={`absolute left-[3px] sm:left-[3px] top-6 w-px transition-colors duration-700 ${
                                                isActive || isPast ? 'bg-lime-400/30' : 'bg-neutral-800'
                                            }`}
                                            style={{ height: idx === totalItems - 1 ? '0' : 'calc(100% + 8px)' }}
                                        />

                                        <div className="space-y-1">
                                            <h3
                                                className={`text-base sm:text-lg font-semibold transition-all duration-300 ${
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
                                                className={`text-[10px] sm:text-xs tracking-[0.25em] uppercase font-mono transition-colors duration-300 ${
                                                    isActive
                                                        ? 'text-lime-400/90'
                                                        : isPast
                                                          ? 'text-neutral-500/60'
                                                          : 'text-neutral-700'
                                                }`}
                                            >
                                                {exp.role}
                                            </p>
                                            <div
                                                className={`h-px rounded-full transition-all duration-700 ${
                                                    isActive
                                                        ? 'w-12 bg-gradient-to-r from-lime-400 to-lime-400/20'
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