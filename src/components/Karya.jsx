import { useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';

const SLIDE_DATA = [
  { name: "BYD SEAL", img: "/img/byd.jpg", link: "https://bydcirebon.id/" },
  { name: "Mariposas Tour", img: "/img/mariposas.png", link: "https://tourmariposas.vercel.app" },
  { name: "Cafe", img: "/img/landing.png", link: "https://rikorizky.github.io/mycafe.github.io/" },
  { name: "Aplikasi Pembelian", img: "/img/tokoreact.png", link: "https://penjualan-barang-sable.vercel.app/" },
  { name: "Happy Birthday", img: "/img/ultah.png", link: "https://rikorizky.github.io/dibuka.github.oi/" },
  { name: "Happy Birthday pt2", img: "/img/ultah2.png", link: "https://rikorizky.github.io/hbd.github.io/" },
  { name: "SISTA BIJAK", img: "/img/sistabijak.png", link: "https://github.com/MuhammadRaffaFadellah/sista-bijak" }
];

const TOTAL = SLIDE_DATA.length;
let activeIdx = 1;
let isAnimating = false;
let autoSlideInterval = null;
let titleAnimationTimer = null;

export default function Karya() {
  const sliderRef = useRef(null);
  const titleDivRef = useRef(null);
  const captionDivRef = useRef(null);
  const previewDivRef = useRef(null);
  const counterSpanRef = useRef(null);
  const totalSpanRef = useRef(null);
  const prevArrowRef = useRef(null);
  const nextArrowRef = useRef(null);

  const getIndex = useCallback((offset) => {
    let newIdx = activeIdx + offset;
    while (newIdx < 1) newIdx += TOTAL;
    while (newIdx > TOTAL) newIdx -= TOTAL;
    return newIdx;
  }, []);

  const updateCounter = (index) => {
    if (counterSpanRef.current) counterSpanRef.current.innerText = index;
  };

  const clearTitleTimer = () => {
    if (titleAnimationTimer) clearTimeout(titleAnimationTimer);
    titleAnimationTimer = null;
  };

  const animateTitleToCaption = (slideName) => {
    clearTitleTimer();
    gsap.killTweensOf(titleDivRef.current);
    const h1 = titleDivRef.current?.querySelector('h1');
    if (!h1) return;
    h1.innerText = slideName;

    titleDivRef.current.classList.add('karya-title-visible');
    gsap.fromTo(titleDivRef.current,
      { scale: 0.8, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(0.6)" }
    );

    titleAnimationTimer = setTimeout(() => {
      gsap.to(titleDivRef.current, {
        y: window.innerHeight * 0.3,
        scale: 0.6,
        opacity: 0,
        duration: 0.8,
        ease: "power2.in",
        onComplete: () => {
          titleDivRef.current.classList.remove('karya-title-visible');
          gsap.set(titleDivRef.current, { clearProps: "all" });
          if (captionDivRef.current) {
            captionDivRef.current.innerText = slideName;
            captionDivRef.current.classList.remove('karya-show');
            void captionDivRef.current.offsetWidth;
            captionDivRef.current.classList.add('karya-show');
          }
        }
      });
      titleAnimationTimer = null;
    }, 1000);
  };

  const updatePreview = (content) => {
    if (!previewDivRef.current) return;
    const newImg = document.createElement('img');
    newImg.src = content.img;
    newImg.alt = content.name;
    previewDivRef.current.appendChild(newImg);
    gsap.fromTo(newImg,
      { opacity: 0, scale: 1.03 },
      { opacity: 1, scale: 1, duration: 1.2, ease: "power2.out", delay: 0.5,
        onComplete: () => {
          const old = previewDivRef.current.querySelector('img:not(:last-child)');
          if (old) old.remove();
        }
      }
    );
  };

  const createSlide = (content, className) => {
    const div = document.createElement('div');
    div.className = `karya-slide-container ${className}`;
    div.innerHTML = `<div class="karya-slide-img"><img src="${content.img}" alt="${content.name}" loading="eager"></div>`;
    return div;
  };

  const transitionDesktop = (direction) => {
    if (isAnimating) return;
    isAnimating = true;

    const outPos = direction === 'next' ? 'prev' : 'next';
    const inPos = direction === 'next' ? 'next' : 'prev';

    let outSlide = sliderRef.current.querySelector(`.karya-slide-container.${outPos}`);
    const activeSlide = sliderRef.current.querySelector('.karya-slide-container.active');
    let inSlide = sliderRef.current.querySelector(`.karya-slide-container.${inPos}`);

    const inIdx = getIndex(direction === 'next' ? 1 : -1);
    if (!inSlide) {
      inSlide = createSlide(SLIDE_DATA[inIdx-1], inPos);
      sliderRef.current.appendChild(inSlide);
      const startLeft = (inPos === 'prev') ? '15%' : '85%';
      gsap.set(inSlide, { left: startLeft, scale: 0.92, clipPath: 'polygon(20% 30%, 80% 30%, 80% 70%, 20% 70%)' });
    }
    if (!outSlide) {
      const outIdx = getIndex(direction === 'next' ? -1 : 1);
      outSlide = createSlide(SLIDE_DATA[outIdx-1], outPos);
      sliderRef.current.appendChild(outSlide);
      const startLeft = (outPos === 'prev') ? '15%' : '85%';
      gsap.set(outSlide, { left: startLeft, scale: 0.92, clipPath: 'polygon(20% 30%, 80% 30%, 80% 70%, 20% 70%)' });
    }

    gsap.to(inSlide, { left: '50%', scale: 1, clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)', duration: 1.6, ease: "power3.inOut" });
    gsap.to(activeSlide, { left: (outPos === 'prev') ? '15%' : '85%', scale: 0.92, clipPath: 'polygon(20% 30%, 80% 30%, 80% 70%, 20% 70%)', duration: 1.6, ease: "power3.inOut" });
    gsap.to(outSlide, { scale: 0, opacity: 0, duration: 1.4, ease: "power3.inOut" });

    const farIdx = getIndex(direction === 'next' ? 2 : -2);
    const newSlide = createSlide(SLIDE_DATA[farIdx-1], inPos);
    sliderRef.current.appendChild(newSlide);
    const newStartLeft = (inPos === 'prev') ? '15%' : '85%';
    gsap.set(newSlide, { left: newStartLeft, scale: 0.92, opacity: 0, clipPath: 'polygon(20% 30%, 80% 30%, 80% 70%, 20% 70%)' });
    gsap.to(newSlide, { scale: 0.92, opacity: 1, duration: 1.6, ease: "power3.inOut", delay: 0.1 });

    setTimeout(() => {
      outSlide?.remove();
      activeSlide.className = `karya-slide-container ${outPos}`;
      inSlide.className = 'karya-slide-container active';
      newSlide.className = `karya-slide-container ${inPos}`;
      gsap.set('.karya-slide-container.prev', { left: '15%', scale: 0.92, clipPath: 'polygon(20% 30%, 80% 30%, 80% 70%, 20% 70%)' });
      gsap.set('.karya-slide-container.active', { left: '50%', scale: 1, clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)' });
      gsap.set('.karya-slide-container.next', { left: '85%', scale: 0.92, clipPath: 'polygon(20% 30%, 80% 30%, 80% 70%, 20% 70%)' });
      activeIdx = inIdx;
      isAnimating = false;
      updateCounter(activeIdx);
      animateTitleToCaption(SLIDE_DATA[activeIdx-1].name);
      updatePreview(SLIDE_DATA[activeIdx-1]);
    }, 1800);
  };

  const transitionMobile = (direction) => {
    if (isAnimating) return;
    isAnimating = true;
    const newIdx = getIndex(direction === 'next' ? 1 : -1);
    const newContent = SLIDE_DATA[newIdx-1];
    const activeSlide = sliderRef.current.querySelector('.karya-slide-container.active');
    const imgElement = activeSlide?.querySelector('.karya-slide-img img');
    if (!imgElement || imgElement.src === newContent.img) {
      isAnimating = false;
      return;
    }
    const tl = gsap.timeline({ onComplete: () => {
      activeIdx = newIdx;
      isAnimating = false;
      updateCounter(activeIdx);
      updatePreview(newContent);
      animateTitleToCaption(newContent.name);
    }});
    tl.to(imgElement, { opacity: 0, duration: 0.2 })
      .call(() => { imgElement.src = newContent.img; })
      .to(imgElement, { opacity: 1, duration: 0.3 });
  };

  const transition = (direction) => {
    if (isAnimating) return;
    // BREAKPOINT DIUBAH MENJADI 1024px (IPAD & TABLET)
    const isMobile = window.innerWidth <= 1024;
    if (isMobile) transitionMobile(direction);
    else transitionDesktop(direction);
  };

  const startAutoSlide = () => {
    if (autoSlideInterval) clearInterval(autoSlideInterval);
    autoSlideInterval = setInterval(() => {
      if (!isAnimating) transition('next');
    }, 5000);
  };

  const resetAutoSlide = () => {
    clearInterval(autoSlideInterval);
    startAutoSlide();
  };

  const redirectActiveSlide = () => {
    if (isAnimating) return;
    const currentData = SLIDE_DATA[activeIdx - 1];
    if (currentData?.link && currentData.link !== '#') {
      window.open(currentData.link, '_blank');
    }
    resetAutoSlide();
  };

  const initSlides = () => {
    const old = sliderRef.current.querySelectorAll('.karya-slide-container');
    old.forEach(s => s.remove());

    // BREAKPOINT 1024px
    const isMobile = window.innerWidth <= 1024;
    if (!isMobile) {
      const prevIdx = getIndex(-1);
      const nextIdx = getIndex(1);
      const prevSlide = createSlide(SLIDE_DATA[prevIdx-1], 'prev');
      const activeSlide = createSlide(SLIDE_DATA[activeIdx-1], 'active');
      const nextSlide = createSlide(SLIDE_DATA[nextIdx-1], 'next');
      sliderRef.current.append(prevSlide, activeSlide, nextSlide);
      gsap.set('.karya-slide-container.prev', { left: '15%', scale: 0.92, clipPath: 'polygon(20% 30%, 80% 30%, 80% 70%, 20% 70%)' });
      gsap.set('.karya-slide-container.active', { left: '50%', scale: 1, clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)' });
      gsap.set('.karya-slide-container.next', { left: '85%', scale: 0.92, clipPath: 'polygon(20% 30%, 80% 30%, 80% 70%, 20% 70%)' });
    } else {
      const activeSlide = createSlide(SLIDE_DATA[activeIdx-1], 'active');
      sliderRef.current.appendChild(activeSlide);
      gsap.set('.karya-slide-container.active', { left: '50%', scale: 1, clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)' });
    }

    if (titleDivRef.current) {
      const h1 = titleDivRef.current.querySelector('h1');
      if (h1) h1.innerText = "";
      titleDivRef.current.classList.remove('karya-title-visible');
    }
    if (captionDivRef.current) {
      captionDivRef.current.innerText = "";
      captionDivRef.current.classList.remove('karya-show');
    }
    setTimeout(() => animateTitleToCaption(SLIDE_DATA[0].name), 500);
    updatePreview(SLIDE_DATA[0]);
    updateCounter(1);
  };

  useEffect(() => {
    if (totalSpanRef.current) totalSpanRef.current.innerText = TOTAL;
    initSlides();
    startAutoSlide();

    const handleClickSlide = (e) => {
      const slide = e.target.closest('.karya-slide-container');
      if (!slide || isAnimating) return;
      if (slide.classList.contains('next')) transition('next');
      else if (slide.classList.contains('prev')) transition('prev');
      else if (slide.classList.contains('active')) redirectActiveSlide();
    };
    const handlePrevArrow = () => transition('prev');
    const handleNextArrow = () => transition('next');
    const handleResize = () => {
      // BREAKPOINT 1024px
      const wasMobile = window.innerWidth <= 1024;
      const nowMobile = window.innerWidth <= 1024;
      if (wasMobile !== nowMobile) window.location.reload();
    };

    sliderRef.current.addEventListener('click', handleClickSlide);
    prevArrowRef.current?.addEventListener('click', handlePrevArrow);
    nextArrowRef.current?.addEventListener('click', handleNextArrow);
    window.addEventListener('resize', handleResize);

    return () => {
      clearInterval(autoSlideInterval);
      clearTitleTimer();
      sliderRef.current?.removeEventListener('click', handleClickSlide);
      prevArrowRef.current?.removeEventListener('click', handlePrevArrow);
      nextArrowRef.current?.removeEventListener('click', handleNextArrow);
      window.removeEventListener('resize', handleResize);
    };
  }, [getIndex]);

  return (
    <>
      <style>{`
        .karya-slider {
          position: relative;
          width: 100%;
          max-width: 100%;
          height: 100vh;
          overflow: hidden;
          background: radial-gradient(circle at 30% 10%, #0a0a0f, #010101);
          font-family: 'Inter', sans-serif;
          margin: 0;
          padding: 0;
        }
        .karya-slide-container {
          position: absolute;
          width: 32%;
          height: 70%;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: #0c0c12;
          border-radius: 36px;
          overflow: hidden;
          cursor: pointer;
          box-shadow: 0 30px 50px -20px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.06);
          transition: box-shadow 0.4s cubic-bezier(0.2, 0.9, 0.4, 1.1);
        }
        .karya-slide-container:hover {
          box-shadow: 0 40px 65px -18px rgba(0, 0, 0, 0.9), 0 0 0 1px rgba(255, 255, 255, 0.2);
        }
        .karya-slide-img {
          position: absolute;
          width: 100%;
          height: 100%;
        }
        .karya-slide-img img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transform: scale(1.02);
          transition: transform 0.7s cubic-bezier(0.2, 0.9, 0.4, 1.2);
          filter: brightness(0.95) contrast(1.02);
        }
        .karya-slide-container:hover .karya-slide-img img {
          transform: scale(1.1);
          filter: brightness(1.0) contrast(1.05);
        }
        .karya-slide-container.prev {
          left: 15%;
          transform: translate(-50%, -50%) scale(0.92);
          clip-path: polygon(20% 30%, 80% 30%, 80% 70%, 20% 70%);
        }
        .karya-slide-container.active {
          left: 50%;
          transform: translate(-50%, -50%) scale(1);
          clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%);
        }
        .karya-slide-container.next {
          left: 85%;
          transform: translate(-50%, -50%) scale(0.92);
          clip-path: polygon(20% 30%, 80% 30%, 80% 70%, 20% 70%);
        }
        .karya-slider-title {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 85%;
          max-width: 1100px;
          text-align: center;
          z-index: 30;
          pointer-events: none;
          opacity: 0;
          visibility: hidden;
        }
        .karya-slider-title.karya-title-visible {
          opacity: 1;
          visibility: visible;
        }
        .karya-slider-title h1 {
          font-size: clamp(2.2rem, 8vw, 4.8rem);
          font-weight: 500;
          letter-spacing: -0.01em;
          color: #ffffff;
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.4);
          line-height: 1.2;
        }
        .karya-slider-counter {
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          bottom: 2rem;
          z-index: 25;
          background: rgba(0, 0, 0, 0.4);
          backdrop-filter: blur(12px);
          padding: 0.4rem 1.2rem;
          border-radius: 40px;
          border: 0.5px solid rgba(255,255,255,0.1);
        }
        .karya-slider-counter p {
          display: flex;
          gap: 0.4rem;
          justify-content: center;
          font-size: 0.9rem;
          color: #e0e0e0;
        }
        .karya-slider-counter p span:first-child {
          font-weight: 500;
          color: white;
        }
        .karya-slider-preview {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 0;
          opacity: 0.3;
          overflow: hidden;
          filter: blur(3px) brightness(0.6);
          pointer-events: none;
        }
        .karya-slider-preview img {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          animation: karyaSlowScale 28s infinite alternate ease-in-out;
        }
        @keyframes karyaSlowScale {
          0% { transform: scale(1) translateX(0%); }
          100% { transform: scale(1.2) translateX(1.5%); }
        }
        .karya-ambient-glow {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 45%;
          background: linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.1) 60%, transparent);
          pointer-events: none;
          z-index: 1;
        }
        .karya-slide-caption {
          position: absolute;
          bottom: 2rem;
          left: 2rem;
          z-index: 35;
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(12px);
          padding: 0.4rem 1.2rem;
          border-radius: 40px;
          border: 0.5px solid rgba(255,255,255,0.15);
          font-size: 0.85rem;
          font-weight: 450;
          letter-spacing: 0.03em;
          text-transform: uppercase;
          color: #ffffff;
          pointer-events: none;
          opacity: 0;
          transform: translateY(12px);
          transition: opacity 0.45s ease, transform 0.45s ease;
        }
        .karya-slide-caption.karya-show {
          opacity: 1;
          transform: translateY(0);
        }
        .karya-nav-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 44px;
          height: 44px;
          background: rgba(0, 0, 0, 0.4);
          backdrop-filter: blur(8px);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.8rem;
          font-weight: 300;
          color: rgba(255,255,255,0.8);
          cursor: pointer;
          z-index: 40;
          transition: all 0.2s ease;
          border: 0.5px solid rgba(255,255,255,0.1);
        }
        .karya-nav-arrow:hover {
          background: rgba(0, 0, 0, 0.6);
          color: white;
          transform: translateY(-50%) scale(1.05);
        }
        .karya-prev-arrow { left: 1.5rem; }
        .karya-next-arrow { right: 1.5rem; }
        .karya-footer {
          position: absolute;
          right: 1.5rem;
          bottom: 1rem;
          z-index: 25;
          font-size: 0.65rem;
          opacity: 0.4;
          color: #ccc;
          pointer-events: none;
        }

        /* MEDIA QUERY UNTUK MOBILE & TABLET (LEBAR ≤ 1024px) */
        @media (max-width: 1024px) {
          .karya-slider {
            height: 100vh;
          }
          .karya-slide-container {
            width: 80%;
            height: 55%;
            border-radius: 28px;
          }
          .karya-slide-container.prev,
          .karya-slide-container.next {
            display: none;
          }
          .karya-slide-container.active {
            left: 50%;
            transform: translate(-50%, -50%) scale(1);
            display: block;
          }
          .karya-slider-title h1 {
            font-size: clamp(1.8rem, 7vw, 2.8rem);
          }
          .karya-nav-arrow {
            width: 36px;
            height: 36px;
            font-size: 1.5rem;
          }
          .karya-prev-arrow { left: 0.8rem; }
          .karya-next-arrow { right: 0.8rem; }
          .karya-slider-preview {
            opacity: 0.4;
            filter: blur(4px) brightness(0.65);
          }
          .karya-slide-caption {
            bottom: 1.2rem;
            left: 1rem;
            font-size: 0.7rem;
            padding: 0.3rem 1rem;
            white-space: normal;
            max-width: 65%;
          }
          .karya-slider-counter {
            bottom: 1.2rem;
            padding: 0.3rem 1rem;
            font-size: 0.8rem;
          }
          .karya-footer {
            right: 1rem;
            bottom: 0.8rem;
            font-size: 0.6rem;
            max-width: 65%;
            text-align: right;
          }
        }
      `}</style>
      <div
        ref={sliderRef}
        id="project"
        className="karya-slider"
        style={{ marginTop: '-40vh', position: 'relative', zIndex: 20, isolation: 'isolate' }}
      >
        <div ref={titleDivRef} className="karya-slider-title"><h1></h1></div>
        <div className="karya-slider-counter"><p><span ref={counterSpanRef}>1</span><span>/</span><span ref={totalSpanRef}>7</span></p></div>
        <div ref={previewDivRef} className="karya-slider-preview"></div>
        <div className="karya-ambient-glow"></div>
        <div ref={captionDivRef} className="karya-slide-caption"></div>
        <div ref={prevArrowRef} className="karya-nav-arrow karya-prev-arrow">←</div>
        <div ref={nextArrowRef} className="karya-nav-arrow karya-next-arrow">→</div>
        <footer className="karya-footer">⟡ click active slide to open link · arrows to navigate</footer>
      </div>
    </>
  );
}