/* ============================================================
   MAIN INTERACTIONS — main.js
   Cursor · Mobile Menu · Scroll · Terminal · Reveal
   Counter · Tilt · Parallax · Icon Cycler · Form · Status Bar
   ============================================================ */

(function () {
  "use strict";

  /* ──────────────────────────────────────────────────────────
     UTILITIES
  ────────────────────────────────────────────────────────── */
  const $  = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const hasMouse = window.matchMedia("(pointer: fine)").matches;
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ──────────────────────────────────────────────────────────
     CUSTOM CURSOR & ANIMATED MOUSE MOVEMENT TRAIL ENGINE
  ────────────────────────────────────────────────────────── */
  const cursor = $("#cursor");
  const ring   = $("#cursor-ring");
  const trailCanvas = $("#cursor-trail-canvas");

  if (cursor && ring) {
    let mx = -100, my = -100, rx = -100, ry = -100;
    const ctx = trailCanvas ? trailCanvas.getContext("2d") : null;
    let width = 0, height = 0;
    const sparkles = [];
    const ripplePulses = [];

    function resizeTrailCanvas() {
      if (!trailCanvas) return;
      width = window.innerWidth;
      height = window.innerHeight;
      trailCanvas.width = width * (window.devicePixelRatio || 1);
      trailCanvas.height = height * (window.devicePixelRatio || 1);
      if (ctx) ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);
    }
    resizeTrailCanvas();
    window.addEventListener("resize", resizeTrailCanvas, { passive: true });

    document.addEventListener("mousemove", (e) => {
      mx = e.clientX; my = e.clientY;
      cursor.style.left = mx + "px"; cursor.style.top = my + "px";

      // Emit mouse movement sparkles
      if (Math.random() > 0.25) {
        const isLight = document.documentElement.getAttribute("data-theme") === "light";
        sparkles.push({
          x: mx,
          y: my,
          vx: (Math.random() - 0.5) * 1.6,
          vy: (Math.random() - 0.5) * 1.6 - 0.5,
          radius: Math.random() * 2.5 + 1.2,
          color: isLight ? "#0284c7" : (Math.random() > 0.5 ? "#00f2fe" : "#818cf8"),
          alpha: 0.95,
          decay: Math.random() * 0.03 + 0.025
        });
      }
    });

    document.addEventListener("mousedown", (e) => {
      cursor.style.transform = "translate(-50%,-50%) scale(1.4)";
      ring.style.transform   = "translate(-50%,-50%) scale(0.8)";
    });

    document.addEventListener("mouseup", () => {
      cursor.style.transform = ""; ring.style.transform = "";
    });
    document.addEventListener("mouseleave", () => {
      cursor.style.opacity = "0"; ring.style.opacity = "0";
    });
    document.addEventListener("mouseenter", () => {
      cursor.style.opacity = "1"; ring.style.opacity = "1";
    });

    // Render Trail Canvas Frame Loop
    (function renderTrailFrame() {
      rx += (mx - rx) * 0.14; ry += (my - ry) * 0.14;
      ring.style.left = rx + "px"; ring.style.top = ry + "px";

      if (ctx) {
        ctx.clearRect(0, 0, width, height);

        // Render Click Shockwave Ripples
        for (let i = ripplePulses.length - 1; i >= 0; i--) {
          const rp = ripplePulses[i];
          rp.radius += 2.5;
          rp.alpha -= 0.03;

          if (rp.alpha <= 0 || rp.radius >= rp.maxRadius) {
            ripplePulses.splice(i, 1);
            continue;
          }

          ctx.strokeStyle = rp.color + rp.alpha + ")";
          ctx.lineWidth = 1.8;
          ctx.beginPath();
          ctx.arc(rp.x, rp.y, rp.radius, 0, Math.PI * 2);
          ctx.stroke();
        }

        // Render Mouse Movement Sparkles
        for (let i = sparkles.length - 1; i >= 0; i--) {
          const p = sparkles[i];
          p.x += p.vx;
          p.y += p.vy;
          p.alpha -= p.decay;
          p.radius *= 0.96;

          if (p.alpha <= 0 || p.radius <= 0.3) {
            sparkles.splice(i, 1);
            continue;
          }

          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.alpha;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalAlpha = 1;
      }

      requestAnimationFrame(renderTrailFrame);
    })();
  }

  /* ──────────────────────────────────────────────────────────
     MOBILE MENU
  ────────────────────────────────────────────────────────── */
  const hamburger  = $(".hamburger");
  const mobileMenu = $(".mobile-menu");
  let menuOpen = false;

  function openMenu() {
    if (!hamburger || !mobileMenu) return;
    menuOpen = true;
    mobileMenu.classList.add("open");
    hamburger.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
    const spans = $$("span", hamburger);
    if (spans[0]) spans[0].style.transform = "rotate(45deg) translate(5px,5px)";
    if (spans[1]) spans[1].style.opacity   = "0";
    if (spans[2]) spans[2].style.transform = "rotate(-45deg) translate(5px,-5px)";
  }

  function closeMenu() {
    if (!hamburger || !mobileMenu) return;
    menuOpen = false;
    mobileMenu.classList.remove("open");
    hamburger.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
    const spans = $$("span", hamburger);
    if (spans[0]) spans[0].style.transform = "";
    if (spans[1]) spans[1].style.opacity   = "1";
    if (spans[2]) spans[2].style.transform = "";
  }

  if (hamburger) {
    hamburger.addEventListener("click", () => (menuOpen ? closeMenu() : openMenu()));
    hamburger.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); menuOpen ? closeMenu() : openMenu(); }
    });
  }

  /* Close on any link inside menu */
  if (mobileMenu) {
    $$("a", mobileMenu).forEach((a) => a.addEventListener("click", closeMenu));
  }

  /* Close on Escape */
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && menuOpen) { closeMenu(); hamburger?.focus(); }
  });

  /* Close on outside click */
  document.addEventListener("pointerdown", (e) => {
    if (menuOpen && hamburger && mobileMenu &&
        !hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
      closeMenu();
    }
  });

  /* ──────────────────────────────────────────────────────────
     NAV: scroll state + active links (optimized with IntersectionObserver)
  ────────────────────────────────────────────────────────── */
  const nav      = $("nav");
  const navLinks = $$(".nav-links a");
  const sections = $$("section[id]");

  window.addEventListener("scroll", () => {
    if (!nav) return;

    /* Sticky style */
    if (window.scrollY > 10) {
      nav.classList.add("scrolled");
    } else {
      nav.classList.remove("scrolled");
    }
  }, { passive: true });

  // High-performance asynchronous active navigation section observer
  if (sections.length && navLinks.length) {
    const navObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute("id");
          navLinks.forEach((a) => {
            a.classList.toggle("active-link", a.getAttribute("href") === "#" + id);
          });
        }
      });
    }, {
      root: null,
      rootMargin: "-25% 0px -55% 0px", // Focus in the middle area of the viewport
      threshold: 0
    });

    sections.forEach((s) => navObserver.observe(s));
  }

  /* ──────────────────────────────────────────────────────────
     SMOOTH SCROLL for anchor links
  ────────────────────────────────────────────────────────── */
  $$('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const target = $(a.getAttribute("href"));
      if (!target) return;
      e.preventDefault();
      const navH = nav ? nav.offsetHeight : 72;
      window.scrollTo({
        top: target.getBoundingClientRect().top + window.scrollY - navH - 8,
        behavior: "smooth",
      });
    });
  });

  /* ──────────────────────────────────────────────────────────
     TYPING EFFECT + INTERACTIVE CLI SHELL
  ────────────────────────────────────────────────────────── */
  const typingEl    = $("#typing-text");
  const terminal    = $("#interactive-terminal");
  const historyEl   = $("#terminal-history");
  const shellInput  = $("#terminal-input");
  const shellPrompt = $("#shell-prompt");
  const scrollArea  = $("#terminal-scroll-area");
  const actionHint  = terminal ? $(".terminal-action-hint", terminal) : null;

  const PHRASES = [
    "console.log('Hello, I am Ahmed Aqeel!')",
    "react_native.build(cross_platform_app)",
    "git commit -m 'Production-ready update'",
    "n8n.workflow.run(ai_automation_pipeline)",
    "firebase.deploy(app_to_production)",
    "flutter build apk --release",
    "ollama.run('llama3.2', prompt)",
  ];

  let pIdx = 0, cIdx = 0, deleting = false, activeShell = false;

  function typeLoop() {
    if (activeShell || !typingEl) return;
    const phrase = PHRASES[pIdx];
    if (!deleting) {
      typingEl.textContent = phrase.slice(0, ++cIdx);
      if (cIdx === phrase.length) { deleting = true; setTimeout(typeLoop, 2400); return; }
    } else {
      typingEl.textContent = phrase.slice(0, --cIdx);
      if (cIdx === 0) { deleting = false; pIdx = (pIdx + 1) % PHRASES.length; }
    }
    setTimeout(typeLoop, deleting ? 36 : 74);
  }

  if (typingEl && !prefersReduced) setTimeout(typeLoop, 1200);

  /* CLI command map */
  const CLI = {
    help:
      `Available commands:<br>
       &bull; <span class="term-cmd">about</span>    — bio &amp; credentials<br>
       &bull; <span class="term-cmd">skills</span>   — full tech stack<br>
       &bull; <span class="term-cmd">projects</span> — key projects<br>
       &bull; <span class="term-cmd">contact</span>  — contact details<br>
       &bull; <span class="term-cmd">neofetch</span> — system banner<br>
       &bull; <span class="term-cmd">clear</span>    — clear history<br>
       &bull; <span class="term-cmd">exit</span>     — close shell`,
    about:
      `<b>Ahmed Aqeel</b> — Full Stack Developer &amp; Software Engineering Student.<br>
       Based in Kotli, AJK, Pakistan.<br>
       Passionate about building end-to-end solutions.<br>
       &bull; <b>Mobile:</b> React Native, Flutter<br>
       &bull; <b>Web/Backend:</b> Node.js, Express, TypeScript, React<br>
       &bull; <b>Python:</b> Automation, Web Scraping, Basic AI<br>
       Always eager to tackle new challenges and deliver clean, scalable code.`,
    skills:
      `<span class="term-highlight">Tech Stack</span><br>
       &bull; Languages  : JavaScript, C++, Python, Dart<br>
       &bull; Mobile     : React Native, Flutter, Expo<br>
       &bull; Backend    : Node.js, Firebase, Supabase, PHP<br>
       &bull; AI Tools   : Claude, ChatGPT, Gemini, Ollama, n8n<br>
       &bull; Deploy     : Vercel, Netlify, Docker<br>
       &bull; Design     : Figma, Photoshop, Illustrator, Premiere Pro`,
    projects:
      `<span class="term-highlight">Featured Projects</span><br>
       1. portfolio-pro — Web Template<br>
       2. Organization Finance — TypeScript / React<br>
       3. react-native-auth-ui — Mobile UI<br>
       4. Basic Chatbot — Python / NLP`,
    contact:
      `<span class="term-highlight">Contact</span><br>
       &bull; Email     : engrahmedaqeel14@gmail.com<br>
       &bull; WhatsApp  : +92 316 1893004<br>
       &bull; LinkedIn  : linkedin.com/in/ahmed-aqeel-2a0090271<br>
       &bull; Location  : Kotli, Azad Kashmir, Pakistan`,
    neofetch:
      `<pre class="neo-pre">   /\\   <b>ahmed@portfolio</b>
  /  \\  ─────────────────────
 /_/\\_\\ OS    : Kotli, AJK, Pakistan
 \\_/\\_/ Host  : BS Software Engineering
        Stack : React Native · Flutter · Node.js
        BaaS  : Firebase · Supabase
        AI    : Ollama · n8n · Claude
        Shell : interactive-cli v4.0.0</pre>`,
  };

  if (terminal && shellInput && historyEl) {
    const activateShell = () => {
      if (activeShell) { shellInput.focus(); return; }
      activeShell = true;
      terminal.classList.add("active-shell");
      if (shellPrompt) shellPrompt.style.display = "inline-block";
      shellInput.style.display = "inline-block";
      if (actionHint) { actionHint.textContent = "Type a command & press Enter"; actionHint.style.color = "var(--gold)"; }
      if (historyEl.children.length <= 2) {
        const w = document.createElement("div");
        w.innerHTML = `<span class="term-highlight">Shell active.</span> Type <span class="term-cmd">help</span> to list commands.`;
        historyEl.appendChild(w);
      }
      shellInput.focus();
      if (scrollArea) scrollArea.scrollTop = scrollArea.scrollHeight;
    };

    terminal.addEventListener("click", activateShell);

    shellInput.addEventListener("keydown", (e) => {
      if (e.key !== "Enter") return;
      const val = shellInput.value.trim();
      shellInput.value = "";

      const echo = document.createElement("div");
      echo.innerHTML = `<span class="term-highlight">ahmed@aqeel:~$</span> <span class="term-cmd">${val}</span>`;
      historyEl.appendChild(echo);

      if (!val) { if (scrollArea) scrollArea.scrollTop = scrollArea.scrollHeight; return; }

      const cmd = val.toLowerCase();

      if (cmd === "clear") { historyEl.innerHTML = ""; return; }

      if (cmd === "exit") {
        activeShell = false;
        terminal.classList.remove("active-shell");
        if (shellPrompt) shellPrompt.style.display = "none";
        shellInput.style.display = "none";
        if (actionHint) { actionHint.textContent = "Click inside to type"; actionHint.style.color = ""; }
        historyEl.innerHTML = `
          <div>// Hello World! My name is <span class="term-highlight">Ahmed Aqeel</span>.</div>
          <div>// Click inside to activate CLI shell. Try typing <span class="term-highlight">help</span>.</div>`;
        pIdx = 0; cIdx = 0; deleting = false;
        if (typingEl && !prefersReduced) setTimeout(typeLoop, 500);
        return;
      }

      const resp = document.createElement("div");
      resp.innerHTML = CLI[cmd] ||
        `<span class="term-error">command not found: ${val}</span> — type <span class="term-highlight">help</span>`;
      historyEl.appendChild(resp);
      if (scrollArea) scrollArea.scrollTop = scrollArea.scrollHeight;
    });
  }

  /* ──────────────────────────────────────────────────────────
     SCROLL REVEAL
  ────────────────────────────────────────────────────────── */
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("visible");
      $$(".skill-fill", entry.target).forEach((bar) => {
        setTimeout(() => { bar.style.width = (bar.dataset.w || 0) + "%"; }, 200);
      });
      // Optionally unobserve after revealing to prevent re-triggering if not desired
      // revealObs.unobserve(entry.target); 
    });
  }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

  $$(".reveal").forEach((el) => revealObs.observe(el));

  /* ──────────────────────────────────────────────────────────
     COUNTER ANIMATION  (runs once per element)
  ────────────────────────────────────────────────────────── */
  const counterObs = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el     = entry.target;
      const target = parseInt(el.dataset.target, 10);
      const suffix = el.dataset.suffix || "";
      let current  = 0;
      const step   = Math.max(1, Math.floor(target / 50));
      const timer  = setInterval(() => {
        current = Math.min(current + step, target);
        el.textContent = current + suffix;
        if (current >= target) clearInterval(timer);
      }, 28);
      counterObs.unobserve(el); /* run once */
    });
  }, { threshold: 0.5 });

  $$(".stat-num[data-target]").forEach((el) => counterObs.observe(el));

  /* ──────────────────────────────────────────────────────────
     CONTACT FORM  (FormSubmit API integration)
  ────────────────────────────────────────────────────────── */
  const contactForm = $("#contact-form");
  const formStatus  = $("#form-status");

  if (contactForm) {
    contactForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      /* Validate required fields */
      let valid = true;
      $$("[required]", contactForm).forEach((el) => {
        const empty = !el.value.trim();
        el.classList.toggle("input-error", empty);
        if (empty) valid = false;
      });
      if (!valid) { setStatus("error", "Please fill in all required fields."); return; }

      /* Email format check */
      const emailEl = $("#c-email", contactForm);
      if (emailEl && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailEl.value)) {
        emailEl.classList.add("input-error");
        setStatus("error", "Please enter a valid email address."); return;
      }

      const btn = $("[type='submit']", contactForm);
      if (btn) { btn.disabled = true; btn.textContent = "Sending…"; }

      let sentSuccessfully = false;

      try {
        const name    = ($("#c-name",  contactForm)?.value || "").trim();
        const email   = (emailEl?.value || "").trim();
        const phone   = ($("#c-phone", contactForm)?.value || "").trim();
        const service = ($("#c-service", contactForm)?.value || "").trim();
        const budget  = ($("#c-budget",  contactForm)?.value || "").trim();
        const message = ($("#c-msg",   contactForm)?.value || "").trim();
        const website = ($("#c-website", contactForm)?.value || "").trim();

        // 1. Spambot Preemption
        if (website !== "") {
          showSuccessModal();
          contactForm.reset();
          if (btn) {
            btn.disabled = false;
            btn.textContent = "Send Message →";
          }
          return;
        }

        let validationOrRateLimitError = null;

        // 2. Try secure Vercel Serverless SMTP API
        try {
          const res = await fetch('/api/submit-contact', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, phone, service, budget, message, website })
          });

          const json = await res.json().catch(() => ({}));
          if (res.ok) {
            if (json && json.success) {
              sentSuccessfully = true;
            }
          } else {
            // Check if it's an explicit validation or rate-limiting error (400 or 429)
            if (res.status === 400 || res.status === 429) {
              validationOrRateLimitError = json.message || "Security check failed. Please try again later.";
            }
          }
        } catch (apiErr) {
          console.warn("Vercel Serverless API failed/unreachable. Attempting FormSubmit fallback...", apiErr);
        }

        // If it was an explicit security or client error rejection, do NOT attempt fallback
        if (validationOrRateLimitError) {
          setStatus("error", validationOrRateLimitError);
          if (btn) {
            btn.disabled = false;
            btn.textContent = "Send Message →";
          }
          return;
        }

        // 3. Fallback to free public FormSubmit.co API if Vercel serverless is offline (e.g. during local testing)
        if (!sentSuccessfully) {
          const fallbackRes = await fetch('https://formsubmit.co/ajax/engrahmedaqeel14@gmail.com', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify({
              name,
              email,
              phone,
              service,
              budget,
              message,
              _subject: 'Ahmed Aqeel Portfolio Form - Direct Submission'
            })
          });

          if (fallbackRes.ok) {
            const fallbackJson = await fallbackRes.json();
            if (fallbackJson && (fallbackJson.success === "true" || fallbackJson.success === true)) {
              sentSuccessfully = true;
            }
          }
        }

        if (sentSuccessfully) {
          showSuccessModal();
          contactForm.reset();
        } else {
          throw new Error("All endpoints failed");
        }

      } catch (err) {
        setStatus("error", "Failed to send message. Please try again or email engrahmedaqeel14@gmail.com directly.");
      } finally {
        if (btn) {
          btn.disabled = false;
          btn.textContent = "Send Message →";
        }
      }
    });

    /* Clear error highlight on input */
    $$("input, textarea, select", contactForm).forEach((el) => {
      el.addEventListener("input", () => el.classList.remove("input-error"));
    });
  }

  function setStatus(type, msg) {
    if (!formStatus) return;
    formStatus.className  = `form-status ${type}`;
    formStatus.textContent = msg;
    formStatus.hidden = false;
    setTimeout(() => { formStatus.hidden = true; formStatus.className = "form-status"; }, 6000);
  }

  /* ──────────────────────────────────────────────────────────
     3-D TILT + SPOTLIGHT  (mouse devices only - optimized rect caching)
  ────────────────────────────────────────────────────────── */
  if (hasMouse && !prefersReduced) {
    $$(".project-card, .skill-card, .service-card").forEach((card) => {
      let r = null;
      card.addEventListener("mouseenter", () => {
        r = card.getBoundingClientRect();
      });
      card.addEventListener("mousemove", (e) => {
        if (!r) r = card.getBoundingClientRect();
        const x = ((e.clientX - r.left) / r.width  - 0.5) * 8;
        const y = ((e.clientY - r.top)  / r.height - 0.5) * 8;
        card.style.transform = `translateY(-6px) rotateX(${-y}deg) rotateY(${x}deg)`;
        card.style.setProperty("--mouse-x", (e.clientX - r.left) + "px");
        card.style.setProperty("--mouse-y", (e.clientY - r.top)  + "px");
      }, { passive: true });
      card.addEventListener("mouseleave", () => { card.style.transform = ""; r = null; });
    });
  }

  /* ──────────────────────────────────────────────────────────
     HERO PARALLAX  (mouse devices only - optimized rect caching)
  ────────────────────────────────────────────────────────── */
  const heroVisual = $(".hero-visual");
  const avatarWrap = $(".avatar-wrap");
  const floatChips = $$(".float-chip");

  if (heroVisual && avatarWrap && hasMouse && !prefersReduced) {
    let r = null;
    heroVisual.addEventListener("mouseenter", () => {
      r = heroVisual.getBoundingClientRect();
    });
    heroVisual.addEventListener("mousemove", (e) => {
      if (!r) r = heroVisual.getBoundingClientRect();
      const x = (e.clientX - r.left) - r.width  / 2;
      const y = (e.clientY - r.top)  - r.height / 2;
      avatarWrap.style.transform = `translate(${x * 0.032}px, ${y * 0.032}px)`;
      floatChips.forEach((c, i) => {
        const f = (i + 1) * 0.042;
        c.style.transform = `translate(${x * f}px, ${y * f}px)`;
      });
    }, { passive: true });
    heroVisual.addEventListener("mouseleave", () => {
      avatarWrap.style.transform = "";
      floatChips.forEach((c) => { c.style.transform = ""; });
      r = null;
    });
  }

  /* ──────────────────────────────────────────────────────────
     SKILL ICON 3-D CYCLER
  ────────────────────────────────────────────────────────── */
  if (!prefersReduced) {
    $$(".skill-icon").forEach((icon, idx) => {
      const items = $$("img, svg", icon);
      if (items.length <= 1) return;
      let active = items.findIndex((el) => el.classList.contains("active"));
      if (active === -1) { active = 0; items[0].classList.add("active"); }
      let busy = false;

      function cycle() {
        if (busy || document.hidden) return;
        busy = true;
        const cur  = items[active];
        const next = items[(active + 1) % items.length];
        const card = icon.closest(".skill-card");
        const col  = card ? getComputedStyle(card).getPropertyValue("--card-accent").trim() : "#00e5c4";
        icon.style.boxShadow = `0 0 18px ${col}`;
        icon.style.transform = "scale(0.9) rotateY(-8deg)";
        cur.classList.add("exiting"); cur.classList.remove("active");
        setTimeout(() => {
          cur.classList.remove("exiting");
          next.classList.add("active");
          active = (active + 1) % items.length;
          setTimeout(() => { icon.style.boxShadow = ""; icon.style.transform = ""; busy = false; }, 400);
        }, 600);
      }

      setTimeout(() => setInterval(cycle, 2000), idx * 400);
    });
  }

  /* ──────────────────────────────────────────────────────────
     ROLE PILL AUTO-CYCLE
  ────────────────────────────────────────────────────────── */
  if (!prefersReduced) {
    const pills = $$(".role-pill");
    if (pills.length > 1) {
      let active = 0;
      setInterval(() => {
        pills[active].classList.remove("active");
        active = (active + 1) % pills.length;
        pills[active].classList.add("active");
      }, 2600);
    }
  }

  /* ──────────────────────────────────────────────────────────
     SCROLL TO TOP BUTTON
  ────────────────────────────────────────────────────────── */
  const scrollTopBtn = $("#scroll-top");
  if (scrollTopBtn) {
    window.addEventListener("scroll", () => {
      scrollTopBtn.classList.toggle("visible", window.scrollY > 480);
    }, { passive: true });
    scrollTopBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ──────────────────────────────────────────────────────────
     FUTURISTIC POPUP SUCCESS MODAL
  ────────────────────────────────────────────────────────── */
  function showSuccessModal() {
    // 1. Synthesize a premium electronic chime sound using Web Audio API
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        const audioCtx = new AudioContextClass();
        const playTone = (freq, start, duration) => {
          const osc = audioCtx.createOscillator();
          const gainNode = audioCtx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(freq, start);
          gainNode.gain.setValueAtTime(0.06, start);
          gainNode.gain.exponentialRampToValueAtTime(0.0001, start + duration);
          osc.connect(gainNode);
          gainNode.connect(audioCtx.destination);
          osc.start(start);
          osc.stop(start + duration);
        };
        const now = audioCtx.currentTime;
        playTone(523.25, now, 0.1);        // C5
        playTone(783.99, now + 0.08, 0.22); // G5
      }
    } catch (soundError) {
      // Gracefully ignore if audio context is blocked
    }

    // 2. Inject custom modal and toast styles if not already present
    if (!document.getElementById("success-modal-styles")) {
      const styles = document.createElement("style");
      styles.id = "success-modal-styles";
      styles.textContent = `
        /* Toast Popup styles - BOTTOM RIGHT / BOTTOM CENTER FALLBACK */
        .sys-toast-container {
          position: fixed;
          bottom: 30px;
          right: 30px;
          z-index: 9999999;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 12px;
          pointer-events: none;
          width: 90%;
          max-width: 360px;
        }
        @media (max-width: 768px) {
          .sys-toast-container {
            bottom: 20px;
            right: 50%;
            transform: translateX(50%);
            align-items: center;
          }
        }
        .sys-toast {
          pointer-events: auto;
          background: rgba(13, 18, 36, 0.96);
          border: 1.5px solid #00e5c4;
          box-shadow: 0 10px 30px rgba(0, 229, 196, 0.2), inset 0 0 10px rgba(0, 229, 196, 0.05);
          border-radius: 16px;
          padding: 14px 20px;
          display: flex;
          align-items: center;
          gap: 12px;
          width: 100%;
          transform: translateY(40px);
          opacity: 0;
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .sys-toast.show {
          transform: translateY(0);
          opacity: 1;
        }
        .sys-toast-icon {
          width: 32px;
          height: 32px;
          background: rgba(0, 229, 196, 0.1);
          border: 1.5px solid #00e5c4;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #00e5c4;
          box-shadow: 0 0 10px rgba(0, 229, 196, 0.3);
          flex-shrink: 0;
        }
        .sys-toast-content {
          flex-grow: 1;
        }
        .sys-toast-title {
          font-size: 13.5px;
          font-weight: 800;
          color: #ffffff;
          margin: 0 0 2px 0;
          letter-spacing: 0.5px;
          text-transform: uppercase;
        }
        .sys-toast-title span {
          color: #00e5c4;
        }
        .sys-toast-desc {
          font-size: 11.5px;
          color: #9ca3af;
          margin: 0;
        }
      `;
      document.head.appendChild(styles);
    }

    // 3. Create and trigger a beautiful floating Toast Notification Popup at bottom center/right
    let toastContainer = document.querySelector(".sys-toast-container");
    if (!toastContainer) {
      toastContainer = document.createElement("div");
      toastContainer.className = "sys-toast-container";
      document.body.appendChild(toastContainer);
    }

    const toast = document.createElement("div");
    toast.className = "sys-toast";
    toast.innerHTML = `
      <div class="sys-toast-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="#00e5c4" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" width="18" height="18">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      </div>
      <div class="sys-toast-content">
        <h4 class="sys-toast-title"><span>Successfully Sent!</span></h4>
        <p class="sys-toast-desc">We will contact you soon.</p>
      </div>
    `;
    toastContainer.appendChild(toast);

    // Slide in toast
    setTimeout(() => toast.classList.add("show"), 100);

    // Auto-remove toast after 4 seconds
    setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(() => toast.remove(), 500);
    }, 4000);
  }

  /* ──────────────────────────────────────────────────────────
     RESUME DOWNLOAD — download the PDF, then open it in a new tab
  ────────────────────────────────────────────────────────── */
  const resumeBtn = $("#resume-download-btn");
  if (resumeBtn) {
    resumeBtn.addEventListener("click", (e) => {
      e.preventDefault();
      const resumeUrl = resumeBtn.getAttribute("href");

      const link = document.createElement("a");
      link.href = resumeUrl;
      link.download = resumeBtn.getAttribute("download") || "Ahmed_Aqeel_Resume.pdf";
      document.body.appendChild(link);
      link.click();
      link.remove();

      window.open(resumeUrl, "_blank", "noopener");
    });
  }

  /* ──────────────────────────────────────────────────────────
     SERVICES — "Show what's included" disclosure toggle
     Real button + aria-expanded, CSS handles the grid-template-rows
     animation — this just flips the state.
  ────────────────────────────────────────────────────────── */
  $$(".sv2-disclosure-toggle").forEach((btn) => {
    btn.addEventListener("click", () => {
      const panel = document.getElementById(btn.getAttribute("aria-controls"));
      if (!panel) return;
      const open = btn.getAttribute("aria-expanded") === "true";
      btn.setAttribute("aria-expanded", String(!open));
      panel.classList.toggle("is-open", !open);
      if (window.va) window.va("event", { name: "service_disclosure_toggle", service: btn.getAttribute("aria-controls").replace("sv2-disclosure-", ""), open: !open });
    });
  });

  /* ──────────────────────────────────────────────────────────
     SERVICES — "Built with this" proof links briefly highlight
     the matching project card after the page scrolls to it.
  ──────────────────────────────────────────────────────────── */
  $$(".sv2-proof-link[data-project-highlight]").forEach((link) => {
    link.addEventListener("click", () => {
      const id = link.getAttribute("data-project-highlight");
      const card = document.querySelector(`.project-card[data-project-id="${id}"]`);
      if (!card) return;
      setTimeout(() => {
        card.classList.add("project-highlight");
        setTimeout(() => card.classList.remove("project-highlight"), 1800);
      }, 500);
    });
  });

  /* ──────────────────────────────────────────────────────────
     SERVICES — CTA click instrumentation (Vercel Analytics)
  ──────────────────────────────────────────────────────────── */
  $$(".sv2-cta").forEach((cta) => {
    cta.addEventListener("click", () => {
      const params = new URLSearchParams(cta.getAttribute("href").split("#")[0]);
      if (window.va) window.va("event", { name: "service_cta_click", service: params.get("service") || "unknown" });
    });
  });

  /* ──────────────────────────────────────────────────────────
     CONTACT FORM — prefill from a ?service= query param, set by
     the Services section CTAs. Falls back gracefully if the param
     is missing or doesn't match a real option.
  ──────────────────────────────────────────────────────────── */
  function prefillServiceFromQuery() {
    const params = new URLSearchParams(window.location.search);
    const service = params.get("service");
    if (!service) return;

    const select = $("#c-service");
    if (!select) return;
    const match = Array.from(select.options).find((o) => o.value === service);
    if (!match) return; // unrecognised value — leave the form untouched

    select.value = service;

    const msg = $("#c-msg");
    if (msg && !msg.value.trim()) {
      msg.value = `Hi Ahmed — I'm interested in ${match.textContent.trim()}.`;
    }
  }
  prefillServiceFromQuery();

  // Intercept Services CTA clicks so the page scrolls smoothly instead
  // of doing a full reload (the href still works fine without JS).
  $$(".sv2-cta[href*='service=']").forEach((cta) => {
    cta.addEventListener("click", (e) => {
      const href = cta.getAttribute("href"); // "?service=web#contact"
      const [query] = href.split("#");
      e.preventDefault();
      history.pushState(null, "", query + "#contact");
      prefillServiceFromQuery();
      const contactEl = document.getElementById("contact");
      if (contactEl) contactEl.scrollIntoView({ behavior: prefersReduced ? "auto" : "smooth" });
    });
  });

  /* ──────────────────────────────────────────────────────────
     THEME TOGGLE CONTROLLER (100% Functional Dark / Light Mode)
  ──────────────────────────────────────────────────────────── */
  function initThemeController() {
    const toggleBtn = $("#theme-toggle");
    if (!toggleBtn) return;

    const moonIcon = $(".moon-icon", toggleBtn);
    const sunIcon = $(".sun-icon", toggleBtn);

    const savedTheme = localStorage.getItem("portfolio-theme");
    const prefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;

    let currentTheme = savedTheme || (prefersLight ? "light" : "dark");

    function applyTheme(theme) {
      document.documentElement.setAttribute("data-theme", theme);
      if (theme === "light") {
        if (moonIcon) moonIcon.style.display = "none";
        if (sunIcon) sunIcon.style.display = "inline-flex";
      } else {
        if (moonIcon) moonIcon.style.display = "inline-flex";
        if (sunIcon) sunIcon.style.display = "none";
      }
      localStorage.setItem("portfolio-theme", theme);
      window.dispatchEvent(new CustomEvent("themechange", { detail: { theme } }));
    }

    applyTheme(currentTheme);

    toggleBtn.addEventListener("click", () => {
      currentTheme = currentTheme === "dark" ? "light" : "dark";
      applyTheme(currentTheme);
    });
  }

  // Initialize theme controller immediately & on DOMContentLoaded
  initThemeController();
  document.addEventListener("DOMContentLoaded", initThemeController);

})();

