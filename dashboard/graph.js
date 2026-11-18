/* Revisu - two relational graphs in the style of Logseq's graph view.
 *   1. "Persone & paper": researchers <-> the papers they wrote (shared papers = collaboration).
 *      Hide papers to see the projected co-authorship network (who works with whom).
 *   2. "Parole": keywords linked when they appear in the same paper.
 * Built from the sample papers of the selected topic (works.json).
 * Uses globals from app.js: state, $, esc, fmt, css, oa, flag, fold, growthTxt, setKeyword, toast. */
"use strict";

const EUROPE = new Set("AT BE BG CH CY CZ DE DK EE ES FI FR GB GR HR HU IE IS IT LT LU LV MT NL NO PL PT RO RS SE SI SK UA BA AL MK ME".split(" "));
const NAM = new Set(["US", "CA", "MX"]);
const ASIA = new Set("CN JP KR IN SG TW HK IR TR SA AE IL MY TH VN ID PK QA BD".split(" "));
const nid = (x) => (typeof x === "object" ? x.id : x);
const GRAPHS = [];

function region(cc) {
  const home = state.settings.home_country || "IT";
  if (!cc) return "other";
  if (cc === home) return "home";
  if (EUROPE.has(cc)) return "europe";
  if (NAM.has(cc)) return "nam";
  if (ASIA.has(cc)) return "asia";
  return "other";
}
function rgba(hex, a) {
  const h = (hex || "").replace("#", "");
  if (h.length !== 6) return hex;
  return `rgba(${parseInt(h.slice(0, 2), 16)},${parseInt(h.slice(2, 4), 16)},${parseInt(h.slice(4, 6), 16)},${a})`;
}
function palette() {
  return {
    home: css("--accent-hot"), europe: css("--series-1"), nam: css("--series-2"), asia: css("--series-3"), other: css("--muted"),
    paper: css("--g-paper"), warm: css("--div-warm"), warm2: css("--div-warm-2"), mid: css("--div-mid"), cool2: css("--div-cool-2"), cool: css("--div-cool"),
    text: css("--g-text"), text2: css("--g-text-2"), link: css("--g-link"), hi: css("--g-hi"), bg: css("--g-bg"),
  };
}
function addLink(links, a, b, extra) {
  if (a === b) return;
  const [s, t] = a < b ? [a, b] : [b, a];
  const k = s + "|" + t;
  const l = links.get(k) || { source: s, target: t, w: 0, ...extra };
  l.w++; links.set(k, l);
}

// ------------------------------------------------------------------ data builders
function buildPeoplePapers(d, o) {
  const people = new Map(), papers = new Map(), links = new Map();
  const top = new Map(d.authors.map((a) => [a.id, a]));
  const count = new Map();
  d.works.forEach((w) => w.authors.forEach((a) => a.id && count.set(a.id, (count.get(a.id) || 0) + 1)));
  // keep people who appear in >= 2 sample papers or are among the most active of the topic
  const watched = new Set(d.authors.filter((a) => a.watched).flatMap((a) => [a.id, ...(a.aliases || [])]));
  const keep = (id) => (count.get(id) || 0) >= 2 || top.has(id) || watched.has(id);
  d.works.forEach((w) => {
    // in papers of followed people/groups keep every author, so their collaborators appear too
    const au = w.authors.filter((a) => a.id && (keep(a.id) || w.tags.includes("watched")));
    if (!au.length) return;
    au.forEach((a) => {
      const t = top.get(a.id);
      const n = people.get(a.id) || { id: a.id, type: "person", label: t?.name || a.name, papers: [],
        country: t?.country || a.inst[0]?.country, inst: t?.institution || a.inst[0]?.name, recent: t?.count_recent,
        watched: watched.has(a.id) };
      n.papers.push(w.id); people.set(a.id, n);
    });
    if (o.papers) {
      papers.set(w.id, { id: w.id, type: "paper", label: w.title, w });
      au.forEach((a) => addLink(links, w.id, a.id));
    } else {
      for (let i = 0; i < au.length; i++) for (let j = i + 1; j < au.length; j++) addLink(links, au[i].id, au[j].id);
    }
  });
  return { nodes: [...people.values(), ...papers.values()], links: [...links.values()], hubs: [] };
}

function buildWords(d) {
  const nodes = new Map(), links = new Map();
  const info = new Map([...d.keywords, ...d.topics].map((k) => [fold(k.name), k]));
  d.works.forEach((w) => {
    const ks = [...new Set((w.keywords || []).map(fold))].filter(Boolean);
    ks.forEach((k) => {
      const n = nodes.get("k:" + k) || { id: "k:" + k, type: "word", label: w.keywords.find((x) => fold(x) === k), papers: [], info: info.get(k) };
      n.papers.push(w.id); nodes.set(n.id, n);
    });
    for (let i = 0; i < ks.length; i++) for (let j = i + 1; j < ks.length; j++) addLink(links, "k:" + ks[i], "k:" + ks[j]);
  });
  // a word present in a large share of papers is the query itself: it would link everything to everything
  const hubMax = Math.max(8, d.works.length * 0.3);
  const hubs = [...nodes.values()].filter((n) => n.papers.length > hubMax);
  hubs.forEach((h) => nodes.delete(h.id));
  const ls = [...links.values()].filter((l) => nodes.has(l.source) && nodes.has(l.target));
  return { nodes: [...nodes.values()], links: ls, hubs: hubs.map((h) => h.label) };
}

// ------------------------------------------------------------------ one Logseq-like graph view
function createGraph(root, cfg) {
  const S = { cfg, fg: null, full: null, nbrs: new Map(), deg: new Map(), sel: null, hover: null, key: "", pal: {},
              o: { ...cfg.defaults } };
  root.innerHTML = `
    <div class="card-head">
      <h2>${cfg.title} <span class="muted small g-sub"></span></h2>
      <div class="filters">
        <input class="g-search" type="search" placeholder="Cerca nel grafo…" aria-label="Cerca nel grafo">
        <button class="ghost g-fit" type="button" title="Adatta alla finestra">⤢</button>
        <button class="ghost g-full" type="button" title="Schermo intero">⛶</button>
      </div>
    </div>
    <div class="lsq">
      <div class="lsq-canvas"></div>
      <div class="lsq-settings">
        <button type="button" class="lsq-gear" title="Impostazioni del grafo">⚙</button>
        <div class="lsq-box" hidden>
          ${cfg.toggles.map(([k, l]) => `<label class="check"><input type="checkbox" data-o="${k}"> ${l}</label>`).join("")}
          <label class="check"><input type="checkbox" data-o="labels"> Etichette</label>
          <label class="check"><input type="checkbox" data-o="orphans"> Nodi senza collegamenti</label>
          <label class="rng">Repulsione <input type="range" min="10" max="400" data-o="charge"></label>
          <label class="rng">Distanza link <input type="range" min="5" max="150" data-o="dist"></label>
          <label class="rng">Dimensione nodi <input type="range" min="2" max="8" step="0.5" data-o="size"></label>
          <label class="rng">Dimensione testo <input type="range" min="6" max="18" data-o="font"></label>
        </div>
      </div>
      <div class="lsq-panel" hidden></div>
    </div>
    <div class="legend g-legend"></div>`;
  const q = (s) => root.querySelector(s);
  const el = q(".lsq-canvas"), panel = q(".lsq-panel");

  // settings controls
  root.querySelectorAll("[data-o]").forEach((inp) => {
    const k = inp.dataset.o;
    if (inp.type === "checkbox") inp.checked = !!S.o[k]; else inp.value = S.o[k];
    inp.addEventListener("input", () => {
      S.o[k] = inp.type === "checkbox" ? inp.checked : +inp.value;
      if (k === "charge" || k === "dist") { applyForces(); S.fg.d3ReheatSimulation(); }
      else if (cfg.rebuildOn.includes(k) || k === "orphans") { S.key = ""; render(); }
    });
  });
  q(".lsq-gear").onclick = () => (q(".lsq-box").hidden = !q(".lsq-box").hidden);
  q(".g-fit").onclick = () => fit();
  q(".g-full").onclick = () => toggleFull();
  q(".g-search").addEventListener("keydown", (e) => {
    if (e.key === "Escape") { e.target.value = ""; select(null); return; }
    if (e.key !== "Enter") return;
    const s = fold(e.target.value.trim()); if (!s) return;
    const n = S.full.nodes.find((x) => fold(x.label).includes(s));
    if (n) select(n.id, true); else toast("Nessun nodo trovato");
  });

  function applyForces() {
    S.fg.d3Force("charge").strength(-S.o.charge).distanceMax(400);
    S.fg.d3Force("link").distance(S.o.dist);
  }
  const focus = () => S.sel || S.hover;
  const isNb = (a, b) => (S.nbrs.get(a) || new Set()).has(b);
  const faded = (n) => { const f = focus(); return f && n.id !== f && !isNb(f, n.id); };
  const radius = (n) => S.o.size * (1 + Math.sqrt(S.deg.get(n.id) || 0) * 0.55) * (n.type === "paper" ? 0.75 : 1);

  function init() {
    S.fg = ForceGraph()(el)
      .nodeId("id")
      .nodeRelSize(1)
      .nodeVal((n) => radius(n) ** 2)
      .nodeLabel(() => "")
      .nodeCanvasObject(draw)
      .nodePointerAreaPaint((n, color, ctx) => { ctx.fillStyle = color; ctx.beginPath(); ctx.arc(n.x, n.y, radius(n) + 2, 0, 2 * Math.PI); ctx.fill(); })
      .linkColor((l) => {
        const f = focus();
        if (f && (nid(l.source) === f || nid(l.target) === f)) return S.pal.hi;
        return rgba(S.pal.link, f ? 0.12 : 0.55);
      })
      .linkWidth((l) => { const f = focus(); return f && (nid(l.source) === f || nid(l.target) === f) ? 1.6 : 0.6 + Math.min(1.5, (l.w - 1) * 0.4); })
      .onNodeHover((n) => { S.hover = n ? n.id : null; el.style.cursor = n ? "pointer" : ""; })
      .onNodeClick((n) => select(n.id, false))
      .onNodeDragEnd((n) => { n.fx = n.x; n.fy = n.y; }) // like Logseq: dragged nodes stay where you drop them
      .onBackgroundClick(() => select(null))
      .autoPauseRedraw(false)
      .warmupTicks(40)
      .cooldownTicks(200)
      .onEngineStop(() => { if (S.fitPending) { S.fitPending = false; fit(); } });
    applyForces();
    new ResizeObserver(() => S.fg.width(el.clientWidth).height(el.clientHeight)).observe(el);
    S.fg.width(el.clientWidth).height(el.clientHeight);
  }

  function draw(n, ctx, scale) {
    const f = focus(), dim = faded(n), r = radius(n);
    const base = cfg.color(n, S.pal);
    ctx.globalAlpha = dim ? 0.12 : 1;
    ctx.beginPath(); ctx.arc(n.x, n.y, r, 0, 2 * Math.PI);
    ctx.fillStyle = n.id === S.sel ? S.pal.hi : base; ctx.fill();
    if (n.watched && n.id !== f) { ctx.lineWidth = 2.2 / scale; ctx.strokeStyle = S.pal.text; ctx.beginPath(); ctx.arc(n.x, n.y, r + 2.5 / scale, 0, 2 * Math.PI); ctx.stroke(); }
    if (n.id === f) { ctx.lineWidth = 2 / scale; ctx.strokeStyle = S.pal.hi; ctx.beginPath(); ctx.arc(n.x, n.y, r + 3 / scale, 0, 2 * Math.PI); ctx.stroke(); }
    // labels: always for the focus + neighbours; otherwise fade in with zoom (bigger nodes first), like Logseq
    if (S.o.labels && !dim) {
      const big = (S.deg.get(n.id) || 0) >= S.labelDeg;
      const near = (f && (n.id === f || isNb(f, n.id))) || n.watched;
      const alpha = near ? 1 : Math.max(0, Math.min(1, (scale - (big ? 0.15 : 0.9)) * 2));
      if (alpha > 0.02) {
        let t = (n.watched ? "★ " : "") + (n.label || "");
        const max = n.type === "paper" ? 42 : 30;
        if (t.length > max && n.id !== f) t = t.slice(0, max - 1) + "…";
        const fs = S.o.font / Math.max(scale, 0.8);
        ctx.globalAlpha = alpha;
        ctx.font = `${n.id === f ? "600 " : ""}${fs}px system-ui, -apple-system, "Segoe UI", sans-serif`;
        ctx.textAlign = "center"; ctx.textBaseline = "top";
        ctx.fillStyle = n.id === f ? S.pal.text : S.pal.text2;
        ctx.fillText(t, n.x, n.y + r + 2 / scale);
      }
    }
    ctx.globalAlpha = 1;
  }

  function fit() {
    const ns = S.fg.graphData().nodes.filter((n) => n.x != null);
    if (ns.length < 8) return S.fg.zoomToFit(500, 40);
    const cx = ns.reduce((a, n) => a + n.x, 0) / ns.length, cy = ns.reduce((a, n) => a + n.y, 0) / ns.length;
    const ds = ns.map((n) => Math.hypot(n.x - cx, n.y - cy)).sort((a, b) => a - b);
    const lim = ds[Math.floor(ds.length * 0.9)] * 1.15;
    S.fg.zoomToFit(500, 30, (n) => Math.hypot(n.x - cx, n.y - cy) <= lim);
  }
  function toggleFull(force) {
    const on = force ?? !root.classList.contains("full");
    root.classList.toggle("full", on);
    document.body.classList.toggle("noscroll", on);
    q(".g-full").textContent = on ? "✕" : "⛶";
    setTimeout(fit, 150);
  }
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && root.classList.contains("full")) toggleFull(false); });

  function render() {
    const d = state.cache[state.slug];
    if (!d) return;
    if (typeof ForceGraph === "undefined") { el.innerHTML = '<p class="muted" style="padding:16px">Libreria del grafo non caricata (serve internet al primo avvio).</p>'; return; }
    S.pal = palette();
    if (!S.fg) init();
    const key = state.slug + "|" + cfg.rebuildOn.map((k) => S.o[k]).join(",") + "|" + S.o.orphans;
    if (key !== S.key) {
      S.key = key;
      const data = cfg.build(d, S.o);
      S.deg = new Map(); S.nbrs = new Map();
      data.links.forEach((l) => {
        const a = nid(l.source), b = nid(l.target);
        S.deg.set(a, (S.deg.get(a) || 0) + 1); S.deg.set(b, (S.deg.get(b) || 0) + 1);
        (S.nbrs.get(a) || S.nbrs.set(a, new Set()).get(a)).add(b);
        (S.nbrs.get(b) || S.nbrs.set(b, new Set()).get(b)).add(a);
      });
      if (!S.o.orphans) data.nodes = data.nodes.filter((n) => S.deg.has(n.id));
      const degs = data.nodes.map((n) => S.deg.get(n.id) || 0).sort((a, b) => b - a);
      S.labelDeg = degs[Math.min(25, degs.length - 1)] || 1;
      S.full = data; S.sel = null; S.hover = null; S.fitPending = true;
      S.fg.graphData(data);
      q(".g-sub").textContent = `— ${data.nodes.length} nodi · ${data.links.length} collegamenti · ${d.works.length} paper campione` +
        (data.hubs.length ? ` · nascosta perché collegata a tutto: ${data.hubs.join(", ")}` : "");
      renderPanel();
    }
    q(".g-legend").innerHTML = cfg.legend(S.pal).map(([c, l]) => `<span><i style="background:${c}"></i>${l}</span>`).join("") +
      `<span class="muted">· dimensione = numero di collegamenti · trascina i nodi, rotella per lo zoom, clic per i dettagli</span>`;
  }

  function select(id, center = false) {
    S.sel = id;
    if (id && center) {
      const n = S.fg.graphData().nodes.find((x) => x.id === id);
      if (n && n.x != null) { S.fg.centerAt(n.x, n.y, 600); S.fg.zoom(Math.max(S.fg.zoom(), 2.2), 600); }
    }
    renderPanel();
  }
  const byId = (id) => S.full.nodes.find((n) => n.id === id);
  const nbList = (id, type) => [...(S.nbrs.get(id) || [])].map(byId).filter((n) => n && (!type || n.type === type))
    .sort((a, b) => (S.deg.get(b.id) || 0) - (S.deg.get(a.id) || 0));
  const chip = (n) => `<button type="button" class="gchip" data-node="${esc(n.id)}"><i style="background:${cfg.color(n, S.pal)}"></i>${esc(n.label.length > 70 ? n.label.slice(0, 69) + "…" : n.label)}</button>`;

  function renderPanel() {
    if (!S.sel) { panel.hidden = true; return; }
    const n = byId(S.sel), d = state.cache[state.slug];
    if (!n) { panel.hidden = true; return; }
    const paperLi = (ids) => [...new Set(ids)].map((pid) => d.works.find((w) => w.id === pid)).filter(Boolean)
      .sort((a, b) => b.cites - a.cites).slice(0, 10)
      .map((w) => `<li><a href="${esc(w.doi || oa(w.id))}" target="_blank" rel="noopener">${esc(w.title)}</a> <span class="muted small">${w.year} · ${fmt(w.cites)} cit.</span></li>`).join("");
    let h = "";
    if (n.type === "person") {
      const co = S.o.papers ? [...new Set(nbList(n.id, "paper").flatMap((p) => nbList(p.id, "person")))].filter((x) => x.id !== n.id) : nbList(n.id, "person");
      h = `<div class="gtype">Ricercatore</div><h3><a href="${oa(n.id)}" target="_blank" rel="noopener">${esc(n.label)}</a></h3>
        <p class="small">${flag(n.country)} ${esc(n.inst || "affiliazione non nota")}<br>${n.papers.length} paper nel campione${n.recent ? ` · ${n.recent} lavori recenti sul topic` : ""}</p>
        ${co.length ? `<h4>Collabora con (${co.length})</h4><div class="gchips">${co.slice(0, 24).map(chip).join("")}</div>` : `<p class="small muted">Nessun coautore tra le persone del grafo.</p>`}
        <h4>Paper</h4><ul class="gpapers">${paperLi(n.papers)}</ul>`;
    } else if (n.type === "paper") {
      const w = n.w;
      h = `<div class="gtype">Paper</div><h3><a href="${esc(w.doi || oa(w.id))}" target="_blank" rel="noopener">${esc(w.title)}</a></h3>
        <p class="small">${w.year} · ${esc(w.venue || "")} · ${fmt(w.cites)} citazioni</p>
        <h4>Autori nel grafo</h4><div class="gchips">${nbList(n.id, "person").map(chip).join("")}</div>
        <p class="small muted">Tutti gli autori: ${esc(w.authors.map((a) => a.name).join(", "))}</p>
        ${w.abstract ? `<details class="abs"><summary>abstract</summary><p>${esc(w.abstract)}</p></details>` : ""}`;
    } else {
      const rel = nbList(n.id);
      h = `<div class="gtype">Parola chiave</div><h3>${esc(n.label)}</h3>
        <p class="small">${n.papers.length} paper nel campione${n.info ? ` · ${fmt(n.info.count_recent)} lavori recenti sul topic, crescita <b>${growthTxt(n.info.growth)}</b>` : ""}</p>
        <button type="button" class="small g-show">Filtra la lista paper su questa parola ↓</button>
        ${rel.length ? `<h4>Collegata a (${rel.length})</h4><div class="gchips">${rel.slice(0, 30).map(chip).join("")}</div>` : ""}
        <h4>Paper</h4><ul class="gpapers">${paperLi(n.papers)}</ul>`;
    }
    panel.innerHTML = `<button type="button" class="ghost small gclose" aria-label="Chiudi">✕</button>` + h;
    panel.hidden = false;
    panel.querySelector(".gclose").onclick = () => select(null);
    panel.querySelectorAll("[data-node]").forEach((b) => (b.onclick = () => select(b.dataset.node, true)));
    const gs = panel.querySelector(".g-show");
    if (gs) gs.onclick = () => setKeyword(n.label, "keywords");
  }

  // focus a node from outside (e.g. the watchlist card); falls back to any alias id of a followed person
  function focusExternal(id) {
    const d = state.cache[state.slug];
    const a = d && d.authors.find((x) => x.id === id);
    const ids = [id, ...((a && a.aliases) || [])];
    const n = S.full && S.full.nodes.find((x) => ids.includes(x.id));
    if (n) select(n.id, true); else toast("Non presente nel grafo: nessun paper del campione con questa persona");
  }
  return { render, focus: focusExternal };
}

// ------------------------------------------------------------------ the two graphs
function setupGraphs() {
  if (GRAPHS.length) return;
  GRAPHS.push(createGraph($("#graphPeople"), {
    title: "Grafo persone &amp; paper",
    defaults: { papers: true, labels: true, orphans: false, charge: 60, dist: 30, size: 3, font: 11 },
    toggles: [["papers", "Mostra i paper (spento = solo chi collabora con chi)"]],
    rebuildOn: ["papers"],
    build: buildPeoplePapers,
    color: (n, p) => (n.type === "paper" ? p.paper : p[region(n.country)]),
    legend: (p) => {
      const home = state.settings.home_country || "IT";
      return [[p.paper, "paper"], [p.home, `ricercatore ${flag(home)}`], [p.europe, "Europa"], [p.nam, "Nord America"], [p.asia, "Asia"], [p.other, "altro / ignoto"]];
    },
  }));
  GRAPHS.push(createGraph($("#graphWords"), {
    title: "Grafo delle parole",
    defaults: { labels: true, orphans: false, charge: 120, dist: 45, size: 3, font: 12 },
    toggles: [],
    rebuildOn: [],
    build: (d) => buildWords(d),
    color: (n, p) => {
      const g = n.info?.growth;
      if (!n.info || !n.info.eligible) return p.mid;
      if (g == null || g >= 2) return p.warm;
      if (g >= 1.25) return p.warm2;
      if (g > 0.8) return p.mid;
      if (g > 0.5) return p.cool2;
      return p.cool;
    },
    legend: (p) => [[p.cool, "in calo"], [p.mid, "stabile / poco volume"], [p.warm2, "in crescita"], [p.warm, "forte crescita"]],
  }));
}

function renderGraph() {
  setupGraphs();
  GRAPHS.forEach((g) => g.render());
}
