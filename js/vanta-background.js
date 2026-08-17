/**
 * Vanta.js 3D Interactive Net Background Engine
 * Customized for Ahmed Aqeel's AI Full-Stack Developer Portfolio.
 * https://github.com/tengbao/vanta
 */

(function () {
  "use strict";

  let vantaEffect = null;

  function getTheme() {
    return document.documentElement.getAttribute("data-theme") || "dark";
  }

  function initVanta() {
    if (typeof VANTA === "undefined" || typeof THREE === "undefined") {
      console.warn("Vanta.js or Three.js not loaded yet. Retrying...");
      setTimeout(initVanta, 100);
      return;
    }

    const container = document.getElementById("stack-network");
    if (!container) return;

    const theme = getTheme();
    const isLight = theme === "light";

    try {
      if (vantaEffect) {
        vantaEffect.destroy();
        vantaEffect = null;
      }

      vantaEffect = VANTA.NET({
        el: container,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.00,
        minWidth: 200.00,
        scale: 1.00,
        scaleMobile: 1.00,
        color: isLight ? 0x0369a1 : 0x00f2fe,
        backgroundColor: isLight ? 0xf8fafc : 0x03050c,
        points: isLight ? 7.00 : 8.00,
        maxDistance: isLight ? 14.00 : 15.00,
        spacing: 22.00,
        showDots: true
      });
    } catch (err) {
      console.error("Vanta.js initialization error:", err);
    }
  }

  // Handle Theme Change
  window.addEventListener("themechange", (e) => {
    const theme = e.detail ? e.detail.theme : getTheme();
    if (vantaEffect) {
      const isLight = theme === "light";
      vantaEffect.setOptions({
        color: isLight ? 0x0369a1 : 0x00f2fe,
        backgroundColor: isLight ? 0xf8fafc : 0x03050c,
        points: isLight ? 7.00 : 8.00,
        maxDistance: isLight ? 14.00 : 15.00,
        spacing: 22.00
      });
    }
  });

  // Handle Resize
  window.addEventListener("resize", () => {
    if (vantaEffect && typeof vantaEffect.resize === "function") {
      vantaEffect.resize();
    }
  }, { passive: true });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initVanta);
  } else {
    initVanta();
  }
})();
