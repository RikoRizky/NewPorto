import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ---------- DATA SERTIFIKAT ----------
const certificates = [
  {
    id: 0,
    title: 'Sertifikat BNSP',
    organization: 'Badan Nasional Sertifikasi Profesi',
    year: '2025',
    description:
      'Sertifikat kompetensi profesi yang diakui secara nasional dari Badan Nasional Sertifikasi Profesi (BNSP) sebagai bukti penguasaan standar keahlian tertentu.',
    fileId: '1rsrf3LQ5EeqACZ4O7PvpAdpmTk8snZ5J',
    link: 'https://drive.google.com/file/d/1rsrf3LQ5EeqACZ4O7PvpAdpmTk8snZ5J/view',
  },
  {
    id: 1,
    title: 'Sertifikat PKL',
    organization: 'Badan Pusat Statistik Kota Cirebon',
    year: '2024',
    description:
      'Sertifikat Praktik Kerja Lapangan (PKL) yang diselenggarakan oleh Badan Pusat Statistik (BPS) Kota Cirebon, mencakup pengalaman langsung dalam pengolahan dan analisis data statistik.',
    fileId: '1y3VN-N-0SqDUHNsEDsHt1PVmCTZDOTvk',
    link: 'https://drive.google.com/file/d/1y3VN-N-0SqDUHNsEDsHt1PVmCTZDOTvk/view',
  },
  {
    id: 2,
    title: 'Sertifikat UKK',
    organization: 'Uji Kompetensi Keahlian RPL',
    year: '2024',
    description:
      'Sertifikat Uji Kompetensi Keahlian (UKK) bidang Rekayasa Perangkat Lunak (RPL) yang mengukur kemampuan teknis dalam pengembangan perangkat lunak sesuai standar industri.',
    fileId: '1XY4nEWlOES9m9tWEgYsDiRC1YbGAQbeO',
    link: 'https://drive.google.com/file/d/1XY4nEWlOES9m9tWEgYsDiRC1YbGAQbeO/view',
  },
  {
    id: 3,
    title: 'Sertifikat Karier.mu',
    organization: 'Menjadi Talenta Siap Bisnis',
    year: '2024',
    description:
      'Sertifikat program "Menjadi Talenta Siap Bisnis" dari Karier.mu, membekali peserta dengan keterampilan bisnis, kewirausahaan, dan kesiapan kerja di era ekonomi digital.',
    fileId: '1hc3UhB86SjkcyUJMYuN7oXKLtHxiYmWF',
    link: 'https://drive.google.com/file/d/1hc3UhB86SjkcyUJMYuN7oXKLtHxiYmWF/view',
  },
  {
    id: 4,
    title: 'Sertifikat Karier.mu',
    organization: 'Kelas Persiapan Kerja',
    year: '2024',
    description:
      'Sertifikat "Kelas Persiapan Kerja" dari Karier.mu, program pelatihan yang dirancang untuk meningkatkan kesiapan mahasiswa dalam menghadapi dunia kerja profesional.',
    fileId: '1hb91N-07A9gE-jXKM2ubNV0v_HxtaF75',
    link: 'https://drive.google.com/file/d/1hb91N-07A9gE-jXKM2ubNV0v_HxtaF75/view',
  },
  {
    id: 5,
    title: 'Sertifikat Partisipasi',
    organization: 'Kunjungan Industri GAMELAB Indonesia',
    year: '2023',
    description:
      'Sertifikat partisipasi dalam kunjungan industri ke GAMELAB Indonesia, memberikan wawasan mendalam tentang ekosistem pengembangan game dan industri kreatif digital.',
    fileId: '1hdLfWs4pNjjCx3a6fEe50F0vT1R_DTYT',
    link: 'https://drive.google.com/file/d/1hdLfWs4pNjjCx3a6fEe50F0vT1R_DTYT/view',
  },
];

const totalItems = certificates.length;

// Helper untuk thumbnail Google Drive
const getThumbnail = (fileId) =>
  `https://drive.google.com/thumbnail?id=${fileId}&sz=w800`;

export default function Certificates() {
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRef = useRef(null);
  const itemRefs = useRef([]);
  const imageRefs = useRef([]);
  const titleRef = useRef(null);
  const roleRef = useRef(null);
  const descTextRef = useRef(null);
  const cardRef = useRef(null);

  // Preload images
  useEffect(() => {
    certificates.forEach((cert) => {
      const img = new Image();
      img.src = getThumbnail(cert.fileId);
    });
  }, []);

  // ScrollTrigger setup — end sangat pendek agar pin selesai cepat
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
        end: `+=${totalItems * 20}%`, // sangat pendek, tidak ada sisa scroll kosong
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
  }, []);

  // Update konten saat activeIndex berubah
  useEffect(() => {
    const cert = certificates[activeIndex];
    if (!cert) return;

    if (titleRef.current) titleRef.current.textContent = cert.title;
    if (roleRef.current)
      roleRef.current.textContent = `${cert.organization} • ${cert.year}`;
    if (descTextRef.current) descTextRef.current.textContent = cert.description;

    imageRefs.current.forEach((img, idx) => {
      if (img) {
        img.style.opacity = idx === activeIndex ? '1' : '0';
        img.style.transform = idx === activeIndex ? 'scale(1)' : 'scale(1.05)';
      }
    });

    const textEls = [titleRef.current, roleRef.current, descTextRef.current].filter(
      Boolean
    );
    gsap.set(textEls, { opacity: 0, y: 12 });
    gsap.to(textEls, {
      opacity: 1,
      y: 0,
      duration: 0.25,
      ease: 'power2.out',
      stagger: 0.05,
    });
  }, [activeIndex]);

  const activeCert = certificates[activeIndex];

  return (
    <div
      ref={sectionRef}
      className="relative bg-[#0a0a0a] font-sans selection:bg-lime-400/30"
      // min-h dihapus agar tinggi menyesuaikan konten
    >
      {/* Animated background orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-lime-500/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-lime-400/5 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-lime-500/3 rounded-full blur-3xl" />
      </div>

      {/* Subtle grid pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-40 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 py-8 sm:py-12 lg:py-16 pb-0">
        {/* pb-0 — tidak ada padding bawah */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 xl:gap-16 items-start">
          {/* ===== LEFT COLUMN ===== */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-20 self-start">
            {/* Image Card */}
            <div className="relative overflow-hidden rounded-2xl bg-neutral-900/50 shadow-2xl shadow-lime-500/10 aspect-[4/3] sm:aspect-[16/10] lg:aspect-[4/3] border border-white/10 group">
              {certificates.map((cert, idx) => (
                <img
                  key={cert.id}
                  ref={(el) => (imageRefs.current[idx] = el)}
                  src={getThumbnail(cert.fileId)}
                  alt={cert.title}
                  className="absolute inset-0 w-full h-full object-cover will-change-transform"
                  style={{
                    opacity: idx === activeIndex ? 1 : 0,
                    transform: idx === activeIndex ? 'scale(1)' : 'scale(1.05)',
                    transition:
                      'opacity 0.6s cubic-bezier(0.25,0.46,0.45,0.94), transform 0.6s cubic-bezier(0.25,0.46,0.45,0.94)',
                  }}
                  loading="lazy"
                />
              ))}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/80 via-transparent to-transparent pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-br from-lime-500/5 via-transparent to-transparent pointer-events-none" />
              <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-lime-500/15 rounded-full blur-3xl pointer-events-none animate-pulse" />
              <a
                href={activeCert?.link}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 text-[10px] font-mono tracking-widest text-lime-400/80 hover:text-lime-300 hover:border-lime-400/40 transition-all duration-300 flex items-center gap-1.5 group/link"
              >
                <span>
                  {String(activeIndex + 1).padStart(2, '0')} /{' '}
                  {String(totalItems).padStart(2, '0')}
                </span>
                <span className="opacity-50 group-hover/link:opacity-100 transition">
                  ↗
                </span>
              </a>
            </div>

            {/* Detail Card */}
            <div
              ref={cardRef}
              className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 sm:p-7 border border-white/10 shadow-xl shadow-lime-500/5 transition-all duration-300 hover:border-lime-400/30 hover:shadow-lime-500/10"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3
                    ref={titleRef}
                    className="text-xl sm:text-2xl lg:text-3xl font-bold text-white leading-tight tracking-tight"
                  >
                    {activeCert?.title}
                  </h3>
                  <p
                    ref={roleRef}
                    className="text-xs sm:text-sm text-lime-400 font-medium mt-1 tracking-wide"
                  >
                    {activeCert?.organization} • {activeCert?.year}
                  </p>
                </div>
                <a
                  href={activeCert?.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 w-8 h-8 rounded-full bg-lime-400/10 border border-lime-400/20 flex items-center justify-center text-[10px] font-mono text-lime-400/70 hover:bg-lime-400/20 hover:border-lime-400/40 hover:text-lime-300 transition-all duration-300"
                >
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </a>
              </div>
              <div className="w-12 h-0.5 bg-gradient-to-r from-lime-400 to-transparent mt-3 mb-4 rounded-full" />
              <p
                ref={descTextRef}
                className="text-sm sm:text-base text-neutral-300 leading-relaxed font-light"
              >
                {activeCert?.description}
              </p>
            </div>

            {/* Dot Navigation */}
            <div className="flex justify-center gap-3 pt-2">
              {certificates.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveIndex(idx)}
                  className={`group relative h-2 rounded-full transition-all duration-500 cursor-pointer focus:outline-none focus:ring-2 focus:ring-lime-400/50 ${
                    idx === activeIndex
                      ? 'w-10 bg-lime-400 shadow-[0_0_24px_rgba(163,230,53,0.5)]'
                      : 'w-2 bg-neutral-700 hover:bg-neutral-500 hover:scale-125'
                  }`}
                  aria-label={`Go to certificate ${idx + 1}`}
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

          {/* ===== RIGHT COLUMN — TIMELINE ===== */}
          <div className="lg:col-span-7 pl-6 sm:pl-8 lg:pl-10 relative mt-4 lg:mt-0">
            {/* Vertical line background */}
            <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-lime-400/30 via-neutral-700/40 to-transparent" />
            {/* Vertical line fill */}
            <div
              className="absolute left-0 top-0 w-px bg-gradient-to-b from-lime-400/70 to-lime-400/20 transition-all duration-700"
              style={{ height: `${((activeIndex + 1) / totalItems) * 100}%` }}
            />

            <div className="space-y-12 sm:space-y-14 mb-0">
              {/* mb-0 — tidak ada margin bottom */}
              {certificates.map((cert, idx) => {
                const isActive = idx === activeIndex;
                const isPast = idx < activeIndex;

                return (
                  <div
                    key={cert.id}
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
                      style={{
                        height: idx === totalItems - 1 ? '0' : 'calc(100% + 8px)',
                      }}
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
                        {cert.title}
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
                        {cert.organization}
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