import gsap from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { useCallback, useLayoutEffect, useRef, useState } from 'react';
import './Navbar.css';

gsap.registerPlugin(ScrollToPlugin);

const MENU_DURATION = 0.75;
const MENU_EASE = 'power4.inOut';

const NAV_LINKS = [
  { label: 'Home', href: '#beranda' },
  { label: 'About', href: '#biodata' },
  { label: 'Experience', href: '#experience' },
  { label: 'Projects', href: '#project' },
  { label: 'Feedback', href: '#feedback' },
  { label: 'Contact', href: '#contact' },
];

const FEATURED_PROJECTS = [
  {
    title: 'BYD SEAL',
    desc: 'Automotive landing page',
    image: '/img/byd.jpg',
    href: '#project',
  },
  {
    title: 'Mariposas Tour',
    desc: 'Travel agency website',
    image: '/img/mariposas.png',
    href: '#project',
  },
  {
    title: 'Cafe Website',
    desc: 'Interactive cafe menu',
    image: '/img/landing.png',
    href: '#project',
  },
];

const SKILLS = ['React', 'JavaScript', 'GSAP', 'Tailwind CSS', 'HTML & CSS', 'Git & GitHub'];

const EXPERIENCE = [
  { title: 'Sertifikat BNSP', desc: 'Teknologi Informasi · 2025' },
  { title: 'PKL BPS Cirebon', desc: 'Digitalisasi data · 2024' },
  { title: 'UKK RPL', desc: 'Rekayasa Perangkat Lunak · 2024' },
];

function showNav(shell) {
  if (!shell) return;
  shell.classList.remove('nav-hidden');
  shell.classList.add('nav-visible');
}

function isOverlayVisible(overlay) {
  if (!overlay) return false;
  return overlay.style.display === 'block' || overlay.classList.contains('is-open');
}

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const shellRef = useRef(null);
  const navRef = useRef(null);
  const overlayRef = useRef(null);
  const menuInnerRef = useRef(null);
  const menuTweenRef = useRef(null);
  const menuOpenRef = useRef(false);
  const pendingScrollRef = useRef(null);

  const setMenu = useCallback((open) => {
    menuOpenRef.current = open;
    setMenuOpen(open);
  }, []);

  const closeMenu = useCallback(() => setMenu(false), [setMenu]);
  const toggleMenu = useCallback(() => setMenu(!menuOpenRef.current), [setMenu]);

  const scrollToHash = useCallback((hash) => {
    if (!hash || hash === '#') {
      gsap.to(window, { scrollTo: 0, duration: 1, ease: 'power3.inOut' });
      return;
    }

    const id = hash.replace(/^#/, '');
    const target = document.getElementById(id);
    if (!target) return;

    const navOffset = (navRef.current?.offsetHeight ?? 72) + 48;

    gsap.to(window, {
      scrollTo: { y: target, offsetY: navOffset, autoKill: true },
      duration: 1.1,
      ease: 'power3.inOut',
    });
  }, []);

  const handleNavClick = useCallback(
    (e) => {
      const href = e.currentTarget.getAttribute('href');
      if (!href) return;

      e.preventDefault();
      e.stopPropagation();

      if (href === '#') return;

      if (!href.startsWith('#')) {
        window.open(href, '_blank');
        return;
      }

      if (menuOpenRef.current) {
        pendingScrollRef.current = href;
        closeMenu();
        return;
      }

      scrollToHash(href);
    },
    [closeMenu, scrollToHash]
  );

  useLayoutEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  useLayoutEffect(() => {
    const overlay = overlayRef.current;
    const nav = navRef.current;
    const menuInner = menuInnerRef.current;
    if (!overlay) return;

    const panels = overlay.querySelectorAll('.menu-panel');
    const navLinks = nav?.querySelectorAll('.nav-center a, .nav-cta-desktop');

    if (!menuOpen && !isOverlayVisible(overlay)) {
      overlay.style.display = 'none';
      overlay.style.pointerEvents = 'none';
      gsap.set(overlay, { yPercent: 100, opacity: 1 });
      gsap.set(menuInner, { opacity: 1 });
      gsap.set(panels, { opacity: 0, y: 36 });
      if (nav) gsap.set(nav, { y: 0, scale: 1 });
      return;
    }

    menuTweenRef.current?.kill();

    if (menuOpen) {
      overlay.style.display = 'block';
      overlay.style.pointerEvents = 'auto';

      gsap.set(overlay, { yPercent: 100, opacity: 1 });
      gsap.set(menuInner, { opacity: 0.4 });
      gsap.set(panels, { opacity: 0, y: 48 });
      if (navLinks?.length) gsap.set(navLinks, { opacity: 1, y: 0 });

      menuTweenRef.current = gsap.timeline({ defaults: { ease: MENU_EASE } });

      menuTweenRef.current
        .to(overlay, { yPercent: 0, duration: MENU_DURATION, ease: 'power4.out' })
        .to(menuInner, { opacity: 1, duration: 0.35 }, '-=0.45')
        .to(
          panels,
          { opacity: 1, y: 0, duration: 0.55, stagger: 0.09, ease: 'power3.out' },
          '-=0.5'
        );

      if (nav) {
        menuTweenRef.current.to(
          nav,
          { y: 4, scale: 1.01, duration: 0.5, ease: 'power2.out' },
          '-=0.65'
        );
      }
    } else if (isOverlayVisible(overlay)) {
      overlay.style.pointerEvents = 'none';

      menuTweenRef.current = gsap.timeline({
        onComplete: () => {
          if (menuOpenRef.current) return;

          overlay.style.display = 'none';
          gsap.set(overlay, { yPercent: 100 });
          gsap.set(panels, { opacity: 0, y: 36 });

          const pending = pendingScrollRef.current;
          pendingScrollRef.current = null;
          if (pending) {
            gsap.delayedCall(0.05, () => scrollToHash(pending));
          }
        },
      });

      if (nav) {
        menuTweenRef.current.to(nav, {
          y: 0,
          scale: 1,
          duration: 0.45,
          ease: 'power2.inOut',
        });
      }

      if (navLinks?.length) {
        menuTweenRef.current.to(
          navLinks,
          { opacity: 0.6, y: -6, duration: 0.25, stagger: 0.03, ease: 'power2.in' },
          0
        );
      }

      menuTweenRef.current
        .to(
          panels,
          { opacity: 0, y: -28, duration: 0.35, stagger: 0.05, ease: 'power3.in' },
          0.05
        )
        .to(menuInner, { opacity: 0.3, duration: 0.3, ease: 'power2.in' }, 0.1)
        .to(overlay, { yPercent: 100, duration: MENU_DURATION, ease: 'power4.in' }, 0.12);

      if (navLinks?.length) {
        menuTweenRef.current.to(
          navLinks,
          { opacity: 1, y: 0, duration: 0.4, stagger: 0.04, ease: 'power2.out' },
          '-=0.35'
        );
      }
    }

    return () => {
      menuTweenRef.current?.kill();
    };
  }, [menuOpen, scrollToHash]);

  useLayoutEffect(() => {
    const shell = shellRef.current;
    if (!shell) return;

    let lastScrollTop = window.pageYOffset || document.documentElement.scrollTop;
    showNav(shell);

    const onScroll = () => {
      if (menuOpenRef.current) return;

      const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;

      if (currentScrollTop < 120) {
        showNav(shell);
      } else if (currentScrollTop > lastScrollTop && currentScrollTop - lastScrollTop > 4) {
        shell.classList.add('nav-hidden');
        shell.classList.remove('nav-visible');
      } else if (lastScrollTop - currentScrollTop > 4) {
        showNav(shell);
      }

      lastScrollTop = currentScrollTop;
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useLayoutEffect(() => {
    return () => {
      document.body.style.overflow = '';
      menuTweenRef.current?.kill();
    };
  }, []);

  return (
    <>
      <div className="navbar-shell nav-visible" ref={shellRef}>
        <nav
          className={`modern-nav ${menuOpen ? 'nav-menu-open' : ''}`}
          ref={navRef}
        >
          <div className="nav-left">
            <a href="#beranda" className="nav-brand" onClick={handleNavClick}>
              <span className="brand-mark">RR</span>
              <div className="brand-divider" />
              <div className="brand-text">
                <h1>Riko Rizky</h1>
                <p>Portfolio</p>
              </div>
            </a>
          </div>

          <div className="nav-center">
            {NAV_LINKS.map((link) => (
              <a key={link.href} href={link.href} onClick={handleNavClick}>
                {link.label}
              </a>
            ))}
            <a
              href="#contact"
              className="nav-cta nav-cta-desktop"
              onClick={handleNavClick}
            >
              Hire Me
            </a>
          </div>

          <div className="nav-right">
            <button
              type="button"
              className={`nav-menu-toggle ${menuOpen ? 'active' : ''}`}
              aria-label={menuOpen ? 'Tutup menu' : 'Buka menu'}
              aria-expanded={menuOpen}
              onClick={toggleMenu}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </nav>
      </div>

      <section
        ref={overlayRef}
        className={`navbar-overlay-menu ${menuOpen ? 'is-open' : ''}`}
        aria-hidden={!menuOpen}
      >
        <div ref={menuInnerRef} className="menu-inner">
          <nav className="mega-mobile-nav menu-panel" aria-label="Navigasi mobile">
            <h3 className="mega-heading">Navigasi</h3>
            <ul className="mega-mobile-links">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a href={link.href} onClick={handleNavClick}>
                    {link.label}
                  </a>
                </li>
              ))}
              <li className="nav-cta-mobile-wrapper">
                <a href="#contact" className="nav-cta" onClick={handleNavClick}>
                  Hire Me
                </a>
              </li>
            </ul>
          </nav>

          <div className="mega-menu-grid">
            <section className="menu-panel mega-section">
              <h3 className="mega-heading">Quick Links</h3>
              <ul className="mega-nav-list">
                {NAV_LINKS.map((link) => (
                  <li key={link.href}>
                    <a href={link.href} onClick={handleNavClick}>
                      {link.label}
                      <span>→</span>
                    </a>
                  </li>
                ))}
              </ul>
            </section>

            <section className="menu-panel mega-section">
              <h3 className="mega-heading">Tech Stack</h3>
              <div className="mega-skill-pills">
                {SKILLS.map((skill) => (
                  <span key={skill} className="mega-skill-pill">
                    {skill}
                  </span>
                ))}
              </div>
            </section>

            <section className="menu-panel mega-section">
              <h3 className="mega-heading">Featured Projects</h3>
              <div className="mega-project-cards">
                {FEATURED_PROJECTS.map((project) => (
                  <a
                    key={project.title}
                    href={project.href}
                    className="mega-project-card"
                    onClick={handleNavClick}
                  >
                    <img src={project.image} alt={project.title} loading="lazy" />
                    <div className="mega-project-card-body">
                      <h4>{project.title}</h4>
                      <p>{project.desc}</p>
                    </div>
                  </a>
                ))}
              </div>
            </section>

            <section className="menu-panel mega-section">
              <h3 className="mega-heading">Experience Highlights</h3>
              <ul className="mega-experience-list">
                {EXPERIENCE.map((item) => (
                  <li key={item.title}>
                    <strong>{item.title}</strong>
                    <span>{item.desc}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </div>
      </section>
    </>
  );
}
