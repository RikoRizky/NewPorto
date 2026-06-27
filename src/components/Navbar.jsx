import gsap from 'gsap';
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { scrollToSection } from '../utils/scrollToSection';
import './Navbar.css';

const MENU_DURATION = 0.75;
const MENU_EASE = 'power4.inOut';

const NAV_LINKS = [
  { label: 'Home', href: '#beranda' },
  { label: 'About', href: '#biodata' },
  { label: 'Experience', href: '#experience' },
  { label: 'Projects', href: '#project' },
  { label: 'Contact', href: '#contact' },
  { label: 'Feedback', href: '#feedback' },
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

const SKILLS = [
  { name: 'React', icon: 'fab fa-react' },
  { name: 'JavaScript', icon: 'fab fa-js' },
  { name: 'PHP', icon: 'fab fa-php' },
  { name: 'Laravel', icon: 'fab fa-laravel' },
  { name: 'Tailwind CSS', icon: 'fab fa-css3-alt' },
  { name: 'GSAP', icon: null },
  { name: 'MySQL', icon: 'fas fa-database' },
  { name: 'Git & GitHub', icon: 'fab fa-github' },
  { name: 'Figma', icon: 'fab fa-figma' },
  { name: 'Supabase', icon: 'fas fa-bolt' },
];

const EXPERIENCE = [
  { title: 'Sertifikat BNSP', desc: 'Teknologi Informasi · 2025' },
  { title: 'PKL BPS Cirebon', desc: 'Digitalisasi data · 2024' },
  { title: 'UKK RPL', desc: 'Rekayasa Perangkat Lunak · 2024' },
];

const SOCIAL_LINKS = [
  { label: 'GitHub', href: 'https://github.com/rikorizky', icon: 'fab fa-github' },
  { label: 'Instagram', href: 'https://instagram.com/sir_ikoo', icon: 'fab fa-instagram' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/riko-rizky-baswara-921262338?utm_source=share_via&utm_content=profile&utm_medium=member_android', icon: 'fab fa-linkedin-in' },
  { label: 'Email', href: 'mailto:rikorizky20@gmail.com', icon: 'fas fa-envelope' },
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
  const [activeSection, setActiveSection] = useState('beranda');
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
    const navOffset = (navRef.current?.offsetHeight ?? 72) + 48;
    scrollToSection(hash, navOffset);
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

  useEffect(() => {
    const sectionIds = NAV_LINKS.map((link) => link.href.replace('#', ''));

    const updateActive = () => {
      // Kumpulkan semua elemen section yang ada
      const sections = sectionIds
        .map((id) => document.getElementById(id))
        .filter(Boolean);

      if (sections.length === 0) return;

      const viewportMiddle = window.scrollY + window.innerHeight / 2;
      let current = sections[0].id;
      let minDist = Infinity;

      for (const el of sections) {
        const rect = el.getBoundingClientRect();
        const top = rect.top + window.scrollY;
        const bottom = rect.bottom + window.scrollY;
        const middle = (top + bottom) / 2;
        const dist = Math.abs(middle - viewportMiddle);
        if (dist < minDist) {
          minDist = dist;
          current = el.id;
        }
      }

      setActiveSection(current);
    };

    updateActive();
    window.addEventListener('scroll', updateActive, { passive: true });
    window.addEventListener('resize', updateActive);

    return () => {
      window.removeEventListener('scroll', updateActive);
      window.removeEventListener('resize', updateActive);
    };
  }, []);

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
    const navLinks = nav?.querySelectorAll('.nav-center a');

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

  const isActive = (href) => activeSection === href.replace('#', '');

  return (
    <>
      <div className="navbar-shell nav-visible" ref={shellRef}>
        <nav
          className={`modern-nav ${menuOpen ? 'nav-menu-open' : ''}`}
          ref={navRef}
        >
          <div className="nav-left">
            <a href="#beranda" className="nav-brand" onClick={handleNavClick}>
              <img
                src="/img/rikobgmerah.jpg"
                alt="Riko Rizky"
                className="brand-mark"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.style.display = 'none';
                  const fallback = document.createElement('span');
                  fallback.className = 'brand-mark';
                  fallback.textContent = 'RR';
                  e.target.parentNode.replaceChild(fallback, e.target);
                }}
              />
              {/* ======= END DIUBAH ======= */}
              <div className="brand-divider" />
              <div className="brand-text">
                <h1>Riko Rizky</h1>
                <p>Portfolio</p>
              </div>
            </a>
          </div>

          <div className="nav-center">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={isActive(link.href) ? 'nav-link-active' : ''}
                onClick={handleNavClick}
                aria-current={isActive(link.href) ? 'page' : undefined}
              >
                {link.label}
              </a>
            ))}
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
        <div className="menu-bg-decor" aria-hidden="true">
          <div className="menu-bg-grid" />
          <div className="menu-bg-orb menu-bg-orb--1" />
          <div className="menu-bg-orb menu-bg-orb--2" />
        </div>

        <div ref={menuInnerRef} className="menu-inner">
          <nav className="mega-mobile-nav menu-panel" aria-label="Navigasi mobile">
            <h3 className="mega-heading">Navigasi</h3>
            <ul className="mega-mobile-links">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className={isActive(link.href) ? 'nav-link-active' : ''}
                    onClick={handleNavClick}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="mega-menu-grid">
            <section className="menu-panel mega-section">
              <h3 className="mega-heading">Tentang Saya</h3>
              <div className="mega-profile-card">
                <div className="mega-profile-header">
                  <img
                    src="/img/rikobgmerah.jpg"
                    alt="Riko Rizky"
                    className="mega-profile-avatar"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.style.display = 'none';
                      const fallback = document.createElement('span');
                      fallback.className = 'mega-profile-avatar';
                      fallback.textContent = 'RR';
                      e.target.parentNode.replaceChild(fallback, e.target);
                    }}
                  />
                  <div>
                    <strong>Riko Rizky</strong>
                    <span>Web Developer · RPL</span>
                  </div>
                </div>
                <p className="mega-profile-bio">
                  Passionate web developer dari Cirebon yang fokus pada frontend interaktif,
                  animasi GSAP, dan desain responsif di setiap perangkat.
                </p>
                <ul className="mega-profile-meta">
                  <li>
                    <i className="fas fa-map-marker-alt" />
                    Cirebon, Indonesia
                  </li>
                  <li>
                    <i className="fas fa-envelope" />
                    <a href="mailto:rikorizky20@gmail.com">rikorizky20@gmail.com</a>
                  </li>
                </ul>
              </div>
            </section>

            <section className="menu-panel mega-section">
              <h3 className="mega-heading">Keahlian Utama</h3>
              <div className="mega-skill-pills">
                {SKILLS.map((skill) => (
                  <span key={skill.name} className="mega-skill-pill">
                    {skill.icon ? <i className={skill.icon} /> : <span className="mega-skill-letter">G</span>}
                    {skill.name}
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
              <h3 className="mega-heading">Sertifikasi &amp; Social</h3>
              <ul className="mega-experience-list">
                {EXPERIENCE.map((item) => (
                  <li key={item.title}>
                    <strong>{item.title}</strong>
                    <span>{item.desc}</span>
                  </li>
                ))}
              </ul>
              <div className="mega-social-row">
                {SOCIAL_LINKS.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target={social.href.startsWith('mailto') ? undefined : '_blank'}
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    onClick={social.href.startsWith('#') ? handleNavClick : undefined}
                  >
                    <i className={social.icon} />
                  </a>
                ))}
              </div>
            </section>
          </div>
        </div>
      </section>
    </>
  );
}