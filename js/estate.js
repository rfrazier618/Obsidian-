/* ============================================================
   THE OBSIDIAN ESTATE — scene engine
   One continuous environment. Rooms are scenes; movement is
   cinematic; the architecture is the interface.
   ============================================================ */

(function () {
  "use strict";

  /* ---------- state ---------- */

  const SCENES = [
    "security-gate", "founders-way", "legacy-circle", "fountain-court",
    "grand-atrium", "onyx-lounge", "library", "hall-of-legacy",
    "founders-gallery", "morning-room", "chefs-kitchen", "formal-dining",
    "conservatory-gallery", "rear-estate", "gemini"
  ];

  const store = {
    get geminiFound() { try { return localStorage.getItem("oe-gemini") === "1"; } catch { return false; } },
    set geminiFound(v) { try { localStorage.setItem("oe-gemini", v ? "1" : "0"); } catch {} },
    get sound() { try { return localStorage.getItem("oe-sound") === "1"; } catch { return false; } },
    set sound(v) { try { localStorage.setItem("oe-sound", v ? "1" : "0"); } catch {} }
  };

  let current = null;
  let transitioning = false;

  /* ---------- ambient sound (synthesized, optional) ---------- */

  const Sound = {
    ctx: null, master: null, nodes: [],
    ensure() {
      if (!store.sound) return null;
      if (!this.ctx) {
        const AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) return null;
        this.ctx = new AC();
        this.master = this.ctx.createGain();
        this.master.gain.value = 0.0;
        this.master.connect(this.ctx.destination);
      }
      if (this.ctx.state === "suspended") this.ctx.resume();
      return this.ctx;
    },
    stopAll(fade = 0.8) {
      if (!this.ctx) return;
      const t = this.ctx.currentTime;
      this.master.gain.cancelScheduledValues(t);
      this.master.gain.linearRampToValueAtTime(0.0001, t + fade);
      const old = this.nodes; this.nodes = [];
      setTimeout(() => old.forEach(n => { try { n.stop(); } catch {} }), fade * 1000 + 60);
    },
    /* filtered noise bed — hearth, wind, room tone */
    bed(freq, level) {
      const ctx = this.ensure(); if (!ctx) return;
      const t = ctx.currentTime;
      const buf = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
      const src = ctx.createBufferSource();
      src.buffer = buf; src.loop = true;
      const lp = ctx.createBiquadFilter();
      lp.type = "lowpass"; lp.frequency.value = freq;
      src.connect(lp); lp.connect(this.master);
      src.start();
      this.nodes.push(src);
      this.master.gain.cancelScheduledValues(t);
      this.master.gain.linearRampToValueAtTime(level, t + 2);
    },
    /* low mechanical rumble for the gears */
    rumble(seconds) {
      const ctx = this.ensure(); if (!ctx) return;
      const t = ctx.currentTime;
      const osc = ctx.createOscillator();
      osc.type = "sawtooth"; osc.frequency.value = 28;
      const lp = ctx.createBiquadFilter();
      lp.type = "lowpass"; lp.frequency.value = 90;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.0001, t);
      g.gain.linearRampToValueAtTime(0.5, t + 1.4);
      g.gain.linearRampToValueAtTime(0.0001, t + seconds);
      osc.connect(lp); lp.connect(g); g.connect(this.master);
      this.master.gain.cancelScheduledValues(t);
      this.master.gain.linearRampToValueAtTime(0.5, t + 0.4);
      osc.start(); osc.stop(t + seconds + 0.2);
      this.nodes.push(osc);
    }
  };

  const soundToggle = document.getElementById("sound-toggle");
  function reflectSound() {
    soundToggle.setAttribute("aria-pressed", store.sound ? "true" : "false");
    soundToggle.querySelector(".st-state").textContent = store.sound ? "ON" : "OFF";
  }
  soundToggle.addEventListener("click", () => {
    store.sound = !store.sound;
    reflectSound();
    if (!store.sound) Sound.stopAll();
    else sceneAmbience(current);
  });
  reflectSound();

  function sceneAmbience(id) {
    Sound.stopAll(0.6);
    if (!store.sound) return;
    const beds = {
      "security-gate": [300, 0.05],
      "founders-way": [420, 0.05],
      "rear-estate": [500, 0.06],
      "onyx-lounge": [180, 0.07],
      "gemini": [220, 0.08]
    };
    const b = beds[id];
    if (b) Sound.bed(b[0], b[1]);
  }

  /* ---------- crest slots: canonical asset or explicit placeholder ---------- */
  /* The crest is never redrawn here. If assets/crest/rsf-shield.png is
     absent, the slot degrades to a marked placeholder ring. */
  (function checkCrest() {
    const img = new Image();
    img.onerror = () => document.querySelectorAll("[data-crest]")
      .forEach(el => el.classList.add("placeholder"));
    img.src = "assets/crest/rsf-shield.png";
  })();

  /* ---------- library shelves ---------- */

  const SPINE_COLORS = [
    "#1d1a22", "#241f28", "#2a2118", "#1a2021", "#221a1a",
    "#1f1d2a", "#282218", "#1b1f18", "#231c20", "#191d24"
  ];

  function buildShelf(el, rows, cols, markTarget) {
    el.innerHTML = "";
    el.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
    for (let r = 1; r <= rows; r++) {
      const row = document.createElement("div");
      row.className = "shelf-row";
      for (let c = 1; c <= cols; c++) {
        const b = document.createElement("div");
        b.className = "book-spine";
        b.style.background = SPINE_COLORS[(r * 7 + c * 3) % SPINE_COLORS.length];
        b.style.height = (68 + ((r * 13 + c * 29) % 30)) + "%";
        b.style.flexGrow = String(1 + ((r * 5 + c * 11) % 3) * 0.35);
        /* the clue: 1984 — 8 rows down, 4 books across */
        if (markTarget && r === 8 && c === 4) b.classList.add("the-book");
        row.appendChild(b);
      }
      el.appendChild(row);
    }
  }

  buildShelf(document.getElementById("library-shelves"), 9, 14, false);

  /* ---------- scene navigation ---------- */

  const compass = document.getElementById("compass");

  function go(id, opts = {}) {
    if (transitioning && !opts.force) return;
    const next = document.getElementById("s-" + id);
    if (!next || id === current) return;
    if (id === "gemini" && !store.geminiFound && !opts.unlock) {
      id = "library";
      return go("library");
    }
    transitioning = true;
    const prev = current ? document.getElementById("s-" + current) : null;
    if (prev) prev.classList.remove("active");
    current = id;
    requestAnimationFrame(() => requestAnimationFrame(() => {
      next.classList.add("active");
    }));
    try { history.replaceState(null, "", "#/" + id); } catch {}
    document.title = next.dataset.title
      ? next.dataset.title + " · The Obsidian Estate"
      : "The Obsidian Estate";
    compass.hidden = (id === "security-gate" || id === "onyx-lounge");
    sceneAmbience(id);
    setTimeout(() => { transitioning = false; }, 1400);
  }

  /* gate opening is a scene event, then movement */
  document.querySelectorAll("[data-go]").forEach(btn => {
    btn.addEventListener("click", () => {
      const dest = btn.dataset.go;
      if (btn.dataset.gate === "open") {
        const gateScene = document.getElementById("s-security-gate");
        if (!gateScene.classList.contains("gate-open")) {
          gateScene.classList.add("gate-open");
          Sound.ensure();
          Sound.rumble(3.2);
          setTimeout(() => go(dest), 2300);
          return;
        }
      }
      go(dest);
    });
  });

  compass.addEventListener("click", () => go("onyx-lounge"));

  /* ---------- gemini discovery state ---------- */

  function revealGeminiInLounge() {
    document.getElementById("li-gemini").hidden = false;
    document.getElementById("li-gemini-link").hidden = false;
  }
  if (store.geminiFound) revealGeminiInLounge();

  /* ---------- cutscenes: the secret entrance ---------- */

  const cutsceneEl = document.getElementById("cutscene");
  const steps = ["cs-1", "cs-2", "cs-3", "cs-4"];
  const DURATIONS = { "cs-1": 10000, "cs-2": 9500, "cs-3": 8000, "cs-4": 11500 };
  let csTimer = null, csIndex = -1, csActive = false;

  function playCutscenes() {
    csActive = true;
    cutsceneEl.hidden = false;
    buildShelf(document.getElementById("cs-shelf"), 9, 12, true);
    csIndex = -1;
    nextCutscene();
  }

  function nextCutscene() {
    if (!csActive) return;
    if (csIndex >= 0) {
      const prevEl = document.getElementById(steps[csIndex]);
      prevEl.classList.add("leaving");
      setTimeout(() => prevEl.classList.remove("active", "leaving"), 950);
    }
    csIndex++;
    if (csIndex >= steps.length) return endCutscenes();
    const id = steps[csIndex];
    const el = document.getElementById(id);
    setTimeout(() => el.classList.add("active"), csIndex === 0 ? 0 : 900);
    if (id === "cs-2") Sound.rumble(7);
    if (id === "cs-4") Sound.stopAll(3);
    csTimer = setTimeout(nextCutscene, DURATIONS[id]);
  }

  function endCutscenes() {
    csActive = false;
    clearTimeout(csTimer);
    steps.forEach(s => document.getElementById(s).classList.remove("active", "leaving"));
    cutsceneEl.hidden = true;
    store.geminiFound = true;
    revealGeminiInLounge();
    go("gemini", { unlock: true, force: true });
  }

  document.getElementById("cs-skip").addEventListener("click", endCutscenes);
  document.getElementById("discover-more").addEventListener("click", () => {
    Sound.ensure();
    playCutscenes();
  });

  /* advance a cutscene early on click (not on the skip button) */
  cutsceneEl.addEventListener("click", e => {
    if (e.target.id === "cs-skip" || !csActive) return;
    clearTimeout(csTimer);
    nextCutscene();
  });

  /* ---------- guest book ---------- */

  const guestbook = document.getElementById("guestbook");
  document.getElementById("open-guestbook").addEventListener("click", () => {
    guestbook.hidden = false;
  });
  guestbook.querySelector(".gb-close").addEventListener("click", () => {
    guestbook.hidden = true;
  });
  guestbook.addEventListener("click", e => {
    if (e.target === guestbook) guestbook.hidden = true;
  });

  /* ---------- keyboard ---------- */

  document.addEventListener("keydown", e => {
    if (e.key === "Escape") {
      if (!guestbook.hidden) guestbook.hidden = true;
      else if (csActive) endCutscenes();
    }
  });

  /* ---------- awaken ---------- */

  const entry = (location.hash || "").replace(/^#\/?/, "");
  const start = SCENES.includes(entry) ? entry : "security-gate";
  requestAnimationFrame(() => {
    document.body.classList.remove("preload");
    document.body.classList.add("awake");
    go(start, { force: true });
  });
})();
