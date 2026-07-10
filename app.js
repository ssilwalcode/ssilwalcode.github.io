const root = document.body;
const themeToggle = document.querySelector(".theme-toggle");
const year = document.querySelector("#year");
const cursorGlow = document.querySelector(".cursor-glow");
const filterButtons = document.querySelectorAll(".filter-button");
const projectCards = document.querySelectorAll(".project-card");
const detailButtons = document.querySelectorAll(".details-toggle");
const magneticItems = document.querySelectorAll(".magnetic");

year.textContent = new Date().getFullYear();

const savedTheme = localStorage.getItem("portfolio-theme");
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
  root.classList.add("dark");
}

themeToggle.addEventListener("click", () => {
  root.classList.toggle("dark");
  localStorage.setItem("portfolio-theme", root.classList.contains("dark") ? "dark" : "light");
});

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const target = document.querySelector(link.getAttribute("href"));

    if (!target) {
      return;
    }

    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;

    filterButtons.forEach((item) => item.classList.toggle("is-active", item === button));
    projectCards.forEach((card) => {
      const categories = card.dataset.category.split(" ");
      const shouldShow = filter === "all" || categories.includes(filter);
      card.classList.toggle("is-hidden", !shouldShow);
    });
  });
});

detailButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const details = button.nextElementSibling;
    const isExpanded = button.getAttribute("aria-expanded") === "true";

    button.setAttribute("aria-expanded", String(!isExpanded));
    button.textContent = isExpanded ? "View impact" : "Hide impact";
    details.hidden = isExpanded;
  });
});

window.addEventListener("pointermove", (event) => {
  root.classList.add("has-pointer");
  cursorGlow.style.left = `${event.clientX}px`;
  cursorGlow.style.top = `${event.clientY}px`;
});

magneticItems.forEach((item) => {
  item.addEventListener("pointermove", (event) => {
    const rect = item.getBoundingClientRect();
    const x = (event.clientX - rect.left - rect.width / 2) * 0.12;
    const y = (event.clientY - rect.top - rect.height / 2) * 0.18;
    item.style.transform = `translate(${x}px, ${y}px)`;
  });

  item.addEventListener("pointerleave", () => {
    item.style.transform = "";
  });
});
