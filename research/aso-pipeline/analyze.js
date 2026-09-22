// Analysis for the video downloader study: classify apps, score keywords, competitor ranks, listing feature claims → data.json
const fs = require('fs');
const path = require('path');
const raw = require('./raw.json');

const BRAND_DEV = ['google llc', 'meta platforms', 'instagram', 'whatsapp llc', 'facebook', 'tiktok pte', 'bytedance', 'snap inc', 'x corp',
  'pinterest', 'videolan', 'mx media', 'opera', 'ucweb', 'brave software', 'mozilla', 'microsoft corporation', 'samsung electronics',
  'adobe', 'vimeo', 'dailymotion', 'linkedin', 'spotify', 'amazon mobile', 'netflix', 'aloha mobile'];
const appById = Object.fromEntries(raw.apps.map(a => [a.appId, a]));
const isBrand = a => { const d = (a.developer || '').toLowerCase(); return BRAND_DEV.some(b => d.startsWith(b)); };

function category(a) {
  const t = ((a.title || '') + ' ' + (a.summary || '')).toLowerCase();
  const platform = /(instagram|insta\b|reels?\b|tiktok|facebook|\bfb\b|twitter|\bx\b video|pinterest|snapchat|whatsapp)/.test(t);
  if (/(status saver|story saver)/.test(t) && !/video downloader/.test(t)) return 'saver';
  if (/(video|reel|story|clip)s?\b.*\b(download|saver|save)|\bdownload(er)?\b.*\bvideo/.test(t)) return platform && !/\ball\b/.test(t) ? 'platform' : 'downloader';
  if (/(downloader|download manager)/.test(t)) return 'downloader';
  if (/(browser)/.test(t)) return 'browser';
  if (/(video player|media player|\bplayer\b)/.test(t)) return 'player';
  if (/(editor|cutter|trim|video maker|inshot|capcut)/.test(t)) return 'editor';
  if (/(mp3|audio|music|converter)/.test(t)) return 'audio';
  if (/(vault|hide|locker|private)/.test(t)) return 'vault';
  return 'other';
}
const NICHE = { downloader: 1, platform: 0.8, saver: 0.7, browser: 0.55, player: 0.35, editor: 0.3, audio: 0.3, vault: 0.3, other: 0 };
const TIER_W = { A: 1, B: 0.7, C: 0.3, D: 0 };
const TM = /\b(instagram|insta|reels?|facebook|fb|tiktok|twitter|x video|whatsapp|pinterest|vimeo|dailymotion|linkedin|snapchat)\b/;
function tierOf(q) {
  if (/\b(youtube|yt|tube)\b/.test(q)) return 'D';
  if (raw.tiers.CORE.includes(q)) return 'A';
  if (raw.tiers.PLATFORM.includes(q)) return 'B';
  if (raw.tiers.ADJACENT.includes(q)) return 'B';
  if (raw.tiers.PERIPHERAL.includes(q)) return 'C';
  if (/(video|reel|story|status)/.test(q) && /(download|saver|save)/.test(q)) return TM.test(q) ? 'B' : 'A';
  if (/(mp3|cutter|editor|trim|player|vault|convert)/.test(q)) return 'B';
  if (/(download|saver)/.test(q)) return 'B';
  return 'C';
}
const SRC = q => raw.tiers.CORE.includes(q) ? 'core' : raw.tiers.PLATFORM.includes(q) ? 'plat' : raw.tiers.ADJACENT.includes(q) ? 'adj' : raw.tiers.PERIPHERAL.includes(q) ? 'per' : 'ac';

const demandBy = {};
raw.demand.forEach(d => { demandBy[d.gl + '|' + d.q] = d; });
const log = n => Math.log10(Math.max(1, n));

// Autocomplete phrases with YouTube, adult-site or piracy intent, or no readable intent, stay off the board.
const EXCLUDE = new Set(['all video downloader and home', 'download videos from youtu.be free', 'save videos xxvi', 'movie downloader']);
raw.keywords = raw.keywords.filter(k => !EXCLUDE.has(k));
const markets = {};
for (const gl of raw.markets) {
  markets[gl] = raw.serps.filter(s => s.gl === gl && !EXCLUDE.has(s.q) && !/youtu|xxx?\b|xxvi|porn/.test(s.q)).map(s => {
    const ids = s.results;
    const top10 = ids.slice(0, 10).map(id => appById[id]).filter(Boolean);
    const nonBrand = top10.filter(a => !isBrand(a));
    const nicheScore = top10.length ? top10.reduce((x, a) => x + NICHE[category(a)], 0) / top10.length : 0;
    const comps = raw.competitors.map(c => ids.indexOf(c) + 1).map(r => r || null);
    const compIn10 = comps.filter(r => r && r <= 10).length;
    const installs = top10.map(a => a.realInstalls || a.minInstalls || 0).filter(Boolean).sort((a, b) => a - b);
    const median = installs.length ? installs[Math.floor(installs.length / 2)] : 0;
    const smallest = nonBrand.map(a => ({ a, i: a.realInstalls || a.minInstalls || 0 })).filter(x => x.i).sort((x, y) => x.i - y.i)[0];
    const d = demandBy[gl + '|' + s.q] || { score: 0, step: null };
    const tier = tierOf(s.q);
    const R = 0.55 * TIER_W[tier] + 0.35 * nicheScore + 0.10 * Math.min(1, compIn10 / 3);
    const entryEase = smallest ? Math.max(0, 1 - log(smallest.i) / 8) : 0.15;
    const O = 0.35 * (nonBrand.length / 10) + 0.30 * (d.score / 100) + 0.15 * Math.min(1, log(median) / 9) + 0.20 * entryEase;
    return {
      q: s.q, tier, src: SRC(s.q), tm: TM.test(s.q) ? 1 : 0, depth: ids.length, ids,
      nb: nonBrand.length, niche: +nicheScore.toFixed(2), vol: median,
      entry: smallest ? smallest.i : null, entryId: smallest ? smallest.a.appId : null, entryRank: smallest ? ids.indexOf(smallest.a.appId) + 1 : null,
      demand: d.score, demandAt: d.step, comps, c10: compIn10, c30: comps.filter(Boolean).length,
      R: +R.toFixed(3), O: +O.toFixed(3), P: Math.round(100 * R * R * O),
    };
  }).sort((a, b) => b.P - a.P);
}

const used = new Set([raw.mine, ...raw.competitors].filter(id => appById[id]));
Object.values(markets).forEach(rows => rows.forEach(r => r.ids.slice(0, 10).forEach(id => used.add(id))));
const appList = [...used].filter(id => appById[id]);
const idx = Object.fromEntries(appList.map((id, i) => [id, i]));
const apps = appList.map(id => { const a = appById[id]; return [id, a.title, a.developer, a.realInstalls || a.minInstalls || null, a.score || null, a.ratings || null, a.released || null, a.updated || null, isBrand(a) ? 1 : 0, category(a), a.containsAds ? 1 : 0, a.iap || null]; });
Object.values(markets).forEach(rows => rows.forEach(r => { r.ids = r.ids.map(id => (id in idx ? idx[id] : -1)); r.entryIdx = r.entryId ? idx[r.entryId] : null; delete r.entryId; }));

// Feature claims each listing makes (title + short + full description), for the Features tab.
const CLAIMS = [
  ['paste', 'Paste link to download', /(paste|copy)[^.]{0,40}(link|url)|(link|url)[^.]{0,20}paste/],
  ['browser', 'Built-in browser with auto-detect', /(built[- ]in browser|in-app browser|browser[^.]{0,40}(detect|download))|auto[- ]?detect/],
  ['quality', 'Choose video quality / HD', /(\bhd\b|1080p|720p|4k|resolution|quality)/],
  ['background', 'Background downloads · pause & resume', /(background|pause|resume)/],
  ['multi', 'Multiple / batch downloads', /(multiple (videos|downloads|files)|batch|parallel|simultaneous|at the same time|at once)/],
  ['story', 'Story & reels saver', /(story|stories|reels?)\b/],
  ['status', 'WhatsApp status saver', /status saver|save status|whatsapp status|statuses/],
  ['mp3', 'MP3 / audio extraction', /(mp3|extract audio|audio extract|video to audio|music)/],
  ['private', 'Private folder / vault / lock', /(private (folder|vault|album|space|video)|vault|password|pin\b|lock|hide (videos|files))/],
  ['editor', 'Built-in video editor (cut, crop, merge)', /(video (editor|cutter|trimmer|merger)|trim|crop|merge videos|cut videos|edit videos)/],
  ['player', 'Video player', /(video player|hd player|4k player|media player|play videos)/],
  ['languages', 'Multi-language interface', /(languages|multilingual|multi-language)/],
];
function claimsOf(a) {
  const t = [a.title, a.summary, a.description].join('\n').toLowerCase();
  return Object.fromEntries(CLAIMS.map(([k, , re]) => [k, re.test(t) ? 1 : 0]));
}

const board = markets.US;
const profiles = raw.competitors.concat([raw.mine]).filter(id => appById[id]).map(id => {
  const a = appById[id];
  const titleKw = board.filter(r => r.tier !== 'D' && (' ' + a.title.toLowerCase().replace(/[^a-z0-9]+/g, ' ') + ' ').includes(' ' + r.q + ' ')).map(r => r.q);
  const descWords = (a.description || '').toLowerCase().split(/[^a-z0-9]+/).filter(Boolean).length;
  const kwDens = board.slice(0, 14).map(r => {
    const n = ((a.description || '').toLowerCase().match(new RegExp('\\b' + r.q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b', 'g')) || []).length;
    return { q: r.q, n, d: +(100 * n * r.q.split(' ').length / Math.max(1, descWords)).toFixed(1) };
  }).filter(x => x.n);
  const ci = raw.competitors.indexOf(id);
  const perMarket = {};
  raw.markets.forEach(gl => {
    const hits = ci < 0 ? [] : markets[gl].map(r => ({ q: r.q, rank: r.comps[ci] })).filter(x => x.rank);
    perMarket[gl] = { top3: hits.filter(h => h.rank <= 3).length, top10: hits.filter(h => h.rank <= 10).length, any: hits.length, best: hits.length ? Math.min(...hits.map(h => h.rank)) : null };
  });
  return {
    id, idx: idx[id], title: a.title, titleLen: a.title.length, summary: a.summary || '', summaryLen: (a.summary || '').length,
    description: a.description || '', descLen: (a.description || '').length, descWords,
    developer: a.developer, installs: a.realInstalls || a.minInstalls, installsLabel: a.installsLabel, score: a.score, ratings: a.ratings,
    released: a.released, updated: a.updated, genre: a.genre, ads: a.containsAds ? 1 : 0, iap: a.iap, video: a.video ? 1 : 0, shots: (a.screenshots || []).length,
    titleKw, kwDens, perMarket, claims: claimsOf(a), mine: id === raw.mine,
  };
});

const marketSummary = raw.markets.map(gl => {
  const rows = markets[gl].filter(r => raw.secondary.includes(r.q));
  const entries = rows.map(r => r.entry).filter(Boolean).sort((a, b) => a - b);
  return {
    gl, keywords: rows.length, avgNonBrand: +(rows.reduce((s, r) => s + r.nb, 0) / Math.max(1, rows.length)).toFixed(1),
    medianEntry: entries.length ? entries[Math.floor(entries.length / 2)] : null, compTop10: rows.reduce((s, r) => s + r.c10, 0),
    avgDepth: +(rows.reduce((s, r) => s + r.depth, 0) / Math.max(1, rows.length)).toFixed(1),
    best: rows.slice(0, 6).map(r => ({ q: r.q, P: r.P, nb: r.nb, entry: r.entry, c10: r.c10, tm: r.tm })),
  };
});

fs.writeFileSync(path.join(__dirname, 'data.json'), JSON.stringify({
  collectedAt: raw.collectedAt, markets: raw.markets, mineIdx: idx[raw.mine], compIdx: raw.competitors.map(c => (c in idx ? idx[c] : -1)),
  competitors: raw.competitors, apps, board: markets, profiles, marketSummary, secondary: raw.secondary, claims: CLAIMS.map(([k, l]) => [k, l]), missing: raw.missing || [],
}));
console.log('apps', apps.length, '| US keywords', markets.US.length, '| profiles', profiles.length, '| missing competitors', (raw.missing || []).join(', ') || 'none');
console.log('\nTop 25 US keywords:');
markets.US.slice(0, 25).forEach((r, i) => console.log(`${String(i + 1).padStart(2)}. P${String(r.P).padStart(3)} ${r.tier}${r.tm ? '™' : ' '} R${Math.round(r.R * 100)} nb${r.nb} d${r.demand} c10:${r.c10} entry:${r.entry == null ? '—' : r.entry < 1000 ? '<1K' : Math.round(r.entry / 1000) + 'K'} ${r.q}`));
console.log('\nCompetitors (US):');
profiles.forEach(p => console.log(`  ${p.mine ? '★' : ' '} ${p.title} — ${p.developer} ${p.installsLabel} · top10 ${p.perMarket.US.top10} · any ${p.perMarket.US.any} · best #${p.perMarket.US.best || '—'} · claims ${Object.entries(p.claims).filter(([, v]) => v).map(([k]) => k).join(',')}`));
console.log('\nMarkets:');
marketSummary.forEach(m => console.log(`  ${m.gl}: nb ${m.avgNonBrand} · entry ${m.medianEntry ? Math.round(m.medianEntry / 1000) + 'K' : '—'} · comp top10 ${m.compTop10} · depth ${m.avgDepth} · ${m.best.slice(0, 3).map(b => b.q + ' P' + b.P).join(', ')}`));
