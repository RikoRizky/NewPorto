import { useEffect } from 'react';

const SliderPage = () => {
  useEffect(() => {
    const SLIDE_DATA = [
      { name: 'BYD SEAL', img: 'img/byd.jpg', link: 'https://bydcirebon.id/' },
      { name: 'Mariposas Tour', img: 'img/mariposas.png', link: 'https://tourmariposas.vercel.app' },
      { name: 'Cafe', img: 'img/landing.png', link: 'https://rikorizky.github.io/mycafe.github.io/' },
      {
        name: 'Aplikasi Pembelian',
        img: 'img/tokoreact.png',
        link: 'https://penjualan-barang-sable.vercel.app/',
      },
      { name: 'Happy Birthday', img: 'img/ultah.png', link: 'https://rikorizky.github.io/dibuka.github.oi/' },
      { name: 'Happy Birthday pt2', img: 'img/ultah2.png', link: 'https://rikorizky.github.io/hbd.github.io/' },
      {
        name: 'SISTA BIJAK',
        img: 'img/sistabijak.png',
        link: 'https://github.com/MuhammadRaffaFadellah/sista-bijak',
      },
    ];

    const TOTAL = SLIDE_DATA.length;

    const init = () => {
      const sliderRoot = document.querySelector('.harmony-slider');
      if (!sliderRoot) return;

      const slider = sliderRoot.querySelector('.slider');
      const titleDiv = sliderRoot.querySelector('.slider-title');
      const counterSpan = sliderRoot.querySelector('.slider-counter p span:first-child');
      const totalSpan = sliderRoot.querySelector('.slider-counter p span:last-child');
      const previewDiv = sliderRoot.querySelector('.slider-preview');
      const captionDiv = sliderRoot.querySelector('.slide-caption');
      const prevArrow = sliderRoot.querySelector('.prev-arrow');
      const nextArrow = sliderRoot.querySelector('.next-arrow');

      if (!slider || !titleDiv || !captionDiv) return;

      if (totalSpan) totalSpan.innerText = TOTAL;

      let activeIdx = 1;
      let isAnimating = false;
      let isMobile = window.innerWidth <= 760;
      let titleAnimationTimer = null;

      // Auto
      let autoSlideInterval = null;
      const AUTO_DELAY = 5000;

      const checkMobile = () => {
        isMobile = window.innerWidth <= 760;
      };

      const startAutoSlide = () => {
        if (autoSlideInterval) clearInterval(autoSlideInterval);
        autoSlideInterval = setInterval(() => {
          if (!isAnimating) transition('next');
        }, AUTO_DELAY);
      };

      const resetAutoSlide = () => {
        if (autoSlideInterval) {
          clearInterval(autoSlideInterval);
          startAutoSlide();
        }
      };

      const clearTitleTimer = () => {
        if (titleAnimationTimer) {
          clearTimeout(titleAnimationTimer);
          titleAnimationTimer = null;
        }
      };

      const updateCounterOnly = (index) => {
        if (counterSpan) counterSpan.innerText = index;
      };

      const animateTitleToCaption = (slideName) => {
        clearTitleTimer();
        gsap.killTweensOf(titleDiv);
        const h1 = titleDiv.querySelector('h1');
        if (!h1) return;
        gsap.killTweensOf(h1);

        h1.innerText = slideName;
        if (isMobile) h1.style.whiteSpace = 'normal';
        else h1.style.whiteSpace = 'nowrap';

        titleDiv.classList.add('visible');
        gsap.set(titleDiv, { opacity: 1, visibility: 'visible', scale: 1, y: 0 });
        gsap.fromTo(
          titleDiv,
          { scale: 0.8, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(0.6)' }
        );

        titleAnimationTimer = setTimeout(() => {
          gsap.to(titleDiv, {
            y: window.innerHeight * 0.3,
            scale: 0.6,
            opacity: 0,
            duration: 0.8,
            ease: 'power2.in',
            onComplete: () => {
              titleDiv.classList.remove('visible');
              gsap.set(titleDiv, { clearProps: 'all' });
              captionDiv.innerText = slideName;
              gsap.killTweensOf(captionDiv);
              captionDiv.classList.remove('show');
              void captionDiv.offsetWidth;
              captionDiv.classList.add('show');
            },
          });
          titleAnimationTimer = null;
        }, 1000);
      };

      const updatePreview = (content) => {
        if (!previewDiv) return;
        const newImg = document.createElement('img');
        newImg.src = content.img;
        newImg.alt = content.name;
        previewDiv.appendChild(newImg);
        gsap.fromTo(
          newImg,
          { opacity: 0, scale: 1.03 },
          {
            opacity: 1,
            scale: 1,
            duration: 1.2,
            ease: 'power2.out',
            delay: 0.5,
            onComplete: () => {
              const old = previewDiv.querySelector('img:not(:last-child)');
              if (old) old.remove();
            },
          }
        );
      };

      const createSlide = (content, className) => {
        const div = document.createElement('div');
        div.className = `slide-container ${className}`;
        div.innerHTML = `<div class="slide-img"><img src="${content.img}" alt="${content.name}" loading="eager"></div>`;
        return div;
      };

      const getIndex = (offset) => {
        let newIdx = activeIdx + offset;
        while (newIdx < 1) newIdx += TOTAL;
        while (newIdx > TOTAL) newIdx -= TOTAL;
        return newIdx;
      };

      const transitionDesktop = (direction) => {
        if (isAnimating) return;
        isAnimating = true;
        resetAutoSlide();

        const outPos = direction === 'next' ? 'prev' : 'next';
        const inPos = direction === 'next' ? 'next' : 'prev';

        let outSlide = slider.querySelector(`.slide-container.${outPos}`);
        const activeSlide = slider.querySelector('.slide-container.active');
        let inSlide = slider.querySelector(`.slide-container.${inPos}`);

        if (!inSlide) {
          const inIdx = getIndex(direction === 'next' ? 1 : -1);
          inSlide = createSlide(SLIDE_DATA[inIdx - 1], inPos);
          slider.appendChild(inSlide);
          const startLeft = inPos === 'prev' ? '15%' : '85%';
          gsap.set(inSlide, {
            left: startLeft,
            scale: 0.92,
            clipPath: 'polygon(20% 30%, 80% 30%, 80% 70%, 20% 70%)',
          });
        }
        if (!outSlide) {
          const outIdx = getIndex(direction === 'next' ? -1 : 1);
          outSlide = createSlide(SLIDE_DATA[outIdx - 1], outPos);
          slider.appendChild(outSlide);
          const startLeft = outPos === 'prev' ? '15%' : '85%';
          gsap.set(outSlide, {
            left: startLeft,
            scale: 0.92,
            clipPath: 'polygon(20% 30%, 80% 30%, 80% 70%, 20% 70%)',
          });
        }

        gsap.to(inSlide, {
          left: '50%',
          scale: 1,
          clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
          duration: 1.6,
          ease: 'hop',
        });
        gsap.to(activeSlide, {
          left: outPos === 'prev' ? '15%' : '85%',
          scale: 0.92,
          clipPath: 'polygon(20% 30%, 80% 30%, 80% 70%, 20% 70%)',
          duration: 1.6,
          ease: 'hop',
        });
        gsap.to(outSlide, {
          scale: 0,
          opacity: 0,
          duration: 1.4,
          ease: 'hop',
        });

        const nextActiveIdx = getIndex(direction === 'next' ? 1 : -1);
        const farIdx = getIndex(direction === 'next' ? 2 : -2);
        const newSlide = createSlide(SLIDE_DATA[farIdx - 1], inPos);
        slider.appendChild(newSlide);
        const newStartLeft = inPos === 'prev' ? '15%' : '85%';
        gsap.set(newSlide, {
          left: newStartLeft,
          scale: 0.92,
          opacity: 0,
          clipPath: 'polygon(20% 30%, 80% 30%, 80% 70%, 20% 70%)',
        });
        gsap.to(newSlide, {
          scale: 0.92,
          opacity: 1,
          duration: 1.6,
          ease: 'hop',
          delay: 0.1,
        });

        setTimeout(() => {
          if (outSlide && outSlide.parentNode) outSlide.remove();
          activeSlide.className = `slide-container ${outPos}`;
          inSlide.className = 'slide-container active';
          newSlide.className = `slide-container ${inPos}`;

          gsap.set('.slide-container.prev', {
            left: '15%',
            scale: 0.92,
            clipPath: 'polygon(20% 30%, 80% 30%, 80% 70%, 20% 70%)',
          });
          gsap.set('.slide-container.active', {
            left: '50%',
            scale: 1,
            clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
          });
          gsap.set('.slide-container.next', {
            left: '85%',
            scale: 0.92,
            clipPath: 'polygon(20% 30%, 80% 30%, 80% 70%, 20% 70%)',
          });

          activeIdx = nextActiveIdx;
          isAnimating = false;
          updateCounterOnly(activeIdx);
          animateTitleToCaption(SLIDE_DATA[activeIdx - 1].name);
          updatePreview(SLIDE_DATA[activeIdx - 1]);
        }, 1800);
      };

      const transitionMobile = (direction) => {
        if (isAnimating) return;
        isAnimating = true;
        resetAutoSlide();

        const newIdx = getIndex(direction === 'next' ? 1 : -1);
        const newContent = SLIDE_DATA[newIdx - 1];
        const activeSlide = slider.querySelector('.slide-container.active');
        const imgElement = activeSlide.querySelector('.slide-img img');
        const currentSrc = imgElement.src;
        const newSrc = newContent.img;

        if (currentSrc === newSrc) {
          isAnimating = false;
          return;
        }

        gsap
          .timeline({
            onComplete: () => {
              activeIdx = newIdx;
              isAnimating = false;
              updateCounterOnly(activeIdx);
              updatePreview(newContent);
              animateTitleToCaption(newContent.name);
            },
          })
          .to(imgElement, { opacity: 0, duration: 0.2, ease: 'power2.out' })
          .call(() => {
            imgElement.src = newSrc;
          })
          .to(imgElement, { opacity: 1, duration: 0.3, ease: 'power2.in' });
      };

      const transition = (direction) => {
        if (isAnimating) return;
        if (isMobile) transitionMobile(direction);
        else transitionDesktop(direction);
      };

      const redirectActiveSlide = () => {
        if (isAnimating) return;
        const currentData = SLIDE_DATA[activeIdx - 1];
        if (currentData && currentData.link && currentData.link !== '#') {
          window.open(currentData.link, '_blank');
        }
        resetAutoSlide();
      };

      const initSlides = () => {
        const old = slider.querySelectorAll('.slide-container');
        old.forEach((s) => s.remove());

        if (!isMobile) {
          const prevIdx = getIndex(-1);
          const nextIdx = getIndex(1);
          slider.append(
            createSlide(SLIDE_DATA[prevIdx - 1], 'prev'),
            createSlide(SLIDE_DATA[activeIdx - 1], 'active'),
            createSlide(SLIDE_DATA[nextIdx - 1], 'next')
          );

          gsap.set('.slide-container.prev', {
            left: '15%',
            scale: 0.92,
            clipPath: 'polygon(20% 30%, 80% 30%, 80% 70%, 20% 70%)',
          });
          gsap.set('.slide-container.active', {
            left: '50%',
            scale: 1,
            clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
          });
          gsap.set('.slide-container.next', {
            left: '85%',
            scale: 0.92,
            clipPath: 'polygon(20% 30%, 80% 30%, 80% 70%, 20% 70%)',
          });
        } else {
          slider.appendChild(createSlide(SLIDE_DATA[activeIdx - 1], 'active'));
          gsap.set('.slide-container.active', {
            left: '50%',
            scale: 1,
            clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
          });
        }

        const h1 = titleDiv.querySelector('h1');
        if (h1) h1.innerText = '';
        titleDiv.classList.remove('visible');
        captionDiv.innerText = '';
        captionDiv.classList.remove('show');

        setTimeout(() => {
          animateTitleToCaption(SLIDE_DATA[0].name);
        }, 500);

        if (previewDiv) previewDiv.innerHTML = '';
        updatePreview(SLIDE_DATA[0]);
        updateCounterOnly(1);
      };

      const bindEvents = () => {
        slider.addEventListener('click', (e) => {
          if (isMobile) return;
          const slide = e.target.closest('.slide-container');
          if (!slide || isAnimating) return;
          if (slide.classList.contains('next')) transition('next');
          else if (slide.classList.contains('prev')) transition('prev');
        });

        slider.addEventListener('click', (e) => {
          const activeClicked = e.target.closest('.slide-container.active');
          if (!activeClicked) return;
          if (isAnimating) return;
          redirectActiveSlide();
        });

        if (prevArrow) prevArrow.addEventListener('click', () => !isAnimating && transition('prev'));
        if (nextArrow) nextArrow.addEventListener('click', () => !isAnimating && transition('next'));

        window.addEventListener('resize', () => {
          const wasMobile = isMobile;
          checkMobile();
          if (wasMobile !== isMobile) location.reload();
        });
      };

      gsap.registerPlugin(CustomEase);
      CustomEase.create(
        'hop',
        'M0,0 C0.488,0.02 0.467,0.286 0.5,0.5 0.532,0.712 0.58,1 1,1'
      );

      initSlides();
      bindEvents();
      startAutoSlide();
    };

    const w = window;
    const ensureScripts = () => {
      return new Promise((resolve) => {
        if (typeof w.gsap === 'undefined') {
          const s = document.createElement('script');
          s.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js';
          s.onload = () => resolve(ensureScripts());
          document.body.appendChild(s);
          return;
        }
        if (typeof w.CustomEase === 'undefined') {
          const s = document.createElement('script');
          s.src = 'https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/CustomEase.min.js';
          s.onload = () => resolve(ensureScripts());
          document.body.appendChild(s);
          return;
        }
        resolve();
      });
    };

    ensureScripts().then(init);

    return () => {
      // nothing
    };
  }, []);

  return (
    <div className="harmony-slider">
      <div className="slider">
        <div className="slider-title">
          <h1></h1>
        </div>
        <div className="slider-counter">
          <p>
            <span>1</span>
            <span>/</span>
            <span>7</span>
          </p>
        </div>
        <div className="slider-preview"></div>
        <div className="ambient-glow"></div>
        <div className="slide-caption"></div>
        <div className="nav-arrow prev-arrow">←</div>
        <div className="nav-arrow next-arrow">→</div>
      </div>
      <footer>⟡ click active slide to open link · arrows to navigate</footer>

      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          user-select: none;
          -webkit-tap-highlight-color: transparent;
        }

        body {
          width: 100%;
          min-height: 100vh;
          background: radial-gradient(circle at 30% 10%, #0a0a0f, #010101);
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          overflow-x: hidden;
          color: #f0f0f0;
          position: relative;
          font-weight: 400;
          line-height: 1.5;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        @media (max-width: 760px) {
          body { background: #000; }
        }

        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #1a1a1e; }
        ::-webkit-scrollbar-thumb { background: #4a4a5a; border-radius: 8px; }

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
          will-change: transform, opacity, clip-path;
          box-shadow: 0 30px 50px -20px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.06);
          transition: box-shadow 0.4s cubic-bezier(0.2, 0.9, 0.4, 1.1);
          backface-visibility: hidden;
        }

        .slide-container:hover {
          box-shadow: 0 40px 65px -18px rgba(0, 0, 0, 0.9), 0 0 0 1px rgba(255, 255, 255, 0.2);
        }

        .slide-container.active {
          cursor: pointer;
        }

        .slide-container.active:hover {
          box-shadow: 0 45px 70px -15px rgba(0, 0, 0, 0.85), 0 0 0 2px rgba(255, 215, 120, 0.5);
        }

        .slide-img {
          position: absolute;
          width: 100%;
          height: 100%;
          will-change: transform;
        }

        .slide-img img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transform: scale(1.02);
          transition: transform 0.7s cubic-bezier(0.2, 0.9, 0.4, 1.2);
          filter: brightness(0.95) contrast(1.02);
        }

        .slide-container:hover .slide-img img {
          transform: scale(1.1);
          filter: brightness(1.0) contrast(1.05);
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
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.4);
          white-space: normal;
          line-height: 1.2;
        }

        .slider-counter {
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
          font-weight: 400;
        }

        .slider-counter p {
          display: flex;
          gap: 0.4rem;
          justify-content: center;
          font-size: 0.9rem;
          letter-spacing: 0;
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
        }

        @keyframes slowScale {
          0% { transform: scale(1) translateX(0%); }
          100% { transform: scale(1.2) translateX(1.5%); }
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

        .nav-arrow:hover {
          background: rgba(0, 0, 0, 0.6);
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
          background: none;
          padding: 0;
          pointer-events: none;
          font-weight: 400;
          letter-spacing: 0;
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
            font-weight: 500;
            text-shadow: 0 1px 8px rgba(0,0,0,0.5);
          }
          .nav-arrow {
            width: 36px;
            height: 36px;
            font-size: 1.5rem;
          }
          .prev-arrow { left: 0.8rem; }
          .next-arrow { right: 0.8rem; }

          .slider-preview {
            display: block;
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
            opacity: 0.4;
            max-width: 65%;
            text-align: right;
          }
        }
      `}</style>
    </div>
  );
};

export default SliderPage;

