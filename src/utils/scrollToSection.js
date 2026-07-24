import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

let scrollTween = null;

function resolveScrollY(target, offsetY) {
  ScrollTrigger.refresh();

  // If target itself is a pinned ScrollTrigger, return its start position
  const targetPin = ScrollTrigger.getAll().find(
    (st) =>
      (st.trigger === target || st.vars?.trigger === target) &&
      st.vars?.pin === true
  );

  if (targetPin) {
    return Math.max(0, targetPin.start - offsetY);
  }

  // Find all pinned ScrollTriggers whose trigger element precedes target in DOM order
  const allTriggers = ScrollTrigger.getAll();
  const precedingPins = allTriggers.filter((st) => {
    if (!st.vars?.pin) return false;
    const el = st.trigger || st.vars?.trigger;
    if (!el || el === target) return false;
    return (el.compareDocumentPosition(target) & Node.DOCUMENT_POSITION_FOLLOWING) !== 0;
  });

  if (precedingPins.length > 0) {
    // Sort preceding pins by end position descending (find the last preceding pin)
    precedingPins.sort((a, b) => b.end - a.end);
    const lastPin = precedingPins[0];
    const lastPinEl = lastPin.trigger || lastPin.vars?.trigger;

    // Special case for #project (Karya): Adjust scroll position so Karya showcase header is centered on all viewports
    if (target.id === 'project') {
      const extraOffset = window.innerHeight * 0.45;
      return Math.max(0, lastPin.end + extraOffset);
    }

    // Calculate distance from the last pinned element to target element in DOM layout
    const relativeDistance = target.getBoundingClientRect().top - lastPinEl.getBoundingClientRect().top;
    return Math.max(0, lastPin.end + relativeDistance - offsetY);
  }

  // Fallback for sections before any pinned triggers
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
