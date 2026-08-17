/* ============================================================
   NEUROLINK DIGITAL LLM MATRIX — Moving AI Data Stream Engine.
   Ultra-High Tech Background for AI Full Stack Developer:
   - Moving Digital LLM Tokens & Binary Nodes (AI, LLM, 01, GPT, N8N, PY, SYS)
   - Dynamic Moving Neural Synapse Lines
   - Digital Data Signal Pulses (101, AI, λ) traveling along paths
   - Interactive Mouse Digital Laser Beams
   - World-Space Virtualized 60FPS Render Engine
   ============================================================ */

(function () {
  "use strict";

  const CFG = window.STACK_NETWORK_CONFIG || {};

  let canvas = document.getElementById("sn-canvas");
  if (!canvas) {
    canvas = document.createElement("canvas");
    canvas.id = "sn-canvas";
    canvas.style.cssText = "position:fixed;inset:0;z-index:0;pointer-events:none;";
    document.body.prepend(canvas);
  }

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isMobile = () => window.innerWidth < 768;

  /* ---- Viewport & Document Dimensions ---- */
  function getViewportSize() {
    if (window.visualViewport) return { w: window.visualViewport.width, h: window.visualViewport.height };
    return { w: window.innerWidth, h: window.innerHeight };
  }

  let vpW = 0, vpH = 0, dpr = 1, docH = 1;

  function updateCanvasSize() {
    const vp = getViewportSize();
    vpW = vp.w;
    vpH = vp.h;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(vpW * dpr);
    canvas.height = Math.round(vpH * dpr);
    canvas.style.width = vpW + "px";
    canvas.style.height = vpH + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  /* ---- Scroll & Touch Active Tracking ---- */
  let scrollYRef = window.scrollY || 0;
  let isScrolling = false;
  let scrollTimeout = null;

  window.addEventListener("scroll", () => {
    scrollYRef = window.scrollY || 0;
    isScrolling = true;
    if (scrollTimeout) clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => { isScrolling = false; }, 150);
  }, { passive: true });

  window.addEventListener("touchmove", () => {
    isScrolling = true;
    if (scrollTimeout) clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => { isScrolling = false; }, 150);
  }, { passive: true });

  /* ---- Pointer Tracking (World Space) ---- */
  let mouseWorldX = -9999, mouseWorldY = -9999, lastMouseMoveAt = 0;
  window.addEventListener("pointermove", (e) => {
    if (isMobile()) return; // Disable pointer tracking overhead on touch
    mouseWorldX = e.clientX;
    mouseWorldY = e.clientY + scrollYRef;
    lastMouseMoveAt = performance.now();
  }, { passive: true });

  /* ---- Section Density Map ---- */
  let sectionMap = [];
  function buildSectionMap() {
    const sections = document.querySelectorAll("section, header, footer");
    const map = [];
    sections.forEach((sec) => {
      const id = (sec.id || sec.tagName).toLowerCase();
      let density = 0.7;
      if (id.includes("hero") || id.includes("header")) density = 1.0;
      else if (id.includes("skill")) density = 0.65;
      else if (id.includes("service")) density = 0.65;
      else if (id.includes("project")) density = 0.8;
      else if (id.includes("contact")) density = 0.9;
      else if (id.includes("footer")) density = 0.9;

      map.push({
        y0: sec.offsetTop,
        y1: sec.offsetTop + sec.offsetHeight,
        density
      });
    });
    map.sort((a, b) => a.y0 - b.y0);
    sectionMap = map;
  }

  function getSectionDensity(worldY) {
    if (!sectionMap.length) return 0.7;
    for (let i = 0; i < sectionMap.length; i++) {
      const s = sectionMap[i];
      if (worldY >= s.y0 && worldY <= s.y1) {
        let alphaMult = s.density;
        const distFromTop = worldY - s.y0;
        const distFromBottom = s.y1 - worldY;
        if (distFromTop < 200 && i > 0) {
          const t = distFromTop / 200;
          alphaMult = sectionMap[i - 1].density * (1 - t) + s.density * t;
        } else if (distFromBottom < 200 && i < sectionMap.length - 1) {
          const t = distFromBottom / 200;
          alphaMult = s.density * (1 - t) + sectionMap[i + 1].density * t;
        }
        return alphaMult;
      }
    }
    return 0.7;
  }

  /* ---- Spatial Index Grid ---- */
  const CELL_SIZE = 190;
  let spatialGrid = new Map();
  function getCellKey(cx, cy) { return (cx & 0xffff) | ((cy & 0xffff) << 16); }

  function buildSpatialGrid(nodes) {
    spatialGrid.clear();
    for (let i = 0; i < nodes.length; i++) {
      const n = nodes[i];
      const cx = Math.floor(n.worldX / CELL_SIZE);
      const cy = Math.floor(n.worldY / CELL_SIZE);
      const key = getCellKey(cx, cy);
      let list = spatialGrid.get(key);
      if (!list) {
        list = [];
        spatialGrid.set(key, list);
      }
      list.push(i);
    }
  }

  /* ---- Digital LLM Token Vocabulary ---- */
  const DIGITAL_TOKENS = ["AI", "01", "LLM", "GPT", "10", "NLP", "N8N", "PY", "SYS", "0x", "REACT", "API", "NODE"];

  /* ---- Color Palette (Cyan -> Blue -> Violet) ---- */
  function getInterpolatedColor(ratio) {
    let r, g, b;
    if (ratio < 0.5) {
      const t = ratio / 0.5;
      r = Math.round(0 * (1 - t) + 0 * t);
      g = Math.round(242 * (1 - t) + 162 * t);
      b = Math.round(254 * (1 - t) + 255 * t);
    } else {
      const t = (ratio - 0.5) / 0.5;
      r = Math.round(0 * (1 - t) + 168 * t);
      g = Math.round(162 * (1 - t) + 85 * t);
      b = Math.round(255 * (1 - t) + 247 * t);
    }
    return [r, g, b];
  }

  /* ---- World Node Generation (Digital LLM Token Nodes) ---- */
  let nodes = [];
  function generateNodes() {
    updateCanvasSize();
    const newDocH = Math.max(document.documentElement.scrollHeight, vpH * 2);
    const mobile = isMobile();

    const targetCount = mobile ? 18 : Math.min(120, Math.max(30, Math.round((newDocH / 1000) * 8)));

    if (nodes.length > 0 && docH > 0) {
      const scaleY = newDocH / docH;
      for (let i = 0; i < nodes.length; i++) {
        nodes[i].worldY *= scaleY;
        const ratio = Math.max(0, Math.min(1, nodes[i].worldY / newDocH));
        nodes[i].color = getInterpolatedColor(ratio);
      }
      docH = newDocH;
      buildSpatialGrid(nodes);
      return;
    }

    docH = newDocH;
    nodes = [];

    for (let i = 0; i < targetCount; i++) {
      const worldX = Math.random() * vpW;
      const worldY = Math.random() * docH;
      const ratio = worldY / docH;

      let band = 1;
      let parallaxRate = 1.0;

      if (ratio <= 0.30) {
        band = 0; parallaxRate = mobile || reducedMotion ? 1.0 : 0.92;
      } else if (ratio >= 0.62) {
        band = 2; parallaxRate = mobile || reducedMotion ? 1.0 : 1.08;
      }

      const angle = Math.random() * Math.PI * 2;
      const speed = mobile ? 8 : (14 + Math.random() * 18);

      const token = DIGITAL_TOKENS[i % DIGITAL_TOKENS.length];

      nodes.push({
        worldX,
        worldY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        band,
        parallaxRate,
        token,
        freq: 0.8 + Math.random() * 1.4,
        phase: Math.random() * Math.PI * 2,
        baseSize: mobile ? 2.5 : (3 + Math.random() * 2.5),
        color: getInterpolatedColor(ratio),
        pulseEnergy: 0
      });
    }

    buildSpatialGrid(nodes);
  }

  /* ---- Resize Handler ----
     Mobile browsers collapse/expand the address bar as you scroll,
     firing `resize` with only the height changing — not a real resize.
     Reacting to that re-ran section-map DOM reads + node rescaling on
     every scroll, adding avoidable work exactly when scroll performance
     matters most. Only react to an actual width change or a big height
     jump (real resize/orientation change, not the address bar). */
  let lastKnownRW = window.innerWidth;
  let lastKnownRH = window.innerHeight;
  let resizeTimer = null;
  window.addEventListener("resize", () => {
    if (resizeTimer) clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      const rw = window.innerWidth;
      const rh = window.innerHeight;
      const widthChanged = rw !== lastKnownRW;
      const heightChangedALot = Math.abs(rh - lastKnownRH) > 150;
      if (!widthChanged && !heightChangedALot) return;
      lastKnownRW = rw;
      lastKnownRH = rh;
      buildSectionMap();
      generateNodes();
    }, 200);
  }, { passive: true });

  /* ---- Draw Single Digital Node ---- */
  function drawDigitalNode(ctx, node, sx, sy, size, alpha) {
    const col = node.color;
    ctx.fillStyle = `rgba(${col[0]},${col[1]},${col[2]},${alpha.toFixed(3)})`;

    if (node.band === 0) {
      // Client band — square node (interface layer)
      const half = size;
      ctx.fillRect(sx - half, sy - half, size * 2, size * 2);
    } else if (node.band === 1) {
      // Service band — diamond node (logic layer), per STACK_NETWORK_CONFIG.bands.service.shape
      const half = size * 1.15;
      ctx.beginPath();
      ctx.moveTo(sx, sy - half);
      ctx.lineTo(sx + half, sy);
      ctx.lineTo(sx, sy + half);
      ctx.lineTo(sx - half, sy);
      ctx.closePath();
      ctx.fill();
    } else {
      // Model band — circle node (intelligence layer)
      ctx.beginPath();
      ctx.arc(sx, sy, size * 1.2, 0, Math.PI * 2);
      ctx.fill();
    }

    if (node.token && alpha > 0.18) {
      ctx.font = (isMobile() ? "9px" : "10px") + " 'JetBrains Mono', monospace";
      ctx.fillStyle = `rgba(255,255,255,${(alpha * 0.95).toFixed(3)})`;
      ctx.fillText(node.token, sx + size + 4, sy + 3);
    }
  }

  /* ---- Pulses Engine ---- */
  let pulses = [];
  let lastPulseTime = 0;

  function triggerPulses(now) {
    if (pulses.length > (isMobile() ? 5 : 12)) return;
    if (now - lastPulseTime < (isMobile() ? 1400 : 900)) return;
    lastPulseTime = now;

    if (!nodes.length) return;
    const fromIdx = Math.floor(Math.random() * nodes.length);
    const nA = nodes[fromIdx];

    const cx = Math.floor(nA.worldX / CELL_SIZE);
    const cy = Math.floor(nA.worldY / CELL_SIZE);

    let candidates = [];
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        const list = spatialGrid.get(getCellKey(cx + dx, cy + dy));
        if (list) {
          for (let i = 0; i < list.length; i++) {
            if (list[i] !== fromIdx) candidates.push(list[i]);
          }
        }
      }
    }

    if (candidates.length === 0) return;
    const toIdx = candidates[Math.floor(Math.random() * candidates.length)];
    const nB = nodes[toIdx];

    const dx = nB.worldX - nA.worldX;
    const dy = nB.worldY - nA.worldY;
    if (dx * dx + dy * dy > 200 * 200) return;

    pulses.push({
      fromIdx,
      toIdx,
      progress: 0,
      speed: 0.8 + Math.random() * 0.6,
      char: nA.token || "AI"
    });
  }

  /* ---- Render Loop (Optimized 60FPS) ---- */
  let lastFrameTime = performance.now();
  let lastScrollRenderAt = 0;
  const mobileScrollFrameInterval = 1000 / 20;

  function render(now) {
    requestAnimationFrame(render);

    const mobile = isMobile();

    // Throttle (don't fully stop) rendering during active touch scrolling on
    // mobile: keeps the network visibly moving instead of freezing, while
    // still costing less exactly when the scroll compositor needs the
    // main thread most.
    if (mobile && isScrolling) {
      if (now - lastScrollRenderAt < mobileScrollFrameInterval) return;
      lastScrollRenderAt = now;
    }

    // dt is measured since the last frame that actually ran (not the last
    // rAF tick) — frames skipped by the throttle above must still count
    // toward elapsed time, otherwise node movement visibly slows down
    // during scroll instead of just getting less smooth.
    const dt = Math.min(0.064, (now - lastFrameTime) / 1000);
    lastFrameTime = now;

    const scrollY = scrollYRef;
    ctx.clearRect(0, 0, vpW, vpH);

    // Update Node World Positions
    for (let i = 0; i < nodes.length; i++) {
      const n = nodes[i];
      n.worldX += n.vx * dt;
      n.worldY += n.vy * dt;

      if (n.worldX < -20) n.worldX = vpW + 20;
      if (n.worldX > vpW + 20) n.worldX = -20;
      if (n.worldY < -20) n.worldY = docH + 20;
      if (n.worldY > docH + 20) n.worldY = -20;
    }

    buildSpatialGrid(nodes);

    // Find visible nodes in current viewport
    const visibleList = [];
    const minScreenY = -40;
    const maxScreenY = vpH + 40;

    for (let i = 0; i < nodes.length; i++) {
      const n = nodes[i];
      const sy = n.worldY - scrollY * n.parallaxRate;
      if (sy >= minScreenY && sy <= maxScreenY) {
        visibleList.push(i);
      }
    }

    // 1. Neural Synapse Lines
    const maxConnections = mobile ? 1 : 3;
    for (let i = 0; i < visibleList.length; i++) {
      const idxA = visibleList[i];
      const nodeA = nodes[idxA];
      const syA = nodeA.worldY - scrollY * nodeA.parallaxRate;
      const sxA = nodeA.worldX;

      const cx = Math.floor(nodeA.worldX / CELL_SIZE);
      const cy = Math.floor(nodeA.worldY / CELL_SIZE);

      let connections = 0;

      for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
          const list = spatialGrid.get(getCellKey(cx + dx, cy + dy));
          if (!list) continue;

          for (let k = 0; k < list.length; k++) {
            const idxB = list[k];
            if (idxB <= idxA) continue;

            const nodeB = nodes[idxB];
            const syB = nodeB.worldY - scrollY * nodeB.parallaxRate;

            if (syB < minScreenY || syB > maxScreenY) continue;

            const sxB = nodeB.worldX;
            const distDx = sxB - sxA;
            const distDy = syB - syA;
            const distSq = distDx * distDx + distDy * distDy;

            const maxDist = mobile ? 120 : 160;

            if (distSq < maxDist * maxDist) {
              const dist = Math.sqrt(distSq);
              const fade = 1 - dist / maxDist;
              const sectionDensity = getSectionDensity((nodeA.worldY + nodeB.worldY) / 2);
              const alpha = fade * (mobile ? 0.30 : 0.5) * sectionDensity;

              ctx.beginPath();
              const col = nodeA.color;

              ctx.strokeStyle = `rgba(${col[0]},${col[1]},${col[2]},${alpha.toFixed(3)})`;
              ctx.lineWidth = 1.0;

              ctx.moveTo(sxA, syA);
              ctx.lineTo(sxB, syB);
              ctx.stroke();

              connections++;
              if (connections >= maxConnections) break;
            }
          }
          if (connections >= maxConnections) break;
        }
        if (connections >= maxConnections) break;
      }
    }

    // 2. Mouse Laser Beams (Desktop only)
    const mouseActive = !mobile && (performance.now() - lastMouseMoveAt) < 3000;
    if (mouseActive && !reducedMotion) {
      const mouseScreenY = mouseWorldY - scrollY;
      for (let i = 0; i < visibleList.length; i++) {
        const idx = visibleList[i];
        const n = nodes[idx];
        const sy = n.worldY - scrollY * n.parallaxRate;
        const dx = n.worldX - mouseWorldX;
        const dy = sy - mouseScreenY;
        const distSq = dx * dx + dy * dy;

        if (distSq < 160 * 160) {
          const dist = Math.sqrt(distSq);
          const alpha = (1 - dist / 160) * 0.6;
          ctx.beginPath();
          ctx.moveTo(n.worldX, sy);
          ctx.lineTo(mouseWorldX, mouseScreenY);
          ctx.strokeStyle = `rgba(0, 242, 254, ${alpha.toFixed(3)})`;
          ctx.lineWidth = 1.2;
          ctx.stroke();
          n.pulseEnergy = Math.min(1.0, n.pulseEnergy + 0.2);
        }
      }
    }

    // 3. Draw Nodes
    for (let i = 0; i < visibleList.length; i++) {
      const idx = visibleList[i];
      const n = nodes[idx];
      const sy = n.worldY - scrollY * n.parallaxRate;
      const sx = n.worldX;

      const breathe = Math.sin(now * 0.002 * n.freq + n.phase) * 0.6;
      const currentSize = n.baseSize + breathe;

      const sectionDensity = getSectionDensity(n.worldY);
      const alpha = 0.55 * sectionDensity + (n.pulseEnergy * 0.5);

      drawDigitalNode(ctx, n, sx, sy, Math.max(2.0, currentSize), alpha);

      if (n.pulseEnergy > 0) {
        n.pulseEnergy = Math.max(0, n.pulseEnergy - dt * 1.5);
      }
    }

    // 4. Draw Traveling Data Pulses
    if (!reducedMotion) {
      triggerPulses(now);

      for (let p = pulses.length - 1; p >= 0; p--) {
        const pulse = pulses[p];
        pulse.progress += dt * pulse.speed;

        const nA = nodes[pulse.fromIdx];
        const nB = nodes[pulse.toIdx];

        if (!nA || !nB) { pulses.splice(p, 1); continue; }

        const syA = nA.worldY - scrollY * nA.parallaxRate;
        const syB = nB.worldY - scrollY * nB.parallaxRate;

        const px = nA.worldX + (nB.worldX - nA.worldX) * pulse.progress;
        const py = syA + (syB - syA) * pulse.progress;

        ctx.font = "bold 11px 'JetBrains Mono', monospace";
        ctx.shadowColor = "#00f2fe";
        ctx.shadowBlur = 8;
        ctx.fillStyle = `#00f2fe`;
        ctx.fillText(pulse.char, px, py);
        ctx.shadowBlur = 0;

        if (pulse.progress >= 1.0) {
          nB.pulseEnergy = 1.0;
          pulses.splice(p, 1);
        }
      }
    }
  }

  /* ---- Initialize ---- */
  function init() {
    buildSectionMap();
    generateNodes();
    requestAnimationFrame(render);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
