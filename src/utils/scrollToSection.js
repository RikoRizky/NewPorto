import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

let scrollTween = null;

function resolveScrollY(target, offsetY) {
  ScrollTrigger.refresh();

  const pinnedTrigger = ScrollTrigger.getAll().find(
    (st) =>
      (st.trigger === target || st.vars?.trigger === target) &&
      st.vars?.pin === true
  );

  if (pinnedTrigger) {
    return Math.max(0, pinnedTrigger.start - offsetY);
  }

  const rect = target.getBoundingClientRect();
  return Math.max(0, rect.top + window.pageYOffset - offsetY);
}

function runScroll(y, onDone) {
  const html = document.documentElement;
  const body = document.body;
  const previousHtmlBehavior = html.style.scrollBehavior;
  const previousBodyBehavior = body.style.scrollBehavior;

  html.style.scrollBehavior = 'auto';
  body.style.scrollBehavior = 'auto';

  const scrollState = { y: window.pageYOffset || html.scrollTop };

  const finish = () => {
    html.style.scrollBehavior = previousHtmlBehavior;
    body.style.scrollBehavior = previousBodyBehavior;
    ScrollTrigger.refresh();
    scrollTween = null;
    onDone?.();
  };

  scrollTween = gsap.to(scrollState, {
    y,
    duration: 1.1,
    ease: 'power3.inOut',
    overwrite: 'auto',
    onUpdate: () => {
      document.documentElement.scrollTop = scrollState.y;
      document.body.scrollTop = scrollState.y;
    },
    onComplete: finish,
    onInterrupt: finish,
  });
}

export function scrollToSection(hash, offsetY = 120) {
  scrollTween?.kill();
  scrollTween = null;

  if (!hash || hash === '#') {
    runScroll(0);
    return;
  }

  const id = hash.replace(/^#/, '');
  const target = document.getElementById(id);
  if (!target) return;

  const y = resolveScrollY(target, offsetY);
  runScroll(y);
}

export function killScrollTween() {
  scrollTween?.kill();
  scrollTween = null;
}
