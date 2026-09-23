// Shared behavior for the whole site: theme toggle, visit counter,
// system clock, header pixel-fire, and a small easter egg.

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

// Classic "Doom fire" pixel algorithm, rendered in the theme's own
// grayscale (bg -> fg) so it always matches light/dark mode.
function initFire() {
  const canvas = document.querySelector(".fire-canvas");
  if (!canvas || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const W = 80;
  const H = 34;
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  const STEPS = 36;
  const pixels = new Uint8Array(W * H);
  for (let x = 0; x < W; x++) pixels[(H - 1) * W + x] = STEPS;
  const imageData = ctx.createImageData(W, H);

  let palette = [];
  function hexToRgb(hex) {
    hex = hex.trim().replace("#", "");
    if (hex.length === 3) hex = hex.split("").map((c) => c + c).join("");
    const num = parseInt(hex, 16);
    return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
  }
  function buildPalette() {
    const style = getComputedStyle(document.documentElement);
    const bg = hexToRgb(style.getPropertyValue("--bg") || "#ffffff");
    const fg = hexToRgb(style.getPropertyValue("--fg") || "#000000");
    palette = Array.from({ length: STEPS + 1 }, (_, i) => {
      const t = i / STEPS;
      return [
        Math.round(bg[0] + (fg[0] - bg[0]) * t),
        Math.round(bg[1] + (fg[1] - bg[1]) * t),
        Math.round(bg[2] + (fg[2] - bg[2]) * t),
      ];
    });
  }
  buildPalette();

  function spreadFire(x, y) {
    const src = y * W + x;
    const intensity = pixels[src];
    if (intensity === 0) {
      pixels[src - W] = 0;
      return;
    }
    const rand = Math.floor(Math.random() * 3);
    const dstX = Math.min(W - 1, Math.max(0, x - rand + 1));
    pixels[dstX + (y - 1) * W] = Math.max(0, intensity - (rand & 1));
  }

  function render() {
    const data = imageData.data;
    for (let i = 0; i < pixels.length; i++) {
      const c = palette[pixels[i]] || palette[0];
      const o = i * 4;
      data[o] = c[0];
      data[o + 1] = c[1];
      data[o + 2] = c[2];
      data[o + 3] = 255;
    }
    ctx.putImageData(imageData, 0, 0);
  }

  function tick() {
    for (let x = 0; x < W; x++) {
      for (let y = 1; y < H; y++) spreadFire(x, y);
    }
    render();
  }

  render();
  let timer = setInterval(tick, 90);

  document.addEventListener("visibilitychange", () => {
    clearInterval(timer);
    if (!document.hidden) timer = setInterval(tick, 90);
  });

  const themeBtn = document.getElementById("theme-toggle");
  if (themeBtn) themeBtn.addEventListener("click", () => setTimeout(buildPalette, 0));
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
  initFire();
  initKonami();
  console.log("%c> system ready_", "font-family:monospace;color:#3ddc74;");
});
