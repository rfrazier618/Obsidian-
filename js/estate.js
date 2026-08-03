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
    /* the compass always points home; from the lounge, home is the Atrium */
    const inLounge = (id === "onyx-lounge");
    compass.hidden = (id === "security-gate");
    compass.dataset.dest = inLounge ? "grand-atrium" : "onyx-lounge";
    compass.firstElementChild.textContent = inLounge ? "GRAND ATRIUM" : "ONYX LOUNGE";
    compass.title = inLounge ? "Return to the Grand Atrium" : "Return to the Onyx Lounge";
    document.body.classList.toggle("render-scene",
      next.classList.contains("render-titled") || next.hasAttribute("data-hide-mark"));
    sceneAmbience(id);
    setTimeout(() => { transitioning = false; }, 1400);
  }

  /* gate opening is a scene event, then movement.
     Portrait screens play the gate-opening film; landscape crossfades the
     closed render into the open one. Either way the stills are the fallback. */
  const gateVideo = document.getElementById("gate-video");
  const arrivalVideo = document.getElementById("arrival-video");
  const arrivalSkip = document.getElementById("arrival-skip");

  /* Play a film over the gate scene. The still-render crossfade always runs
     underneath, so a codec failure or slow buffer never strands the visitor.
     The film stays hidden until it actually renders frames. */
  function playFilm(video, { onDone, onFallback, maxMs }) {
    let settled = false;
    const cleanup = () => {
      video.pause();
      video.hidden = true;
      arrivalSkip.hidden = true;
    };
    const done = () => { if (!settled) { settled = true; cleanup(); onDone(); } };
    const fallback = () => { if (!settled) { settled = true; cleanup(); onFallback(); } };
    video.currentTime = 0;
    video.addEventListener("playing", () => {
      if (!settled) { video.hidden = false; arrivalSkip.hidden = false; }
    }, { once: true });
    video.addEventListener("ended", done, { once: true });
    video.addEventListener("error", fallback, { once: true });
    arrivalSkip.onclick = done;
    video.onclick = done;
    setTimeout(fallback, maxMs);
    const p = video.play();
    if (p && p.catch) p.catch(fallback);
  }

  function openGate(dest) {
    const gateScene = document.getElementById("s-security-gate");
    gateScene.classList.add("gate-open");
    Sound.ensure();
    Sound.rumble(3.2);
    const portrait = window.innerHeight > window.innerWidth * 1.05;
    if (portrait && gateVideo) {
      /* phones: the gates open on film, then the walk begins */
      playFilm(gateVideo, {
        onDone: () => go(dest),
        onFallback: () => setTimeout(() => go(dest), 1200),
        maxMs: 11500
      });
    } else if (arrivalVideo) {
      /* landscape: the arrival film carries you up the drive and delivers
         you home; the grounds remain explorable via "Return outside" */
      playFilm(arrivalVideo, {
        onDone: () => go("grand-atrium"),
        onFallback: () => setTimeout(() => go(dest), 1200),
        maxMs: 17500
      });
    } else {
      setTimeout(() => go(dest), 2600);
    }
  }

  document.querySelectorAll("[data-go]").forEach(btn => {
    btn.addEventListener("click", () => {
      const dest = btn.dataset.go;
      if (btn.dataset.gate === "open") {
        const gateScene = document.getElementById("s-security-gate");
        if (!gateScene.classList.contains("gate-open")) {
          openGate(dest);
          return;
        }
      }
      go(dest);
    });
  });

  compass.addEventListener("click", () => go(compass.dataset.dest || "onyx-lounge"));

  /* ---------- gemini discovery state ---------- */

  function revealGeminiInLounge() {
    document.getElementById("li-gemini").hidden = false;
    document.getElementById("li-gemini-link").hidden = false;
    const mark = document.getElementById("onyx-gemini");
    if (mark) { mark.hidden = false; layoutRenderScenes(); }
  }
  if (store.geminiFound) revealGeminiInLounge();

  /* ---------- cutscenes: the secret entrance ---------- */

  const cutsceneEl = document.getElementById("cutscene");
  const secretVideo = document.getElementById("secret-video");
  const steps = ["cs-1", "cs-2", "cs-3", "cs-4"];
  const DURATIONS = { "cs-1": 10000, "cs-2": 9500, "cs-3": 8000, "cs-4": 11500 };
  let csTimer = null, csIndex = -1, csActive = false, csFilm = false;

  /* the discovery plays the secret-entrance film; the staged CSS
     cutscenes are the fallback if the film cannot play */
  function playCutscenes() {
    csActive = true;
    cutsceneEl.hidden = false;
    if (secretVideo) {
      let settled = false;
      csFilm = true;
      const fallback = () => {
        if (settled) return;
        settled = true;
        csFilm = false;
        secretVideo.pause();
        secretVideo.hidden = true;
        if (csActive) startCssCutscenes();
      };
      const finish = () => {
        if (settled) return;
        settled = true;
        csFilm = false;
        endCutscenes();
      };
      secretVideo.hidden = false;
      secretVideo.currentTime = 0;
      secretVideo.addEventListener("ended", finish, { once: true });
      secretVideo.addEventListener("error", fallback, { once: true });
      secretVideo.onclick = finish;
      setTimeout(() => { if (!settled && secretVideo.currentTime < 0.5) fallback(); }, 4000);
      setTimeout(finish, 13000);
      const p = secretVideo.play();
      if (p && p.catch) p.catch(fallback);
    } else {
      startCssCutscenes();
    }
  }

  function startCssCutscenes() {
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
    csFilm = false;
    clearTimeout(csTimer);
    if (secretVideo) { secretVideo.pause(); secretVideo.hidden = true; }
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

  /* advance a cutscene early on click (not on the skip button; the film
     handles its own clicks) */
  cutsceneEl.addEventListener("click", e => {
    if (e.target.id === "cs-skip" || e.target.id === "secret-video" || !csActive || csFilm) return;
    clearTimeout(csTimer);
    nextCutscene();
  });

  /* ---------- room renders: map hotspots onto cover-cropped backdrops ---------- */
  /* Hotspots carrying data-ix/data-iy are positioned in image space (fractions
     of the render) and re-projected through the CSS cover crop, so they sit on
     the render's own gold markers at any viewport size. */

  function layoutRenderScenes() {
    document.querySelectorAll(".scene .render-backdrop[data-aspect]").forEach(bd => {
      const scene = bd.closest(".scene");
      const aspect = parseFloat(bd.dataset.aspect);
      const vw = window.innerWidth, vh = window.innerHeight;
      const contain = bd.dataset.fit === "contain";
      let w = vw, h = vw / aspect;
      if (contain ? h > vh : h < vh) { h = vh; w = vh * aspect; }
      const ox = (vw - w) / 2, oy = (vh - h) / 2;
      scene.querySelectorAll("[data-ix]").forEach(hs => {
        let x = ox + parseFloat(hs.dataset.ix) * w;
        let y = oy + parseFloat(hs.dataset.iy) * h;
        /* hit areas sized in image space cover a baked sign and its marker */
        if (hs.dataset.w) {
          hs.style.width = (parseFloat(hs.dataset.w) * w) + "px";
          hs.style.height = (parseFloat(hs.dataset.h) * h) + "px";
        }
        if (hs.hasAttribute("data-clamp")) {
          /* critical navigation stays reachable even when the crop cuts
             its marker off — it slides to the nearest edge instead */
          x = Math.min(Math.max(x, vw * 0.09), vw * 0.91);
          y = Math.min(Math.max(y, vh * 0.12), vh * 0.9);
          hs.style.display = "";
        } else {
          hs.style.display = (x < -24 || x > vw + 24 || y < -24 || y > vh + 24) ? "none" : "";
        }
        hs.style.left = x + "px";
        hs.style.top = y + "px";
        hs.style.right = "auto";
        hs.style.bottom = "auto";
        hs.style.transform = "translate(-50%, -50%)";
      });
    });
  }
  window.addEventListener("resize", layoutRenderScenes);
  layoutRenderScenes();

  /* locked hotspots — rooms the house declines to open */
  document.querySelectorAll("[data-locked]").forEach(btn => {
    const label = btn.querySelector(".label");
    let timer = null;
    if (label) {
      const original = label.innerHTML;
      btn.addEventListener("click", () => {
        label.textContent = btn.dataset.locked;
        btn.classList.add("locked-flash");
        clearTimeout(timer);
        timer = setTimeout(() => {
          label.innerHTML = original;
          btn.classList.remove("locked-flash");
        }, 2600);
      });
    } else {
      /* a bare marker over baked signage speaks beneath itself */
      const word = document.createElement("span");
      word.className = "locked-word";
      word.textContent = btn.dataset.locked;
      btn.appendChild(word);
      btn.addEventListener("click", () => {
        btn.classList.add("locked-flash");
        clearTimeout(timer);
        timer = setTimeout(() => btn.classList.remove("locked-flash"), 2600);
      });
    }
  });

  /* ---------- guest book ---------- */

  const guestbook = document.getElementById("guestbook");
  const openGuestbook = () => { guestbook.hidden = false; };
  document.getElementById("open-guestbook").addEventListener("click", openGuestbook);
  document.querySelectorAll("[data-guestbook]").forEach(b =>
    b.addEventListener("click", openGuestbook));
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
