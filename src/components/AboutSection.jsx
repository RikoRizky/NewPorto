import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './AboutSection.css';

gsap.registerPlugin(ScrollTrigger);

const PROFILE_PHOTO = '/img/rikobgmerah.jpg';

const SKILL_CATEGORIES = [
  {
    title: 'Frontend',
    emoji: '🎨',
    skills: [
      { name: 'HTML5', fa: 'fab fa-html5', color: '#e44d26' },
      { name: 'CSS3', fa: 'fab fa-css3-alt', color: '#264de4' },
      { name: 'JavaScript', fa: 'fab fa-js', color: '#f7df1e', darkIcon: true },
      { name: 'Bootstrap', fa: 'fab fa-bootstrap', color: '#7952b3' },
      { name: 'Tailwind', fa: 'fab fa-css3-alt', color: '#0ea5e9' },
      { name: 'React', fa: 'fab fa-react', color: '#61dafb' },
    ],
  },
  {
    title: 'Backend & Database',
    emoji: '⚙️',
    skills: [
      { name: 'PHP', fa: 'fab fa-php', color: '#8892be' },
      { name: 'Laravel', fa: 'fab fa-laravel', color: '#ff2d20' },
      { name: 'MySQL', fa: 'fas fa-database', color: '#00758f' },
      { name: 'MySQL WB', fa: 'fas fa-server', color: '#00758f' }, // Workbench masuk ke sini
      { name: 'Supabase', fa: 'fas fa-bolt', color: '#3ecf8e' },
    ],
  },
  {
    title: 'Java Development',
    emoji: '☕',
    skills: [
      { name: 'Java', fa: 'fab fa-java', color: '#f89820' },
      { name: 'Alice', fa: 'fas fa-cube', color: '#68a063' },
      { name: 'Greenfoot', fa: 'fas fa-gamepad', color: '#888888' },
      { name: 'NetBeans', fa: 'fas fa-file-code', color: '#8b0000' },
      { name: 'IntelliJ', fa: 'fas fa-laptop-code', color: '#954b16ff' }, // Menggunakan icon terminal
    ],
  },
  {
    title: 'Tools',
    emoji: '🛠️',
    skills: [
      { name: 'VS Code', fa: 'fas fa-code', color: '#007acc' },
      { name: 'Git', fa: 'fab fa-git-alt', color: '#f05032' },
      { name: 'GitHub', fa: 'fab fa-github', color: '#ffffff' },
      { name: 'Figma', fa: 'fab fa-figma', color: '#f24e1e' },
      { name: 'GSAP', fa: null, color: '#88ce02', letter: 'G' },
    ],
  },
];

const STATS = [
  { value: 7, suffix: '+', label: 'Projects Built', icon: 'fas fa-laptop-code' },
  { value: 6, suffix: '+', label: 'Certifications', icon: 'fas fa-certificate' },
  { value: 2, suffix: '+', label: 'Years Learning', icon: 'fas fa-book-open' },
  { value: 100, suffix: '%', label: 'Passion Driven', icon: 'fas fa-fire' },
];

function ProfileAvatar() {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="about-avatar-wrap">
      <div className="about-avatar-ring" />
      <div className="about-avatar">
        {!imgError ? (
          <img
            src={PROFILE_PHOTO}
            alt="Riko Rizky"
            className="about-avatar-photo"
            onError={() => setImgError(true)}
          />
        ) : (
          <span className="about-avatar-fallback">RR</span>
        )}
      </div>
    </div>
  );
}

export default function AboutSection() {
  const sectionRef = useRef(null);
  const profileRef = useRef(null);
  const rightRef = useRef(null);
  const statsRef = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(profileRef.current, {
        x: -30,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
          toggleActions: 'play none none reverse',
        },
      });

      gsap.from(rightRef.current?.children || [], {
        y: 30,
        opacity: 0,
        duration: 0.65,
        stagger: 0.08,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: rightRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      });

      gsap.from('.about-skill-chip', {
        y: 16,
        opacity: 0,
        duration: 0.45,
        stagger: 0.03,
        ease: 'back.out(1.5)',
        scrollTrigger: {
          trigger: '.about-skills-wrap',
          start: 'top 88%',
          toggleActions: 'play none none reverse',
        },
      });

      statsRef.current.forEach((el, i) => {
        if (!el) return;
        const target = STATS[i]?.value || 0;
        const suffix = STATS[i]?.suffix || '';
        const obj = { val: 0 };
        gsap.to(obj, {
          val: target,
          duration: 2,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            toggleActions: 'play none none reverse',
          },
          onUpdate: () => {
            el.textContent = Math.round(obj.val) + suffix;
          },
        });
      });

      sectionRef.current?.querySelectorAll('.animate-text').forEach((textEl) => {
        textEl.setAttribute('data-text', textEl.textContent.trim());
        ScrollTrigger.create({
          trigger: textEl,
          start: 'top 65%',
          end: 'bottom 40%',
          scrub: 1,
          onUpdate: (self) => {
            const clip = Math.max(0, 100 - self.progress * 100);
            textEl.style.setProperty('--clip-value', `${clip}%`);
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="biodata" className="about-section">
      <div className="about-section-glow about-section-glow--orange" />
      <div className="about-section-glow about-section-glow--amber" />
      <div className="about-grid-pattern" />

      <div className="about-section-inner">
        <div className="about-section-header">
          <div className="about-section-label">
            <span className="about-line" />
            <span>Get to know me</span>
            <span className="about-line" />
          </div>
          <h2 className="about-section-title">
            About <span>Me</span>
          </h2>
        </div>

        <div className="about-layout">
          <div ref={profileRef} className="about-profile-col">
            <div className="about-profile-card">
              <div className="about-profile-glow" />
              <ProfileAvatar />
              <h3 className="about-profile-name">Riko Rizky</h3>
              <p className="about-profile-role">Web Developer</p>
              <div className="about-profile-divider" />
              <ul className="about-profile-info">
                <li><i className="fas fa-map-marker-alt" /> Bandung, Indonesia</li>
                <li><i className="fas fa-graduation-cap" /> Teknik Informatika</li>
                <li><i className="fas fa-code" /> UI/UX Designer & Web Developer</li>
              </ul>
              <div className="about-profile-socials">
                <a href="https://github.com/rikorizky" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                  <i className="fab fa-github" />
                </a>
                <a href="mailto:rikorizky20@gmail.com" aria-label="Email">
                  <i className="fas fa-envelope" />
                </a>
                <a href="#feedback" aria-label="Feedback">
                  <i className="fas fa-comment-dots" />
                </a>
              </div>
            </div>
          </div>

          <div ref={rightRef} className="about-right-col">
            <p className="animate-text about-bio">
            Saya adalah pengembang web yang antusias menciptakan karya digital interaktif. Dengan mengedepankan fungsionalitas dan responsivitas, saya berkomitmen membangun website modern yang tidak hanya responsif, tetapi juga memberikan pengalaman visual yang berkesan bagi setiap pengguna.
            </p>

            <div className="about-stats">
              {STATS.map((stat, i) => (
                <div key={stat.label} className="about-stat-card">
                  <i className={`${stat.icon} about-stat-icon`} />
                  <p ref={(el) => (statsRef.current[i] = el)} className="about-stat-value">
                    0{stat.suffix}
                  </p>
                  <p className="about-stat-label">{stat.label}</p>
                </div>
              ))}
            </div>

            <div className="about-skills-wrap">
              <div className="about-skills-head">
                <span className="about-skills-tag">Tech Stack</span>
                <h4>Keahlian Saya</h4>
              </div>
              {SKILL_CATEGORIES.map((cat) => (
                <div key={cat.title} className="about-skill-row">
                  <span className="about-skill-cat">
                    {cat.emoji} {cat.title}
                  </span>
                  <div className="about-skill-chips">
                    {cat.skills.map((skill) => (
                      <div
                        key={skill.name}
                        className="about-skill-chip"
                        style={{ '--chip-color': skill.color }}
                        title={skill.name}
                      >
                        {skill.fa ? (
                          <i className={`${skill.fa} ${skill.darkIcon ? 'dark-icon' : ''}`} />
                        ) : (
                          <span className="chip-letter">{skill.letter}</span>
                        )}
                        <span className="chip-name">{skill.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
