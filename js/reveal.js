/* ── reveal.js — Scroll-triggered fade-up animations ── */

const reveals = document.querySelectorAll('.reveal');

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Slight stagger between sibling elements
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, i * 80);

      // Stop watching once revealed
      observer.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.12  // trigger when 12% of element is visible
});

reveals.forEach(el => observer.observe(el));
