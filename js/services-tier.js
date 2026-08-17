/* ============================================================
   SERVICES SECTION — capability tier resolution + runtime FPS guard.
   Single source of truth: every other services-* module reads the
   tier from here (data-tier on .services-v2, or window.SVTier.get())
   instead of independently checking capabilities. One decision.

   Tiers:
     full     — hover:hover + pointer:fine + >=8 cores + >=8GB RAM (if
                reported) + no reduced-motion. Tilt, shared light, all six
                ambient loops, scroll-driven assembly.
     reduced  — touch, or 4-8 cores. Scroll-driven assembly + accent
                pulse only. No tilt, no shared light.
     static   — prefers-reduced-motion, Save-Data, or <=4 cores. Scenes
                render fully assembled, zero animation.

   Demotion: sampled only while tier is 'full' (the only tier running
   anything expensive). Rolling 60-frame window; if the median frame
   time implies <50fps for over 1s, drop one tier and stay there for
   the session — no re-promotion, a device that struggled once isn't
   worth re-testing mid-visit.
   ============================================================ */

(function () {
  "use strict";

  const section = document.querySelector(".services-v2");
  if (!section) return;

  const listeners = [];
  let tier = resolveInitialTier();
  section.dataset.tier = tier;

  function resolveInitialTier() {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const saveData = navigator.connection && navigator.connection.saveData;
    const cores = navigator.hardwareConcurrency || 4;
    const mem = navigator.deviceMemory; // undefined on many browsers — only used when present
    const hoverFine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    if (reducedMotion || saveData || cores <= 4) return "static";
    if (hoverFine && cores >= 8 && (mem === undefined || mem >= 8)) return "full";
    return "reduced";
  }

  function setTier(next, reason) {
    if (next === tier) return;
    tier = next;
    section.dataset.tier = tier;
    if (isDebug()) console.info(`[services-tier] demoted → ${tier} (${reason})`);
    listeners.forEach((fn) => fn(tier));
  }

  function isDebug() {
    return location.hostname === "localhost" || location.search.includes("svdebug");
  }

  // ---- Runtime FPS guard (only meaningful — and only run — on 'full') ----
  const WINDOW_SIZE = 60;
  const frameDeltas = [];
  let lastTime = null;
  let belowThresholdSince = null;
  let guardRaf = null;

  function tick(now) {
    if (lastTime !== null) {
      const dt = now - lastTime;
      frameDeltas.push(dt);
      if (frameDeltas.length > WINDOW_SIZE) frameDeltas.shift();

      if (frameDeltas.length === WINDOW_SIZE) {
        const sorted = [...frameDeltas].sort((a, b) => a - b);
        const medianDt = sorted[Math.floor(sorted.length / 2)];
        const medianFps = 1000 / medianDt;

        if (medianFps < 50) {
          if (belowThresholdSince === null) belowThresholdSince = now;
          if (now - belowThresholdSince > 1000) {
            if (tier === "full") setTier("reduced", `median ${medianFps.toFixed(1)}fps sustained`);
            else if (tier === "reduced") setTier("static", `median ${medianFps.toFixed(1)}fps sustained`);
            // Reset the window and keep watching — a 'reduced' device that
            // just got demoted from 'full' may still be struggling and
            // worth cascading further down to 'static'.
            frameDeltas.length = 0;
            belowThresholdSince = null;
          }
        } else {
          belowThresholdSince = null;
        }
      }
    }
    lastTime = now;
    guardRaf = tier === "static" ? null : requestAnimationFrame(tick);
  }

  function startGuard() {
    // Sample on 'full' and 'reduced' — both run *some* animation, so both
    // are worth demoting further if the frame rate says so. 'static' has
    // nothing left to demote away from, so there's nothing to sample.
    if (guardRaf || tier === "static") return;
    frameDeltas.length = 0;
    lastTime = null;
    belowThresholdSince = null;
    guardRaf = requestAnimationFrame(tick);
  }
  function stopGuard() {
    if (guardRaf) cancelAnimationFrame(guardRaf);
    guardRaf = null;
  }

  // Guard only runs while the section is on screen — no point spending a
  // rAF loop measuring frame time for content nobody's looking at. Same
  // observer also toggles .sv-in-view, which the ambient-loop CSS uses to
  // pause every animation the instant the section scrolls off screen —
  // no point burning battery animating content nobody's looking at either.
  const io = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        section.classList.toggle("sv-in-view", e.isIntersecting);
        if (e.isIntersecting) startGuard();
        else stopGuard();
      }),
    { threshold: 0.1 }
  );
  io.observe(section);

  window.SVTier = {
    get: () => tier,
    onChange: (fn) => listeners.push(fn),
  };
})();
