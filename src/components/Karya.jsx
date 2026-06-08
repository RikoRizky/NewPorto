import { useEffect } from 'react';
import WhatIDoIcon from '/img/whatido.svg';

const Karya = () => {
  // ==================== ANIMASI WHAT I DO (tidak berubah) ====================
  useEffect(() => {
    const loadGSAPAndScrollTrigger = () => {
      if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        initWhatIDoAnimations();
        return;
      }
      const gsapScript = document.createElement('script');
      gsapScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js';
      gsapScript.onload = () => {
        const stScript = document.createElement('script');
        stScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js';
        stScript.onload = () => {
          gsap.registerPlugin(ScrollTrigger);
          initWhatIDoAnimations();
        };
        document.body.appendChild(stScript);
      };
      document.body.appendChild(gsapScript);
    };

    const initWhatIDoAnimations = () => {
      ScrollTrigger.create({
        trigger: '.services',
        start: 'top bottom',
        end: 'top top',
        scrub: 1,
        onUpdate: self => {
          const headers = document.querySelectorAll('.services-header');
          if (headers.length >= 3) {
            gsap.set(headers[0], { x: `${100 - self.progress * 100}%` });
            gsap.set(headers[1], { x: `${-100 + self.progress * 100}%` });
            gsap.set(headers[2], { x: `${100 - self.progress * 100}%` });
          }
        },
      });

      ScrollTrigger.create({
        trigger: '.services',
        start: 'top top',
        end: `+=${window.innerHeight * 2}`,
        pin: true,
        scrub: 1,
        pinSpacing: false,
        onUpdate: self => {
          const headers = document.querySelectorAll('.services-header');
          if (headers.length < 3) return;
          if (self.progress <= 0.5) {
            const yProgress = self.progress / 0.5;
            gsap.set(headers[0], { y: `${yProgress * 100}%` });
            gsap.set(headers[2], { y: `${yProgress * -100}%` });
          } else {
            gsap.set(headers[0], { y: '100%' });
            gsap.set(headers[2], { y: '-100%' });
            const scaleProgress = (self.progress - 0.5) / 0.5;
            const minScale = window.innerWidth <= 1000 ? 0.3 : 0.1;
            const scale = 1 - scaleProgress * (1 - minScale);
            headers.forEach(header => gsap.set(header, { scale }));
          }
        },
      });
    };

    loadGSAPAndScrollTrigger();
  }, []);

  // ==================== SLIDER DENGAN PERBAIKAN PREVIEW ====================
  useEffect(() => {
    const SLIDE_DATA = [
      { name: "BYD SEAL",         img: "img/byd.jpg",          link: "https://bydcirebon.id/" },
      { name: "Mariposas Tour",   img: "img/mariposas.png",    link: "https://tourmariposas.vercel.app" },
      { name: "Cafe",             img: "img/landing.png",      link: "https://rikorizky.github.io/mycafe.github.io/" },
      { name: "Aplikasi Pembelian", img: "img/tokoreact.png",   link: "https://penjualan-barang-sable.vercel.app/" },
      { name: "Happy Birthday",   img: "img/ultah.png",        link: "https://rikorizky.github.io/dibuka.github.oi/" },
      { name: "Happy Birthday pt2",  img: "img/ultah2.png",    link: "https://rikorizky.github.io/hbd.github.io/" },
      { name: "SISTA BIJAK",      img: "img/sistabijak.png",   link: "https://github.com/MuhammadRaffaFadellah/sista-bijak" }
    ];
    const TOTAL = SLIDE_DATA.length;

    // Preload semua gambar
    SLIDE_DATA.forEach(item => {
      const img = new Image();
      img.src = item.img;
    });

    const initSlider = () => {
      const slider = document.querySelector('.slider');
      if (!slider) return;

      if (typeof gsap === 'undefined' || typeof CustomEase === 'undefined') {
        console.warn('GSAP or CustomEase not ready');
        return;
      }

      gsap.registerPlugin(CustomEase);
      CustomEase.create("smoothSlide", "M0,0 C0.25,0.1 0.25,0.9 1,1");

      const titleDiv = slider.querySelector('.slider-title');
      const counterSpan = slider.querySelector('.slider-counter p span:first-child');
      const totalSpan = slider.querySelector('.slider-counter p span:last-child');
      const previewDiv = slider.querySelector('.slider-preview');
      const captionDiv = slider.querySelector('.slide-caption');
      if (totalSpan) totalSpan.innerText = TOTAL;

      let activeIdx = 0;
      let isAnimating = false;
      let isMobile = window.innerWidth <= 760;
      let autoInterval = null;
      let titleTimer = null;

      const getSlideData = (idx) => SLIDE_DATA[(idx + TOTAL) % TOTAL];
      const updateCounter = () => {
        if (counterSpan) counterSpan.innerText = activeIdx + 1;
      };

      const animateTitleToCaption = (slideName) => {
        if (titleTimer) clearTimeout(titleTimer);
        gsap.killTweensOf(titleDiv);
        const h1 = titleDiv.querySelector('h1');
        h1.innerText = slideName;
        if (isMobile) h1.style.whiteSpace = 'normal';
        else h1.style.whiteSpace = 'nowrap';

        titleDiv.classList.add('visible');
        gsap.set(titleDiv, { opacity: 1, visibility: 'visible', scale: 1 });
        gsap.fromTo(titleDiv,
          { scale: 0.8, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(0.6)" }
        );

        titleTimer = setTimeout(() => {
          gsap.to(titleDiv, {
            y: window.innerHeight * 0.3,
            scale: 0.6,
            opacity: 0,
            duration: 0.8,
            ease: "power2.in",
            onComplete: () => {
              titleDiv.classList.remove('visible');
              gsap.set(titleDiv, { clearProps: "all" });
              captionDiv.innerText = slideName;
              captionDiv.classList.remove('show');
              void captionDiv.offsetWidth;
              captionDiv.classList.add('show');
            }
          });
          titleTimer = null;
        }, 1000);
      };

      // ========== UPDATE PREVIEW DENGAN EFEK FADE (PERBAIKAN) ==========
      const updatePreview = (content) => {
        if (!previewDiv) return;
        const oldImg = previewDiv.querySelector('img');
        const newImg = document.createElement('img');
        newImg.src = content.img;
        newImg.alt = content.name;
        newImg.style.opacity = '0';
        previewDiv.appendChild(newImg);
        
        if (oldImg) {
          gsap.to(oldImg, { opacity: 0, duration: 0.3, onComplete: () => oldImg.remove() });
        }
        gsap.to(newImg, { opacity: 1, duration: 0.4, delay: 0.1 });
      };

      // Membuat elemen slide
      const createSlideElement = (content, positionClass) => {
        const div = document.createElement('div');
        div.className = `slide-container ${positionClass}`;
        div.innerHTML = `<div class="slide-img"><img src="${content.img}" alt="${content.name}"></div>`;
        return div;
      };

      // Inisialisasi 3 slide pertama
      const initSlides = () => {
        slider.querySelectorAll('.slide-container').forEach(s => s.remove());
        const prevIdx = (activeIdx - 1 + TOTAL) % TOTAL;
        const nextIdx = (activeIdx + 1) % TOTAL;
        slider.append(
          createSlideElement(getSlideData(prevIdx), 'prev'),
          createSlideElement(getSlideData(activeIdx), 'active'),
          createSlideElement(getSlideData(nextIdx), 'next')
        );
        gsap.set('.slide-container.prev', { left: '15%', scale: 0.92, clipPath: 'polygon(20% 30%, 80% 30%, 80% 70%, 20% 70%)' });
        gsap.set('.slide-container.active', { left: '50%', scale: 1, clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)' });
        gsap.set('.slide-container.next', { left: '85%', scale: 0.92, clipPath: 'polygon(20% 30%, 80% 30%, 80% 70%, 20% 70%)' });
      };

      // ========== TRANSISI DESKTOP (DIPERBAIKI) ==========
      const transitionTo = (direction) => {
        if (isAnimating) return;
        isAnimating = true;
        if (autoInterval) {
          clearInterval(autoInterval);
          startAutoSlide();
        }

        const currentPrev = slider.querySelector('.slide-container.prev');
        const currentActive = slider.querySelector('.slide-container.active');
        const currentNext = slider.querySelector('.slide-container.next');
        if (!currentPrev || !currentActive || !currentNext) return;

        let newActiveIdx, newPrevIdx, newNextIdx;
        if (direction === 'next') {
          newActiveIdx = (activeIdx + 1) % TOTAL;
          newPrevIdx = activeIdx;
          newNextIdx = (activeIdx + 2) % TOTAL;
        } else {
          newActiveIdx = (activeIdx - 1 + TOTAL) % TOTAL;
          newPrevIdx = (activeIdx - 2 + TOTAL) % TOTAL;
          newNextIdx = activeIdx;
        }

        // PERBAIKAN: Update preview SEBELUM animasi dimulai
        const newSlideData = getSlideData(newActiveIdx);
        updatePreview(newSlideData);
        animateTitleToCaption(newSlideData.name); // judul juga bisa langsung diperbarui

        const newPrevSlide = createSlideElement(getSlideData(newPrevIdx), 'temp-prev');
        const newActiveSlide = createSlideElement(getSlideData(newActiveIdx), 'temp-active');
        const newNextSlide = createSlideElement(getSlideData(newNextIdx), 'temp-next');

        gsap.set([newPrevSlide, newActiveSlide, newNextSlide], { opacity: 0 });
        slider.append(newPrevSlide, newActiveSlide, newNextSlide);

        if (direction === 'next') {
          gsap.set(newPrevSlide, { left: '85%', scale: 0.92, clipPath: 'polygon(20% 30%, 80% 30%, 80% 70%, 20% 70%)', opacity: 0 });
          gsap.set(newActiveSlide, { left: '85%', scale: 0.92, clipPath: 'polygon(20% 30%, 80% 30%, 80% 70%, 20% 70%)', opacity: 0 });
          gsap.set(newNextSlide, { left: '130%', scale: 0.92, clipPath: 'polygon(20% 30%, 80% 30%, 80% 70%, 20% 70%)', opacity: 0 });

          const tl = gsap.timeline({
            onComplete: () => {
              currentPrev.remove();
              currentActive.remove();
              currentNext.remove();
              newPrevSlide.className = 'slide-container prev';
              newActiveSlide.className = 'slide-container active';
              newNextSlide.className = 'slide-container next';
              gsap.set('.slide-container.prev', { left: '15%', scale: 0.92, clipPath: 'polygon(20% 30%, 80% 30%, 80% 70%, 20% 70%)' });
              gsap.set('.slide-container.active', { left: '50%', scale: 1, clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)' });
              gsap.set('.slide-container.next', { left: '85%', scale: 0.92, clipPath: 'polygon(20% 30%, 80% 30%, 80% 70%, 20% 70%)' });
              activeIdx = newActiveIdx;
              updateCounter();
              isAnimating = false;
            }
          });
          tl.to(currentPrev, { left: '-30%', opacity: 0, duration: 0.8, ease: "smoothSlide" }, 0);
          tl.to(currentActive, { left: '15%', scale: 0.92, clipPath: 'polygon(20% 30%, 80% 30%, 80% 70%, 20% 70%)', duration: 0.8, ease: "smoothSlide" }, 0);
          tl.to(currentNext, { left: '50%', scale: 1, clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)', duration: 0.8, ease: "smoothSlide" }, 0);
          tl.fromTo(newPrevSlide, { opacity: 0 }, { left: '15%', opacity: 1, duration: 0.8, ease: "smoothSlide" }, 0);
          tl.fromTo(newActiveSlide, { opacity: 0 }, { left: '50%', opacity: 1, scale: 1, clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)', duration: 0.8, ease: "smoothSlide" }, 0);
          tl.fromTo(newNextSlide, { opacity: 0 }, { left: '85%', opacity: 1, duration: 0.8, ease: "smoothSlide" }, 0);
        } 
        else { // prev
          gsap.set(newPrevSlide, { left: '-30%', scale: 0.92, clipPath: 'polygon(20% 30%, 80% 30%, 80% 70%, 20% 70%)', opacity: 0 });
          gsap.set(newActiveSlide, { left: '15%', scale: 0.92, clipPath: 'polygon(20% 30%, 80% 30%, 80% 70%, 20% 70%)', opacity: 0 });
          gsap.set(newNextSlide, { left: '15%', scale: 0.92, clipPath: 'polygon(20% 30%, 80% 30%, 80% 70%, 20% 70%)', opacity: 0 });

          const tl = gsap.timeline({
            onComplete: () => {
              currentPrev.remove();
              currentActive.remove();
              currentNext.remove();
              newPrevSlide.className = 'slide-container prev';
              newActiveSlide.className = 'slide-container active';
              newNextSlide.className = 'slide-container next';
              gsap.set('.slide-container.prev', { left: '15%', scale: 0.92, clipPath: 'polygon(20% 30%, 80% 30%, 80% 70%, 20% 70%)' });
              gsap.set('.slide-container.active', { left: '50%', scale: 1, clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)' });
              gsap.set('.slide-container.next', { left: '85%', scale: 0.92, clipPath: 'polygon(20% 30%, 80% 30%, 80% 70%, 20% 70%)' });
              activeIdx = newActiveIdx;
              updateCounter();
              isAnimating = false;
            }
          });
          tl.to(currentNext, { left: '130%', opacity: 0, duration: 0.8, ease: "smoothSlide" }, 0);
          tl.to(currentActive, { left: '85%', scale: 0.92, clipPath: 'polygon(20% 30%, 80% 30%, 80% 70%, 20% 70%)', duration: 0.8, ease: "smoothSlide" }, 0);
          tl.to(currentPrev, { left: '50%', scale: 1, clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)', duration: 0.8, ease: "smoothSlide" }, 0);
          tl.fromTo(newPrevSlide, { opacity: 0 }, { left: '15%', opacity: 1, duration: 0.8, ease: "smoothSlide" }, 0);
          tl.fromTo(newActiveSlide, { opacity: 0 }, { left: '50%', opacity: 1, scale: 1, clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)', duration: 0.8, ease: "smoothSlide" }, 0);
          tl.fromTo(newNextSlide, { opacity: 0 }, { left: '85%', opacity: 1, duration: 0.8, ease: "smoothSlide" }, 0);
        }
      };

      // ========== TRANSISI MOBILE (DIPERBAIKI) ==========
      const transitionMobile = (direction) => {
        if (isAnimating) return;
        isAnimating = true;
        if (autoInterval) {
          clearInterval(autoInterval);
          startAutoSlide();
        }
        const newIdx = (direction === 'next') ? (activeIdx + 1) % TOTAL : (activeIdx - 1 + TOTAL) % TOTAL;
        const newContent = getSlideData(newIdx);
        
        // PERBAIKAN: update preview dan judul langsung
        updatePreview(newContent);
        animateTitleToCaption(newContent.name);
        
        const activeSlide = slider.querySelector('.slide-container.active');
        const imgElement = activeSlide.querySelector('.slide-img img');
        const tl = gsap.timeline({
          onComplete: () => {
            activeIdx = newIdx;
            updateCounter();
            isAnimating = false;
          }
        });
        tl.to(imgElement, { opacity: 0, duration: 0.2 })
          .call(() => { imgElement.src = newContent.img; imgElement.alt = newContent.name; })
          .to(imgElement, { opacity: 1, duration: 0.3 });
      };

      const transition = (direction) => {
        if (isAnimating) return;
        if (isMobile) transitionMobile(direction);
        else transitionTo(direction);
      };

      const redirectActiveSlide = () => {
        if (isAnimating) return;
        const data = getSlideData(activeIdx);
        if (data?.link && data.link !== '#') window.open(data.link, '_blank');
        if (autoInterval) {
          clearInterval(autoInterval);
          startAutoSlide();
        }
      };

      const startAutoSlide = () => {
        if (autoInterval) clearInterval(autoInterval);
        autoInterval = setInterval(() => {
          if (!isAnimating) transition('next');
        }, 5000);
      };

      const handleResize = () => {
        const newMobile = window.innerWidth <= 760;
        if (newMobile !== isMobile) {
          isMobile = newMobile;
          if (autoInterval) clearInterval(autoInterval);
          initSlides();
          updateCounter();
          animateTitleToCaption(getSlideData(activeIdx).name);
          updatePreview(getSlideData(activeIdx));
          startAutoSlide();
        }
      };

      const onClickSlide = (e) => {
        if (isMobile) return;
        const slide = e.target.closest('.slide-container');
        if (!slide || isAnimating) return;
        if (slide.classList.contains('next')) transition('next');
        else if (slide.classList.contains('prev')) transition('prev');
      };
      const onClickActive = (e) => {
        if (e.target.closest('.slide-container.active')) redirectActiveSlide();
      };

      slider.addEventListener('click', onClickSlide);
      slider.addEventListener('click', onClickActive);
      const prevArrow = slider.querySelector('.prev-arrow');
      const nextArrow = slider.querySelector('.next-arrow');
      if (prevArrow) prevArrow.addEventListener('click', () => transition('prev'));
      if (nextArrow) nextArrow.addEventListener('click', () => transition('next'));
      window.addEventListener('resize', handleResize);

      initSlides();
      updateCounter();
      setTimeout(() => animateTitleToCaption(getSlideData(0).name), 500);
      updatePreview(getSlideData(0));
      startAutoSlide();

      return () => {
        if (autoInterval) clearInterval(autoInterval);
        if (titleTimer) clearTimeout(titleTimer);
        slider.removeEventListener('click', onClickSlide);
        slider.removeEventListener('click', onClickActive);
        if (prevArrow) prevArrow.removeEventListener('click', () => {});
        if (nextArrow) nextArrow.removeEventListener('click', () => {});
        window.removeEventListener('resize', handleResize);
      };
    };

    // Load GSAP & CustomEase
    if (typeof gsap === 'undefined') {
      const gsapScript = document.createElement('script');
      gsapScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js';
      gsapScript.onload = () => {
        const customEaseScript = document.createElement('script');
        customEaseScript.src = 'https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/CustomEase.min.js';
        customEaseScript.onload = () => setTimeout(initSlider, 100);
        document.body.appendChild(customEaseScript);
      };
      document.body.appendChild(gsapScript);
    } else if (typeof CustomEase === 'undefined') {
      const customEaseScript = document.createElement('script');
      customEaseScript.src = 'https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/CustomEase.min.js';
      customEaseScript.onload = () => setTimeout(initSlider, 100);
      document.body.appendChild(customEaseScript);
    } else {
      setTimeout(initSlider, 100);
    }
  }, []);

  return (
    <>
      <section className="services">
        <div className="services-header">
          <img src={WhatIDoIcon} alt="What I Do" />
        </div>
        <div className="services-header">
          <img src={WhatIDoIcon} alt="What I Do" />
        </div>
        <div className="services-header">
          <img src={WhatIDoIcon} alt="What I Do" />
        </div>
      </section>

      <section className="services-copy">
        <div className="slider">
          <div className="slider-title"><h1></h1></div>
          <div className="slider-counter"><p><span>1</span><span>/</span><span>7</span></p></div>
          <div className="slider-preview"></div>
          <div className="ambient-glow"></div>
          <div className="slide-caption"></div>
          <div className="nav-arrow prev-arrow">←</div>
          <div className="nav-arrow next-arrow">→</div>
          <footer>⟡ click active slide to open link · arrows to navigate</footer>
        </div>
      </section>

      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          user-select: none;
          -webkit-tap-highlight-color: transparent;
        }
        body {
          background: radial-gradient(circle at 30% 10%, #0a0a0f, #010101);
          font-family: 'Inter', sans-serif;
          color: #f0f0f0;
        }
        .slider {
          position: relative;
          width: 100vw;
          height: 100vh;
          overflow: hidden;
          touch-action: pan-y pinch-zoom;
        }
        .slide-container {
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
          will-change: transform, left, opacity, clip-path;
          box-shadow: 0 30px 50px -20px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.06);
          transition: box-shadow 0.4s;
          backface-visibility: hidden;
        }
        .slide-container:hover {
          box-shadow: 0 40px 65px -18px rgba(0,0,0,0.9), 0 0 0 1px rgba(255,255,255,0.2);
        }
        .slide-container.active:hover {
          box-shadow: 0 45px 70px -15px rgba(0,0,0,0.85), 0 0 0 2px rgba(255,215,120,0.5);
        }
        .slide-img {
          position: absolute;
          width: 100%;
          height: 100%;
        }
        .slide-img img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transform: scale(1.02);
          transition: transform 0.7s;
          filter: brightness(0.95);
        }
        .slide-container:hover .slide-img img {
          transform: scale(1.1);
          filter: brightness(1.0);
        }
        .slide-container.prev {
          left: 15%;
          transform: translate(-50%, -50%) scale(0.92);
          clip-path: polygon(20% 30%, 80% 30%, 80% 70%, 20% 70%);
        }
        .slide-container.active {
          left: 50%;
          transform: translate(-50%, -50%) scale(1);
          clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%);
        }
        .slide-container.next {
          left: 85%;
          transform: translate(-50%, -50%) scale(0.92);
          clip-path: polygon(20% 30%, 80% 30%, 80% 70%, 20% 70%);
        }
        .slider-title {
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
        .slider-title.visible {
          opacity: 1;
          visibility: visible;
        }
        .slider-title h1 {
          font-size: clamp(2.2rem, 8vw, 4.8rem);
          font-weight: 500;
          letter-spacing: -0.01em;
          color: #ffffff;
          text-shadow: 0 2px 10px rgba(0,0,0,0.4);
          white-space: normal;
          line-height: 1.2;
        }
        .slider-counter {
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          bottom: 2rem;
          z-index: 25;
          background: rgba(0,0,0,0.4);
          backdrop-filter: blur(12px);
          padding: 0.4rem 1.2rem;
          border-radius: 40px;
          border: 0.5px solid rgba(255,255,255,0.1);
        }
        .slider-counter p {
          display: flex;
          gap: 0.4rem;
          justify-content: center;
          font-size: 0.9rem;
          color: #e0e0e0;
        }
        .slider-counter p span:first-child {
          font-weight: 500;
          color: white;
        }
        .slider-preview {
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
        .slider-preview img {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          animation: slowScale 28s infinite alternate ease-in-out;
          transition: opacity 0.4s ease-in-out; /* tambahan untuk fade */
        }
        @keyframes slowScale {
          0% { transform: scale(1); }
          100% { transform: scale(1.2); }
        }
        .ambient-glow {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 45%;
          background: linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.1) 60%, transparent);
          pointer-events: none;
          z-index: 1;
        }
        .slide-caption {
          position: absolute;
          bottom: 2rem;
          left: 2rem;
          z-index: 35;
          background: rgba(0,0,0,0.5);
          backdrop-filter: blur(12px);
          padding: 0.4rem 1.2rem;
          border-radius: 40px;
          border: 0.5px solid rgba(255,255,255,0.15);
          font-size: 0.85rem;
          font-weight: 450;
          letter-spacing: 0.03em;
          text-transform: uppercase;
          color: #ffffff;
          white-space: nowrap;
          pointer-events: none;
          opacity: 0;
          transform: translateY(12px);
          transition: opacity 0.45s ease, transform 0.45s ease;
        }
        .slide-caption.show {
          opacity: 1;
          transform: translateY(0);
        }
        .nav-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 44px;
          height: 44px;
          background: rgba(0,0,0,0.4);
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
        .nav-arrow:hover {
          background: rgba(0,0,0,0.6);
          color: white;
          transform: translateY(-50%) scale(1.05);
        }
        .prev-arrow { left: 1.5rem; }
        .next-arrow { right: 1.5rem; }
        footer {
          position: absolute;
          right: 1.5rem;
          bottom: 1rem;
          z-index: 25;
          font-size: 0.65rem;
          opacity: 0.4;
          color: #ccc;
          pointer-events: none;
        }
        @media (max-width: 760px) {
          .slide-container {
            width: 80%;
            height: 55%;
            border-radius: 28px;
          }
          .slide-container.prev,
          .slide-container.next {
            display: none;
          }
          .slide-container.active {
            left: 50%;
            transform: translate(-50%, -50%) scale(1);
            display: block;
          }
          .slider-title h1 {
            font-size: clamp(1.8rem, 7vw, 2.8rem);
          }
          .nav-arrow {
            width: 36px;
            height: 36px;
            font-size: 1.5rem;
          }
          .prev-arrow { left: 0.8rem; }
          .next-arrow { right: 0.8rem; }
          .slider-preview {
            opacity: 0.4;
            filter: blur(4px) brightness(0.65);
          }
          .slide-caption {
            bottom: 1.2rem;
            left: 1rem;
            font-size: 0.7rem;
            padding: 0.3rem 1rem;
            white-space: normal;
            max-width: 65%;
          }
          .slider-counter {
            bottom: 1.2rem;
            padding: 0.3rem 1rem;
            font-size: 0.8rem;
          }
          footer {
            right: 1rem;
            bottom: 0.8rem;
            font-size: 0.6rem;
            max-width: 65%;
            text-align: right;
          }
        }
      `}</style>
    </>
  );
};

export default Karya;