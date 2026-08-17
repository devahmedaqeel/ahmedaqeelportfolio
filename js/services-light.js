/* ============================================================
   SERVICES SECTION — one shared virtual light for the whole grid.
   Without this, each card computed its own specular highlight from
   its own cursor position — six independent lights. Here there is
   exactly one: a single pointermove listener on the section, one
   rAF write per frame publishing --light-x/--light-y (px, section-
   relative) onto the section element. Each card is a reader: it
   already knows its own offset within the section (set once, not
   per frame) and derives its local highlight position + falloff
   from the shared coordinate.

   'full' tier only — the capability table calls for no ambient
   light on 'reduced'/'static', and this module is inert there.
   ============================================================ */

(function () {
  "use strict";

  const section = document.querySelector(".services-v2");
  if (!section || !window.SVTier) return;

  let active = false;
  let raf = null;
  let lightX = 0, lightY = 0; // section-relative px
  const cards = [];

  function collectCardOffsets() {
    const sRect = section.getBoundingClientRect();
    cards.length = 0;
    document.querySelectorAll(".sv2-card").forEach((card) => {
      const r = card.getBoundingClientRect();
      cards.push({
        el: card,
        left: r.left - sRect.left,
        top: r.top - sRect.top,
        w: r.width,
        h: r.height,
        cx: r.left - sRect.left + r.width / 2,
        cy: r.top - sRect.top + r.height / 2,
        diag: Math.hypot(r.width, r.height) / 2,
      });
    });
  }

  function write() {
    section.style.setProperty("--light-x", lightX.toFixed(1) + "px");
    section.style.setProperty("--light-y", lightY.toFixed(1) + "px");

    // One loop over six cards, still inside the same single rAF write —
    // not six independent listeners each doing their own event handling.
    for (const c of cards) {
      const d = Math.hypot(lightX - c.cx, lightY - c.cy);
      const intensity = Math.max(0, 1 - d / (c.diag * 3.2));
      const localX = ((lightX - c.left) / c.w) * 100;
      const localY = ((lightY - c.top) / c.h) * 100;
      c.el.style.setProperty("--sv-light-intensity", intensity.toFixed(2));
      c.el.style.setProperty("--mx", localX.toFixed(1) + "%");
      c.el.style.setProperty("--my", localY.toFixed(1) + "%");
    }
    raf = null;
  }

  function schedule() {
    if (!raf) raf = requestAnimationFrame(write);
  }

  function onMove(e) {
    const sRect = section.getBoundingClientRect();
    lightX = e.clientX - sRect.left;
    lightY = e.clientY - sRect.top;
    schedule();
  }

  function attach() {
    if (active) return;
    active = true;
    collectCardOffsets();
    section.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("resize", collectCardOffsets, { passive: true });
  }

  function detach() {
    if (!active) return;
    active = false;
    section.removeEventListener("pointermove", onMove);
    window.removeEventListener("resize", collectCardOffsets);
    if (raf) cancelAnimationFrame(raf);
    raf = null;
    section.style.removeProperty("--light-x");
    section.style.removeProperty("--light-y");
    cards.forEach((c) => {
      c.el.style.removeProperty("--sv-light-intensity");
      c.el.style.removeProperty("--mx");
      c.el.style.removeProperty("--my");
    });
  }

  function sync(tier) {
    if (tier === "full") attach();
    else detach();
  }

  sync(window.SVTier.get());
  window.SVTier.onChange(sync);
})();
