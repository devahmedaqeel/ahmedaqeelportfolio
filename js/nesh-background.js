/**
 * Nesh - Luxury Fluid Ambient Background & Texture Engine
 * Customized for Ahmed Aqeel's AI Full-Stack Developer Portfolio.
 *
 * Aesthetic Traits:
 * - Obsidian Dark Space Atmosphere (#03050c -> #080d1e) with luxury matte texture
 * - Volumetric Glowing Fluid Mesh Blobs (Cyan, Violet, Magenta, Deep Indigo, Teal)
 * - Pure Floating Glass Skill Icon Badges (React, Node, AI Bot, Database, Code, Automation, SEO)
 * - Constellation Light Dust Particle Network with Proximity Laser Connections
 * - Cyber Tech Grid Intersections with Traveling Pulse Beams
 * - Lerped Parallax & Mouse Gravitation
 * - Light / Dark Mode Adaptive
 */

(function () {
  'use strict';

  class NeshLuxuryBackground {
    constructor() {
      this.canvas = document.getElementById('nesh-bg-canvas');
      if (!this.canvas) return;

      this.ctx = this.canvas.getContext('2d', { alpha: true });
      if (!this.ctx) return;

      this.width  = 0;
      this.height = 0;
      this.dpr    = Math.min(window.devicePixelRatio || 1, 2);
      this.time   = 0;
      this.theme  = document.documentElement.getAttribute('data-theme') || 'dark';

      // Mouse & Scroll Physics
      this.mouse  = { x: 0, y: 0, targetX: 0, targetY: 0, active: false };
      this.scroll = { y: window.scrollY || 0, targetY: window.scrollY || 0 };

      // Dark palette
      this.darkPalette = {
        cyan:      'rgba(0, 242, 254, ',
        violet:    'rgba(99, 102, 241, ',
        indigo:    'rgba(79, 70, 229, ',
        magenta:   'rgba(236, 72, 153, ',
        turquoise: 'rgba(0, 229, 196, ',
        blue:      'rgba(56, 189, 248, ',
        orange:    'rgba(251, 146, 60, '
      };

      // Light palette — uses darker, more saturated versions so particles
      // remain clearly visible against the bright #f8fafc background.
      this.lightPalette = {
        cyan:      'rgba(3, 105, 161, ',
        violet:    'rgba(79, 70, 229, ',
        indigo:    'rgba(55, 48, 163, ',
        magenta:   'rgba(190, 24, 93, ',
        turquoise: 'rgba(13, 118, 110, ',
        blue:      'rgba(14, 116, 144, ',
        orange:    'rgba(194, 65, 12, '
      };

      this.palette = this.theme === 'light' ? this.lightPalette : this.darkPalette;

      // Skill icon badge definitions
      this.skillIcons = [
        { type: 'react',      color: '#00f2fe' },
        { type: 'node',       color: '#10b981' },
        { type: 'ai',         color: '#a855f7' },
        { type: 'database',   color: '#f5c842' },
        { type: 'code',       color: '#38bdf8' },
        { type: 'automation', color: '#ec4899' },
        { type: 'seo',        color: '#00e5c4' }
      ];

      this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      this.initBlobs();
      this.initSkillIconNodes();
      this.initSkillParticles();
      this.initParticles();
      this.initGridBeams();
      this.initEvents();
      this.resize();
      
      if (this.reducedMotion) {
        this.renderFrame();
      } else {
        this.animate();
      }
    }

    /* ─── Aurora Blobs ─────────────────────────────────────────────────── */
    initBlobs() {
      const isLight = this.theme === 'light';
      const m = isLight ? 0.5 : 1.0;

      this.blobs = [
        { xRatio: 0.85, yRatio: 0.20, baseRadius: 560, color: this.palette.cyan,      opacity: 0.18 * m, speedX:  0.00035, speedY:  0.00028, phase: 0,              pulseSpeed: 0.0012 },
        { xRatio: 0.15, yRatio: 0.75, baseRadius: 600, color: this.palette.indigo,    opacity: 0.19 * m, speedX: -0.00028, speedY:  0.00032, phase: Math.PI / 2.5,  pulseSpeed: 0.0010 },
        { xRatio: 0.50, yRatio: 0.45, baseRadius: 520, color: this.palette.violet,    opacity: 0.16 * m, speedX:  0.00038, speedY: -0.00028, phase: Math.PI * 0.8,  pulseSpeed: 0.0014 },
        { xRatio: 0.88, yRatio: 0.82, baseRadius: 480, color: this.palette.magenta,   opacity: 0.15 * m, speedX: -0.00032, speedY: -0.00035, phase: Math.PI * 1.3,  pulseSpeed: 0.0011 },
        { xRatio: 0.12, yRatio: 0.25, baseRadius: 490, color: this.palette.turquoise, opacity: 0.15 * m, speedX:  0.00028, speedY:  0.00022, phase: Math.PI * 1.7,  pulseSpeed: 0.0009 },
        { xRatio: 0.65, yRatio: 0.85, baseRadius: 450, color: this.palette.orange,    opacity: 0.14 * m, speedX:  0.00030, speedY: -0.00025, phase: Math.PI * 0.4,  pulseSpeed: 0.0010 }
      ];
    }

    /* ─── Floating Glass Skill Icon Nodes ─────────────────────────────────── */
    initSkillIconNodes() {
      const isMobile = window.innerWidth < 768;
      const count = isMobile ? 5 : this.skillIcons.length;

      this.iconNodes = this.skillIcons.slice(0, count).map((icon, i) => ({
        type:    icon.type,
        color:   icon.color,
        xRatio:  0.12 + (i * 0.14) % 0.76,
        yRatio:  0.14 + (i * 0.16) % 0.68,
        speedX:  (Math.random() - 0.5) * 0.30,
        speedY:  (Math.random() - 0.5) * 0.25,
        opacity: 0.85 + (i % 3) * 0.05,
        phase:   Math.random() * Math.PI * 2,
        radius:  isMobile ? 6 : 7.5 + (i % 3) * 1.0
      }));
    }

    initSkillParticles() {
      const isMobile = window.innerWidth < 768;
      const definitions = [
        { label: 'RN', color: this.palette.cyan },
        { label: 'FL', color: this.palette.violet },
        { label: 'ND', color: this.palette.blue },
        { label: 'AI', color: this.palette.magenta },
        { label: 'PY', color: this.palette.turquoise },
        { label: 'DB', color: this.palette.orange },
        { label: 'UX', color: this.palette.cyan }
      ];

      const count = isMobile ? 4 : definitions.length;
      this.skillParticles = definitions.slice(0, count).map((def, i) => ({
        label:     def.label,
        color:     def.color,
        x:         Math.random() * window.innerWidth,
        y:         Math.random() * window.innerHeight,
        radius:    isMobile ? 4 : 5.0,
        speedX:    (Math.random() - 0.5) * 0.25,
        speedY:    (Math.random() - 0.5) * 0.16,
        opacity:   0.18 + Math.random() * 0.18,
        phase:     Math.random() * Math.PI * 2,
        drift:     0.08 + Math.random() * 0.06
      }));
    }

    /* ─── Multi-Depth Constellation Particles ──────────────────────────────── */
    initParticles() {
      const isMobile = window.innerWidth < 768;
      const isLight  = this.theme === 'light';
      const count    = isMobile ? (isLight ? 45 : 48) : (isLight ? 110 : 115);
      this.particles = [];

      for (let i = 0; i < count; i++) {
        const roll = Math.random();
        const depthLayer = roll > 0.60 ? 2 : (roll > 0.30 ? 1 : 0); // 0=far, 1=mid, 2=near
        
        let radius, speedMult, baseAlpha;
        if (depthLayer === 2) {
          radius    = Math.random() * 0.5 + (isLight ? 1.6 : 1.2);
          speedMult = 1.0;
          baseAlpha = isLight ? Math.random() * 0.20 + 0.75 : Math.random() * 0.25 + 0.65;
        } else if (depthLayer === 1) {
          radius    = Math.random() * 0.4 + (isLight ? 1.2 : 0.8);
          speedMult = 0.65;
          baseAlpha = isLight ? Math.random() * 0.20 + 0.60 : Math.random() * 0.25 + 0.45;
        } else {
          radius    = Math.random() * 0.3 + (isLight ? 0.9 : 0.5);
          speedMult = 0.35;
          baseAlpha = isLight ? Math.random() * 0.18 + 0.45 : Math.random() * 0.20 + 0.30;
        }

        const colorStr = roll > 0.45 ? this.palette.cyan : (roll > 0.25 ? this.palette.violet : this.palette.magenta);

        this.particles.push({
          x:            Math.random() * (this.width || window.innerWidth),
          y:            Math.random() * (this.height || window.innerHeight),
          radius:       radius,
          color:        colorStr,
          alpha:        baseAlpha,
          layer:        depthLayer,
          hasGlow:      depthLayer >= 1 && Math.random() > 0.40,
          twinkleSpeed: Math.random() * 0.035 + 0.015,
          speedX:       (Math.random() - 0.5) * 0.42 * speedMult,
          speedY:       (-Math.random() * 0.45 - 0.12) * speedMult
        });
      }
    }

    /* ─── Grid Traveling Pulse Beams ────────────────────────────────────── */
    initGridBeams() {
      const isMobile = window.innerWidth < 768;
      this.gridSpacing = isMobile ? 65 : 55;
      this.beams = [];
      const beamCount = isMobile ? 8 : 15;
      for (let i = 0; i < beamCount; i++) {
        this.beams.push({
          col:      Math.floor(Math.random() * 35),
          row:      Math.floor(Math.random() * 35),
          progress: Math.random(),
          speed:    Math.random() * 0.008 + 0.003,
          color:    Math.random() > 0.5 ? this.palette.cyan : this.palette.magenta
        });
      }
    }

    /* ─── Events ────────────────────────────────────────────────────────── */
    initEvents() {
      window.addEventListener('resize', () => this.resize(), { passive: true });

      const updateMouse = (x, y) => {
        this.mouse.targetX = x;
        this.mouse.targetY = y;
        this.mouse.active  = true;
      };

      window.addEventListener('mousemove', (e) => updateMouse(e.clientX, e.clientY), { passive: true });
      window.addEventListener('touchmove', (e) => {
        if (e.touches && e.touches[0]) {
          updateMouse(e.touches[0].clientX, e.touches[0].clientY);
        }
      }, { passive: true });

      window.addEventListener('scroll', () => {
        this.scroll.targetY = window.scrollY || 0;
      }, { passive: true });

      window.addEventListener('mouseleave', () => {
        this.mouse.active = false;
      }, { passive: true });

      window.addEventListener('themechange', (e) => {
        this.updateThemePalette(e.detail ? e.detail.theme : 'dark');
      });
    }

    /* ─── Theme Switch ──────────────────────────────────────────────────── */
    updateThemePalette(theme) {
      this.theme   = theme;
      this.palette = theme === 'light' ? this.lightPalette : this.darkPalette;
      this.initBlobs();
      this.initParticles();
      this.initSkillParticles();
    }

    /* ─── Resize ─────────────────────────────────────────────────────────── */
    resize() {
      this.width  = window.innerWidth;
      this.height = window.innerHeight;
      this.dpr    = window.innerWidth < 768 ? 1.0 : Math.min(window.devicePixelRatio || 1, 2.0);
      this.canvas.width  = this.width  * this.dpr;
      this.canvas.height = this.height * this.dpr;
      this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
      this.ctx.imageSmoothingEnabled = true;

      // Only re-init particles if count would change significantly
      const isMobile = this.width < 768;
      const isLight  = this.theme === 'light';
      const newCount = isMobile ? (isLight ? 55 : 40) : Math.min(Math.floor(this.width / (isLight ? 11 : 14)), isLight ? 120 : 95);
      if (!this.particles || Math.abs(this.particles.length - newCount) > 10) {
        this.initParticles();
      }
      this.initSkillParticles();

      if (!this.mouse.active) {
        this.mouse.targetX = this.width  * 0.5;
        this.mouse.targetY = this.height * 0.35;
        this.mouse.x = this.mouse.targetX;
        this.mouse.y = this.mouse.targetY;
      }
    }

    /* ─── Layer 1: Volumetric Aurora Mesh ────────────────────────────────── */
    drawFluidMesh() {
      const ctx          = this.ctx;
      const scrollOffset = this.scroll.y * 0.12;

      this.blobs.forEach((blob) => {
        const x = (blob.xRatio + Math.sin(this.time * blob.speedX + blob.phase) * 0.12) * this.width;
        let   y = (blob.yRatio + Math.cos(this.time * blob.speedY + blob.phase) * 0.12) * this.height - scrollOffset;

        const totalHeight = this.height * 1.5;
        y = ((y % totalHeight) + totalHeight) % totalHeight - this.height * 0.25;

        const dx     = (this.mouse.x - this.width  / 2) * 0.045;
        const dy     = (this.mouse.y - this.height / 2) * 0.045;
        const pulse  = Math.sin(this.time * blob.pulseSpeed + blob.phase) * 55;
        const radius = blob.baseRadius + pulse;

        const grad = ctx.createRadialGradient(x + dx, y + dy, 0, x + dx, y + dy, radius);
        grad.addColorStop(0,    blob.color + blob.opacity + ')');
        grad.addColorStop(0.45, blob.color + (blob.opacity * 0.45) + ')');
        grad.addColorStop(0.85, blob.color + (blob.opacity * 0.10) + ')');
        grad.addColorStop(1,    blob.color + '0)');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(x + dx, y + dy, radius, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    /* ─── Layer 2: Cyber Grid + Pulse Beams ─────────────────────────────── */
    drawCyberGrid() {
      const ctx     = this.ctx;
      const spacing = this.gridSpacing;
      const isLight = this.theme === 'light';

      ctx.save();
      ctx.strokeStyle = isLight ? 'rgba(3, 105, 161, 0.02)' : 'rgba(0, 242, 254, 0.024)';
      ctx.lineWidth   = 0.4;

      for (let x = 0; x < this.width; x += spacing) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, this.height); ctx.stroke();
      }
      for (let y = 0; y < this.height; y += spacing) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(this.width, y); ctx.stroke();
      }

      // Traveling intersection pulse beams
      this.beams.forEach((b) => {
        b.progress += b.speed;
        if (b.progress > 1) {
          b.progress = 0;
          b.col = Math.floor(Math.random() * Math.ceil(this.width  / spacing));
          b.row = Math.floor(Math.random() * Math.ceil(this.height / spacing));
        }

        const nx    = b.col * spacing;
        const ny    = b.row * spacing;
        const alpha = Math.sin(b.progress * Math.PI) * 0.35;

        const glowCol = isLight ? `rgba(2,132,199,${alpha * 0.14})` : b.color + (alpha * 0.18) + ')';
        ctx.fillStyle = glowCol;
        ctx.beginPath();
        ctx.arc(nx, ny, 5.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = isLight ? `rgba(2,132,199,${alpha * 0.55})` : b.color + alpha + ')';
        ctx.beginPath();
        ctx.arc(nx, ny, 2.2, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.restore();
    }

    /* ─── Layer 3: Floating Glass Skill Icon Badges ──────────────────────── */
    drawSkillIconBadge(ctx, x, y, radius, type, color, opacity) {
      const isLight = this.theme === 'light';
      ctx.save();

      // Glowing Ambient Brand Halo
      ctx.fillStyle = isLight
        ? `rgba(2, 132, 199, ${opacity * 0.18})`
        : color + '22';
      ctx.beginPath();
      ctx.arc(x, y, radius + 1.8, 0, Math.PI * 2);
      ctx.fill();

      // Glass body with crisp border
      ctx.fillStyle   = isLight ? 'rgba(255, 255, 255, 0.95)' : 'rgba(10, 16, 36, 0.85)';
      ctx.strokeStyle = isLight ? 'rgba(2, 132, 199, 0.85)' : color;
      ctx.lineWidth   = 1.0;

      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Icon colour
      const iconColor = (isLight && (color === '#00f2fe' || color === '#38bdf8' || color === '#ffffff'))
        ? '#0284c7' : color;

      ctx.strokeStyle = iconColor;
      ctx.fillStyle   = iconColor;
      ctx.lineWidth   = 1.0;
      ctx.lineCap     = 'round';
      ctx.lineJoin    = 'round';

      const s = radius * 0.50;

      if (type === 'react') {
        ctx.beginPath(); ctx.ellipse(x, y, s, s * 0.4,  Math.PI / 4, 0, Math.PI * 2); ctx.stroke();
        ctx.beginPath(); ctx.ellipse(x, y, s, s * 0.4, -Math.PI / 4, 0, Math.PI * 2); ctx.stroke();
        ctx.beginPath(); ctx.arc(x, y, 1.1, 0, Math.PI * 2); ctx.fill();

      } else if (type === 'node') {
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
          const a = (i * Math.PI) / 3;
          const hx = x + Math.cos(a) * s, hy = y + Math.sin(a) * s;
          i === 0 ? ctx.moveTo(hx, hy) : ctx.lineTo(hx, hy);
        }
        ctx.closePath(); ctx.stroke();
        ctx.beginPath(); ctx.arc(x, y, 1.0, 0, Math.PI * 2); ctx.fill();

      } else if (type === 'ai') {
        ctx.beginPath();
        ctx.arc(x,            y - s * 0.5, 1.0, 0, Math.PI * 2);
        ctx.arc(x - s * 0.6, y + s * 0.5, 1.0, 0, Math.PI * 2);
        ctx.arc(x + s * 0.6, y + s * 0.5, 1.0, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(x, y - s * 0.5);
        ctx.lineTo(x - s * 0.6, y + s * 0.5);
        ctx.lineTo(x + s * 0.6, y + s * 0.5);
        ctx.closePath(); ctx.stroke();

      } else if (type === 'database') {
        ctx.beginPath(); ctx.ellipse(x, y - s * 0.4, s * 0.7, s * 0.25, 0, 0, Math.PI * 2); ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x - s * 0.7, y - s * 0.4);
        ctx.lineTo(x - s * 0.7, y + s * 0.4);
        ctx.ellipse(x, y + s * 0.4, s * 0.7, s * 0.25, 0, 0, Math.PI);
        ctx.lineTo(x + s * 0.7, y - s * 0.4);
        ctx.stroke();

      } else if (type === 'code') {
        ctx.beginPath();
        ctx.moveTo(x - s * 0.5, y - s * 0.4); ctx.lineTo(x - s * 0.9, y); ctx.lineTo(x - s * 0.5, y + s * 0.4);
        ctx.moveTo(x + s * 0.5, y - s * 0.4); ctx.lineTo(x + s * 0.9, y); ctx.lineTo(x + s * 0.5, y + s * 0.4);
        ctx.moveTo(x + s * 0.2, y - s * 0.6); ctx.lineTo(x - s * 0.2, y + s * 0.6);
        ctx.stroke();

      } else if (type === 'automation') {
        ctx.beginPath();
        ctx.moveTo(x + s * 0.2, y - s * 0.8);
        ctx.lineTo(x - s * 0.5, y + s * 0.1);
        ctx.lineTo(x + s * 0.1, y + s * 0.1);
        ctx.lineTo(x - s * 0.2, y + s * 0.8);
        ctx.lineTo(x + s * 0.5, y - s * 0.1);
        ctx.lineTo(x - s * 0.1, y - s * 0.1);
        ctx.closePath(); ctx.fill();

      } else {
        // seo
        ctx.beginPath();
        ctx.moveTo(x - s * 0.7, y + s * 0.5);
        ctx.lineTo(x - s * 0.2, y);
        ctx.lineTo(x + s * 0.2, y + s * 0.3);
        ctx.lineTo(x + s * 0.7, y - s * 0.5);
        ctx.stroke();
        ctx.beginPath(); ctx.arc(x + s * 0.7, y - s * 0.5, 1.0, 0, Math.PI * 2); ctx.fill();
      }

      ctx.restore();
    }

    drawSkillIconNodes() {
      const ctx          = this.ctx;
      const scrollOffset = this.scroll.y * 0.08;
      const isLight      = this.theme === 'light';

      const computedNodes = this.iconNodes.map((node) => {
        let x = (node.xRatio + Math.sin(this.time * 0.0004 + node.phase) * 0.06) * this.width;
        let y = (node.yRatio + Math.cos(this.time * 0.0003 + node.phase) * 0.06) * this.height - scrollOffset;

        const totalHeight = this.height * 1.4;
        y = ((y % totalHeight) + totalHeight) % totalHeight - this.height * 0.2;

        return { ...node, x, y };
      });

      // Draw Neurolink Lines from icons to nearby constellation particles
      if (this.particles && this.particles.length > 0) {
        computedNodes.forEach((node) => {
          this.particles.forEach((p) => {
            if (p.layer < 1) return;
            const dx = node.x - p.x;
            const dy = node.y - p.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 135) {
              const la = (1 - dist / 135) * (isLight ? 0.35 : 0.25);
              ctx.strokeStyle = isLight ? `rgba(3, 105, 161, ${la})` : `rgba(0, 242, 254, ${la})`;
              ctx.lineWidth = 0.9;
              ctx.beginPath();
              ctx.moveTo(node.x, node.y);
              ctx.lineTo(p.x, p.y);
              ctx.stroke();

              // Traveling data pulse dot
              const pulsePos = ((this.time * 0.0012 + node.phase) % 1);
              const px = node.x + (p.x - node.x) * pulsePos;
              const py = node.y + (p.y - node.y) * pulsePos;
              ctx.fillStyle = isLight ? `rgba(3, 105, 161, ${la * 1.8})` : `rgba(0, 242, 254, ${la * 2.0})`;
              ctx.beginPath();
              ctx.arc(px, py, 1.8, 0, Math.PI * 2);
              ctx.fill();
            }
          });
        });
      }

      // Render Floating Icon Badges
      computedNodes.forEach((node) => {
        const pulseOpacity = node.opacity * (Math.sin(this.time * 0.0016 + node.phase) * 0.15 + 0.85);
        this.drawSkillIconBadge(ctx, node.x, node.y, node.radius, node.type, node.color, pulseOpacity);
      });
    }

    drawSkillParticles() {
      const ctx      = this.ctx;
      const isLight  = this.theme === 'light';
      const isMobile = this.width < 768;

      this.skillParticles.forEach((p) => {
        p.x += p.speedX + Math.cos(this.time * 0.0007 + p.phase) * p.drift;
        p.y += p.speedY + Math.sin(this.time * 0.0006 + p.phase) * p.drift * 0.75;

        if (p.x < -18) { p.x = this.width + 18; }
        if (p.x > this.width + 18) { p.x = -18; }
        if (p.y < -18) { p.y = this.height + 18; }
        if (p.y > this.height + 18) { p.y = -18; }

        const glowAlpha = isLight ? p.opacity * 0.22 : p.opacity * 0.16;
        ctx.fillStyle  = p.color + glowAlpha + ')';
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius + 3, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = p.color + (isLight ? Math.min(0.72, p.opacity * 1.5) : p.opacity + 0.06) + ')';
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = isLight ? '#ffffff' : '#e8f7ff';
        ctx.font = `${isMobile ? 7 : 8}px Inter, system-ui, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(p.label, p.x, p.y + 0.5);
      });
    }

    /* ─── Layer 4: Multi-Depth Constellation Particle Dust ───────────────── */
    drawConstellationParticles() {
      const ctx     = this.ctx;
      const len     = this.particles.length;
      const isLight = this.theme === 'light';

      for (let i = 0; i < len; i++) {
        const p = this.particles[i];
        p.y += p.speedY;
        p.x += p.speedX + Math.sin(this.time * 0.0009 + p.y * 0.006) * 0.12;

        if (p.y < -12)           { p.y = this.height + 12; p.x = Math.random() * this.width; }
        if (p.x < -12)           { p.x = this.width + 12; }
        if (p.x > this.width + 12){ p.x = -12; }

        if (this.mouse.active) {
          const dx   = p.x - this.mouse.x;
          const dy   = p.y - this.mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120 && dist > 8) {
            const force = (120 - dist) / 120;
            p.x += (dx / dist) * force * 2.1;
            p.y += (dy / dist) * force * 2.1;

            if (p.layer >= 1 && dist < 100) {
              const mla = (1 - dist / 100) * (isLight ? 0.18 : 0.12);
              ctx.strokeStyle = isLight ? `rgba(2, 132, 199, ${mla})` : `rgba(0, 242, 254, ${mla})`;
              ctx.lineWidth = 0.8;
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(this.mouse.x, this.mouse.y);
              ctx.stroke();
            }
          }
        }

        if (p.hasGlow) {
          const glowAlpha = isLight ? p.alpha * 0.25 : p.alpha * 0.28;
          ctx.fillStyle = p.color + glowAlpha + ')';
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius + (isLight ? 4.5 : 3.8), 0, Math.PI * 2);
          ctx.fill();
        }

        const twinkle  = Math.sin(this.time * p.twinkleSpeed) * 0.20 + 0.80;
        const alphaVal = isLight ? Math.min(0.95, p.alpha * twinkle * 1.5) : Math.min(0.98, Math.max(0.40, p.alpha * twinkle * 1.25));
        ctx.fillStyle = p.color + alphaVal + ')';
        ctx.beginPath();
        ctx.arc(p.x, p.y, isLight ? p.radius * 1.15 : p.radius, 0, Math.PI * 2);
        ctx.fill();

        if (p.layer >= 1) {
          for (let j = i + 1; j < len; j++) {
            const p2 = this.particles[j];
            if (p2.layer < 1) continue;

            const pdx   = p.x - p2.x;
            const pdy   = p.y - p2.y;
            const pdist = Math.sqrt(pdx * pdx + pdy * pdy);
            const maxDist = (p.layer === 2 && p2.layer === 2) ? 115 : 90;

            if (pdist < maxDist) {
              const la = (1 - pdist / maxDist) * (isLight ? 0.32 : 0.22);
              ctx.strokeStyle = isLight ? `rgba(3, 105, 161, ${la})` : `rgba(0, 242, 254, ${la})`;
              ctx.lineWidth   = isLight ? 1.0 : 0.85;
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.stroke();
            }
          }
        }
      }
    }

    /* ─── Render Single Frame (Reduced Motion Fallback) ─────────────────── */
    renderFrame() {
      this.ctx.clearRect(0, 0, this.width, this.height);
      const isLight  = this.theme === 'light';
      const isMobile = this.width < 768;

      if (!this.reducedMotion) {
        this.drawSkillParticles();
      }

      if (!this.reducedMotion) {
        this.drawSkillIconNodes();
      }

      this.drawConstellationParticles();
    }

    /* ─── Animation Loop ─────────────────────────────────────────────────── */
    animate() {
      if (this.reducedMotion) {
        this.renderFrame();
        return;
      }

      this.time += 16;

      this.mouse.x  += (this.mouse.targetX  - this.mouse.x)  * 0.05;
      this.mouse.y  += (this.mouse.targetY  - this.mouse.y)  * 0.05;
      this.scroll.y += (this.scroll.targetY - this.scroll.y) * 0.08;

      this.renderFrame();

      requestAnimationFrame(() => this.animate());
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new NeshLuxuryBackground());
  } else {
    new NeshLuxuryBackground();
  }
})();
