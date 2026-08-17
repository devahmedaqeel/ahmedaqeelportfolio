/**
 * 4K Glass Crystal & Neurolink Synapse Engine
 * Customized for Ahmed Aqeel's AI Full-Stack Developer Portfolio.
 *
 * Aesthetics:
 * - 4K High-Definition Obsidian Crystal Space
 * - Geometric Glass Facets & Refraction Mesh
 * - Small Floating Glass Skill Badges (React Native, Node.js, Ollama AI, n8n, Python, Firebase, SEO)
 * - Dynamic Neurolink Synapse Lines & Traveling Data Pulses
 * - Cursor Interactive Laser Connections
 * - 60 FPS Ultra-Smooth Performance
 */

(function () {
  "use strict";

  class CrystalNeurolinkEngine {
    constructor() {
      this.canvas = document.getElementById("crystal-neurolink-canvas");
      if (!this.canvas) return;

      this.ctx = this.canvas.getContext("2d", { alpha: true });
      if (!this.ctx) return;

      this.width = 0;
      this.height = 0;
      this.dpr = Math.min(window.devicePixelRatio || 1, 2.0);
      this.time = 0;
      this.theme = document.documentElement.getAttribute("data-theme") || "dark";

      // Mouse & Scroll
      this.mouse = { x: 0, y: 0, targetX: 0, targetY: 0, active: false };
      this.scroll = { y: window.scrollY || 0, targetY: window.scrollY || 0 };

      // Skill Badges matching Ahmed Aqeel's actual tech stack
      this.skills = [
        { type: "react",      label: "React Native", color: "#00f2fe", xR: 0.15, yR: 0.18 },
        { type: "node",       label: "Node.js",      color: "#10b981", xR: 0.82, yR: 0.22 },
        { type: "ai",         label: "Ollama AI",    color: "#a855f7", xR: 0.35, yR: 0.38 },
        { type: "automation", label: "n8n AI",       color: "#ec4899", xR: 0.75, yR: 0.52 },
        { type: "python",     label: "Python",       color: "#38bdf8", xR: 0.20, yR: 0.65 },
        { type: "database",   label: "Firebase",     color: "#f5c842", xR: 0.85, yR: 0.72 },
        { type: "seo",        label: "SEO & Video",  color: "#00e5c4", xR: 0.45, yR: 0.82 }
      ];

      this.reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      this.initNodes();
      this.initCrystalFacets();
      this.initEvents();
      this.resize();

      if (this.reducedMotion) {
        this.renderFrame();
      } else {
        this.animate();
      }
    }

    /* ─── Node & Particle Initialization ───────────────────────────────── */
    initNodes() {
      const isMobile = window.innerWidth < 768;
      const count = isMobile ? 5 : this.skills.length;

      this.skillNodes = this.skills.slice(0, count).map((sk, i) => ({
        type: sk.type,
        label: sk.label,
        color: sk.color,
        xRatio: sk.xR,
        yRatio: sk.yR,
        radius: isMobile ? 4.0 : 5.0,
        speedX: (Math.random() - 0.5) * 0.20,
        speedY: (Math.random() - 0.5) * 0.16,
        phase: Math.random() * Math.PI * 2,
        opacity: 0.85 + (i % 3) * 0.05
      }));

      // Neural Synapse Nodes (delicate micro dots)
      const particleCount = isMobile ? 28 : 60;
      this.synapseNodes = [];

      for (let i = 0; i < particleCount; i++) {
        const isNear = Math.random() > 0.4;
        this.synapseNodes.push({
          x: Math.random() * (this.width || window.innerWidth),
          y: Math.random() * (this.height || window.innerHeight),
          radius: isNear ? Math.random() * 0.4 + 0.7 : Math.random() * 0.3 + 0.4,
          color: Math.random() > 0.4 ? "#00f2fe" : (Math.random() > 0.5 ? "#8b5cf6" : "#00e5c4"),
          alpha: isNear ? Math.random() * 0.20 + 0.55 : Math.random() * 0.15 + 0.30,
          speedX: (Math.random() - 0.5) * 0.30,
          speedY: (-Math.random() * 0.32 - 0.08),
          twinkleSpeed: Math.random() * 0.03 + 0.015,
          isNear
        });
      }
    }

    /* ─── 4K Crystal Facet Mesh ────────────────────────────────────────── */
    initCrystalFacets() {
      this.crystalPolygons = [];
    }

    /* ─── Events & Resize ───────────────────────────────────────────────── */
    initEvents() {
      window.addEventListener("resize", () => this.resize(), { passive: true });

      const updateMouse = (x, y) => {
        this.mouse.targetX = x;
        this.mouse.targetY = y;
        this.mouse.active = true;
      };

      window.addEventListener("mousemove", (e) => updateMouse(e.clientX, e.clientY), { passive: true });
      window.addEventListener("touchmove", (e) => {
        if (e.touches && e.touches[0]) {
          updateMouse(e.touches[0].clientX, e.touches[0].clientY);
        }
      }, { passive: true });

      window.addEventListener("scroll", () => {
        this.scroll.targetY = window.scrollY || 0;
      }, { passive: true });

      window.addEventListener("themechange", (e) => {
        this.theme = e.detail ? e.detail.theme : "dark";
      });
    }

    resize() {
      this.width = window.innerWidth;
      this.height = window.innerHeight;
      this.dpr = window.innerWidth < 768 ? 1.0 : Math.min(window.devicePixelRatio || 1, 2.0);
      this.canvas.width = Math.round(this.width * this.dpr);
      this.canvas.height = Math.round(this.height * this.dpr);
      this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);

      if (!this.mouse.active) {
        this.mouse.targetX = this.width * 0.5;
        this.mouse.targetY = this.height * 0.35;
        this.mouse.x = this.mouse.targetX;
        this.mouse.y = this.mouse.targetY;
      }
    }

    /* ─── Layer 1: 4K Glass Crystal Facets ──────────────────────────────── */
    drawGlassCrystalFacets() {
      const ctx = this.ctx;
      const isLight = this.theme === "light";

      ctx.save();
      this.crystalPolygons.forEach((poly) => {
        ctx.beginPath();
        poly.points.forEach((pt, idx) => {
          const px = pt.x * this.width;
          const py = pt.y * this.height;
          idx === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
        });
        ctx.closePath();

        ctx.fillStyle = isLight ? "rgba(3, 105, 161, 0.015)" : poly.color;
        ctx.fill();

        ctx.strokeStyle = isLight ? "rgba(3, 105, 161, 0.04)" : "rgba(255, 255, 255, 0.035)";
        ctx.lineWidth = 0.8;
        ctx.stroke();
      });
      ctx.restore();
    }

    /* ─── Layer 2: Small Glass Skill Pill Badges ──────────────────────────── */
    drawSmallSkillBadge(x, y, radius, type, label, color, opacity) {
      const ctx = this.ctx;
      const isLight = this.theme === "light";

      ctx.save();

      // Font & Metrics calculation
      const fontSize = 9;
      ctx.font = `600 ${fontSize}px Inter, system-ui, sans-serif`;
      const textWidth = ctx.measureText(label).width;
      const iconSize = 10;
      const paddingX = 8;
      const badgeW = iconSize + textWidth + paddingX * 2.2;
      const badgeH = 18;
      const badgeR = badgeH * 0.5;

      const left = x - badgeW * 0.5;
      const top = y - badgeH * 0.5;

      // Subtle Glass Halo
      ctx.fillStyle = isLight ? `rgba(3, 105, 161, ${opacity * 0.18})` : color + "22";
      ctx.beginPath();
      if (typeof ctx.roundRect === "function") {
        ctx.roundRect(left - 2, top - 2, badgeW + 4, badgeH + 4, badgeR + 2);
      } else {
        ctx.arc(x, y, badgeW * 0.5 + 2, 0, Math.PI * 2);
      }
      ctx.fill();

      // Glass Pill Body
      ctx.fillStyle = isLight ? "rgba(255, 255, 255, 0.95)" : "rgba(10, 16, 36, 0.88)";
      ctx.strokeStyle = isLight ? "rgba(3, 105, 161, 0.75)" : color;
      ctx.lineWidth = 1.0;

      ctx.beginPath();
      if (typeof ctx.roundRect === "function") {
        ctx.roundRect(left, top, badgeW, badgeH, badgeR);
      } else {
        ctx.arc(x, y, badgeW * 0.5, 0, Math.PI * 2);
      }
      ctx.fill();
      ctx.stroke();

      // Icon & Label Text Color
      const iconColor = isLight && (color === "#00f2fe" || color === "#38bdf8") ? "#0284c7" : color;

      // Small Icon Dot / Emblem
      const ix = left + paddingX + 3;
      const iy = y;
      ctx.fillStyle = iconColor;
      ctx.beginPath();
      ctx.arc(ix, iy, 2.2, 0, Math.PI * 2);
      ctx.fill();

      // Skill Label Text
      ctx.fillStyle = isLight ? "#0f172a" : "#f8fafc";
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      ctx.fillText(label, ix + 7, iy + 0.5);

      ctx.restore();
    }

    /* ─── Layer 3: Neurolink Synapse Lines & Traveling Pulses ─────────────── */
    drawNeurolinkNetwork() {
      const ctx = this.ctx;
      const isLight = this.theme === "light";
      const scrollOffset = this.scroll.y * 0.08;

      // Compute Skill Node positions
      const computedSkillNodes = this.skillNodes.map((node) => {
        let x = (node.xRatio + Math.sin(this.time * 0.0004 + node.phase) * 0.05) * this.width;
        let y = (node.yRatio + Math.cos(this.time * 0.0003 + node.phase) * 0.05) * this.height - scrollOffset;
        const totalH = this.height * 1.4;
        y = ((y % totalH) + totalH) % totalH - this.height * 0.2;
        return { ...node, x, y };
      });

      // Update Synapse Nodes
      const len = this.synapseNodes.length;
      for (let i = 0; i < len; i++) {
        const p = this.synapseNodes[i];
        p.y += p.speedY;
        p.x += p.speedX + Math.sin(this.time * 0.0008 + p.y * 0.005) * 0.15;

        if (p.y < -10) { p.y = this.height + 10; p.x = Math.random() * this.width; }
        if (p.x < -10) p.x = this.width + 10;
        if (p.x > this.width + 10) p.x = -10;

        // Render Particle Core
        const twinkle = Math.sin(this.time * p.twinkleSpeed) * 0.20 + 0.80;
        const alphaVal = isLight ? Math.min(0.90, p.alpha * twinkle * 1.4) : p.alpha * twinkle;
        ctx.fillStyle = p.color;
        ctx.globalAlpha = alphaVal;
        ctx.beginPath();
        ctx.arc(p.x, p.y, isLight ? p.radius * 1.1 : p.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1.0;

        // Synapse Lines between nearby particles
        if (p.isNear) {
          for (let j = i + 1; j < len; j++) {
            const p2 = this.synapseNodes[j];
            if (!p2.isNear) continue;

            const dx = p.x - p2.x;
            const dy = p.y - p2.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 110) {
              const la = (1 - dist / 110) * (isLight ? 0.28 : 0.18);
              ctx.strokeStyle = isLight ? `rgba(3, 105, 161, ${la})` : `rgba(0, 242, 254, ${la})`;
              ctx.lineWidth = 0.75;
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.stroke();
            }
          }
        }
      }

      // Neurolink Synapse Lines between Skill Nodes & Particles
      computedSkillNodes.forEach((node) => {
        this.synapseNodes.forEach((p) => {
          if (!p.isNear) return;
          const dx = node.x - p.x;
          const dy = node.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 130) {
            const la = (1 - dist / 130) * (isLight ? 0.32 : 0.22);
            ctx.strokeStyle = isLight ? `rgba(3, 105, 161, ${la})` : `rgba(0, 242, 254, ${la})`;
            ctx.lineWidth = 0.85;
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(p.x, p.y);
            ctx.stroke();

            // Traveling Data Signal Pulse
            const pulsePos = (this.time * 0.0012 + node.phase) % 1;
            const px = node.x + (p.x - node.x) * pulsePos;
            const py = node.y + (p.y - node.y) * pulsePos;
            ctx.fillStyle = isLight ? `rgba(3, 105, 161, ${la * 2.0})` : `rgba(0, 242, 254, ${la * 2.2})`;
            ctx.beginPath();
            ctx.arc(px, py, 1.5, 0, Math.PI * 2);
            ctx.fill();
          }
        });

        // Render Skill Badge
        const pulseOpacity = node.opacity * (Math.sin(this.time * 0.0016 + node.phase) * 0.15 + 0.85);
        this.drawSmallSkillBadge(node.x, node.y, node.radius, node.type, node.label, node.color, pulseOpacity);
      });
    }

    /* ─── Render Single Frame ───────────────────────────────────────────── */
    renderFrame() {
      this.ctx.clearRect(0, 0, this.width, this.height);
      this.drawGlassCrystalFacets();
      this.drawNeurolinkNetwork();
    }

    /* ─── Animation Loop ─────────────────────────────────────────────────── */
    animate() {
      if (this.reducedMotion) {
        this.renderFrame();
        return;
      }

      this.time += 16;
      this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.05;
      this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.05;
      this.scroll.y += (this.scroll.targetY - this.scroll.y) * 0.08;

      this.renderFrame();
      requestAnimationFrame(() => this.animate());
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => new CrystalNeurolinkEngine());
  } else {
    new CrystalNeurolinkEngine();
  }
})();
