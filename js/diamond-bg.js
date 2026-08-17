/* ============================================================
   3D CRYSTAL GLOBE BACKGROUND — Three.js wireframe globe + orbit
   rings + particle field, matching devorbittech.org's background
   (same three.min.js r128, same geometry family: icosahedron
   wireframe sphere, dual torus rings, star particles).
   Runs site-wide (fixed, behind every section) so it's scaled down
   from DevOrbit's single-hero version: fewer particles, capped
   mobile framerate, pauses when tab hidden. Layered above the 2D
   neural-network canvas (js/stack-network.js), which is what
   actually represents the machine-learning data flow — nodes,
   synapse lines, signal pulses — visible through/around the globe.
   ============================================================ */

(function () {
  "use strict";

  const canvas = document.getElementById("diamond-canvas");
  if (!canvas || !window.THREE) return;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isMobile = () => window.innerWidth < 768;

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: !isMobile(), powerPreference: "low-power" });
  } catch (e) {
    return; // WebGL unavailable — leave the 2D canvas + glass layers as the background
  }

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.z = 7;

  /* Everything lives in one group so it can be uniformly scaled to fit
     any screen — see fitToViewport() below. globeRadius is now a fixed
     constant (the original desktop value) regardless of device: on
     mobile/tablet the *screen-space* size is hit exactly via group.scale
     against explicit px targets, and on desktop the scale resolves to
     ~1 (its original, unchanged size) via the same margin-fit logic
     that shipped before this — "desktop keeps its existing size". */
  const group = new THREE.Group();
  scene.add(group);

  const globeRadius = 2.6;
  const outerExtent = globeRadius * 1.65; // outer ring's radius — the widest thing in the group

  // Exact on-screen sphere *diameter* targets per breakpoint (mobile/tablet
  // only). Desktop (returns null) keeps the original fit-with-margin
  // behavior untouched.
  function targetDiameterPx(w) {
    if (w <= 320) return 260;
    if (w <= 375) return 290;
    if (w <= 390) return 300;
    if (w <= 430) return 320;
    if (w <= 768) return 320;
    if (w <= 1024) return 420;
    return null;
  }

  function fitToViewport() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const vFovRad = (camera.fov * Math.PI) / 180;
    const target = targetDiameterPx(w);

    if (target !== null) {
      // Convert the desired on-screen diameter (CSS px) to Three.js world
      // units at the camera's fixed distance, then scale the group so the
      // globe's own diameter (2*globeRadius, before rings) matches it
      // exactly — same technique the DevOrbit reference site's fixed
      // camera distance implies, just solved for an explicit px target
      // instead of "whatever fits."
      const worldUnitsPerPixel = (2 * camera.position.z * Math.tan(vFovRad / 2)) / h;
      const targetWorldDiameter = target * worldUnitsPerPixel;
      const baseWorldDiameter = globeRadius * 2;
      group.scale.setScalar(targetWorldDiameter / baseWorldDiameter);
      return;
    }

    // Desktop/large tablet: original "fit within frustum with margin"
    // behavior, unchanged — this is what "keep existing size" resolves to.
    const aspect = w / h;
    const halfHeight = camera.position.z * Math.tan(vFovRad / 2);
    const halfWidth = halfHeight * aspect;
    const available = Math.min(halfHeight, halfWidth) * 0.82; // 18% margin
    const fitScale = Math.min(1, available / outerExtent);
    group.scale.setScalar(fitScale);
  }

  function setSize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, isMobile() ? 1.5 : 2);
    renderer.setPixelRatio(dpr);
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    fitToViewport();
  }
  setSize();

  /* ---- Wireframe crystal globe (icosahedron mesh, DevOrbit-style) ---- */
  const globeGeo = new THREE.IcosahedronGeometry(globeRadius, isMobile() ? 2 : 3);

  const globeMat = new THREE.MeshBasicMaterial({ color: 0x2ec5ff, wireframe: true, transparent: true, opacity: 0.32 });
  const globe = new THREE.Mesh(globeGeo, globeMat);
  group.add(globe);

  const globePointsMat = new THREE.PointsMaterial({ color: 0x22d3ee, size: 0.05, transparent: true, opacity: 0.95 });
  const globePoints = new THREE.Points(globeGeo, globePointsMat);
  group.add(globePoints);

  /* ---- Dual orbit rings (matches DevOrbit's two tilted torus rings) ----
     Fewer segments on mobile — a ring reads the same with 40 radial
     segments as with 100, but transforms/renders far fewer vertices
     every frame, which is exactly the per-frame cost that turns into
     stutter while it's spinning. */
  const ringSegments = isMobile() ? 40 : 100;
  const ring1 = new THREE.Mesh(
    new THREE.TorusGeometry(globeRadius * 1.35, 0.014, 8, ringSegments),
    new THREE.MeshBasicMaterial({ color: 0x22d3ee, transparent: true, opacity: 0.55 })
  );
  const ring2 = new THREE.Mesh(
    new THREE.TorusGeometry(globeRadius * 1.65, 0.014, 8, ringSegments),
    new THREE.MeshBasicMaterial({ color: 0x8b5cf6, transparent: true, opacity: 0.48 })
  );
  ring2.rotation.x = Math.PI / 2.5;
  group.add(ring1, ring2);

  /* ---- Particle star field drifting through space ---- */
  const PARTICLE_COUNT = reducedMotion ? 0 : (isMobile() ? 150 : 600);
  let stars = null;
  if (PARTICLE_COUNT > 0) {
    const pos = new Float32Array(PARTICLE_COUNT * 3);
    for (let i = 0; i < pos.length; i++) pos[i] = (Math.random() - 0.5) * 24;
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    stars = new THREE.Points(
      geo,
      new THREE.PointsMaterial({ color: 0x00f2fe, size: 0.03, transparent: true, opacity: 0.55 })
    );
    scene.add(stars);
  }

  /* ---- Mouse parallax tilt (desktop only) ---- */
  let targetX = 0, targetY = 0;
  const mouseActive = !isMobile() && !reducedMotion;
  if (mouseActive) {
    window.addEventListener("pointermove", (e) => {
      targetX = (e.clientX / window.innerWidth - 0.5) * 0.6;
      targetY = (e.clientY / window.innerHeight - 0.5) * 0.6;
    }, { passive: true });
  }

  /* ---- Resize (debounced) ----
     Mobile browsers collapse/expand the address bar as you scroll,
     which fires a `resize` event with only the height changing — not
     an actual resize. Reacting to that made the orbit visibly change
     size while scrolling. Only re-fit when the width actually changes
     (real rotation/resize) or height changes by more than the address
     bar ever moves. */
  let lastKnownW = window.innerWidth;
  let lastKnownH = window.innerHeight;
  let resizeTimer = null;
  window.addEventListener("resize", () => {
    if (resizeTimer) clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const widthChanged = w !== lastKnownW;
      const heightChangedALot = Math.abs(h - lastKnownH) > 150;
      if (!widthChanged && !heightChangedALot) return;
      lastKnownW = w;
      lastKnownH = h;
      setSize();
    }, 200);
  }, { passive: true });

  /* ---- Scroll tracking (mobile): skip WebGL render while actively
     scrolling — smooth-scroll from nav clicks fires continuous scroll
     events, and rendering a full Three.js frame on every one of them
     is what was choking the main thread and freezing the scroll. ---- */
  let isScrolling = false;
  let scrollTimer = null;
  function markScrolling() {
    isScrolling = true;
    if (scrollTimer) clearTimeout(scrollTimer);
    scrollTimer = setTimeout(() => { isScrolling = false; }, 150);
  }
  window.addEventListener("scroll", markScrolling, { passive: true });
  window.addEventListener("touchmove", markScrolling, { passive: true });

  /* ---- Render loop: capped ~40fps on mobile (~20fps while actively
     scrolling, so it keeps visibly rotating instead of freezing, but
     costs less exactly when the scroll compositor needs the main
     thread most), paused when tab hidden ---- */
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

    // Rotation is time-based (not a fixed amount per frame), so the
    // globe/rings spin at the same real-world speed whether we're
    // rendering at 60fps, 40fps, or throttled to 20fps during scroll —
    // only the smoothness changes, never the speed. Constants below are
    // tuned to match the original per-frame values at a 60fps baseline
    // (dt * 60 == 1 at exactly 60fps).
    const dt = Math.min(0.1, (now - lastMotionAt) / 1000);
    lastMotionAt = now;
    const t = dt * 60;

    globe.rotation.y += 0.0015 * t;
    globe.rotation.x += 0.0008 * t;
    globePoints.rotation.y = globe.rotation.y;
    globePoints.rotation.x = globe.rotation.x;

    ring1.rotation.z += 0.002 * t;
    ring1.rotation.x += 0.001 * t;
    ring2.rotation.z -= 0.0015 * t;
    ring2.rotation.y += 0.0012 * t;

    if (stars) {
      stars.rotation.y += 0.0003 * t;
      stars.rotation.x += 0.00015 * t;
    }

    if (mouseActive) {
      camera.position.x += (targetX - camera.position.x) * 0.04;
      camera.position.y += (-targetY - camera.position.y) * 0.04;
      camera.lookAt(scene.position);
    }

    renderer.render(scene, camera);
  }

  if (reducedMotion) {
    renderer.render(scene, camera); // single static frame, no rAF loop
  } else {
    requestAnimationFrame(animate);
  }
})();
