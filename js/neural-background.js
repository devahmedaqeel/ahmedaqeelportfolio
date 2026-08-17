/**
 * Master Global Viewport Neural Network Background Engine
 * Customized for Ahmed Aqeel's AI Full-Stack Developer Portfolio.
 *
 * Performance & Visual Architecture:
 * 1. Single Viewport Fixed Canvas (100vw x 100vh) at z-index: 0
 * 2. Coverage across ALL sections (Navbar -> Hero -> Skills -> Services -> Projects -> Experience -> Contact -> Footer)
 * 3. Delta-time (dt) frame rate independent motion (60Hz / 120Hz / 144Hz compatible)
 * 4. Fast Squared-Distance (distSq) connection calculations for 60 FPS performance
 * 5. Smooth 400ms JS color lerping on Light/Dark theme toggle without particle reset
 * 6. Responsive Particle Count (Desktop: 60, Tablet: 40, Mobile: 22)
 * 7. Capped DPR (max 2.0) scaling with explicit CSS pixel bounds
 * 8. Touch guard & subtle desktop mouse displacement
 * 9. Reduced motion & visibility tab pause support
 */

(function () {
  "use strict";

  // Palette RGB definitions for smooth theme lerping
  const PALETTES = {
    dark: {
      cyan:   { r: 0,   g: 242, b: 254 }, // #00f2fe
      indigo: { r: 129, g: 140, b: 248 }, // #818cf8
      pink:   { r: 244, g: 114, b: 182 }, // #f472b6
      line:   { r: 0,   g: 242, b: 254 }, // Cyan lines
      lineMaxAlpha: 0.16
    },
    light: {
      cyan:   { r: 2,   g: 132, b: 199 }, // #0284c7 (Sky Blue)
      indigo: { r: 79,  g: 70,  b: 229 }, // #4f46e5 (Indigo)
      pink:   { r: 219, g: 39,  b: 119 }, // #db2777 (Muted Rose)
      line:   { r: 2,   g: 132, b: 199 }, // Sky blue lines
      lineMaxAlpha: 0.18
    }
  };

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function lerpRGBStr(c1, c2, t) {
    const r = Math.round(lerp(c1.r, c2.r, t));
    const g = Math.round(lerp(c1.g, c2.g, t));
    const b = Math.round(lerp(c1.b, c2.b, t));
    return `rgb(${r}, ${g}, ${b})`;
  }

  function lerpRGBAStr(c1, c2, alpha, t) {
    const r = Math.round(lerp(c1.r, c2.r, t));
    const g = Math.round(lerp(c1.g, c2.g, t));
    const b = Math.round(lerp(c1.b, c2.b, t));
    return `rgba(${r}, ${g}, ${b}, ${alpha.toFixed(3)})`;
  }

  class GlobalNeuralEngine {
    constructor() {
      this.canvas = document.getElementById("neural-canvas") || document.getElementById("crystal-neurolink-canvas") || document.getElementById("nesh-bg-canvas");
      if (!this.canvas) {
        this.createCanvas();
      }

      this.ctx = this.canvas.getContext("2d", { alpha: true });
      if (!this.ctx) return;

      this.width = 0;
      this.height = 0;
      this.dpr = 1;
      this.lastTime = performance.now();
      this.animId = null;

      // Theme State (0.0 = dark, 1.0 = light)
      const initialTheme = document.documentElement.getAttribute("data-theme") || "dark";
      this.themeFactor = initialTheme === "light" ? 1.0 : 0.0;
      this.targetThemeFactor = this.themeFactor;

      // Mouse & Touch State
      this.mouse = { x: -9999, y: -9999, targetX: -9999, targetY: -9999, active: false };
      this.isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;

      // Motion Preference
      this.reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      this.initEvents();
      this.resize();
      this.initParticles();

      if (this.reducedMotion) {
        this.renderFrame(16);
      } else {
        this.animate(performance.now());
      }
    }

    createCanvas() {
      let container = document.getElementById("neural-background") || document.getElementById("stack-network");
      if (!container) {
        container = document.createElement("div");
        container.id = "neural-background";
        container.className = "neural-background";
        document.body.prepend(container);
      }
      this.canvas = document.createElement("canvas");
      this.canvas.id = "neural-canvas";
      container.appendChild(this.canvas);
    }

    /* ─── Responsive Particle Density ──────────────────────────────────── */
    initParticles() {
      const isMobile = this.width < 768;
      const isTablet = this.width >= 768 && this.width < 1024;

      // Density: Desktop 60, Tablet 40, Mobile 22
      const count = isMobile ? 22 : (isTablet ? 40 : 60);
      this.particles = [];

      for (let i = 0; i < count; i++) {
        const roll = Math.random();
        const layer = roll > 0.65 ? 2 : (roll > 0.35 ? 1 : 0);

        let radius, baseAlpha;
        if (layer === 2) {
          radius = Math.random() * 0.5 + (isMobile ? 1.0 : 1.4);
          baseAlpha = Math.random() * 0.20 + 0.50;
        } else if (layer === 1) {
          radius = Math.random() * 0.4 + (isMobile ? 0.7 : 1.0);
          baseAlpha = Math.random() * 0.18 + 0.38;
        } else {
          radius = Math.random() * 0.3 + (isMobile ? 0.5 : 0.7);
          baseAlpha = Math.random() * 0.15 + 0.22;
        }

        const colorType = roll > 0.45 ? "cyan" : (roll > 0.25 ? "indigo" : "pink");

        this.particles.push({
          x: Math.random() * this.width,
          y: Math.random() * this.height,
          radius: radius,
          colorType: colorType,
          alpha: baseAlpha,
          layer: layer,
          hasGlow: layer === 2 && Math.random() > 0.5,
          speedX: (Math.random() - 0.5) * (isMobile ? 12 : 20), // px per sec
          speedY: (-Math.random() * (isMobile ? 14 : 22) - 4),
          twinklePhase: Math.random() * Math.PI * 2,
          twinkleSpeed: Math.random() * 1.8 + 0.8
        });
      }
    }

    /* ─── Controlled Max Connection Distance ────────────────────────────── */
    getConnectionDistance() {
      return Math.min(Math.max(this.width * 0.08, 65), 125);
    }

    /* ─── Viewport Resize & DPR Scaling ───────────────────────────────── */
    resize() {
      const w = window.innerWidth;
      const h = window.innerHeight;

      this.dpr = Math.min(window.devicePixelRatio || 1, 2.0);
      this.width = w;
      this.height = h;

      // Set physical canvas resolution
      this.canvas.width = Math.floor(w * this.dpr);
      this.canvas.height = Math.floor(h * this.dpr);

      // Set CSS style dimensions strictly to viewport px
      this.canvas.style.width = w + "px";
      this.canvas.style.height = h + "px";

      // Reset transform matrix cleanly
      this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);

      // Re-initialize particles if density tier changes
      if (this.particles) {
        const targetCount = w < 768 ? 22 : (w < 1024 ? 40 : 60);
        if (Math.abs(this.particles.length - targetCount) > 8) {
          this.initParticles();
        }
      }
    }

    /* ─── Theme Switch & Event Handlers ──────────────────────────────────── */
    updateThemeTarget(themeName) {
      this.targetThemeFactor = themeName === "light" ? 1.0 : 0.0;
    }

    initEvents() {
      window.addEventListener("resize", () => this.resize(), { passive: true });

      if (!this.isTouch) {
        window.addEventListener("mousemove", (e) => {
          this.mouse.targetX = e.clientX;
          this.mouse.targetY = e.clientY;
          this.mouse.active = true;
        }, { passive: true });

        window.addEventListener("mouseleave", () => {
          this.mouse.active = false;
        }, { passive: true });
      }

      // CustomEvent themechange
      window.addEventListener("themechange", (e) => {
        const newTheme = e.detail ? e.detail.theme : (document.documentElement.getAttribute("data-theme") || "dark");
        this.updateThemeTarget(newTheme);
      });

      // MutationObserver on <html data-theme>
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((m) => {
          if (m.attributeName === "data-theme") {
            const currentAttr = document.documentElement.getAttribute("data-theme") || "dark";
            this.updateThemeTarget(currentAttr);
          }
        });
      });
      observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

      // Tab visibility pause
      document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
          if (this.animId) {
            cancelAnimationFrame(this.animId);
            this.animId = null;
          }
        } else if (!this.reducedMotion && !this.animId) {
          this.lastTime = performance.now();
          this.animate(performance.now());
        }
      });
    }

    /* ─── High-Performance Delta-Time Frame Render ─────────────────────── */
    renderFrame(dt) {
      const ctx = this.ctx;
      const maxDist = this.getConnectionDistance();
      const maxDistSq = maxDist * maxDist;
      const len = this.particles.length;

      // Smooth Theme Interpolation (~400ms lerp)
      this.themeFactor += (this.targetThemeFactor - this.themeFactor) * 0.09;
      const tf = this.themeFactor;

      const darkPalette = PALETTES.dark;
      const lightPalette = PALETTES.light;
      const activeLineMaxAlpha = lerp(darkPalette.lineMaxAlpha, lightPalette.lineMaxAlpha, tf);

      // Clear viewport rectangle cleanly
      ctx.clearRect(0, 0, this.width, this.height);

      // Update Mouse interpolation
      if (this.mouse.active && !this.isTouch) {
        this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.08;
        this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.08;
      }

      // Delta time scaling factor (normalized around 60fps)
      const sec = dt / 1000;

      // Render Particles & Synapse Lines
      for (let i = 0; i < len; i++) {
        const p = this.particles[i];

        // Delta-time frame rate independent movement
        p.x += p.speedX * sec;
        p.y += p.speedY * sec;
        p.twinklePhase += p.twinkleSpeed * sec;

        // Wrap around inside viewport bounds [0, width] x [0, height]
        if (p.y < -5) { p.y = this.height + 5; p.x = Math.random() * this.width; }
        if (p.x < -5) p.x = this.width + 5;
        if (p.x > this.width + 5) p.x = -5;

        // Gentle Mouse Interaction (Repel within 90px)
        if (this.mouse.active && !this.isTouch) {
          const mdx = p.x - this.mouse.x;
          const mdy = p.y - this.mouse.y;
          const mdistSq = mdx * mdx + mdy * mdy;
          if (mdistSq < 8100 && mdistSq > 25) { // 90px squared
            const mdist = Math.sqrt(mdistSq);
            const force = (90 - mdist) / 90;
            p.x += (mdx / mdist) * force * 0.8;
            p.y += (mdy / mdist) * force * 0.8;
          }
        }

        // Particle Color Lerp
        const darkRGB = darkPalette[p.colorType];
        const lightRGB = lightPalette[p.colorType];
        const particleColorStr = lerpRGBStr(darkRGB, lightRGB, tf);

        // Draw Soft Glow Halo
        if (p.hasGlow) {
          const glowAlpha = lerp(p.alpha * 0.20, p.alpha * 0.16, tf);
          ctx.fillStyle = particleColorStr;
          ctx.globalAlpha = glowAlpha;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius + 2.5, 0, Math.PI * 2);
          ctx.fill();
        }

        // Draw Particle Core
        const twinkle = Math.sin(p.twinklePhase) * 0.18 + 0.82;
        const alphaVal = lerp(p.alpha * twinkle, Math.min(0.85, p.alpha * twinkle * 1.25), tf);
        ctx.fillStyle = particleColorStr;
        ctx.globalAlpha = alphaVal;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();

        // Optimized Connection Lines using Squared Distance
        for (let j = i + 1; j < len; j++) {
          const p2 = this.particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const distSq = dx * dx + dy * dy;

          if (distSq < maxDistSq) {
            const dist = Math.sqrt(distSq);
            const lineAlpha = (1 - dist / maxDist) * activeLineMaxAlpha;
            ctx.strokeStyle = lerpRGBAStr(darkPalette.line, lightPalette.line, lineAlpha, tf);
            ctx.lineWidth = 0.75;
            ctx.globalAlpha = 1.0;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      ctx.globalAlpha = 1.0;
    }

    /* ─── Frame Rate Independent Animation Loop ─────────────────────────── */
    animate(currentTime) {
      if (this.reducedMotion) {
        this.renderFrame(16);
        return;
      }

      const dt = Math.min(currentTime - this.lastTime, 50); // Cap max dt at 50ms (20fps min)
      this.lastTime = currentTime;

      this.renderFrame(dt);
      this.animId = requestAnimationFrame((t) => this.animate(t));
    }
  }

  // Auto initialize on DOMReady
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => new GlobalNeuralEngine());
  } else {
    new GlobalNeuralEngine();
  }
})();
