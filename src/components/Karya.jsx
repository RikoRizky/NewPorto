import { useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';

export const SLIDE_DATA = [
  { name: "BYD Cirebon", img: "/img/byd.jpg", link: "https://bydcirebon.id/", category: "Automotive Dealer", tags: ["React", "Vite", "Tailwind"] },
  { name: "Mariposas Tour", img: "/img/mariposas.png", link: "https://tourmariposas.vercel.app", category: "Travel & Tourism", tags: ["React", "GSAP", "Vercel"] },
  { name: "SILADATA", img: "/img/siladata.png", link: "https://siladata.my.id", category: "Data Management", tags: ["Web App", "PHP", "MySQL"] },
  { name: "Perpustakaan", img: "/img/perpus.png", link: "https://perpustakaan.nue.dom.my.id/", category: "Library System", tags: ["Fullstack", "Database", "UI/UX"] },
  { name: "Cafe Landing Page", img: "/img/landing.png", link: "https://rikorizky.github.io/mycafe.github.io/", category: "Restaurant & Cafe", tags: ["HTML5", "CSS3", "JavaScript"] },
  { name: "Aplikasi Pembelian", img: "/img/tokoreact.png", link: "https://penjualan-barang-sable.vercel.app/", category: "E-Commerce App", tags: ["React", "State Mgmt", "CSS Grid"] },
  { name: "Happy Birthday", img: "/img/ultah.png", link: "https://rikorizky.github.io/dibuka.github.oi/", category: "Interactive Web", tags: ["Interactive", "CSS Animation"] },
  { name: "Happy Birthday pt2", img: "/img/ultah2.png", link: "https://rikorizky.github.io/hbd.github.io/", category: "Special Showcase", tags: ["Audio API", "Canvas", "JS"] },
  { name: "SISTA BIJAK", img: "/img/sistabijak.png", link: "https://sista-bijak.nue.dom.my.id", category: "Management System", tags: ["Laravel", "Bootstrap", "MySQL"] },
  { name: "Todo List", img: "/img/todolist.png", link: "https://todo-list.osk.dom.my.id", category: "Data Management", tags: ["Laravel", "Tailwind", "MySQL"] },
  { name: "Trading", img: "/img/trading.png", link: "https://trading2026-n3jr61ob9-rikorizkys-projects.vercel.app", category: "E-learning", tags: ["React", "Tailwind", "Supabase"] }
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
    if (counterSpanRef.current) {
      counterSpanRef.current.innerText = index < 10 ? `0${index}` : index;
    }
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
      { scale: 0.75, opacity: 0, y: -25, filter: "blur(10px)" },
      { scale: 1, opacity: 1, y: 0, filter: "blur(0px)", duration: 0.55, ease: "back.out(1.2)" }
    );

    titleAnimationTimer = setTimeout(() => {
      gsap.to(titleDivRef.current, {
        y: window.innerHeight * 0.28,
        scale: 0.5,
        opacity: 0,
        filter: "blur(8px)",
        duration: 0.65,
        ease: "power3.in",
        onComplete: () => {
          titleDivRef.current.classList.remove('karya-title-visible');
          gsap.set(titleDivRef.current, { clearProps: "all" });
          if (captionDivRef.current) {
            const currentSlide = SLIDE_DATA.find(s => s.name === slideName) || SLIDE_DATA[activeIdx - 1];
            const cat = currentSlide?.category || 'Project';
            captionDivRef.current.innerHTML = `
              <span class="karya-cat-badge">${cat}</span>
              <span class="karya-slide-name">${slideName}</span>
              <span class="karya-caption-arrow">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>
              </span>
            `;
            captionDivRef.current.classList.remove('karya-show');
            void captionDivRef.current.offsetWidth;
            captionDivRef.current.classList.add('karya-show');
            gsap.fromTo(captionDivRef.current,
              { scale: 0.9, opacity: 0, y: 10 },
              { scale: 1, opacity: 1, y: 0, duration: 0.45, ease: "back.out(1.4)" }
            );
          }
        }
      });
      titleAnimationTimer = null;
    }, 900);
  };

  const updatePreview = (content) => {
    if (!previewDivRef.current) return;
    const newImg = document.createElement('img');
    newImg.src = content.img;
    newImg.alt = content.name;
    previewDivRef.current.appendChild(newImg);
    gsap.fromTo(newImg,
      { opacity: 0, scale: 1.15 },
      {
        opacity: 1, scale: 1, duration: 1.5, ease: "power2.out", delay: 0.2,
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
    const tagsHtml = content.tags ? content.tags.map(t => `<span class="karya-card-tag">${t}</span>`).join('') : '';
    const categoryHtml = content.category ? `<span class="karya-card-category">${content.category}</span>` : '';

    div.innerHTML = `
      <div class="karya-slide-img">
        <img src="${content.img}" alt="${content.name}" loading="lazy" decoding="async">
        <div class="karya-card-gradient"></div>
        <div class="karya-card-top-info">${categoryHtml}</div>
        <div class="karya-card-bottom-info">
          <div class="karya-card-tags">${tagsHtml}</div>
          <div class="karya-card-link-badge">
            <span>Kunjungi Project</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>
          </div>
        </div>
      </div>
    `;
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
      inSlide = createSlide(SLIDE_DATA[inIdx - 1], inPos);
      sliderRef.current.appendChild(inSlide);
      const startLeft = (inPos === 'prev') ? '15%' : '85%';
      const startRot = (inPos === 'prev') ? 8 : -8;
      gsap.set(inSlide, { left: startLeft, scale: 0.58, rotateY: startRot, z: -40, opacity: 1, filter: "brightness(0.8)", zIndex: 10, clipPath: 'none' });
    }
    if (!outSlide) {
      const outIdx = getIndex(direction === 'next' ? -1 : 1);
      outSlide = createSlide(SLIDE_DATA[outIdx - 1], outPos);
      sliderRef.current.appendChild(outSlide);
      const startLeft = (outPos === 'prev') ? '15%' : '85%';
      const startRot = (outPos === 'prev') ? 8 : -8;
      gsap.set(outSlide, { left: startLeft, scale: 0.58, rotateY: startRot, z: -40, opacity: 1, filter: "brightness(0.8)", zIndex: 10, clipPath: 'none' });
    }

    const targetRotate = (outPos === 'prev') ? 8 : -8;
    const exitRotate = (outPos === 'prev') ? -22 : 22;
    const newEnterRotate = (inPos === 'prev') ? 22 : -22;

    const animDuration = 1.4;
    const animEase = "power3.inOut";

    // 1. Animate incoming slide to active center (Side -> Center)
    gsap.to(inSlide, {
      left: '50%', scale: 1, rotateY: 0, z: 0, opacity: 1, filter: "brightness(1)", zIndex: 20, clipPath: 'none',
      duration: animDuration, ease: animEase
    });

    // Inner image parallax zoom effect
    const inImg = inSlide.querySelector('.karya-slide-img img');
    if (inImg) {
      gsap.fromTo(inImg, { scale: 1.18 }, { scale: 1, duration: animDuration, ease: animEase });
    }

    // 2. Animate active slide to side position (Center -> Side)
    gsap.to(activeSlide, {
      left: (outPos === 'prev') ? '15%' : '85%',
      scale: 0.58, rotateY: targetRotate, z: -40, opacity: 1, filter: "brightness(0.8)", zIndex: 10, clipPath: 'none',
      duration: animDuration, ease: animEase
    });

    // 3. Animate old side slide exiting (Side -> Offscreen)
    gsap.to(outSlide, {
      scale: 0.35, rotateY: exitRotate, opacity: 0, filter: "brightness(0.5)", z: -80,
      duration: animDuration, ease: animEase
    });

    // 4. Prepare and animate new side slide entering (Offscreen -> Side)
    const farIdx = getIndex(direction === 'next' ? 2 : -2);
    const newSlide = createSlide(SLIDE_DATA[farIdx - 1], inPos);
    sliderRef.current.appendChild(newSlide);
    const newStartLeft = (inPos === 'prev') ? '15%' : '85%';
    const finalRot = (inPos === 'prev') ? 8 : -8;

    gsap.set(newSlide, {
      left: newStartLeft, scale: 0.35, rotateY: newEnterRotate, z: -80, opacity: 0, filter: "brightness(0.5)", zIndex: 5, clipPath: 'none'
    });
    gsap.to(newSlide, {
      scale: 0.58, rotateY: finalRot, z: -40, opacity: 1, filter: "brightness(0.8)", zIndex: 10,
      duration: animDuration, ease: animEase
    });

    setTimeout(() => {
      outSlide?.remove();
      activeSlide.className = `karya-slide-container ${outPos}`;
      inSlide.className = 'karya-slide-container active';
      newSlide.className = `karya-slide-container ${inPos}`;
      gsap.set('.karya-slide-container.prev', { left: '15%', scale: 0.58, rotateY: 8, z: -40, opacity: 1, filter: "brightness(0.8)", zIndex: 10, clipPath: 'none' });
      gsap.set('.karya-slide-container.active', { left: '50%', scale: 1, rotateY: 0, z: 0, opacity: 1, filter: "brightness(1)", zIndex: 20, clipPath: 'none' });
      gsap.set('.karya-slide-container.next', { left: '85%', scale: 0.58, rotateY: -8, z: -40, opacity: 1, filter: "brightness(0.8)", zIndex: 10, clipPath: 'none' });
      activeIdx = inIdx;
      isAnimating = false;
      updateCounter(activeIdx);
      animateTitleToCaption(SLIDE_DATA[activeIdx - 1].name);
      updatePreview(SLIDE_DATA[activeIdx - 1]);
    }, 1450);
  };

  const transitionMobile = (direction) => {
    if (isAnimating) return;
    isAnimating = true;
    const newIdx = getIndex(direction === 'next' ? 1 : -1);
    const newContent = SLIDE_DATA[newIdx - 1];
    const activeSlide = sliderRef.current.querySelector('.karya-slide-container.active');
    const imgElement = activeSlide?.querySelector('.karya-slide-img img');
    if (!imgElement || imgElement.src === newContent.img) {
      isAnimating = false;
      return;
    }
    const tl = gsap.timeline({
      onComplete: () => {
        activeIdx = newIdx;
        isAnimating = false;
        updateCounter(activeIdx);
        updatePreview(newContent);
        animateTitleToCaption(newContent.name);
      }
    });
    tl.to(imgElement, { opacity: 0, duration: 0.2 })
      .call(() => {
        imgElement.src = newContent.img;
        const catElem = activeSlide.querySelector('.karya-card-category');
        if (catElem && newContent.category) catElem.innerText = newContent.category;
        const tagsElem = activeSlide.querySelector('.karya-card-tags');
        if (tagsElem && newContent.tags) {
          tagsElem.innerHTML = newContent.tags.map(t => `<span class="karya-card-tag">${t}</span>`).join('');
        }
      })
      .to(imgElement, { opacity: 1, duration: 0.3 });
  };

  const transition = (direction) => {
    if (isAnimating) return;
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

    const isMobile = window.innerWidth <= 1024;
    if (!isMobile) {
      const prevIdx = getIndex(-1);
      const nextIdx = getIndex(1);
      const prevSlide = createSlide(SLIDE_DATA[prevIdx - 1], 'prev');
      const activeSlide = createSlide(SLIDE_DATA[activeIdx - 1], 'active');
      const nextSlide = createSlide(SLIDE_DATA[nextIdx - 1], 'next');
      sliderRef.current.append(prevSlide, activeSlide, nextSlide);
      gsap.set('.karya-slide-container.prev', { left: '15%', scale: 0.58, rotateY: 8, z: -40, opacity: 0.85, zIndex: 10, clipPath: 'none' });
      gsap.set('.karya-slide-container.active', { left: '50%', scale: 1, rotateY: 0, z: 0, opacity: 1, zIndex: 20, clipPath: 'none' });
      gsap.set('.karya-slide-container.next', { left: '85%', scale: 0.58, rotateY: -8, z: -40, opacity: 0.85, zIndex: 10, clipPath: 'none' });
    } else {
      const activeSlide = createSlide(SLIDE_DATA[activeIdx - 1], 'active');
      sliderRef.current.appendChild(activeSlide);
      gsap.set('.karya-slide-container.active', { left: '50%', scale: 1, clipPath: 'none' });
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
    if (totalSpanRef.current) totalSpanRef.current.innerText = TOTAL < 10 ? `0${TOTAL}` : TOTAL;
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
      const wasMobile = window.innerWidth <= 1024;
      const nowMobile = window.innerWidth <= 1024;
      if (wasMobile !== nowMobile) window.location.reload();
    };

    const sliderNode = sliderRef.current;
    const prevArrowNode = prevArrowRef.current;
    const nextArrowNode = nextArrowRef.current;

    sliderNode?.addEventListener('click', handleClickSlide);
    prevArrowNode?.addEventListener('click', handlePrevArrow);
    nextArrowNode?.addEventListener('click', handleNextArrow);
    window.addEventListener('resize', handleResize);

    return () => {
      clearInterval(autoSlideInterval);
      clearTitleTimer();
      sliderNode?.removeEventListener('click', handleClickSlide);
      prevArrowNode?.removeEventListener('click', handlePrevArrow);
      nextArrowNode?.removeEventListener('click', handleNextArrow);
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
          perspective: 1200px;
          perspective-origin: 50% 50%;
          background: #030308;
          background-image: 
            radial-gradient(circle at 50% 30%, rgba(255, 140, 56, 0.14) 0%, transparent 60%),
            radial-gradient(circle at 15% 70%, rgba(245, 158, 11, 0.08) 0%, transparent 50%),
            radial-gradient(circle at 85% 80%, rgba(255, 140, 56, 0.06) 0%, transparent 50%),
            radial-gradient(rgba(255, 255, 255, 0.04) 1px, transparent 1px);
          background-size: 100% 100%, 100% 100%, 100% 100%, 36px 36px;
          font-family: 'Inter', system-ui, -apple-system, sans-serif;
          margin: 0;
          padding: 0;
        }

        .karya-header-badge {
          position: absolute;
          top: 3.5rem;
          left: 50%;
          transform: translateX(-50%);
          z-index: 25;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.45rem 1.2rem;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.18);
          box-shadow: 
            0 8px 32px rgba(0, 0, 0, 0.4), 
            inset 0 1px 1px rgba(255, 255, 255, 0.25);
          font-size: 0.72rem;
          font-weight: 600;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #ffb07c;
          pointer-events: none;
        }
        .karya-header-badge span.sparkle {
          color: #ff8c38;
          animation: karyaPulse 2s infinite alternate ease-in-out;
        }
        @keyframes karyaPulse {
          0% { opacity: 0.5; transform: scale(0.9); }
          100% { opacity: 1; transform: scale(1.1); }
        }

        /* EFEK GLOSSY UTAMA KARTU */
        .karya-slide-container {
          position: absolute;
          width: 32%;
          height: 68%;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: #0c0c12;
          border-radius: 32px;
          overflow: hidden;
          cursor: pointer;
          border: 1px solid rgba(255, 255, 255, 0.18);
          box-shadow: 
            0 30px 60px -15px rgba(0, 0, 0, 0.95),
            0 0 40px rgba(255, 140, 56, 0.15),
            inset 0 1px 2px rgba(255, 255, 255, 0.3);
          transform-style: preserve-3d;
          transition: border-color 0.4s ease, box-shadow 0.4s ease, filter 0.4s ease;
        }

        /* KILAPAN SHINE GLOSSY SEPERTI KACA SAAT HOVER */
        .karya-slide-container::before {
          content: '';
          position: absolute;
          top: 0;
          left: -130%;
          width: 75%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.22),
            transparent
          );
          transform: skewX(-25deg);
          transition: left 0.85s cubic-bezier(0.16, 1, 0.3, 1);
          z-index: 15;
          pointer-events: none;
        }
        .karya-slide-container:hover::before {
          left: 160%;
        }
        .karya-slide-container:hover {
          border-color: rgba(255, 140, 56, 0.7);
          box-shadow: 
            0 40px 80px -15px rgba(0, 0, 0, 0.98),
            0 0 50px rgba(255, 140, 56, 0.4),
            inset 0 0 0 1px rgba(255, 140, 56, 0.25),
            inset 0 1px 2px rgba(255, 255, 255, 0.4);
        }

        .karya-slide-img {
          position: absolute;
          width: 100%;
          height: 100%;
          background: #0c0c12;
        }
        .karya-slide-img img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transform: scale(1.02);
          transition: transform 0.8s cubic-bezier(0.16, 1, 0.3, 1), filter 0.5s ease;
          filter: brightness(0.9) contrast(1.03);
        }
        .karya-slide-container:hover .karya-slide-img img {
          transform: scale(1.08);
          filter: brightness(1.0) contrast(1.06);
        }

        .karya-card-gradient {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0) 40%, rgba(0,0,0,0.85) 100%);
          pointer-events: none;
        }

        .karya-card-top-info {
          position: absolute;
          top: 1.2rem;
          left: 1.2rem;
          z-index: 10;
        }
        .karya-card-category {
          display: inline-block;
          padding: 0.35rem 0.85rem;
          border-radius: 20px;
          background: rgba(0, 0, 0, 0.55);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.18);
          box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.2);
          font-size: 0.7rem;
          font-weight: 500;
          letter-spacing: 0.04em;
          color: #ffedd5;
        }

        .karya-card-bottom-info {
          position: absolute;
          bottom: 1.4rem;
          left: 1.2rem;
          right: 1.2rem;
          z-index: 10;
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 0.6rem;
        }
        .karya-card-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.35rem;
        }
        .karya-card-tag {
          font-size: 0.65rem;
          font-weight: 500;
          padding: 0.2rem 0.55rem;
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.12);
          backdrop-filter: blur(8px);
          color: #d1d5db;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        /* TOMBOL BADGE GLOSSY */
        .karya-card-link-badge {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          padding: 0.4rem 0.8rem;
          border-radius: 20px;
          background: rgba(255, 140, 56, 0.88);
          color: #ffffff;
          font-size: 0.7rem;
          font-weight: 600;
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255, 255, 255, 0.25);
          box-shadow: 0 4px 12px rgba(255, 140, 56, 0.35), inset 0 1px 1px rgba(255, 255, 255, 0.3);
          white-space: nowrap;
          transition: transform 0.25s ease, background-color 0.25s ease;
        }
        .karya-slide-container:hover .karya-card-link-badge {
          background: rgba(245, 158, 11, 1);
          transform: translateY(-2px);
        }

        .karya-slide-container.prev {
          left: 15%;
          transform: translate(-50%, -50%) scale(0.58) rotateY(8deg) translateZ(-40px);
          opacity: 1;
          filter: brightness(0.8);
          z-index: 10;
          clip-path: none;
          box-shadow: 
            0 25px 50px rgba(0, 0, 0, 0.85),
            0 0 35px rgba(255, 140, 56, 0.22),
            inset 0 1px 1px rgba(255, 255, 255, 0.25);
        }
        .karya-slide-container.active {
          left: 50%;
          transform: translate(-50%, -50%) scale(1) rotateY(0deg) translateZ(0px);
          opacity: 1;
          filter: brightness(1);
          z-index: 20;
          clip-path: none;
        }
        .karya-slide-container.next {
          left: 85%;
          transform: translate(-50%, -50%) scale(0.58) rotateY(-8deg) translateZ(-40px);
          opacity: 1;
          filter: brightness(0.8);
          z-index: 10;
          clip-path: none;
          box-shadow: 
            0 25px 50px rgba(0, 0, 0, 0.85),
            0 0 35px rgba(255, 140, 56, 0.22),
            inset 0 1px 1px rgba(255, 255, 255, 0.25);
        }
        .karya-slide-container.prev:hover {
          filter: brightness(1);
          border-color: rgba(255, 140, 56, 0.8);
          transform: translate(-50%, -50%) scale(0.62) rotateY(3deg) translateZ(-10px);
          box-shadow: 
            0 35px 70px rgba(0, 0, 0, 0.95),
            0 0 45px rgba(255, 140, 56, 0.45),
            inset 0 0 0 1px rgba(255, 140, 56, 0.3);
        }
        .karya-slide-container.next:hover {
          filter: brightness(1);
          border-color: rgba(255, 140, 56, 0.8);
          transform: translate(-50%, -50%) scale(0.62) rotateY(-3deg) translateZ(-10px);
          box-shadow: 
            0 35px 70px rgba(0, 0, 0, 0.95),
            0 0 45px rgba(255, 140, 56, 0.45),
            inset 0 0 0 1px rgba(255, 140, 56, 0.3);
        }

        .karya-slider-title {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 88%;
          max-width: 1200px;
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
          font-size: clamp(2.4rem, 8vw, 5rem);
          font-weight: 700;
          letter-spacing: -0.02em;
          background: linear-gradient(135deg, #ffffff 0%, #ffedd5 60%, #ff8c38 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          text-shadow: 0 10px 30px rgba(0, 0, 0, 0.6);
          line-height: 1.15;
          margin: 0;
        }

        .karya-slider-counter {
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          bottom: 2.2rem;
          z-index: 35;
          background: rgba(15, 23, 42, 0.7);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          padding: 0.45rem 1.4rem;
          border-radius: 40px;
          border: 1px solid rgba(255, 255, 255, 0.15);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5), inset 0 1px 1px rgba(255, 255, 255, 0.2);
        }
        .karya-slider-counter p {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.85rem;
          font-weight: 600;
          color: #94a3b8;
          margin: 0;
          letter-spacing: 0.05em;
        }
        .karya-slider-counter p span:first-child {
          color: #ffffff;
          font-weight: 700;
          font-size: 0.95rem;
        }

        .karya-slider-preview {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 0;
          opacity: 0.22;
          overflow: hidden;
          filter: blur(8px) brightness(0.5) saturate(1.2);
          pointer-events: none;
        }
        .karya-slider-preview img {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          animation: karyaSlowScale 30s infinite alternate ease-in-out;
        }
        @keyframes karyaSlowScale {
          0% { transform: scale(1) translateX(0%); }
          100% { transform: scale(1.18) translateX(1.5%); }
        }

        .karya-ambient-glow {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 50%;
          background: linear-gradient(to top, #030308 0%, rgba(3, 3, 8, 0.4) 60%, transparent);
          pointer-events: none;
          z-index: 1;
        }

        .karya-slide-caption {
          position: absolute;
          bottom: 2.2rem;
          left: 2.5rem;
          z-index: 35;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          background: rgba(15, 23, 42, 0.7);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          padding: 0.45rem 1.3rem;
          border-radius: 40px;
          border: 1px solid rgba(255, 255, 255, 0.15);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5), inset 0 1px 1px rgba(255, 255, 255, 0.2);
          pointer-events: none;
          opacity: 0;
          transform: translateY(14px);
          transition: opacity 0.45s cubic-bezier(0.16, 1, 0.3, 1), transform 0.45s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .karya-slide-caption.karya-show {
          opacity: 1;
          transform: translateY(0);
        }
        .karya-cat-badge {
          font-size: 0.68rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #ff8c38;
          padding: 0.15rem 0.5rem;
          border-radius: 12px;
          background: rgba(255, 140, 56, 0.15);
          border: 1px solid rgba(255, 140, 56, 0.35);
        }
        .karya-slide-name {
          font-size: 0.85rem;
          font-weight: 600;
          color: #ffffff;
          letter-spacing: 0.02em;
        }
        .karya-caption-arrow {
          display: flex;
          align-items: center;
          color: #ffb07c;
        }

        .karya-nav-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 50px;
          height: 50px;
          background: rgba(15, 23, 42, 0.65);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          cursor: pointer;
          z-index: 40;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          border: 1px solid rgba(255, 255, 255, 0.15);
          box-shadow: 0 6px 24px rgba(0, 0, 0, 0.4), inset 0 1px 1px rgba(255, 255, 255, 0.2);
        }
        .karya-nav-arrow:hover {
          background: rgba(255, 140, 56, 0.88);
          border-color: rgba(255, 255, 255, 0.4);
          color: #ffffff;
          transform: translateY(-50%) scale(1.1);
          box-shadow: 0 0 25px rgba(255, 140, 56, 0.55);
        }
        .karya-prev-arrow { left: 2.5rem; }
        .karya-next-arrow { right: 2.5rem; }

        .karya-footer {
          position: absolute;
          right: 2.5rem;
          bottom: 2.2rem;
          z-index: 35;
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.72rem;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.45);
          pointer-events: none;
          letter-spacing: 0.03em;
        }
        .karya-footer span.icon {
          color: #ff8c38;
        }

        /* MEDIA QUERY UNTUK MOBILE & TABLET (LEBAR ≤ 1024px) */
        @media (max-width: 1024px) {
          .karya-slider {
            height: 100vh;
          }
          .karya-header-badge {
            top: 2rem;
            font-size: 0.65rem;
            padding: 0.35rem 0.9rem;
          }
          .karya-slide-container {
            width: 84%;
            height: 56%;
            border-radius: 24px;
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
            font-size: clamp(1.8rem, 7vw, 3rem);
          }
          .karya-nav-arrow {
            width: 42px;
            height: 42px;
          }
          .karya-prev-arrow { left: 1rem; }
          .karya-next-arrow { right: 1rem; }
          .karya-slider-preview {
            opacity: 0.3;
            filter: blur(6px) brightness(0.5);
          }
          .karya-slide-caption {
            bottom: 1.5rem;
            left: 1rem;
            font-size: 0.75rem;
            padding: 0.35rem 0.9rem;
            max-width: 60%;
          }
          .karya-slider-counter {
            bottom: 1.5rem;
            padding: 0.35rem 1rem;
            font-size: 0.8rem;
          }
          .karya-footer {
            right: 1rem;
            bottom: 1.5rem;
            font-size: 0.65rem;
            display: none;
          }
        }
      `}</style>

      <div
        ref={sliderRef}
        id="project"
        className="karya-slider"
        style={{ marginTop: '-40vh', position: 'relative', zIndex: 20, isolation: 'isolate' }}
      >
        <div className="karya-header-badge">
          <span className="sparkle">✦</span>
          <span>PORTFOLIO SHOWCASE</span>
        </div>

        <div ref={titleDivRef} className="karya-slider-title">
          <h1></h1>
        </div>

        <div className="karya-slider-counter">
          <p>
            <span ref={counterSpanRef}>01</span>
            <span style={{ opacity: 0.4 }}>/</span>
            <span ref={totalSpanRef}>09</span>
          </p>
        </div>

        <div ref={previewDivRef} className="karya-slider-preview"></div>
        <div className="karya-ambient-glow"></div>
        <div ref={captionDivRef} className="karya-slide-caption"></div>

        <div ref={prevArrowRef} className="karya-nav-arrow karya-prev-arrow" aria-label="Previous Slide">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </div>

        <div ref={nextArrowRef} className="karya-nav-arrow karya-next-arrow" aria-label="Next Slide">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </div>

        <footer className="karya-footer">
          <span className="icon">✦</span>
          <span>Click active card to view live project</span>
        </footer>
      </div>
    </>
  );
}