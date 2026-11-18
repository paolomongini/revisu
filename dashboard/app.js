/* Revisu dashboard.
 * Reads ../data/ (written by scripts/radar.py and the Claude Code agents).
 * When served by scripts/server.py it can also start data downloads and agent runs and stream their progress. */
"use strict";

const DATA = "../data/";
const MAX_COMPARE = 3; // + the selected topic = 4 lines max
const AGENTS = ["orchestratore", "scout", "trend-analyst", "collab-finder", "reviewer"];
const AGENT_VAR = { "orchestratore": "--series-1", "scout": "--series-2", "trend-analyst": "--series-3", "collab-finder": "--series-4", "reviewer": "--series-5", "radar.py": "--muted" };
const REGIONS = {
  world: [[-50, -165], [72, 185]], europe: [[35, -11], [61, 32]], na: [[14, -128], [56, -62]], asia: [[-8, 66], [50, 148]],
};
const HOME_BOUNDS = { IT: [[36.4, 6.6], [47.1, 18.6]] };

const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];
const state = {
  index: null, updated: null, slug: null, cache: {}, settings: { home_country: "IT" },
  compare: [], trendMode: "abs", hotTab: "keywords", paperTab: "fresh",
  country: "", kw: null, region: "world",
  api: false, job: null, jobSeen: 0, es: null,
  saved: { papers: {}, people: {} },
};
let trendChart = null, overviewChart = null, map = null, mapLayer = null, landLayer = null;
const markers = {};

// ------------------------------------------------------------------ helpers
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const fmt = (n) => (n == null ? "–" : Number(n).toLocaleString("it-IT"));
const css = (v) => getComputedStyle(document.documentElement).getPropertyValue(v).trim();
const oa = (id) => `https://openalex.org/${id}`;
const flag = (cc) => (cc && cc.length === 2 ? String.fromCodePoint(...[...cc.toUpperCase()].map((c) => 127397 + c.charCodeAt(0))) : "");
const growthTxt = (g) => (g == null ? "nuovo" : `×${g.toFixed(2)}`);
const fold = (s) => String(s || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
const typing = (e) => /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName) || e.target.isContentEditable;

async function getJSON(path, base = DATA) {
  const r = await fetch(base + path, { cache: "no-store" });
  if (!r.ok) throw new Error(path + " " + r.status);
  return r.json();
}
async function getText(path) {
  try { const r = await fetch(DATA + path, { cache: "no-store" }); return r.ok ? r.text() : null; } catch { return null; }
}
function store(k, v) { try { localStorage.setItem("radar." + k, JSON.stringify(v)); } catch {} }
function recall(k, d) { try { const v = localStorage.getItem("radar." + k); return v ? JSON.parse(v) : d; } catch { return d; } }
function toast(msg) { const t = $("#toast"); t.textContent = msg; t.hidden = false; clearTimeout(toast.t); toast.t = setTimeout(() => (t.hidden = true), 3500); }
function topicLabel(s) { return ((state.index?.topics || []).find((t) => t.slug === s) || {}).label || s; }

async function loadTopic(slug) {
  if (state.cache[slug]) return state.cache[slug];
  const files = ["meta", "trend", "topics", "keywords", "institutions", "countries", "authors", "works"];
  const vals = await Promise.all(files.map((f) => getJSON(`${slug}/${f}.json`)));
  const d = Object.fromEntries(files.map((f, i) => [f, vals[i]]));
  const info = (state.index?.topics || []).find((t) => t.slug === slug) || {};
  d.report = info.has_report === false ? null : await getText(`${slug}/report.md`);
  d.review = info.has_review === false ? null : await getText(`${slug}/analysis/review.md`);
  state.cache[slug] = d;
  return d;
}

// ------------------------------------------------------------------ URL hash (shareable views)
function readHash() {
  const h = new URLSearchParams(location.hash.slice(1));
  return { t: h.get("t"), c: (h.get("c") || "").split(",").filter(Boolean), country: h.get("country") || "", kw: h.get("kw") };
}
function writeHash() {
  const h = new URLSearchParams();
  if (state.slug) h.set("t", state.slug);
  if (state.compare.length) h.set("c", state.compare.join(","));
  if (state.country) h.set("country", state.country);
  if (state.kw) h.set("kw", state.kw.name);
  history.replaceState(null, "", "#" + h.toString());
}

// ------------------------------------------------------------------ boot
async function boot() {
  const saved = recall("theme", null);
  if (saved) document.documentElement.dataset.theme = saved;
  state.saved = recall("saved", { papers: {}, people: {} });
  updateSavedCount();

  $("#theme").onclick = () => {
    const dark = matchMedia("(prefers-color-scheme: dark)").matches;
    const cur = document.documentElement.dataset.theme || (dark ? "dark" : "light");
    const next = cur === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next; store("theme", next); renderAll();
  };
  matchMedia("(prefers-color-scheme: dark)").addEventListener("change", renderAll);

  bindSeg("#trendMode", "mode", (v) => { state.trendMode = v; renderTrend(); });
  bindSeg("#hotTab", "tab", (v) => { state.hotTab = v; renderHot(); });
  bindSeg("#paperTab", "tab", (v) => { state.paperTab = v; renderPapers(); });
  bindSeg("#mapZoom", "z", (v) => { state.region = v; zoomRegion(); });
  $("#topic").onchange = (e) => onTopicChange(e.target.value);
  $("#compareAdd").onchange = async (e) => {
    const s = e.target.value; e.target.value = "";
    if (s && !state.compare.includes(s) && s !== state.slug && state.compare.length < MAX_COMPARE) {
      state.compare.push(s); store("compare", state.compare); writeHash(); renderCompareControls(); await renderTrend();
    }
  };
  $("#countryFilter").onchange = (e) => setCountry(e.target.value);
  $("#btnShare").onclick = async () => { try { await navigator.clipboard.writeText(location.href); toast("Link copiato"); } catch { toast(location.href); } };
  $("#btnPrint").onclick = () => window.print();
  $("#btnHelp").onclick = () => $("#helpDialog").showModal();
  setupSearch();
  setupAgents();
  setupSaved();
  setupShortcuts();

  await loadConfig();
  if (!recall("helped", false)) { store("helped", true); setTimeout(() => $("#helpDialog").showModal(), 600); }

  await refreshIndex(true);
  setInterval(() => refreshIndex(false), 8000);
  // warm the global search index in the background so the first search is instant
  const idle = window.requestIdleCallback || ((f) => setTimeout(f, 1500));
  idle(() => state.index && !searchIndex && buildSearchIndex());
}

function bindSeg(sel, attr, fn) {
  $(sel).addEventListener("click", (e) => {
    const b = e.target.closest("button"); if (!b) return;
    setSeg(sel, attr, b.dataset[attr]); fn(b.dataset[attr]);
  });
}
function setSeg(sel, attr, val) { $(sel).querySelectorAll("button").forEach((x) => x.classList.toggle("on", x.dataset[attr] === val)); }

async function refreshIndex(first) {
  let idx;
  try { idx = await getJSON("index.json"); $("#live").classList.remove("off"); }
  catch { $("#live").classList.add("off"); if (first) showEmpty(true); return; }
  if (!first && idx.updated === state.updated) {
    const cur = state.slug && idx.topics.find((t) => t.slug === state.slug);
    if (cur && (cur.has_report || state.job?.kind === "agent")) { // a report may have been written without re-indexing
      const rep = await getText(`${state.slug}/report.md`);
      if (rep !== (state.cache[state.slug] || {}).report) { delete state.cache[state.slug]; await selectTopic(state.slug); toast("Report aggiornato dagli agenti"); }
    }
    return;
  }
  state.index = idx; state.updated = idx.updated; state.cache = {}; searchIndex = null;
  if (!first) await loadConfig();
  if (!idx.topics.length) { showEmpty(true); return; }
  showEmpty(false);
  renderSelector();
  const h = first ? readHash() : {};
  const want = h.t || state.slug || recall("slug", null);
  const slug = idx.topics.some((t) => t.slug === want) ? want : idx.topics[0].slug;
  const known = (s) => idx.topics.some((t) => t.slug === s) && s !== slug;
  state.compare = (first && h.c.length ? h.c : first ? recall("compare", []) : state.compare).filter(known).slice(0, MAX_COMPARE);
  if (first) { state.country = h.country || ""; state.kw = h.kw ? { name: h.kw, tab: "keywords" } : null; if (state.kw) state.paperTab = "all"; }
  await selectTopic(slug);
  if (!first) toast("Nuovi dati caricati");
}

async function loadConfig() {
  try {
    const c = await getJSON("config/topics.json", "../");
    state.settings = { ...state.settings, ...c.settings };
    state.configTopics = c.topics || [];
  } catch {}
}

function showEmpty(on) {
  $("#empty").hidden = !on;
  $$("main > :not(#empty)").forEach((el) => (el.hidden = on));
}

function renderSelector() {
  const groups = {};
  const fetched = new Set(state.index.topics.map((t) => t.slug));
  // keep the order of config/topics.json; topics not downloaded yet are listed (○) and fetched on selection
  const cfg = state.configTopics || [];
  const all = [...cfg.map((c) => state.index.topics.find((t) => t.slug === c.slug) || { ...c, pending: true }),
               ...state.index.topics.filter((t) => !cfg.some((c) => c.slug === t.slug))];
  all.forEach((t) => (groups[t.group || "Custom"] = groups[t.group || "Custom"] || []).push(t));
  const pending = all.filter((t) => t.pending).length;
  $("#topic").innerHTML = Object.entries(groups).map(([g, ts]) =>
    `<optgroup label="${esc(g)}">${ts.map((t) => t.pending
      ? `<option value="fetch:${esc(t.slug)}">○ ${esc(t.label)} — da scaricare</option>`
      : `<option value="${esc(t.slug)}">${esc(t.label)}${t.has_report ? " ✦" : ""}</option>`).join("")}</optgroup>`
  ).join("");
  $("#topic").title = `${fetched.size} topic scaricati${pending ? `, ${pending} da scaricare (○): selezionali per scaricarli` : ""}`;
}

function onTopicChange(v) {
  if (!v.startsWith("fetch:")) return selectTopic(v, { resetFilters: true });
  $("#topic").value = state.slug;
  const slug = v.slice(6);
  if (!state.api) { toast(`Per scaricarlo: avvia con start.bat / start.sh, oppure "python scripts/radar.py fetch ${slug}"`); return; }
  startJob("fetch", { slug });
}

async function selectTopic(slug, opts = {}) {
  if (opts.resetFilters) { state.country = ""; state.kw = null; }
  state.slug = slug; store("slug", slug);
  $("#topic").value = slug;
  state.compare = state.compare.filter((s) => s !== slug);
  await loadTopic(slug);
  writeHash();
  renderAll();
}

function renderAll() {
  if (!state.slug || !state.cache[state.slug]) return;
  setSeg("#paperTab", "tab", state.paperTab);
  renderKPIs(); renderActionBar(); renderCompareControls(); renderTrend(); renderMap(); renderHot(); renderCountries();
  renderOverview(); renderPeople(); renderPapers(); renderReport(); renderWatch();
  if (typeof renderGraph === "function") renderGraph();
}

// ------------------------------------------------------------------ KPIs & action bar
function renderKPIs() {
  const { meta, institutions, countries } = state.cache[state.slug];
  const g = meta.volume_growth;
  const [r0, r1] = meta.windows.recent, [p0, p1] = meta.windows.previous;
  const pct = g ? Math.round((g - 1) * 100) : null;
  const home = state.settings.home_country || "IT";
  const hi = countries.findIndex((c) => c.id === home);
  const homeInst = institutions.filter((i) => i.country === home).length;
  $("#kpis").innerHTML = [
    kpi("Pubblicazioni", fmt(meta.total), `${meta.start_year}–${meta.current_year}`),
    kpi(`Finestra ${r0}–${r1}`, fmt(meta.n_recent),
      pct == null ? "" : `<span class="${pct >= 0 ? "up" : "down"}">${pct >= 0 ? "▲" : "▼"} ${Math.abs(pct)}%</span> vs ${p0}–${p1}`),
    kpi(`${flag(home)} ${home === "IT" ? "Italia" : home}`, hi >= 0 ? `#${hi + 1}` : "–",
      hi >= 0 ? `${fmt(countries[hi].count)} lavori ${r0}–${r1} · ${homeInst} istituzioni in mappa` : "non tra i paesi attivi"),
    kpi("Istituzioni in mappa", fmt(institutions.filter((i) => i.lat != null).length), `${fmt(countries.length)} paesi`),
    kpi("Dati aggiornati", new Date(meta.generated_at).toLocaleDateString("it-IT"), `${meta.api_calls} chiamate API · $${meta.cost_usd}`),
  ].join("");
}
const kpi = (l, v, s) => `<div class="kpi"><div class="label">${l}</div><div class="value">${v}</div><div class="sub">${s}</div></div>`;

function renderActionBar() {
  const d = state.cache[state.slug];
  $("#actTitle").textContent = d.meta.label;
  $("#actMeta").innerHTML = ` · query <code>${esc(d.meta.query)}</code>`;
  const busy = !!(state.job && !state.job.done);
  $("#btnRefresh").disabled = busy; $("#btnReport").disabled = busy;
  $("#btnReport").textContent = d.report ? "✦ Rigenera report" : "✦ Genera report con agenti";
}

// ------------------------------------------------------------------ trend (+ compare)
const SERIES = ["--series-1", "--series-2", "--series-3", "--series-4"];
function renderCompareControls() {
  $("#compareChips").innerHTML = state.compare.map((s, i) =>
    `<span class="chip"><i style="background:${css(SERIES[i + 1])}"></i>${esc(topicLabel(s))}<button data-rm="${esc(s)}" aria-label="Rimuovi">×</button></span>`
  ).join("");
  $("#compareChips").querySelectorAll("[data-rm]").forEach((b) => (b.onclick = () => {
    state.compare = state.compare.filter((x) => x !== b.dataset.rm); store("compare", state.compare); writeHash(); renderCompareControls(); renderTrend();
  }));
  const avail = state.index.topics.filter((t) => t.slug !== state.slug && !state.compare.includes(t.slug));
  $("#compareAdd").innerHTML = `<option value="">${state.compare.length >= MAX_COMPARE ? "max 4 linee" : "+ aggiungi topic"}</option>` +
    avail.map((t) => `<option value="${esc(t.slug)}">${esc(t.label)}</option>`).join("");
  $("#compareAdd").disabled = state.compare.length >= MAX_COMPARE || !avail.length;
}

function seriesValues(d) {
  const years = Object.keys(d.trend.years);
  if (state.trendMode === "share") return years.map((y) => (d.trend.share_of_control_literature[y] == null ? null : +(d.trend.share_of_control_literature[y] * 100).toFixed(3)));
  if (state.trendMode === "index") { const b = d.trend.years[years[0]] || 1; return years.map((y) => Math.round((d.trend.years[y] / b) * 100)); }
  return years.map((y) => d.trend.years[y]);
}

async function renderTrend() {
  const slugs = [state.slug, ...state.compare];
  const ds = await Promise.all(slugs.map(loadTopic));
  const years = Object.keys(ds[0].trend.years);
  const last = years.length - 1;
  const grid = css("--grid"), text2 = css("--text-2"), surface = css("--surface");
  const unit = { abs: "pubblicazioni", share: "% dei lavori di Control & Systems Eng.", index: `indice (${years[0]} = 100)` }[state.trendMode];
  const datasets = ds.map((d, i) => ({
    label: d.meta.label, data: seriesValues(d),
    borderColor: css(SERIES[i]), backgroundColor: css(SERIES[i]),
    borderWidth: 2, tension: 0.25, pointRadius: 0, pointHoverRadius: 5,
    pointHoverBorderColor: surface, pointHoverBorderWidth: 2,
    segment: { borderDash: (c) => (c.p1DataIndex === last ? [5, 4] : undefined) },
  }));
  if (trendChart) trendChart.destroy();
  trendChart = new Chart($("#trendChart"), {
    type: "line",
    data: { labels: years, datasets },
    options: {
      responsive: true, maintainAspectRatio: false, animation: false,
      interaction: { mode: "index", intersect: false },
      plugins: {
        legend: { display: ds.length > 1, position: "bottom", labels: { color: text2, boxWidth: 10, boxHeight: 10, usePointStyle: true, pointStyle: "circle" } },
        tooltip: { callbacks: {
          title: (it) => it[0].label + (it[0].dataIndex === last ? " (anno in corso, parziale)" : ""),
          label: (it) => ` ${it.dataset.label}: ${it.parsed.y == null ? "–" : it.parsed.y.toLocaleString("it-IT")}${state.trendMode === "share" ? "%" : ""}`,
        } },
      },
      scales: {
        x: { grid: { display: false }, ticks: { color: text2 }, border: { color: grid } },
        y: { beginAtZero: true, grid: { color: grid }, ticks: { color: text2, maxTicksLimit: 6 }, border: { display: false },
             title: { display: true, text: unit, color: text2, font: { size: 11 } } },
      },
    },
  });
  $("#trendNote").textContent = `Tratteggio = ${years[last]} ancora in corso. ` +
    (state.trendMode === "share" ? "La quota normalizza sulla crescita dell'intera letteratura di controllo, come Google Trends." :
     state.trendMode === "index" ? "L'indice permette di confrontare topic di dimensioni molto diverse." :
     ds.length > 1 ? "Topic di dimensioni diverse? Prova \"Indice\" o \"% letteratura controllo\"." : "");
  $("#trendTable").innerHTML = `<table><thead><tr><th>Anno</th>${ds.map((d) => `<th class="num">${esc(d.meta.label)}</th>`).join("")}</tr></thead><tbody>` +
    years.map((y, i) => `<tr><td>${y}</td>${datasets.map((s) => `<td class="num">${s.data[i] == null ? "–" : s.data[i].toLocaleString("it-IT")}</td>`).join("")}</tr>`).join("") +
    "</tbody></table>";
}

// ------------------------------------------------------------------ overview (all topics: volume x growth)
const pointLabels = {
  id: "pointLabels",
  afterDatasetsDraw(chart) {
    const { ctx, chartArea, scales } = chart;
    ctx.save();
    // reference line: growth = 1
    const y1 = scales.y.getPixelForValue(1);
    if (y1 > chartArea.top && y1 < chartArea.bottom) {
      ctx.strokeStyle = css("--muted"); ctx.setLineDash([4, 4]); ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(chartArea.left, y1); ctx.lineTo(chartArea.right, y1); ctx.stroke(); ctx.setLineDash([]);
      ctx.fillStyle = css("--muted"); ctx.font = "11px system-ui"; ctx.textAlign = "left"; ctx.fillText("stabile (×1)", chartArea.left + 4, y1 - 4);
    }
    ctx.font = "12px system-ui";
    // label the selected topic first, then the others by growth; skip labels that would overlap (tooltip has them all)
    const placed = [];
    const pts = chart.getDatasetMeta(0).data.map((pt, i) => ({ pt, p: chart.data.datasets[0].data[i] }))
      .sort((a, b) => (b.p.slug === state.slug) - (a.p.slug === state.slug) || b.p.y - a.p.y);
    pts.forEach(({ pt, p }) => {
      const right = pt.x > chartArea.right - 180;
      const w = ctx.measureText(p.label).width, x0 = right ? pt.x - 12 - w : pt.x + 12, y0 = pt.y - 8;
      const box = [x0 - 2, y0 - 2, x0 + w + 2, y0 + 16];
      if (placed.some((b) => box[0] < b[2] && box[2] > b[0] && box[1] < b[3] && box[3] > b[1])) return;
      placed.push(box);
      ctx.textAlign = right ? "right" : "left";
      ctx.fillStyle = p.slug === state.slug ? css("--text") : css("--text-2");
      ctx.fillText(p.label, pt.x + (right ? -12 : 12), pt.y + 4);
    });
    ctx.restore();
  },
};
function renderOverview() {
  const ts = state.index.topics.filter((t) => t.volume_growth != null);
  const card = $("#overviewChart").closest(".card");
  card.hidden = ts.length < 2;
  if (ts.length < 2) return;
  const pts = ts.map((t) => ({ x: t.total, y: t.volume_growth, label: t.label, slug: t.slug }));
  const sel = (c) => c.raw && c.raw.slug === state.slug;
  if (overviewChart) overviewChart.destroy();
  overviewChart = new Chart($("#overviewChart"), {
    type: "scatter",
    data: { datasets: [{
      data: pts,
      backgroundColor: (c) => (sel(c) ? css("--accent-hot") : css("--series-1")),
      borderColor: css("--surface"), borderWidth: 2,
      pointRadius: (c) => (sel(c) ? 9 : 7), pointHoverRadius: 10,
    }] },
    options: {
      responsive: true, maintainAspectRatio: false, animation: false,
      layout: { padding: { right: 20, top: 10 } },
      onClick: (_, els) => { if (els.length) selectTopic(pts[els[0].index].slug, { resetFilters: true }); },
      onHover: (e, els) => (e.native.target.style.cursor = els.length ? "pointer" : "default"),
      plugins: {
        legend: { display: false },
        tooltip: { callbacks: { label: (c) => ` ${c.raw.label}: ${fmt(c.raw.x)} lavori, crescita ×${c.raw.y.toFixed(2)}` } },
      },
      scales: {
        x: { type: "logarithmic", grid: { color: css("--grid") }, ticks: { color: css("--text-2"), callback: (v) => ([100, 1000, 10000, 100000].includes(v) ? fmt(v) : "") },
             title: { display: true, text: "pubblicazioni totali (scala log)", color: css("--text-2"), font: { size: 11 } } },
        y: { grid: { color: css("--grid") }, ticks: { color: css("--text-2"), callback: (v) => "×" + v },
             title: { display: true, text: "crescita volume: finestra recente ÷ precedente", color: css("--text-2"), font: { size: 11 } } },
      },
    },
    plugins: [pointLabels],
  });
}

// ------------------------------------------------------------------ map
const MIN_GROWTH_N = 3; // below this, a growth factor is noise
function growthColor(g, n) {
  if (n != null && n < MIN_GROWTH_N) return css("--div-mid");
  if (g == null || g >= 2) return css("--div-warm");
  if (g >= 1.25) return css("--div-warm-2");
  if (g > 0.8) return css("--div-mid");
  if (g > 0.5) return css("--div-cool-2");
  return css("--div-cool");
}
function renderMap() {
  const d = state.cache[state.slug];
  if (!map) {
    map = L.map("map", { scrollWheelZoom: false, minZoom: 1, maxZoom: 10, zoomSnap: 0.25,
                         maxBounds: [[-75, -200], [85, 200]], maxBoundsViscosity: 0.8 }).fitBounds(REGIONS.world);
    map.on("click", () => map.scrollWheelZoom.enable());
    map.attributionControl.addAttribution('Confini: <a href="https://www.naturalearthdata.com" target="_blank" rel="noopener">Natural Earth</a>');
  }
  const landStyle = () => ({ color: css("--land-border"), weight: 0.6, fillColor: css("--land"), fillOpacity: 1 });
  if (!landLayer) {
    landLayer = "loading";
    fetch("vendor/countries-110m.json").then((r) => r.json()).then((topo) => {
      landLayer = L.geoJSON(fixAntimeridian(topojson.feature(topo, topo.objects.countries)), { style: landStyle, interactive: false }).addTo(map);
      landLayer.bringToBack();
    }).catch(() => (landLayer = null));
  } else if (landLayer !== "loading") landLayer.setStyle(landStyle());

  if (mapLayer) mapLayer.remove();
  mapLayer = L.layerGroup().addTo(map);
  Object.keys(markers).forEach((k) => delete markers[k]);
  const inst = d.institutions.filter((i) => i.lat != null);
  const max = Math.max(1, ...inst.map((i) => i.count_recent));
  const people = {};
  d.works.forEach((w) => w.authors.forEach((a) => a.inst.forEach((i) => (people[i.id] = people[i.id] || new Map()).set(a.id, a.name))));
  const dim = (i) => state.country && i.country !== state.country;
  // watched institutions are drawn last (on top) with an accent ring
  [...inst].sort((a, b) => (dim(b) - dim(a)) || (!!a.watched - !!b.watched) || b.count_recent - a.count_recent).forEach((i) => {
    const r = 4 + 16 * Math.sqrt(i.count_recent / max);
    const ppl = [...(people[i.id] || new Map()).entries()].slice(0, 8);
    const html = `<div class="popup"><h3>${i.watched ? "★ " : ""}${esc(i.name)}</h3>
      ${i.watched ? `<div class="k">istituzione che segui · #${inst.indexOf(i) + 1} su ${inst.length} per lavori recenti</div>` : ""}
      <div class="k">${flag(i.country)} ${esc(i.city || "")}${i.country_name ? ", " + esc(i.country_name) : ""}</div>
      <div><b>${fmt(i.count_recent)}</b> lavori ${d.meta.windows.recent.join("–")} · ${fmt(i.count_prev)} nel ${d.meta.windows.previous.join("–")}</div>
      <div>Crescita della quota: <b>${growthTxt(i.growth)}</b></div>
      ${ppl.length ? `<div class="k" style="margin-top:6px">Autori nei paper campione:</div><div>${ppl.map(([id, n]) => `<a href="${oa(id)}" target="_blank" rel="noopener">${esc(n)}</a>`).join(", ")}</div>` : ""}
      <div style="margin-top:6px"><a href="${oa(i.id)}" target="_blank" rel="noopener">Apri su OpenAlex ↗</a></div></div>`;
    markers[i.id] = L.circleMarker([i.lat, i.lon], {
      radius: Math.max(r, i.watched ? 7 : 0), color: i.watched ? css("--text") : css("--ring"), weight: i.watched ? 3 : 1.5,
      fillColor: growthColor(i.growth, i.count_recent),
      fillOpacity: dim(i) ? 0.12 : 0.88, opacity: dim(i) ? 0.3 : 1,
    }).bindPopup(html).bindTooltip(`${i.watched ? "★ " : ""}${esc(i.name)} · ${fmt(i.count_recent)}`, { direction: "top" }).addTo(mapLayer);
  });
  const shown = state.country ? inst.filter((i) => i.country === state.country).length : inst.length;
  $("#mapCaption").textContent = `${shown} istituzioni${state.country ? " in " + state.country : ""} · dimensione = lavori ${d.meta.windows.recent.join("–")} · clicca la mappa per abilitare lo zoom con la rotella`;
  $("#mapLegend").innerHTML = "<span>Crescita quota:</span>" + [
    ["--div-cool", "< ×0.5"], ["--div-cool-2", "×0.5–0.8"], ["--div-mid", `stabile o < ${MIN_GROWTH_N} lavori`], ["--div-warm-2", "×1.25–2"], ["--div-warm", "> ×2 / nuovo"],
  ].map(([v, l]) => `<span><i style="background:${css(v)}"></i>${l}</span>`).join("");
  setTimeout(() => { map.invalidateSize(); if (state.country) zoomCountry(state.country); }, 50);
}
// Countries crossing the 180° meridian (Russia, Fiji) and Antarctica produce rings that jump from +180 to -180:
// Leaflet draws them as horizontal stripes across the whole map. Drop Antarctica and "unwrap" the longitudes.
function fixAntimeridian(fc) {
  const unwrap = (ring) => {
    let off = 0;
    return ring.map(([lon, lat], i) => {
      if (i) { const d = lon + off - ring[i - 1][0] - (ring[i - 1].off || 0); if (d > 180) off -= 360; else if (d < -180) off += 360; }
      const p = [lon + off, lat]; ring[i].off = off; return p;
    });
  };
  fc.features = fc.features.filter((f) => f.id !== "010" && f.properties?.name !== "Antarctica");
  fc.features.forEach((f) => {
    const g = f.geometry; if (!g) return;
    if (g.type === "Polygon") g.coordinates = g.coordinates.map(unwrap);
    else if (g.type === "MultiPolygon") g.coordinates = g.coordinates.map((poly) => poly.map(unwrap));
  });
  return fc;
}
function zoomRegion() {
  if (!map) return;
  if (state.region === "home") {
    const home = state.settings.home_country || "IT";
    return HOME_BOUNDS[home] ? map.flyToBounds(HOME_BOUNDS[home], { duration: 0.6 }) : zoomCountry(home);
  }
  map.flyToBounds(REGIONS[state.region] || REGIONS.world, { duration: 0.6 });
}
function zoomCountry(cc) {
  const pts = state.cache[state.slug].institutions.filter((i) => i.country === cc && i.lat != null).map((i) => [i.lat, i.lon]);
  if (pts.length) map.flyToBounds(L.latLngBounds(pts).pad(0.4), { duration: 0.6, maxZoom: 6 });
}

// ------------------------------------------------------------------ filters
function setCountry(cc) {
  state.country = state.country === cc ? "" : cc;
  writeHash(); renderCountries(); renderPeople(); renderMap();
  if (!state.country) { setSeg("#mapZoom", "z", "world"); state.region = "world"; zoomRegion(); }
}
function setKeyword(name, tab) {
  state.kw = state.kw && state.kw.name === name ? null : { name, tab };
  if (state.kw) state.paperTab = "all";
  writeHash(); renderHot(); setSeg("#paperTab", "tab", state.paperTab); renderPapers();
  if (state.kw) $("#papersCard").scrollIntoView({ behavior: "smooth", block: "start" });
}

// ------------------------------------------------------------------ hot topics & countries
function renderHot() {
  const d = state.cache[state.slug];
  const items = d[state.hotTab].filter((x) => x.eligible).slice(0, 15);
  const max = Math.max(...items.map((x) => x.growth ?? 3), 1);
  $("#hotList").innerHTML = items.length ? items.map((x) => {
    const g = x.growth ?? 3;
    const w = Math.max(2, (Math.min(g, max) / max) * 100);
    const tip = `${x.name}: ${x.count_recent} lavori recenti vs ${x.count_prev} precedenti. Clic: mostra i paper`;
    const on = state.kw && state.kw.name === x.name;
    return `<button type="button" class="bar-row ${on ? "active" : ""}" data-kw="${esc(x.name)}" title="${esc(tip)}">
      <span class="name">${esc(x.name)}${x.growth == null ? '<span class="badge">nuovo</span>' : ""}</span>
      <span class="bar-track"><span class="bar-fill ${g >= 1.25 ? "hot" : ""}" style="width:${w}%"></span></span>
      <span class="val"><b>${growthTxt(x.growth)}</b> · ${fmt(x.count_recent)}</span></button>`;
  }).join("") : '<p class="muted">Volume troppo basso per calcolare la crescita.</p>';
  $("#hotList").querySelectorAll("[data-kw]").forEach((b) => (b.onclick = () => setKeyword(b.dataset.kw, state.hotTab)));
}

function renderCountries() {
  const d = state.cache[state.slug];
  const items = d.countries.slice(0, 12);
  const max = Math.max(...items.map((c) => c.count), 1);
  $("#countryCaption").textContent = `lavori con almeno un autore del paese, ${d.meta.windows.recent.join("–")}`;
  $("#countryList").innerHTML = items.map((c) => `<button type="button" class="bar-row ${state.country === c.id ? "active" : ""}" data-cc="${esc(c.id)}" title="${esc(c.name)}: ${c.count}. Clic: filtra">
      <span class="name">${flag(c.id)} ${esc(c.name)}</span>
      <span class="bar-track"><span class="bar-fill" style="width:${(c.count / max) * 100}%"></span></span>
      <span class="val"><b>${fmt(c.count)}</b></span></button>`).join("");
  $("#countryList").querySelectorAll("[data-cc]").forEach((b) => (b.onclick = () => setCountry(b.dataset.cc)));
}

// ------------------------------------------------------------------ people & papers
const star = (kind, id) => `<button type="button" class="star ${state.saved[kind][id] ? "on" : ""}" data-star="${kind}" data-id="${esc(id)}" aria-label="Salva" title="Salva">${state.saved[kind][id] ? "★" : "☆"}</button>`;

function renderPeople() {
  const d = state.cache[state.slug];
  const cs = [...new Set(d.authors.map((a) => a.country).filter(Boolean))].sort();
  $("#countryFilter").innerHTML = `<option value="">Tutti i paesi</option>` + cs.map((c) => `<option value="${c}">${flag(c)} ${c}</option>`).join("");
  $("#countryFilter").value = cs.includes(state.country) ? state.country : "";
  $("#countryChip").innerHTML = state.country ? `<span class="chip">${flag(state.country)} ${esc(state.country)}<button data-clear="country" aria-label="Rimuovi filtro">×</button></span>` : "";
  const pool = d.authors.filter((a) => !state.country || a.country === state.country);
  const rows = [...pool.slice(0, 25), ...pool.slice(25).filter((a) => a.watched)]; // followed people always listed
  $("#people").innerHTML = `<thead><tr><th></th><th>Ricercatore</th><th>Istituzione (ultima nota)</th><th class="num">Lavori ${d.meta.windows.recent.join("–")}</th><th class="num">h-index</th><th class="num">Citazioni tot.</th></tr></thead><tbody>` +
    (rows.length ? rows.map((a) => `<tr data-id="${esc(a.id)}" class="${a.watched ? "watched" : ""}">
      <td>${star("people", a.id)}</td>
      <td><a href="${oa(a.id)}" target="_blank" rel="noopener">${esc(a.name)}</a>${a.watched ? ' <span class="badge">segui</span>' : ""}${a.orcid ? ` <a class="muted small" href="${esc(a.orcid)}" target="_blank" rel="noopener">ORCID</a>` : ""}</td>
      <td>${flag(a.country)} ${esc(a.institution || "–")}</td>
      <td class="num">${fmt(a.count_recent)}</td><td class="num">${fmt(a.h_index)}</td><td class="num">${fmt(a.cites_total)}</td></tr>`).join("")
      : `<tr><td colspan="6" class="muted">Nessuno tra i ${d.authors.length} più attivi per questo paese: prova la mappa o la ricerca.</td></tr>`) + "</tbody>";
  bindStars("#people", (id) => { const a = d.authors.find((x) => x.id === id); return { id, name: a.name, institution: a.institution, country: a.country, topic: d.meta.label }; });
  $$("#countryChip [data-clear]").forEach((b) => (b.onclick = () => setCountry(state.country)));
}

// ------------------------------------------------------------------ watchlist (config/watchlist.json)
function renderWatch() {
  const d = state.cache[state.slug];
  const wi = d.institutions.filter((i) => i.watched), wa = d.authors.filter((a) => a.watched);
  $("#watchCard").hidden = !wi.length && !wa.length;
  if ($("#watchCard").hidden) return;
  const rank = (arr, x) => arr.indexOf(x) + 1;
  const W = d.meta.windows.recent.join("–");
  $("#watchInst").innerHTML = wi.sort((a, b) => b.count_recent - a.count_recent).map((i) => `
    <button type="button" class="watch-row" data-inst="${esc(i.id)}">
      <span>${flag(i.country)} <b>${esc(i.name)}</b></span>
      <span class="muted small">${fmt(i.count_recent)} lavori ${W} · #${rank(d.institutions, i)} · crescita ${growthTxt(i.growth)}</span>
    </button>`).join("") || '<p class="muted small">Nessuna istituzione seguita ha lavori su questo topic.</p>';
  $("#watchPeople").innerHTML = wa.sort((a, b) => b.count_recent - a.count_recent).map((a) => `
    <button type="button" class="watch-row" data-person="${esc(a.id)}">
      <span>${flag(a.country)} <b>${esc(a.name)}</b> <span class="muted small">${esc(a.institution || "")}</span></span>
      <span class="muted small">${fmt(a.count_recent)} lavori ${W} · #${rank(d.authors, a)} tra gli autori${a.aliases && a.aliases.length > 1 ? ` · ${a.aliases.length} profili OpenAlex uniti` : ""}</span>
    </button>`).join("") || '<p class="muted small">Nessuna persona seguita ha lavori su questo topic.</p>';
  $$("#watchInst [data-inst]").forEach((b) => (b.onclick = () => {
    $("#mapCard").scrollIntoView({ behavior: "smooth", block: "center" });
    const m = markers[b.dataset.inst];
    if (m) setTimeout(() => { map.flyTo(m.getLatLng(), 6, { duration: 0.6 }); setTimeout(() => m.openPopup(), 700); }, 300);
  }));
  $$("#watchPeople [data-person]").forEach((b) => (b.onclick = () => {
    const g = typeof GRAPHS !== "undefined" && GRAPHS[0];
    $("#graphPeople").scrollIntoView({ behavior: "smooth", block: "start" });
    if (g && g.focus) setTimeout(() => g.focus(b.dataset.person), 400);
  }));
}

function paperMatches(w, kw) {
  const n = fold(kw.name);
  if (kw.tab === "topics") return w.topics.some((t) => fold(t) === n);
  return w.keywords.some((k) => fold(k) === n) || fold(w.title).includes(n) || fold(w.abstract).includes(n);
}
function renderPapers() {
  const d = state.cache[state.slug];
  let ws = state.paperTab === "all" ? [...d.works] : d.works.filter((w) => w.tags.includes(state.paperTab));
  if (state.kw) ws = ws.filter((w) => paperMatches(w, state.kw));
  ws = state.paperTab === "fresh" ? ws.sort((a, b) => (b.date || "").localeCompare(a.date || "")) : ws.sort((a, b) => b.cites - a.cites);
  $("#kwChip").innerHTML = state.kw ? `<span class="chip">🔎 ${esc(state.kw.name)} · ${ws.length}<button data-clear="kw" aria-label="Rimuovi filtro">×</button></span>` : "";
  $$("#kwChip [data-clear]").forEach((b) => (b.onclick = () => setKeyword(state.kw.name, state.kw.tab)));
  $("#papers").innerHTML = ws.slice(0, 20).map((w) => {
    const au = w.authors.slice(0, 4).map((a) => esc(a.name)).join(", ") + (w.authors.length > 4 ? " et al." : "");
    const href = w.doi || oa(w.id);
    return `<li>${star("papers", w.id)}<div><a class="t" href="${esc(href)}" target="_blank" rel="noopener">${esc(w.title)}</a>
      <div class="m">${au} · ${w.year} · ${esc(w.venue || "")} · <b>${fmt(w.cites)}</b> citazioni · <a href="${oa(w.id)}" target="_blank" rel="noopener">${w.id}</a></div>
      ${w.abstract ? `<details class="abs"><summary>abstract</summary><p>${esc(w.abstract)}</p></details>` : ""}</div></li>`;
  }).join("") || `<li class="muted">Nessun paper ${state.kw ? `con "${esc(state.kw.name)}" ` : ""}nel campione scaricato.</li>`;
  bindStars("#papers", (id) => {
    const w = d.works.find((x) => x.id === id);
    return { id, title: w.title, year: w.year, venue: w.venue, doi: w.doi, authors: w.authors.map((a) => a.name), topic: d.meta.label };
  });
}

// ------------------------------------------------------------------ saved items
function bindStars(root, payload) {
  $(root).querySelectorAll("[data-star]").forEach((b) => (b.onclick = () => {
    const kind = b.dataset.star, id = b.dataset.id;
    if (state.saved[kind][id]) delete state.saved[kind][id]; else state.saved[kind][id] = payload(id);
    store("saved", state.saved); updateSavedCount();
    b.classList.toggle("on", !!state.saved[kind][id]); b.textContent = state.saved[kind][id] ? "★" : "☆";
    if (!$("#savedDrawer").hidden) renderSaved();
  }));
}
function updateSavedCount() { $("#savedCount").textContent = Object.keys(state.saved.papers).length + Object.keys(state.saved.people).length; }
function setupSaved() {
  $("#btnSaved").onclick = () => toggleDrawer("#savedDrawer");
  $("#savedClose").onclick = () => toggleDrawer("#savedDrawer", false);
  $("#clearSaved").onclick = () => { if (confirm("Svuotare la lista dei salvati?")) { state.saved = { papers: {}, people: {} }; store("saved", state.saved); updateSavedCount(); renderSaved(); renderPeople(); renderPapers(); } };
  $("#exportBib").onclick = () => download("research-radar.bib", Object.values(state.saved.papers).map(bibtex).join("\n\n"), "application/x-bibtex");
  $("#exportMd").onclick = () => download("research-radar.md", savedMarkdown(), "text/markdown");
}
function renderSaved() {
  const P = Object.values(state.saved.papers), A = Object.values(state.saved.people);
  $("#savedList").innerHTML =
    `<h3>Paper (${P.length})</h3>` + (P.length ? `<ul class="saved">${P.map((p) => `<li><a href="${esc(p.doi || oa(p.id))}" target="_blank" rel="noopener">${esc(p.title)}</a><div class="muted small">${esc(p.authors.slice(0, 3).join(", "))} · ${p.year} · ${esc(p.topic)}</div><button class="ghost small" data-unsave="papers" data-id="${esc(p.id)}">rimuovi</button></li>`).join("")}</ul>` : `<p class="muted small">Usa ☆ accanto ai paper.</p>`) +
    `<h3>Persone (${A.length})</h3>` + (A.length ? `<ul class="saved">${A.map((a) => `<li><a href="${oa(a.id)}" target="_blank" rel="noopener">${esc(a.name)}</a><div class="muted small">${flag(a.country)} ${esc(a.institution || "")} · ${esc(a.topic)}</div><button class="ghost small" data-unsave="people" data-id="${esc(a.id)}">rimuovi</button></li>`).join("")}</ul>` : `<p class="muted small">Usa ☆ nella tabella persone.</p>`);
  $("#savedList").querySelectorAll("[data-unsave]").forEach((b) => (b.onclick = () => {
    delete state.saved[b.dataset.unsave][b.dataset.id]; store("saved", state.saved); updateSavedCount(); renderSaved(); renderPeople(); renderPapers();
  }));
}
function bibtex(p) {
  const last = fold((p.authors[0] || "anon").split(" ").pop()).replace(/[^a-z]/g, "");
  const word = fold(p.title).replace(/[^a-z0-9 ]/g, "").split(" ").find((w) => w.length > 3) || "paper";
  const doi = (p.doi || "").replace(/^https?:\/\/doi\.org\//, "");
  const f = [`  title = {{${p.title}}}`, `  author = {${p.authors.join(" and ")}}`, `  year = {${p.year}}`];
  if (p.venue) f.push(`  journal = {${p.venue}}`);
  if (doi) f.push(`  doi = {${doi}}`);
  f.push(`  note = {OpenAlex ${p.id}}`);
  return `@article{${last}${p.year}${word},\n${f.join(",\n")}\n}`;
}
function savedMarkdown() {
  const P = Object.values(state.saved.papers), A = Object.values(state.saved.people);
  return `# Revisu – salvati (${new Date().toLocaleDateString("it-IT")})\n\n## Paper\n` +
    P.map((p) => `- **${p.title}** — ${p.authors.slice(0, 3).join(", ")}${p.authors.length > 3 ? " et al." : ""} (${p.year}). ${p.venue || ""} ${p.doi || oa(p.id)}`).join("\n") +
    `\n\n## Persone\n` + A.map((a) => `- **${a.name}** — ${a.institution || ""} (${a.country || ""}) · ${oa(a.id)} · topic: ${a.topic}`).join("\n") + "\n";
}
function download(name, text, type) {
  const a = Object.assign(document.createElement("a"), { href: URL.createObjectURL(new Blob([text], { type })), download: name });
  document.body.append(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

// ------------------------------------------------------------------ global search
let searchIndex = null, searchBuilding = null;
function buildSearchIndex() {
  if (!searchBuilding) searchBuilding = doBuildSearchIndex().finally(() => (searchBuilding = null));
  return searchBuilding;
}
async function doBuildSearchIndex() {
  // Light index: only the small files (authors, institutions) of every topic; paper lists only for topics
  // already opened in this session. Keeps the search fast even with dozens of topics.
  const people = new Map(), insts = new Map(), papers = new Map();
  const all = await Promise.all(state.index.topics.map(async (t) => {
    if (state.cache[t.slug]) return state.cache[t.slug];
    const [authors, institutions] = await Promise.all([getJSON(`${t.slug}/authors.json`).catch(() => []), getJSON(`${t.slug}/institutions.json`).catch(() => [])]);
    return { authors, institutions, works: [] };
  }));
  for (const [ti, t] of state.index.topics.entries()) {
    const d = all[ti];
    d.authors.forEach((a) => {
      const p = people.get(a.id) || { id: a.id, name: a.name, inst: a.institution, country: a.country, topics: [] };
      p.topics.push({ slug: t.slug, label: t.label, n: a.count_recent, top: true }); people.set(a.id, p);
    });
    d.works.forEach((w) => {
      if (!papers.has(w.id)) papers.set(w.id, { id: w.id, title: w.title, year: w.year, href: w.doi || oa(w.id), slug: t.slug, label: t.label });
      w.authors.forEach((a) => {
        const p = people.get(a.id) || { id: a.id, name: a.name, inst: a.inst[0]?.name, country: a.inst[0]?.country, topics: [] };
        if (!p.topics.some((x) => x.slug === t.slug)) p.topics.push({ slug: t.slug, label: t.label, n: null, top: false });
        people.set(a.id, p);
      });
    });
    d.institutions.forEach((i) => {
      const x = insts.get(i.id) || { id: i.id, name: i.name, city: i.city, country: i.country, topics: [] };
      x.topics.push({ slug: t.slug, label: t.label, n: i.count_recent }); insts.set(i.id, x);
    });
  }
  const key = (s) => fold(s);
  searchIndex = {
    people: [...people.values()].map((p) => ({ ...p, k: key(p.name + " " + (p.inst || "")) })),
    insts: [...insts.values()].map((i) => ({ ...i, k: key(i.name + " " + (i.city || "")) })),
    papers: [...papers.values()].map((p) => ({ ...p, k: key(p.title) })),
  };
}
function setupSearch() {
  const inp = $("#search"), box = $("#searchResults");
  let t = null;
  inp.addEventListener("focus", () => { if (!searchIndex && state.index) buildSearchIndex(); });
  inp.addEventListener("input", () => { clearTimeout(t); t = setTimeout(runSearch, 120); });
  inp.addEventListener("keydown", (e) => {
    if (e.key === "Escape") { inp.value = ""; box.hidden = true; inp.blur(); }
    if (e.key === "Enter") { const first = box.querySelector("[data-go]"); if (first) first.click(); }
  });
  document.addEventListener("click", (e) => { if (!e.target.closest(".search")) box.hidden = true; });
}
async function runSearch() {
  const q = fold($("#search").value.trim()), box = $("#searchResults");
  if (q.length < 2) { box.hidden = true; return; }
  if (!searchIndex) { box.innerHTML = '<div class="sr-empty">Indicizzo i topic…</div>'; box.hidden = false; await buildSearchIndex(); }
  const terms = q.split(/\s+/);
  const hit = (x) => terms.every((w) => x.k.includes(w));
  const P = searchIndex.people.filter(hit).sort((a, b) => b.topics.length - a.topics.length).slice(0, 6);
  const I = searchIndex.insts.filter(hit).slice(0, 5);
  const W = searchIndex.papers.filter(hit).slice(0, 5);
  const topicsTxt = (ts) => ts.map((x) => esc(x.label) + (x.n ? ` (${x.n})` : "")).join(", ");
  box.innerHTML = (!P.length && !I.length && !W.length) ? '<div class="sr-empty">Nessun risultato nei topic scaricati.</div>' :
    (P.length ? `<div class="sr-h">Persone</div>` + P.map((p) => `<button class="sr" data-go="person" data-id="${esc(p.id)}"><b>${esc(p.name)}</b> <span class="muted">${flag(p.country)} ${esc(p.inst || "")}</span><div class="small muted">${topicsTxt(p.topics)}</div></button>`).join("") : "") +
    (I.length ? `<div class="sr-h">Istituzioni</div>` + I.map((i) => `<button class="sr" data-go="inst" data-id="${esc(i.id)}"><b>${esc(i.name)}</b> <span class="muted">${flag(i.country)} ${esc(i.city || "")}</span><div class="small muted">${topicsTxt(i.topics)}</div></button>`).join("") : "") +
    (W.length ? `<div class="sr-h">Paper</div>` + W.map((w) => `<button class="sr" data-go="paper" data-id="${esc(w.id)}"><b>${esc(w.title)}</b><div class="small muted">${w.year} · ${esc(w.label)}</div></button>`).join("") : "");
  box.hidden = false;
  box.querySelectorAll("[data-go]").forEach((b) => (b.onclick = () => goSearch(b.dataset.go, b.dataset.id)));
}
async function goSearch(kind, id) {
  $("#searchResults").hidden = true;
  if (kind === "paper") { const w = searchIndex.papers.find((x) => x.id === id); window.open(w.href, "_blank", "noopener"); return; }
  if (kind === "person") {
    const p = searchIndex.people.find((x) => x.id === id);
    const top = p.topics.filter((x) => x.top).sort((a, b) => b.n - a.n)[0];
    if (!top) { window.open(oa(id), "_blank", "noopener"); return; }
    if (top.slug !== state.slug) await selectTopic(top.slug, { resetFilters: true });
    else if (state.country) setCountry(state.country);
    const row = $(`#people tr[data-id="${CSS.escape(id)}"]`);
    if (row) { row.scrollIntoView({ behavior: "smooth", block: "center" }); row.classList.add("flash"); setTimeout(() => row.classList.remove("flash"), 2200); }
    return;
  }
  const i = searchIndex.insts.find((x) => x.id === id);
  const best = [...i.topics].sort((a, b) => b.n - a.n)[0];
  if (best.slug !== state.slug) await selectTopic(best.slug, { resetFilters: true });
  $("#map").scrollIntoView({ behavior: "smooth", block: "center" });
  setTimeout(() => { const m = markers[id]; if (m) { map.flyTo(m.getLatLng(), 6, { duration: 0.6 }); setTimeout(() => m.openPopup(), 700); } }, 300);
}

// ------------------------------------------------------------------ agents (console + jobs)
function toggleDrawer(sel, force) {
  const el = $(sel), open = force ?? el.hidden;
  $$(".drawer").forEach((d) => (d.hidden = true));
  el.hidden = !open;
  if (open && sel === "#savedDrawer") renderSaved();
}
async function api(path, body) {
  const r = await fetch("/api/" + path, body ? { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) } : {});
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(j.error || r.statusText);
  return j;
}
async function setupAgents() {
  $("#btnAgents").onclick = () => toggleDrawer("#drawer");
  $("#drawerClose").onclick = () => toggleDrawer("#drawer", false);
  $("#btnNew").onclick = () => openNewDialog();
  $("#btnRefresh").onclick = () => startJob("fetch", { slug: state.slug });
  $("#btnReport").onclick = () => runAgentOrHint("radar", state.slug);
  $("#jobCancel").onclick = () => state.job && api(`jobs/${state.job.id}/cancel`, {}).catch((e) => toast(e.message));
  $("#askForm").onsubmit = (e) => { e.preventDefault(); const q = $("#askInput").value.trim(); if (q) { runAgentOrHint("ask", q); $("#askInput").value = ""; } };
  $("#newLabel").addEventListener("input", () => {
    const q = $("#newQuery");
    if (!q.dataset.touched) q.value = $("#newLabel").value.trim() ? `"${$("#newLabel").value.trim().replace(/[",]/g, "")}"` : "";
  });
  $("#newQuery").addEventListener("input", (e) => (e.target.dataset.touched = "1"));
  $("#newForm").addEventListener("submit", onNewSubmit);
  renderPipeline(null);
  let st = null;
  try { st = await api("status"); } catch { st = null; }
  state.api = !!st;
  $("#apiWarn").hidden = state.api;
  $("#askForm").querySelector("button").disabled = !state.api;
  if (!st) return;
  // only a failed /api/status means "no server": errors while re-attaching to a running job must not hide the API
  if (!st.claude) consoleLine({ kind: "warn", agent: "server", text: "Claude Code non trovato: puoi scaricare dati, ma non lanciare gli agenti. Esegui il setup." });
  if (st.busy) { try { attachJob(st.busy); } catch (e) { console.error(e); } }
}
function runAgentOrHint(command, args) {
  if (!state.api) {
    const cmd = `/${command} ${args}`;
    navigator.clipboard?.writeText(cmd).catch(() => {});
    toggleDrawer("#drawer", true);
    toast(`Copiato: ${cmd}. Incollalo in Claude Code.`);
    return;
  }
  startJob("agent", { command, args });
}
function openNewDialog() {
  $("#newErr").hidden = true; $("#newLabel").value = ""; $("#newQuery").value = ""; delete $("#newQuery").dataset.touched;
  $("#newData").disabled = !state.api; $("#newAgents").disabled = false;
  $("#newDialog").showModal(); $("#newLabel").focus();
}
async function onNewSubmit(e) {
  const how = e.submitter && e.submitter.value;
  if (how === "cancel") return;
  e.preventDefault();
  const label = $("#newLabel").value.trim(), query = $("#newQuery").value.trim();
  if (!label) return;
  if (how === "data") {
    if (!query || query.includes(",")) { $("#newErr").textContent = "Scrivi una query senza virgole (usa OR / AND)."; $("#newErr").hidden = false; return; }
    $("#newDialog").close(); startJob("fetch", { query, label, save: true });
  } else {
    $("#newDialog").close(); runAgentOrHint("radar", query && query !== `"${label}"` ? `${label} (query suggerita: ${query})` : label);
  }
}
async function startJob(kind, body) {
  if (!state.api) { toast("Avvia Revisu con start.bat / start.sh per usare questa funzione"); return; }
  try {
    const job = await api(kind === "fetch" ? "fetch" : "agent", body);
    $("#console").innerHTML = "";
    attachJob(job);
    toggleDrawer("#drawer", true);
  } catch (e) { toast(e.message); }
}
function attachJob(job) {
  state.job = { ...job, done: false, kind: job.kind, phase: {} };
  state.jobSeen = 0;
  $("#jobTitle").textContent = job.title;
  $("#jobCancel").hidden = false;
  $("#agentDot").hidden = false;
  renderPipeline(state.job);
  if (state.slug && state.cache[state.slug]) renderActionBar();
  listen();
}
function listen() {
  if (state.es) state.es.close();
  const job = state.job;
  const es = state.es = new EventSource(`/api/jobs/${job.id}/events?from=${state.jobSeen}`);
  es.onmessage = (m) => {
    const ev = JSON.parse(m.data);
    state.jobSeen++;
    onEvent(ev);
    if (ev.kind === "end") es.close();
  };
  es.onerror = () => { es.close(); if (!job.done) setTimeout(() => state.job === job && listen(), 1500); };
}
function onEvent(ev) {
  const job = state.job;
  if (ev.kind === "spawn") job.phase[ev.sub] = "run";
  if (ev.kind === "agentdone") job.phase[ev.agent] = "done";
  // subagents may run in the background: the Task result can arrive before their work. Any later activity means
  // the agent is still running; everything is marked done when the job ends.
  if (ev.kind === "tool" || ev.kind === "text") job.phase[ev.agent] = "run";
  if (ev.kind === "end") { job.done = true; job.ok = ev.ok; }
  consoleLine(ev);
  renderPipeline(job);
  if (ev.kind === "end") {
    $("#jobCancel").hidden = true; $("#agentDot").hidden = true;
    $("#jobTitle").textContent = `${ev.ok ? "✓" : "✗"} ${job.title}`;
    toast(ev.ok ? "Job completato" : "Job terminato con errori");
    refreshIndex(false).then(() => { if (ev.slug && ev.slug !== state.slug) selectTopic(ev.slug, { resetFilters: true }); else if (state.slug) renderActionBar(); });
  }
}
function renderPipeline(job) {
  const el = $("#pipeline");
  if (!job) { el.innerHTML = ""; return; }
  const isAsk = job.title.startsWith("/ask");
  const steps = job.kind === "fetch" ? ["radar.py"] : isAsk ? ["orchestratore", ...Object.keys(job.phase).filter((a) => a !== "orchestratore")] : AGENTS;
  el.innerHTML = steps.map((a, i) => {
    const st = job.kind === "fetch" ? (job.done ? (job.ok ? "done" : "fail") : "run") : (job.phase[a] || (a === "orchestratore" && !job.done ? "run" : "idle"));
    const s = job.done && job.kind !== "fetch" && st === "run" ? (job.ok ? "done" : "fail") : st;
    const icon = { idle: "○", run: "◐", done: "✓", fail: "✗" }[s];
    return `${i ? '<span class="arrow">→</span>' : ""}<span class="step ${s}"><i style="background:${css(AGENT_VAR[a])}"></i>${icon} ${esc(a)}</span>`;
  }).join("");
}
function consoleLine(ev) {
  const c = $("#console");
  const atBottom = c.scrollHeight - c.scrollTop - c.clientHeight < 40;
  const who = ev.agent || "";
  const badge = who ? `<span class="who"><i style="background:${css(AGENT_VAR[who] || "--muted")}"></i>${esc(who)}</span>` : "";
  const t = ev.t != null ? `<span class="tm">${ev.t.toFixed(0)}s</span>` : "";
  let body;
  switch (ev.kind) {
    case "text": body = `<div class="msg">${DOMPurify.sanitize(marked.parse(linkIds(ev.text)), { ADD_ATTR: ["target"] })}</div>`; break;
    case "tool": body = `<code class="tool">${esc(ev.tool)}</code> <span class="muted">${esc(ev.text)}</span>`; break;
    case "spawn": body = `avvia <b>${esc(ev.sub)}</b> <span class="muted">${esc(ev.text)}</span>`; break;
    case "agentdone": body = `<span class="muted">${esc(ev.agent)} ha restituito il risultato all'orchestratore</span>`; break;
    case "error": body = `<span class="err">⚠ ${esc(ev.text)}</span>`; break;
    case "warn": body = `<div class="warn">⚠ ${esc(ev.text)}</div>`; break;
    case "end": body = `<b>${ev.ok ? "✓ Completato" : "✗ Terminato"}</b>` +
      (ev.duration ? ` in ${ev.duration}s` : "") + (ev.turns ? ` · ${ev.turns} turni` : "") +
      (ev.cost != null ? ` · ~$${Number(ev.cost).toFixed(2)} equivalente API (con abbonamento: incluso)` : "") +
      (ev.text && !ev.ok ? `<div class="err">${esc(ev.text)}</div>` : (ev.text && state.job?.kind === "fetch" ? ` · ${esc(ev.text)}` : "")); break;
    case "log": body = `<span class="log">${esc(ev.text)}</span>`; break;
    default: body = esc(ev.text);
  }
  const div = document.createElement("div");
  div.className = `line k-${ev.kind}`;
  div.innerHTML = `${t}${badge}<div class="body">${body}</div>`;
  c.append(div);
  if (atBottom) c.scrollTop = c.scrollHeight;
}

// ------------------------------------------------------------------ report
const linkIds = (md) => md.replace(/\[([WAIT]\d{4,12})\](?!\()/g, (_, id) => `<a class="oa" href="${oa(id)}" target="_blank" rel="noopener">${id}</a>`);
function renderReport() {
  const d = state.cache[state.slug];
  if (!d.report) {
    $("#reportMeta").textContent = "";
    $("#btnPrint").hidden = true;
    $("#report").innerHTML = `<div class="placeholder">Nessun report per questo topic.
      <p>Premi <b>✦ Genera report con agenti</b> (in alto) oppure in Claude Code lancia <code>/radar ${esc(state.slug)}</code>.
      Quattro agenti analizzano i dati, scrivono il report e il reviewer controlla ID e numeri. Puoi seguirli nella console.</p></div>`;
    return;
  }
  $("#btnPrint").hidden = false;
  const verdict = d.review && /VERDICT:\s*(PASS|FIX NEEDED)/i.exec(d.review);
  $("#reportMeta").innerHTML = verdict ? (verdict[1].toUpperCase() === "PASS" ? '<span class="ok">✓ verificato dal reviewer</span>' : '<span class="err">⚠ il reviewer ha chiesto correzioni</span>') : "";
  // Agent-written markdown built from untrusted sources: always sanitize.
  $("#report").innerHTML = DOMPurify.sanitize(marked.parse(linkIds(d.report)), { ADD_ATTR: ["target"] });
}

// ------------------------------------------------------------------ keyboard
function setupShortcuts() {
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") { $$(".drawer").forEach((d) => (d.hidden = true)); $("#searchResults").hidden = true; return; }
    if (typing(e) || e.ctrlKey || e.metaKey || e.altKey || document.querySelector("dialog[open]")) return;
    if (e.key === "/") { e.preventDefault(); $("#search").focus(); }
    else if (e.key === "a") toggleDrawer("#drawer");
    else if (e.key === "n") openNewDialog();
    else if (e.key === "?") $("#helpDialog").showModal();
  });
}

boot();
