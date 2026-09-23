// Shared behavior for the whole site: theme toggle, visit counter,
// reading time, system clock, and a small easter egg.

function initTheme() {
  const root = document.documentElement;
  const btn = document.getElementById("theme-toggle");
  const saved = localStorage.getItem("theme");
  if (saved === "dark") root.setAttribute("data-theme", "dark");

  const updateLabel = () => {
    if (!btn) return;
    btn.textContent = root.getAttribute("data-theme") === "dark" ? "[light]" : "[dark]";
  };
  updateLabel();

  if (btn) {
    btn.addEventListener("click", () => {
      const isDark = root.getAttribute("data-theme") === "dark";
      if (isDark) {
        root.removeAttribute("data-theme");
        localStorage.setItem("theme", "light");
      } else {
        root.setAttribute("data-theme", "dark");
        localStorage.setItem("theme", "dark");
      }
      updateLabel();
    });
  }
}

function initVisitCounter() {
  const el = document.getElementById("visit-count");
  if (!el) return;
  const visits = (parseInt(localStorage.getItem("visitCount") || "0", 10) || 0) + 1;
  localStorage.setItem("visitCount", visits);
  el.textContent = String(visits).padStart(4, "0");
}

function initClock() {
  const el = document.getElementById("clock");
  if (!el) return;
  const tick = () => {
    el.textContent = new Date().toLocaleTimeString("pl-PL");
  };
  tick();
  setInterval(tick, 1000);
}

function initKonami() {
  const seq = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];
  let pos = 0;
  window.addEventListener("keydown", (e) => {
    pos = e.key === seq[pos] ? pos + 1 : (e.key === seq[0] ? 1 : 0);
    if (pos === seq.length) {
      pos = 0;
      document.body.classList.add("glitch-mode");
      console.log("%cwitaj w rynsztoku niebios", "font-family:monospace;color:#3ddc74;font-size:14px;");
      setTimeout(() => document.body.classList.remove("glitch-mode"), 4000);
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initVisitCounter();
  initClock();
  initKonami();
  console.log("%c> system ready_", "font-family:monospace;color:#3ddc74;");
});
