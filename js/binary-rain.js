/* ============================================================
   BINARY RAIN — columns of 0/1 drifting up and down the screen,
   the literal "computer / machine learning data" background layer.
   Sits behind the neural network + globe (see index.html layering).
   Same perf pattern as the rest of the background: mobile-reduced
   column count, capped mobile framerate, pauses when tab hidden,
   respects prefers-reduced-motion, resize debounced + dpr capped.
   ============================================================ */

(function () {
  "use strict";

  const canvas = document.getElementById("binary-rain-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isMobile = () => window.innerWidth < 768;

  const FONT_SIZE = 16;
  const COLORS = ["rgba(34, 211, 238, 0.85)", "rgba(139, 92, 246, 0.75)"];

  let w = 0, h = 0, dpr = 1;
  let columns = [];

  function buildColumns() {
    const count = Math.floor(w / FONT_SIZE);
    const step = isMobile() ? 1.5 : 1; // dense enough to read clearly across the whole page
    columns = [];
    for (let i = 0; i < count; i += step) {
      columns.push({
        x: i * FONT_SIZE,
        y: Math.random() * h,
        dir: Math.random() < 0.5 ? 1 : -1, // flow up or down per column
        speed: FONT_SIZE * (0.5 + Math.random() * 0.6),
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        char: Math.random() < 0.5 ? "0" : "1"
      });
    }
  }

  function setSize() {
    w = window.innerWidth;
    h = window.innerHeight;
    dpr = Math.min(window.devicePixelRatio || 1, isMobile() ? 1.5 : 2);
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    buildColumns();
  }
  setSize();

  /* Mobile browsers collapse/expand the address bar as you scroll,
     firing a `resize` event with only the height changing. Reacting to
     that rebuilt every column from scratch (buildColumns re-randomizes
     positions), making the rain visibly jump/reset while scrolling.
     Only really resize on an actual width change or a big height jump. */
  let lastKnownW = window.innerWidth;
  let lastKnownH = window.innerHeight;
  let resizeTimer = null;
  window.addEventListener("resize", () => {
    if (resizeTimer) clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      const nw = window.innerWidth;
      const nh = window.innerHeight;
      const widthChanged = nw !== lastKnownW;
      const heightChangedALot = Math.abs(nh - lastKnownH) > 150;
      if (!widthChanged && !heightChangedALot) return;
      lastKnownW = nw;
      lastKnownH = nh;
      setSize();
    }, 200);
  }, { passive: true });

  /* Skip drawing while actively scrolling on mobile — smooth-scroll from
     nav clicks fires continuous scroll events, and redrawing this canvas
     on every one of them competed with the scroll compositor and caused
     the page to visibly stall/freeze mid-scroll. */
  let isScrolling = false;
  let scrollTimer = null;
  function markScrolling() {
    isScrolling = true;
    if (scrollTimer) clearTimeout(scrollTimer);
    scrollTimer = setTimeout(() => { isScrolling = false; }, 150);
  }
  window.addEventListener("scroll", markScrolling, { passive: true });
  window.addEventListener("touchmove", markScrolling, { passive: true });

  function drawFrame(dt) {
    ctx.clearRect(0, 0, w, h);
    ctx.font = `600 ${FONT_SIZE}px 'JetBrains Mono', monospace`;

    for (let i = 0; i < columns.length; i++) {
      const c = columns[i];
      ctx.fillStyle = c.color;
      ctx.fillText(c.char, c.x, c.y);

      if (!reducedMotion) {
        c.y += c.speed * c.dir * dt;
        if (c.dir > 0 && c.y > h + FONT_SIZE) {
          c.y = -FONT_SIZE;
          c.char = Math.random() < 0.5 ? "0" : "1";
        } else if (c.dir < 0 && c.y < -FONT_SIZE) {
          c.y = h + FONT_SIZE;
          c.char = Math.random() < 0.5 ? "0" : "1";
        } else if (Math.random() < 0.02 * (dt * 60)) {
          c.char = Math.random() < 0.5 ? "0" : "1"; // occasional flicker mid-flight
        }
      }
    }
  }

  let running = true;
  document.addEventListener("visibilitychange", () => {
    running = !document.hidden;
    if (running && !reducedMotion) requestAnimationFrame(animate);
  });

  const mobileFrameInterval = 1000 / 40;
  const mobileScrollFrameInterval = 1000 / 20;
  let lastFrameAt = 0;
  let lastMotionAt = performance.now();

  function animate(now) {
    if (!running) return;
    requestAnimationFrame(animate);
    if (isMobile()) {
      const interval = isScrolling ? mobileScrollFrameInterval : mobileFrameInterval;
      if (now - lastFrameAt < interval) return;
    }
    lastFrameAt = now;

    // Time-based movement so digit speed stays constant whether we're
    // rendering at 60fps or throttled to 20fps during scroll.
    const dt = Math.min(0.1, (now - lastMotionAt) / 1000) * 60 * 0.016;
    lastMotionAt = now;
    drawFrame(dt);
  }

  if (reducedMotion) {
    drawFrame(0); // single static frame, no rAF loop
  } else {
    requestAnimationFrame(animate);
  }
})();
