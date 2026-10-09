// StepPact — scroll effects. Everything works without this file too.
document.documentElement.classList.add("js");

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// 1. Reveal elements as they scroll into view
const io = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting) {
      e.target.classList.add("in");
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });
document.querySelectorAll(".reveal, .ring-bar").forEach((el) => io.observe(el));

// 2. Count-up numbers: <b data-count="100" data-suffix="%">
const counters = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (!e.isIntersecting) return;
    const el = e.target;
    const target = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || "";
    const prefix = el.dataset.prefix || "";
    counters.unobserve(el);
    if (reduceMotion) { el.textContent = prefix + target + suffix; return; }
    const start = performance.now(), dur = 1400;
    const tick = (now) => {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = prefix + Math.round(target * eased).toLocaleString("en-US") + suffix;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
}, { threshold: 0.6 });
document.querySelectorAll("[data-count]").forEach((el) => counters.observe(el));

// 3. Nav background, top progress bar, gentle parallax for phone + mascot
const nav = document.querySelector(".nav");
const bar = document.querySelector(".progress");
const floaters = document.querySelectorAll("[data-speed]");
let ticking = false;

function onScroll() {
  const y = window.scrollY;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  if (nav) nav.classList.toggle("scrolled", y > 10);
  if (bar) bar.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
  if (!reduceMotion) {
    floaters.forEach((el) => {
      el.style.transform = `translate3d(0, ${y * parseFloat(el.dataset.speed)}px, 0)`;
    });
  }
  ticking = false;
}
window.addEventListener("scroll", () => {
  if (!ticking) { requestAnimationFrame(onScroll); ticking = true; }
}, { passive: true });
onScroll();
