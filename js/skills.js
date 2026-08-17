/* ============================================================
   SKILLS SECTION v2 — render, filter, reveal.
   Vanilla JS (no framework/build step). Renders from
   window.SKILLS_DATA / window.SKILL_CATEGORIES (skills-data.js)
   as separate per-category boxes, each holding its own tile grid.
   ============================================================ */

(function () {
  "use strict";

  const DATA = window.SKILLS_DATA || [];
  const CATEGORIES = window.SKILL_CATEGORIES || [];

  const root = document.getElementById("sk2-categories");
  const filtersEl = document.getElementById("sk2-filters");
  if (!root || !filtersEl) return;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- Official brand marks that aren't available as a clean
     full-color CDN asset — kept as hand-matched local SVGs/images
     so every tile still uses a real mark, never an emoji. ---- */
  const CUSTOM_ICONS = {
    figma: `<svg viewBox="0 0 38 38" xmlns="http://www.w3.org/2000/svg" width="28" height="28">
      <path d="M19 19C19 16.2386 16.7614 14 14 14C11.2386 14 9 16.2386 9 19C9 21.7614 11.2386 24 14 24C16.7614 24 19 21.7614 19 19Z" fill="#1ABCFE"/>
      <path d="M19 5C19 2.23858 16.7614 0 14 0C11.2386 0 9 2.23858 9 5C9 7.76142 11.2386 10 14 10C16.7614 10 19 7.76142 19 5Z" fill="#F24E1E"/>
      <path d="M29 5C29 2.23858 26.7614 0 24 0C21.2386 0 19 2.23858 19 5V10H24C26.7614 10 29 7.76142 29 5Z" fill="#FF7262"/>
      <path d="M19 14V24C19 26.7614 21.2386 29 24 29C26.7614 29 29 26.7614 29 24C29 21.2386 26.7614 19 24 19H19Z" fill="#0ACF83"/>
      <path d="M9 33C9 35.7614 11.2386 38 14 38C16.7614 38 19 35.7614 19 33V24H14C11.2386 24 9 26.2386 9 29C9 30.1046 9 31.8954 9 33Z" fill="#A259FF"/>
    </svg>`,
    canva: `<img class="sk2-icon-img" src="canva.png" alt="" aria-hidden="true" loading="lazy" style="object-fit:contain;" />`,
    lovable: `<svg viewBox="0 0 124 126" xmlns="http://www.w3.org/2000/svg" width="28" height="28">
      <path fill="url(#lovable-grad-sk2)" fill-rule="evenodd" d="M37.3.343c20.43 0 36.991 16.605 36.991 37.088v14.095h12.31c20.43 0 36.991 16.605 36.991 37.088s-16.561 37.088-36.99 37.088H.31V37.431C.31 16.948 16.87.343 37.3.343Z" clip-rule="evenodd"/>
      <defs><linearGradient id="lovable-grad-sk2" x1="41.797" x2="79.356" y1="22.372" y2="125.655" gradientUnits="userSpaceOnUse">
        <stop offset=".025" stop-color="#FF8E63"/><stop offset=".56" stop-color="#FF7EB0"/><stop offset=".95" stop-color="#4B73FF"/>
      </linearGradient></defs>
    </svg>`,
    illustrator: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="28" height="28">
      <rect width="24" height="24" rx="6" fill="#330000"/><rect x="1" y="1" width="22" height="22" rx="5" stroke="#FF9A00" stroke-width="2"/>
      <path d="M7 16L10 8L13 16" stroke="#FF9A00" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M8 14H12" stroke="#FF9A00" stroke-width="2" stroke-linecap="round"/>
      <circle cx="16" cy="15" r="1.5" fill="#FF9A00"/><path d="M16 11V13.5" stroke="#FF9A00" stroke-width="2" stroke-linecap="round"/>
    </svg>`,
    photoshop: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="28" height="28">
      <rect width="24" height="24" rx="6" fill="#001E36"/><rect x="1" y="1" width="22" height="22" rx="5" stroke="#31A8FF" stroke-width="2"/>
      <path d="M7 10C7 9 8 8 9 8H11C12 8 13 9 13 10C13 11 12 12 11 12H7V16" stroke="#31A8FF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M15 14C15 15 16 16 18 16C20 16 20 15 20 14.5C20 13 15 13.5 15 11.5C15 10 17 10 18 10C19 10 20 10.5 20 11" stroke="#31A8FF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`,
    premiere: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="28" height="28">
      <rect width="24" height="24" rx="6" fill="#00005B"/><rect x="1" y="1" width="22" height="22" rx="5" stroke="#9999FF" stroke-width="2"/>
      <path d="M7 8H10C11.1046 8 12 8.89543 12 10C12 11.1046 11.1046 12 10 12H7V16" stroke="#9999FF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M15 11C15 10 16 9 17 9C18 9 19 10 19 11V16" stroke="#9999FF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`,
    capcut: `<img class="sk2-icon-img" src="capcut.png" alt="" aria-hidden="true" loading="lazy" style="object-fit:contain;" />`,
    youtube: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="28" height="28">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814z" fill="#FF0000"/>
      <path d="M9.545 15.568V8.432L15.818 12l-6.273 3.568z" fill="white"/>
    </svg>`,
    tiktok: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="28" height="28">
      <path d="M16 4C14 4 12 5 12 7V15C12 16.6569 10.6569 18 9 18C7.34315 18 6 16.6569 6 15C6 13.3431 7.34315 12 9 12V9C5 9 3 12 3 15C3 18.3137 5.68629 21 9 21C12.3137 21 15 18.3137 15 15V8C17 10 19 10 21 10V7C19 7 17 6 16 4Z" fill="#FE2C55"/>
      <path d="M16 4C14 4 12 5 12 7V15C12 16.6569 10.6569 18 9 18C7.34315 18 6 16.6569 6 15C6 13.3431 7.34315 12 9 12V9C5 9 3 12 3 15C3 18.3137 5.68629 21 9 21C12.3137 21 15 18.3137 15 15V8C17 10 19 10 21 10V7C19 7 17 6 16 4Z" fill="#25F4EE" style="mix-blend-mode:lighten; transform: translate(-1px, 1px);"/>
    </svg>`,
  };

  function iconMarkup(skill) {
    const i = skill.icon.indexOf(":");
    const type = skill.icon.slice(0, i);
    const id = skill.icon.slice(i + 1);

    if (type === "devicon") {
      const folder = id.split("-")[0];
      const src = `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${folder}/${id}.svg`;
      return `<img class="sk2-icon-img" src="${src}" alt="" aria-hidden="true" loading="lazy" />`;
    }
    if (type === "simple") {
      const url = `https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/${id}.svg`;
      const colorStyle = skill.color
        ? `--sk2-icon-color:#${skill.color};`
        : "";
      return `<span class="sk2-icon-mask" style="--sk2-mask-url:url('${url}');${colorStyle}" aria-hidden="true"></span>`;
    }
    if (type === "custom") {
      return CUSTOM_ICONS[id] || "";
    }
    return "";
  }

  /* ---- Filter chips ---- */
  let currentFilter = "all";

  CATEGORIES.forEach((cat) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "sk2-chip";
    btn.dataset.filter = cat.id;
    btn.setAttribute("aria-pressed", cat.id === "all" ? "true" : "false");
    btn.textContent = cat.label;
    if (cat.id === "all") btn.classList.add("is-active");
    btn.addEventListener("click", () => applyFilter(cat.id));
    filtersEl.appendChild(btn);
  });

  /* ---- Build one box per category, each with its own tile grid ---- */
  const boxes = [];
  const allTiles = [];

  CATEGORIES.filter((c) => c.id !== "all").forEach((cat) => {
    const items = DATA.filter((s) => s.category === cat.id);
    if (!items.length) return;

    const box = document.createElement("section");
    box.className = "sk2-category";
    box.dataset.category = cat.id;

    const head = document.createElement("div");
    head.className = "sk2-category-head";
    head.innerHTML = `<h3 class="sk2-category-title">${cat.label}</h3><span class="sk2-category-count">${items.length}</span>`;
    box.appendChild(head);

    const grid = document.createElement("ul");
    grid.className = "sk2-grid";
    grid.setAttribute("role", "list");
    grid.setAttribute("aria-label", cat.label + " skills");
    box.appendChild(grid);

    items.forEach((skill) => {
      const li = document.createElement("li");
      li.className = "sk2-tile";
      li.setAttribute("role", "listitem");

      const dot = document.createElement("span");
      dot.className = "sk2-dot";
      dot.setAttribute("aria-hidden", "true");
      li.appendChild(dot);

      const iconWrap = document.createElement("div");
      iconWrap.className = "sk2-tile-icon";
      iconWrap.innerHTML = iconMarkup(skill);
      li.appendChild(iconWrap);

      const name = document.createElement("span");
      name.className = "sk2-tile-name";
      name.textContent = skill.name;
      li.appendChild(name);

      if (skill.note) {
        const note = document.createElement("span");
        note.className = "sk2-tile-note";
        note.textContent = skill.note;
        li.appendChild(note);
      }

      grid.appendChild(li);
      allTiles.push(li);
    });

    root.appendChild(box);
    boxes.push(box);
  });

  /* ---- Filtering: show/hide whole category boxes ---- */
  function applyFilter(filterId) {
    if (filterId === currentFilter) return;
    currentFilter = filterId;

    filtersEl.querySelectorAll(".sk2-chip").forEach((chip) => {
      const active = chip.dataset.filter === filterId;
      chip.classList.toggle("is-active", active);
      chip.setAttribute("aria-pressed", String(active));
    });

    boxes.forEach((box) => {
      const match = filterId === "all" || box.dataset.category === filterId;
      box.hidden = !match;
    });
  }

  /* ---- Scroll reveal (staggered, once) ---- */
  if (reducedMotion) {
    allTiles.forEach((t) => t.classList.add("is-visible"));
  } else {
    const io = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const idx = allTiles.indexOf(entry.target);
          const delay = Math.min(Math.max(idx % 12, 0) * 25, 550);
          setTimeout(() => entry.target.classList.add("is-visible"), delay);
          obs.unobserve(entry.target);
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );
    allTiles.forEach((t) => io.observe(t));
  }
})();
