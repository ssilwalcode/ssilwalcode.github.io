const root = document.body;
const themeToggle = document.querySelector(".theme-toggle");
const themeIcon = document.querySelector(".theme-icon");
const themeColor = document.querySelector('meta[name="theme-color"]');
const navToggle = document.querySelector(".nav-toggle");
const nav = document.querySelector(".nav-links");
const year = document.querySelector("#year");
const progressBar = document.querySelector(".reading-progress span");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

if (year) year.textContent = new Date().getFullYear();

const applyTheme = (theme) => {
  const isDark = theme === "dark";
  root.classList.toggle("dark", isDark);
  if (themeToggle) themeToggle.setAttribute("aria-label", `Switch to ${isDark ? "light" : "dark"} theme`);
  if (themeIcon) themeIcon.textContent = isDark ? "☀" : "◐";
  if (themeColor) themeColor.setAttribute("content", isDark ? "#121816" : "#f3efe7");
};

const savedTheme = localStorage.getItem("portfolio-theme");
applyTheme(savedTheme || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"));

themeToggle?.addEventListener("click", () => {
  const nextTheme = root.classList.contains("dark") ? "light" : "dark";
  localStorage.setItem("portfolio-theme", nextTheme);
  applyTheme(nextTheme);
});

const closeNavigation = () => {
  nav?.classList.remove("open");
  navToggle?.setAttribute("aria-expanded", "false");
  root.classList.remove("nav-open");
};

navToggle?.addEventListener("click", () => {
  const isOpen = navToggle.getAttribute("aria-expanded") === "true";
  navToggle.setAttribute("aria-expanded", String(!isOpen));
  nav?.classList.toggle("open", !isOpen);
  root.classList.toggle("nav-open", !isOpen);
});

nav?.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeNavigation));
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeNavigation();
});

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const target = document.querySelector(link.getAttribute("href"));
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: prefersReducedMotion.matches ? "auto" : "smooth", block: "start" });
  });
});

document.querySelectorAll(".details-toggle").forEach((button) => {
  button.addEventListener("click", () => {
    const details = button.nextElementSibling;
    const isExpanded = button.getAttribute("aria-expanded") === "true";
    button.setAttribute("aria-expanded", String(!isExpanded));
    if (details) details.hidden = isExpanded;
  });
});

const revealElements = document.querySelectorAll(".reveal");
if (prefersReducedMotion.matches || !("IntersectionObserver" in window)) {
  revealElements.forEach((element) => element.classList.add("is-visible"));
} else {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px" });
  revealElements.forEach((element) => revealObserver.observe(element));
}

const updateProgress = () => {
  if (!progressBar) return;
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
  progressBar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
};

updateProgress();
window.addEventListener("scroll", updateProgress, { passive: true });
window.addEventListener("resize", updateProgress);

if (!prefersReducedMotion.matches && window.matchMedia("(pointer: fine)").matches) {
  document.querySelectorAll(".magnetic").forEach((item) => {
    item.addEventListener("pointermove", (event) => {
      const rect = item.getBoundingClientRect();
      const x = (event.clientX - rect.left - rect.width / 2) * 0.08;
      const y = (event.clientY - rect.top - rect.height / 2) * 0.1;
      item.style.transform = `translate(${x}px, ${y}px)`;
    });
    item.addEventListener("pointerleave", () => { item.style.transform = ""; });
  });
}
