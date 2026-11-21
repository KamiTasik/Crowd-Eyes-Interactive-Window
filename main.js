/**
 * Crowd Eyes — Cargo / GitHub Pages web adaptation
 * Hold pointer or key → open all animated eyes; release → close.
 * Slots use alignment-window coordinates; pack frames are used as-is.
 */

const statusEl = document.getElementById("status");
const hintEl = document.getElementById("hint");
const app = document.getElementById("app");
const eyesRoot = document.getElementById("eyes");

/** @type {Map<string, { frames: HTMLImageElement[], index: number, open: boolean, animating: boolean, img: HTMLImageElement, openMs: number, closeMs: number }>} */
const players = new Map();
const activePointers = new Set();
let keysDown = 0;
let eyesOpen = false;
let config = null;

function setStatus(t) {
  if (statusEl) statusEl.textContent = t;
}

function showFrame(id, i) {
  const p = players.get(id);
  if (!p?.frames?.length) return;
  p.index = Math.max(0, Math.min(p.frames.length - 1, i));
  p.img.src = p.frames[p.index].src;
}

function animateFigure(id, open) {
  const p = players.get(id);
  if (!p?.frames?.length) return;
  if (p.open === open && !p.animating) {
    showFrame(id, open ? p.frames.length - 1 : 0);
    return;
  }
  p.open = open;
  const from = p.index;
  const to = open ? p.frames.length - 1 : 0;
  const duration = open ? p.openMs : p.closeMs;
  if (from === to) return;
  p.animating = true;
  const start = performance.now();
  function tick(now) {
    const t = Math.min(1, (now - start) / duration);
    showFrame(id, Math.round(from + (to - from) * t));
    if (t < 1) requestAnimationFrame(tick);
    else {
      showFrame(id, to);
      p.animating = false;
    }
  }
  requestAnimationFrame(tick);
}

function syncOpenState() {
  const open = activePointers.size > 0 || keysDown > 0;
  if (open === eyesOpen) return;
  eyesOpen = open;
  app.classList.toggle("is-open", open);
  document.getElementById("stage")?.setAttribute("data-open", open ? "true" : "false");
  if (hintEl) {
    hintEl.textContent = open ? "Holding — eyes open" : "Press & hold · or hold a key";
  }
  for (const id of players.keys()) animateFigure(id, open);
}

async function loadImage(src) {
  return new Promise((resolve, reject) => {
    const el = new Image();
    el.onload = () => resolve(el);
    el.onerror = () => reject(new Error(`Failed to load ${src}`));
    el.src = src;
  });
}

/** Load pack frames 00.jpg, 01.jpg, … until a file is missing. */
async function loadPack(pack) {
  const frames = [];
  for (let i = 0; i < 32; i++) {
    const src = `assets/packs/${pack}/${String(i).padStart(2, "0")}.jpg`;
    try {
      frames.push(await loadImage(src));
    } catch {
      break;
    }
  }
  if (!frames.length) throw new Error(`Empty pack: ${pack}`);
  return frames;
}

async function setup() {
  config = await fetch("./config.json", { cache: "no-store" }).then((r) => r.json());
  const openMs = config.interaction?.openMs ?? 350;
  const closeMs = config.interaction?.closeMs ?? 280;
  const params = new URLSearchParams(location.search);
  const debug = params.get("debug") === "1";
  const forceOpen = params.get("open") === "1";
  const debugOverlay = document.getElementById("debugOverlay");
  if (debug && debugOverlay) {
    debugOverlay.hidden = false;
  }

  for (const fig of config.figures) {
    const slot = document.createElement("div");
    slot.className = "eye-slot";
    slot.dataset.id = fig.id;
    slot.title = fig.label || fig.id;
    slot.style.left = `${fig.cx * 100}%`;
    slot.style.top = `${fig.cy * 100}%`;
    slot.style.width = `${fig.width * 100}%`;
    slot.style.height = `${fig.height * 100}%`;

    const img = document.createElement("img");
    img.alt = "";
    img.draggable = false;
    const fit = fig.fit || {};
    const scale = fit.scale ?? 1;
    const rotate = fit.rotate ?? 0; // degrees, clockwise positive
    const dx = fit.dx ?? 0; // translate as fraction of slot size
    const dy = fit.dy ?? 0;
    const tx = fit.tx ?? 0;
    const ty = fit.ty ?? 0;
    img.style.objectPosition = `${50 + tx * 100}% ${50 + ty * 100}%`;
    const transforms = [];
    if (dx || dy) transforms.push(`translate(${dx * 100}%, ${dy * 100}%)`);
    if (scale !== 1) transforms.push(`scale(${scale})`);
    if (rotate) transforms.push(`rotate(${rotate}deg)`);
    if (transforms.length) {
      img.style.transform = transforms.join(" ");
      img.style.transformOrigin = "center center";
    }
    // Let rotated plates extend past the slot; the drawing layer masks them
    if (rotate) slot.style.overflow = "visible";
    slot.appendChild(img);
    eyesRoot.appendChild(slot);

    if (debug && debugOverlay) {
      const box = document.createElement("div");
      box.className = "debug-box";
      box.title = fig.label || fig.id;
      box.style.left = `${fig.cx * 100}%`;
      box.style.top = `${fig.cy * 100}%`;
      box.style.width = `${fig.width * 100}%`;
      box.style.height = `${fig.height * 100}%`;
      debugOverlay.appendChild(box);
    }

    const frames = await loadPack(fig.pack);
    players.set(fig.id, {
      frames,
      index: 0,
      open: false,
      animating: false,
      img,
      openMs,
      closeMs,
    });
    img.src = frames[0].src;
  }

  setStatus("Ready");
  app.focus();

  if (forceOpen) {
    keysDown = 1;
    syncOpenState();
  }
}

function onPointerDown(e) {
  activePointers.add(e.pointerId);
  syncOpenState();
  try {
    app.setPointerCapture(e.pointerId);
  } catch {
    /* ignore */
  }
  e.preventDefault();
}

function onPointerUp(e) {
  activePointers.delete(e.pointerId);
  syncOpenState();
  e.preventDefault();
}

function onKeyDown(e) {
  if (e.repeat || e.metaKey || e.ctrlKey || e.altKey) return;
  keysDown += 1;
  syncOpenState();
  e.preventDefault();
}

function onKeyUp(e) {
  keysDown = Math.max(0, keysDown - 1);
  syncOpenState();
  e.preventDefault();
}

app.addEventListener("pointerdown", onPointerDown, { passive: false });
app.addEventListener("pointerup", onPointerUp, { passive: false });
app.addEventListener("pointercancel", onPointerUp, { passive: false });
window.addEventListener("keydown", onKeyDown);
window.addEventListener("keyup", onKeyUp);
window.addEventListener("blur", () => {
  activePointers.clear();
  keysDown = 0;
  syncOpenState();
});

document.addEventListener("gesturestart", (e) => e.preventDefault(), { passive: false });
document.addEventListener("touchmove", (e) => e.preventDefault(), { passive: false });

setup().catch((err) => {
  setStatus("Load error");
  console.error(err);
});
