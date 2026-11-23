/**
 * Crowd Eyes — Cargo / GitHub Pages web adaptation
 * Desktop: hold Space → eyes open; release → close.
 * Mobile: hold finger on screen → eyes open; lift → close.
 * Documentation: ?auto=1 → sporadic random blinks (no webcam).
 * Slots use alignment-window coordinates; pack frames are used as-is.
 */

const statusEl = document.getElementById("status");
const hintEl = document.getElementById("hint");
const app = document.getElementById("app");
const eyesRoot = document.getElementById("eyes");

/** @type {Map<string, { frames: HTMLImageElement[], index: number, open: boolean, animating: boolean, img: HTMLImageElement, openMs: number, closeMs: number }>} */
const players = new Map();
let spaceHeld = false;
/** @type {Set<number>} */
const activeTouches = new Set();
let autoBlinkOpen = false;
let autoBlinkMode = false;
let eyesOpen = false;
let config = null;

const isTouchUi =
  window.matchMedia("(hover: none) and (pointer: coarse)").matches ||
  navigator.maxTouchPoints > 0;

let HINT_IDLE = isTouchUi ? "Press & hold" : "Hold Space";
let HINT_OPEN = isTouchUi ? "Holding — eyes open" : "Holding Space — eyes open";

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function rand(min, max) {
  return min + Math.random() * (max - min);
}

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
  const open = spaceHeld || activeTouches.size > 0 || autoBlinkOpen;
  if (open === eyesOpen) return;
  eyesOpen = open;
  app.classList.toggle("is-open", open);
  document.getElementById("stage")?.setAttribute("data-open", open ? "true" : "false");
  if (hintEl) {
    hintEl.textContent = open ? HINT_OPEN : HINT_IDLE;
  }
  for (const id of players.keys()) animateFigure(id, open);
}

/** One blink: open briefly, then close. Skips if user is holding. */
async function blinkOnce() {
  if (spaceHeld || activeTouches.size > 0) return;
  autoBlinkOpen = true;
  syncOpenState();
  await sleep(rand(160, 520));
  if (spaceHeld || activeTouches.size > 0) {
    autoBlinkOpen = false;
    return;
  }
  autoBlinkOpen = false;
  syncOpenState();
}

/**
 * Sporadic documentation blinks — random gaps, open time, occasional double-blink.
 * Enable with ?auto=1 or ?blink=1
 */
function startAutoBlink() {
  autoBlinkMode = true;
  HINT_IDLE = "Auto blink · documentation";
  HINT_OPEN = "Blinking";
  if (hintEl) hintEl.textContent = HINT_IDLE;
  app.setAttribute("aria-label", "Automatic blinking for documentation");

  async function loop() {
    while (autoBlinkMode) {
      await sleep(rand(1400, 4200));
      if (!autoBlinkMode) break;
      await blinkOnce();
      // ~30% chance of a quick double-blink
      if (Math.random() < 0.3) {
        await sleep(rand(70, 160));
        await blinkOnce();
      }
      // Rare longer open stare (~8%)
      if (Math.random() < 0.08 && !spaceHeld && activeTouches.size === 0) {
        await sleep(rand(400, 900));
        autoBlinkOpen = true;
        syncOpenState();
        await sleep(rand(600, 1600));
        autoBlinkOpen = false;
        syncOpenState();
      }
    }
  }
  loop();
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
  // Bust CDN/browser cache so config.json edits show up on refresh
  config = await fetch(`./config.json?t=${Date.now()}`, { cache: "no-store" }).then((r) => r.json());
  const openMs = config.interaction?.openMs ?? 350;
  const closeMs = config.interaction?.closeMs ?? 280;
  const params = new URLSearchParams(location.search);
  const debug = params.get("debug") === "1";
  const forceOpen = params.get("open") === "1";
  const autoBlink = params.get("auto") === "1" || params.get("blink") === "1";
  const debugOverlay = document.getElementById("debugOverlay");
  if (debug && debugOverlay) {
    debugOverlay.hidden = false;
  }

  if (hintEl) hintEl.textContent = HINT_IDLE;
  if (isTouchUi && !autoBlink) {
    app.setAttribute("aria-label", "Press and hold the screen to open the eyes");
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
    // Let scaled/rotated/shifted plates extend; drawing cutouts mask them
    if (rotate || scale !== 1 || dx || dy) slot.style.overflow = "visible";
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

  if (forceOpen && !autoBlink) {
    spaceHeld = true;
    syncOpenState();
  }

  if (autoBlink) {
    startAutoBlink();
  }
}

function isSpace(e) {
  return e.code === "Space" || e.key === " " || e.key === "Spacebar";
}

function onKeyDown(e) {
  if (!isSpace(e)) return;
  e.preventDefault();
  if (e.repeat || spaceHeld) return;
  spaceHeld = true;
  syncOpenState();
}

function onKeyUp(e) {
  if (!isSpace(e)) return;
  e.preventDefault();
  if (!spaceHeld) return;
  spaceHeld = false;
  syncOpenState();
}

function releaseAllHolds() {
  let changed = false;
  if (spaceHeld) {
    spaceHeld = false;
    changed = true;
  }
  if (activeTouches.size) {
    activeTouches.clear();
    changed = true;
  }
  if (changed) syncOpenState();
}

/** Native touch — most reliable inside Cargo iframes on iOS/Android. */
function onTouchStart(e) {
  for (const t of e.changedTouches) activeTouches.add(t.identifier);
  syncOpenState();
  e.preventDefault();
}

function onTouchEnd(e) {
  for (const t of e.changedTouches) activeTouches.delete(t.identifier);
  syncOpenState();
  e.preventDefault();
}

/** Pointer fallback (pen / browsers that prefer pointer events). */
function isFingerPointer(e) {
  return e.pointerType === "touch" || e.pointerType === "pen";
}

function onPointerDown(e) {
  if (!isFingerPointer(e)) return;
  // Prefer touch events when available; skip duplicate pointer tracking
  if (e.pointerType === "touch") return;
  activeTouches.add(e.pointerId);
  syncOpenState();
  try {
    app.setPointerCapture(e.pointerId);
  } catch {
    /* ignore */
  }
  e.preventDefault();
}

function onPointerUp(e) {
  if (e.pointerType === "touch") return;
  if (!activeTouches.has(e.pointerId)) return;
  activeTouches.delete(e.pointerId);
  syncOpenState();
  e.preventDefault();
}

window.addEventListener("keydown", onKeyDown);
window.addEventListener("keyup", onKeyUp);

const touchOpts = { passive: false, capture: true };
window.addEventListener("touchstart", onTouchStart, touchOpts);
window.addEventListener("touchend", onTouchEnd, touchOpts);
window.addEventListener("touchcancel", onTouchEnd, touchOpts);

app.addEventListener("pointerdown", onPointerDown, { passive: false });
app.addEventListener("pointerup", onPointerUp, { passive: false });
app.addEventListener("pointercancel", onPointerUp, { passive: false });

window.addEventListener("blur", releaseAllHolds);
document.addEventListener("visibilitychange", () => {
  if (document.hidden) releaseAllHolds();
});

document.addEventListener("gesturestart", (e) => e.preventDefault(), { passive: false });

setup().catch((err) => {
  setStatus("Load error");
  console.error(err);
});
