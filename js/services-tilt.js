/* ============================================================
   SERVICES SECTION — CSS 3D parallax tilt on hover, driven by a
   real spring simulation (not a CSS transition pretending to be
   one). Clamped to ±6deg. 'full' tier only — reads from services-
   tier.js, the single source of truth for capability decisions.
   The specular highlight position/intensity comes from the shared
   light (services-light.js); this module only owns rotation.
   ============================================================ */

(function () {
  "use strict";

  if (!window.SVTier) return;

  const MAX_DEG = 6;
  // Follow spring: how the card chases the pointer while hovering.
  const FOLLOW = { stiffness: 150, damping: 20, mass: 0.8 };
  // Return spring: softer — the card relaxes back rather than snapping.
  const RETURN = { stiffness: 90, damping: 18, mass: 0.8 };

  const instances = [];

  function makeAxis() {
    return { pos: 0, vel: 0, target: 0 };
  }

  function stepSpring(axis, spring, dt) {
    const force = -spring.stiffness * (axis.pos - axis.target) - spring.damping * axis.vel;
    const accel = force / spring.mass;
    axis.vel += accel * dt;
    axis.pos += axis.vel * dt;
    return Math.abs(axis.pos - axis.target) < 0.01 && Math.abs(axis.vel) < 0.01;
  }

  function createTilt(card) {
    const rx = makeAxis();
    const ry = makeAxis();
    let hovering = false;
    let raf = null;
    let lastT = null;

    function loop(now) {
      const dt = Math.min(32, lastT ? now - lastT : 16) / 1000;
      lastT = now;
      const spring = hovering ? FOLLOW : RETURN;
      const doneX = stepSpring(rx, spring, dt);
      const doneY = stepSpring(ry, spring, dt);

      // Lift (translateY on hover) lives in CSS via .is-tilting + `translate`,
      // which has its own CSS transition — keeps this rAF loop focused only
      // on the rotation the spring is actually simulating.
      card.style.transform = `rotateX(${rx.pos.toFixed(2)}deg) rotateY(${ry.pos.toFixed(2)}deg)`;

      if (!hovering && doneX && doneY) {
        card.style.transform = "";
        card.style.willChange = "";
        raf = null;
        lastT = null;
        return;
      }
      raf = requestAnimationFrame(loop);
    }

    function ensureLoop() {
      if (!raf) {
        card.style.willChange = "transform";
        raf = requestAnimationFrame(loop);
      }
    }

    function onEnter(e) {
      if (e.pointerType !== "mouse") return;
      hovering = true;
      card.classList.add("is-tilting");
      ensureLoop();
    }

    function onMove(e) {
      if (e.pointerType !== "mouse" || !hovering) return;
      const rect = card.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top) / rect.height;
      ry.target = Math.max(-MAX_DEG, Math.min(MAX_DEG, (px - 0.5) * MAX_DEG * 2));
      rx.target = Math.max(-MAX_DEG, Math.min(MAX_DEG, -(py - 0.5) * MAX_DEG * 2));
      ensureLoop();
    }

    function onLeave(e) {
      if (e.pointerType !== "mouse") return;
      hovering = false;
      card.classList.remove("is-tilting");
      rx.target = 0;
      ry.target = 0;
      ensureLoop();
    }

    card.addEventListener("pointerenter", onEnter);
    card.addEventListener("pointermove", onMove);
    card.addEventListener("pointerleave", onLeave);

    return {
      teardown() {
        card.removeEventListener("pointerenter", onEnter);
        card.removeEventListener("pointermove", onMove);
        card.removeEventListener("pointerleave", onLeave);
        if (raf) cancelAnimationFrame(raf);
        card.style.transform = "";
        card.style.willChange = "";
        card.classList.remove("is-tilting");
      },
    };
  }

  function attach() {
    if (instances.length) return;
    document.querySelectorAll(".sv2-card").forEach((card) => {
      instances.push(createTilt(card));
    });
  }

  function detach() {
    while (instances.length) instances.pop().teardown();
  }

  function sync(tier) {
    if (tier === "full") attach();
    else detach();
  }

  sync(window.SVTier.get());
  window.SVTier.onChange(sync);
})();
