/* ============================================================
   SERVICES SECTION — scroll-driven scene assembly.
   Each isometric scene assembles depth-first as it enters the
   viewport: ground/shadow layer, then base objects, then the
   elevated accent element — each moving along a valid isometric
   screen axis (straight up, up-left, up-right; never in from the
   side, which would break the projection illusion).

   Two paths:
   - Native: CSS animation-timeline: view() (see style.css). Runs
     off the main thread, zero JS cost, used when supported.
   - Fallback: IntersectionObserver adds .is-assembled once; plain
     CSS transitions with staggered delays take it from there.

   Runs on 'full' and 'reduced' tiers. 'static' renders assembled
   with zero animation (handled purely by the tier CSS, see below).
   ============================================================ */

(function () {
  "use strict";

  if (!window.SVTier) return;

  const supportsScrollTimeline =
    typeof CSS !== "undefined" && CSS.supports && CSS.supports("animation-timeline: view()");

  // ---- One-time DOM restructure: wrap each scene's children into three
  // depth-tier groups so both the native and fallback paths can target them. ----
  function wrapLayers(svg) {
    if (svg.dataset.layered) return;
    svg.dataset.layered = "1";

    const defs = svg.querySelector("defs");
    const accentGroup = svg.querySelector(".iso-scene-accent");
    const children = [...svg.children].filter((el) => el !== defs && el !== accentGroup);
    const groundEls = children.filter((el) => el.classList.contains("iso-shadow"));
    const baseEls = children.filter((el) => !el.classList.contains("iso-shadow"));

    const ns = "http://www.w3.org/2000/svg";
    const groundG = document.createElementNS(ns, "g");
    groundG.setAttribute("class", "iso-layer-ground");
    const baseG = document.createElementNS(ns, "g");
    baseG.setAttribute("class", "iso-layer-base");

    groundEls.forEach((el) => groundG.appendChild(el));
    baseEls.forEach((el) => baseG.appendChild(el));

    svg.appendChild(groundG);
    svg.appendChild(baseG);
    if (accentGroup) svg.appendChild(accentGroup); // re-append last (paint order)
  }

  function setupFallback(svg) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.closest(".sv2-scene").classList.add("is-assembled");
          io.unobserve(entry.target);
        });
      },
      { threshold: 0.15 }
    );
    io.observe(svg);
  }

  function init() {
    document.querySelectorAll(".sv2-scene svg").forEach((svg) => {
      wrapLayers(svg);
      if (!supportsScrollTimeline) setupFallback(svg);
    });
    document.querySelector(".services-v2").classList.add(
      supportsScrollTimeline ? "sv-assembly-native" : "sv-assembly-fallback"
    );
  }

  const tier = window.SVTier.get();
  if (tier !== "static") init();
  window.SVTier.onChange((next) => {
    if (next !== "static" && !document.querySelector(".services-v2").classList.contains("sv-assembly-native") &&
        !document.querySelector(".services-v2").classList.contains("sv-assembly-fallback")) {
      init();
    }
  });
})();
