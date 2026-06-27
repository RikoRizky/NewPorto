import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function useSectionReveal(sectionRef, selector = '.reveal-up', options = {}) {
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const {
      start = 'top 78%',
      stagger = 0.1,
      y = 36,
      duration = 0.75,
    } = options;

    const ctx = gsap.context(() => {
      const targets = section.querySelectorAll(selector);
      if (!targets.length) return;

      gsap.from(targets, {
        y,
        opacity: 0,
        duration,
        stagger,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: section,
          start,
          toggleActions: 'play none none reverse',
        },
      });
    }, section);

    return () => ctx.revert();
  }, [sectionRef, selector, options.start, options.stagger, options.y, options.duration]);
}
