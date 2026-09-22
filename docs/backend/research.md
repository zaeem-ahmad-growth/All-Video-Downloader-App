# Research: scripts and data in full

> **Generated file: do not edit by hand.** Produced by `node tools/export-docs.js` (GitHub runs it after every push).
> The full source of every script in [research/](../../research/), then every small data file (up to 60 KB) in full. Large data files are listed with their structure in the [research index](../research-index.md) and are best searched in place. The overview of the studies is [research/README.md](../../research/README.md). **Load this file when a question or change concerns how the data was collected or scored.**

## Contents

- [research/aso-pipeline/analyze.js](#researchaso-pipelineanalyzejs)
- [research/aso-pipeline/assets.js](#researchaso-pipelineassetsjs)
- [research/aso-pipeline/build.js](#researchaso-pipelinebuildjs)
- [research/aso-pipeline/collect.js](#researchaso-pipelinecollectjs)
- [research/aso-pipeline/convert.ps1](#researchaso-pipelineconvertps1)
- [research/aso-pipeline/discover.js](#researchaso-pipelinediscoverjs)
- [research/aso-pipeline/graphics.js](#researchaso-pipelinegraphicsjs)
- [research/aso-pipeline/inspect.js](#researchaso-pipelineinspectjs)
- [research/aso-pipeline/lib.js](#researchaso-pipelinelibjs)
- [research/aso-pipeline/scope.js](#researchaso-pipelinescopejs)
- [research/aso-pipeline/sep-16-build/build.js](#researchaso-pipelinesep-16-buildbuildjs)
- [research/tiksta-title-check/playcheck.ps1](#researchtiksta-title-checkplaycheckps1)
- [research/tiksta-title-check/score.ps1](#researchtiksta-title-checkscoreps1)
- [research/aso-pipeline/batch1.txt](#researchaso-pipelinebatch1txt)
- [research/aso-pipeline/batch2.txt](#researchaso-pipelinebatch2txt)
- [research/aso-pipeline/features.json](#researchaso-pipelinefeaturesjson)
- [research/aso-pipeline/graphics-notes.json](#researchaso-pipelinegraphics-notesjson)
- [research/aso-pipeline/myassets.json](#researchaso-pipelinemyassetsjson)
- [research/aso-pipeline/offers.json](#researchaso-pipelineoffersjson)
- [research/competitor-visual-memory/assets.json](#researchcompetitor-visual-memoryassetsjson)
- [research/tiksta-title-check/pc.json](#researchtiksta-title-checkpcjson)
- [research/tiksta-title-check/tiksta-long.txt](#researchtiksta-title-checktiksta-longtxt)

## Scripts

### research/aso-pipeline/analyze.js

```js
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
```

### research/aso-pipeline/assets.js

```js
// Real events/offers check on raw listing HTML (US + 3 markets) and download of our listing assets.
const fs = require('fs');
const path = require('path');
const raw = require('./raw.json');
const UA = 'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Mobile Safari/537.36';
const OUT = path.join(__dirname, '..', 'avd-listing');
fs.mkdirSync(OUT, { recursive: true });

async function page(id, gl) {
  const r = await fetch(`https://play.google.com/store/apps/details?id=${id}&hl=en&gl=${gl}`, { headers: { 'User-Agent': UA, 'Accept-Language': 'en-US,en;q=0.9' } });
  return r.text();
}
const text = h => h.replace(/<script[\s\S]*?<\/script>/g, ' ').replace(/<style[\s\S]*?<\/style>/g, ' ').replace(/<[^>]+>/g, '\n').replace(/&amp;/g, '&').replace(/&#39;/g, "'").replace(/\n\s*\n+/g, '\n');

(async () => {
  const out = {};
  for (const id of raw.competitors.concat([raw.mine])) {
    out[id] = {};
    for (const gl of ['US', 'BR', 'DE', 'IN']) {
      const t = text(await page(id, gl));
      const i = t.search(/Events? & offers/i);
      let block = null;
      if (i >= 0) block = t.slice(i, i + 600).split('\n').map(s => s.trim()).filter(Boolean).slice(0, 8).join(' Â· ');
      const flags = ['Ends in', 'Event ends', 'Offer ends', 'Happening now', 'Starts ', 'Limited-time'].filter(f => t.includes(f));
      out[id][gl] = { section: i >= 0, block, flags };
    }
    console.log(id, JSON.stringify(out[id]));
  }
  fs.writeFileSync(path.join(__dirname, 'offers.json'), JSON.stringify(out, null, 1));

  const me = raw.apps.find(a => a.appId === raw.mine);
  const grab = async (url, name, size) => {
    const r = await fetch(url + size, { headers: { 'User-Agent': UA } });
    const type = r.headers.get('content-type') || '';
    const ext = type.includes('png') ? 'png' : type.includes('webp') ? 'webp' : 'jpg';
    const buf = Buffer.from(await r.arrayBuffer());
    fs.writeFileSync(path.join(OUT, `${name}.${ext}`), buf);
    return { file: `listing/${name}.${ext}`, src: url, bytes: buf.length };
  };
  const assets = { icon: await grab(me.icon, 'icon', '=s512'), feature: me.featureGraphic ? await grab(me.featureGraphic, 'feature-graphic', '=w1024') : null, screenshots: [] };
  for (let i = 0; i < me.screenshots.length; i++) assets.screenshots.push(await grab(me.screenshots[i], `screenshot-${String(i + 1).padStart(2, '0')}`, '=h1400'));
  fs.writeFileSync(path.join(__dirname, 'myassets.json'), JSON.stringify(assets, null, 1));
  console.log('assets', JSON.stringify({ icon: assets.icon.bytes, feature: assets.feature && assets.feature.bytes, shots: assets.screenshots.map(s => s.bytes) }));
})();
```

### research/aso-pipeline/build.js

```js
// Build the All Video Downloader page: Cloud Storage design system + this study's tabs + the scoped Product Dossier.
const fs = require('fs');
const path = require('path');
const data = require('./data.json');
const raw = require('./raw.json');
const offersRaw = require('./offers.json');
const assets = require('./myassets.json');
const features = require('./features.json');
const dossier = require('./dossier-parts.json');

const norm = s => s.toLowerCase().replace(/&/g, ' and ').match(/[a-z0-9]+/g) || [];
const US = data.board.US;
const takenNorm = new Set(raw.apps.filter(a => a.appId !== raw.mine).map(a => norm(a.title || '').join(' ')));
const scoreText = t => {
  const w = new Set(norm(t)), phrase = ' ' + norm(t).join(' ') + ' ';
  let s = 0; const hits = [], exact = [];
  for (const r of US) { if (r.tier === 'D') continue; const qw = norm(r.q); if (qw.every(x => w.has(x))) { const ex = phrase.includes(' ' + qw.join(' ') + ' '); s += r.P * (ex ? 1.5 : 1); hits.push(r.q); if (ex) exact.push(r.q); } }
  return { score: Math.round(s), hits, exact };
};
const CURRENT = raw.apps.find(a => a.appId === raw.mine);

// Titles: no platform names, no "free", no claims the app can't back (it contains ads).
const CANDS = [CURRENT.title, 'HD Video Downloader & Saver', 'All Video Downloader: HD Saver', 'Video Downloader: HD & Private', 'Video Downloader & Saver: HD',
  'HD Video Downloader & Cutter', 'All Video Downloader & Cutter', 'Fast Video Downloader & Saver', 'Private Video Downloader & Saver', 'Video Downloader & Cutter',
  'Video Saver: HD Downloader', 'All Video Downloader & Vault', 'HD Video Downloader: Save Link', 'Video Downloader: Save & Cut', 'Private Video Downloader: HD'];
const titles = [...new Set(CANDS)].map(t => ({ t, len: t.length, taken: takenNorm.has(norm(t).join(' ')), current: t === CURRENT.title, ...scoreText(t) }))
  .filter(c => c.len <= 30).sort((a, b) => b.score - a.score);
console.log('titles:'); titles.forEach(c => console.log(`  ${String(c.score).padStart(4)} ${c.len}c ${c.taken ? 'TAKEN ' : ''}${c.current ? 'CURRENT ' : ''}${c.t} (${c.hits.length}; exact ${c.exact.join(', ')})`));
const rec = titles.filter(c => !c.taken && !c.current).slice(0, 3);

const SHORTS = [
  'Save videos from any link in HD, then cut, merge and lock them in a private vault.',
  'HD video downloader with a video cutter, MP3 extractor and PIN-locked video vault',
  'Fast video saver: download HD videos, cut clips, extract MP3 and hide videos',
  'Download videos from links in HD. Video cutter, MP3 extractor and private vault.',
];
const shorts = SHORTS.map(s => ({ s, len: s.length, ...scoreText(rec[0].t + ' ' + s) })).filter(s => s.len <= 80).sort((a, b) => b.score - a.score);
console.log('shorts:'); shorts.forEach(s => console.log(`  ${s.score} ${s.len}c ${s.s}`));

const LONG = `{name} saves videos from a link in the quality you choose, with a built-in video cutter and a private vault. Copy a video link, paste it into the app and download video straight to your phone — then trim it, extract the audio or lock it away behind a PIN.

## Download videos from a link
• Paste a link or share it straight into the app to download video in one step
• Choose the quality before you save, from HD down to smaller files
• Download several videos at once with pause, resume and retry
• Downloads keep running in the background, even for large files
• Works with links from Facebook, Instagram, TikTok, X, LinkedIn, Dailymotion and Vimeo

## HD video saver and player
• All video downloader and player in one app
• Watch saved videos offline with the built-in video player
• Rename, share, delete or favourite any download
• Status saver for statuses you are allowed to keep

## Video cutter and editor · 9 tools
• Trim, split, crop and merge videos
• Change the aspect ratio with a colour or blur background
• Add music to a video, or extract audio and save it as MP3
• Filters and effects, plus an image or text watermark

## Private video downloader with a vault
• Hide videos, pictures and audio in a PIN-locked vault
• Unlock with your fingerprint, and reset your PIN with a security question
• Keep private downloads out of your gallery

## Made for everyone
• 9 languages: English, Urdu, Arabic, Hindi, Turkish, German, French, Portuguese and Chinese
• Right-to-left layouts for Urdu and Arabic
• A clean app built for fast, simple saving

## How to download a video
Copy the link of a video you have permission to save.
Open {name} and paste the link, or share the link into the app.
Pick the quality and tap Download.
Open the saved video to watch, cut or move it to the vault.

## Questions people ask
Where are my downloads saved? In the app, sorted into a folder for each platform. Move any video to the vault in one tap.
Will a large download stop if I leave the app? No. Downloads keep running in the background and resume after a network drop.
What does Premium change? Premium removes ads. Downloads work the same way with or without it.

## Important
Download only videos you own, videos in the public domain, or videos the owner lets you save. Please respect copyright.
{name} is an independent app and is not affiliated with, endorsed by or sponsored by any of the platforms named above.`;
const longPlain = LONG.replace(/\{name\}/g, rec[0].t).replace(/^## /gm, '').replace(/^• /gm, '');
const lw = norm(longPlain).length;
console.log('long chars', longPlain.length, 'words', lw);
['video downloader', 'video saver', 'hd video downloader', 'download video', 'private video downloader'].forEach(p => { const n = (' ' + norm(longPlain).join(' ') + ' ').split(' ' + p + ' ').length - 1; console.log(`  ${p}: ${n} (${(100 * n * p.split(' ').length / lw).toFixed(1)}%)`); });

// IAP ranges → numbers
const parseIap = s => { const m = (s || '').match(/\$([\d.]+)\s*-\s*\$([\d.]+)/) || (s || '').match(/\$([\d.]+)/); return m ? { min: +m[1], max: +(m[2] || m[1]) } : null; };
data.profiles.forEach(p => { p.iapRange = parseIap(p.iap); });

const offersChecked = Object.fromEntries(Object.entries(offersRaw).map(([id, byGl]) => [id, Object.values(byGl).some(o => o.section)]));

// Competitor graphics: measured manifest (install order) + written design reads.
const gManifest = require('./graphics-manifest.json');
const gNotes = require('./graphics-notes.json');
const SHORTS_BY_ID = { 'video.downloader.videodownloader': 'InShot', 'com.gamma.videodownloader': 'Gamma Play', 'videoplayer.videodownloader.downloader': 'QR Code Scanner', 'instagram.video.downloader.story.saver.ig': 'Story Saver', 'instagram.video.downloader.story.saver.ig.insaver': 'InSaver', 'hub.browser.video.downloader.saver': 'Hub (DOSA)', 'videodownloader.instagram.videosaver': 'Fast Saver', 'com.videodownload.browser.videodownloader': 'AppTool', 'downloader.video.download.free': 'Saver & Player Studio', 'instasaver.videodownloader.photodownloader.repost': 'DevBay', 'com.allvideodownloader.hdvideodownloader.savevideos': 'Sky Vision', 'allinone.videodownloader.savevideos': 'Attractive Apps', 'com.videosaver.savevideos.story.saverapp': 'Markhoor', 'com.videodownloder.alldownloadvideos': 'Mobile Notepad', 'com.hdvideodownloader.downloaderapp': 'Vidow', 'free.video.downloader.freevideodownloader2021.video.saver.videosaverlite': 'Vidpal' };
const gApps = gManifest.map(m => { const n = gNotes.apps[String(m.num)]; if (!n) throw new Error('no notes for app ' + m.num); return { num: m.num, id: m.id, slug: m.slug, name: n.name, short: SHORTS_BY_ID[m.id] || m.developer, title: m.title, developer: m.developer, installsLabel: m.installsLabel, installs: m.installs, score: m.score, ratings: m.ratings, updated: m.updated, url: m.url, notes: n.notes, tags: n.tags, assets: m.assets }; });
const graphics = { captured: gNotes.captured, overview: gNotes.overview, captureNote: gNotes.captureNote, patterns: gNotes.patterns, guidance: gNotes.guidance, requirements: gNotes.requirements, scope: gNotes.scope, sources: gNotes.sources, apps: gApps };
console.log('graphics:', gApps.length, 'apps ·', gApps.reduce((s, a) => s + a.assets.length, 0), 'assets');

const payload = JSON.stringify({ data, assets, features, offersChecked, graphics, listing: {
  current: { title: CURRENT.title, summary: CURRENT.summary, description: CURRENT.description, iap: CURRENT.iap, ads: CURRENT.containsAds, privacy: CURRENT.privacyPolicy, site: CURRENT.developerSite, developer: CURRENT.developer, installs: CURRENT.installsLabel, url: `https://play.google.com/store/apps/details?id=${raw.mine}&hl=en&gl=US`, id: raw.mine, genre: CURRENT.genre, privacyStatus: 200 },
  titles, rec, shorts, long: LONG,
}, dossierSections: dossier.sections }).replace(/</g, '\\u003c');

const css = fs.readFileSync(path.join(__dirname, '..', 'aso', 'page.html'), 'utf8').match(/<style>([\s\S]*?)<\/style>/)[1];
const tpl = fs.readFileSync(path.join(__dirname, 'template.html'), 'utf8');
const html = tpl.replace('/*__CSS__*/', () => css).replace('/*__DOSSIER_CSS__*/', () => dossier.css).replace('<!--__DOSSIER__-->', () => dossier.body)
  .replace('__DOSSIER_FONTS__', () => dossier.fonts).replace('/*__PAYLOAD__*/null', () => payload);
const out = path.join(__dirname, '..', 'all-video-downloader.html');
fs.writeFileSync(out, html);
console.log('wrote', out, fs.statSync(out).size, 'bytes');
```

### research/aso-pipeline/collect.js

```js
// Collection for the video downloader study: keyword board (US deep + 7 markets), metadata, autocomplete demand.
const fs = require('fs');
const path = require('path');
const { search, details, suggest, pool } = require('./lib');

const MINE = 'com.video.downloader.instagram.videosaver';
const MARKETS = ['US', 'BR', 'DE', 'ES', 'IT', 'AU', 'AE', 'IN'];

const COMPETITORS = [
  'video.downloader.videodownloader',                         // InShot · Video Downloader · 100M+
  'com.gamma.videodownloader',                                // Gamma Play · Video Downloader - without ads
  'videoplayer.videodownloader.downloader',                   // QR Code Scanner · All Video Downloader & Player · 100M+
  'instagram.video.downloader.story.saver.ig',                // Video downloader - Story Saver · 50M+
  'instagram.video.downloader.story.saver.ig.insaver',        // InSaver: All Video Downloader · 10M+
  'hub.browser.video.downloader.saver',                       // Hub Video Downloader · DOSA Apps · 10M+
  'videodownloader.instagram.videosaver',                     // Video Downloader & Story Saver · 10M+
  'com.videodownload.browser.videodownloader',                // All Video Downloader & Player · AppTool · 10M+
  'downloader.video.download.free',                           // Video Downloader & Video Saver · 50M+
  'instasaver.videodownloader.photodownloader.repost',        // All Video Downloader & Browser · DevBay · 50M+
  'com.allvideodownloader.hdvideodownloader.savevideos',      // Sky Vision · audit App 1
  'allinone.videodownloader.savevideos',                      // Attractive Apps Valley · audit App 2
  'com.videosaver.savevideos.story.saverapp',                 // Markhoor Studio · audit App 3
  'com.videodownloder.alldownloadvideos',                     // Mobile Notepad Apps · audit App 4
  'com.hdvideodownloader.downloaderapp',                      // Vidow · VIDOXE · audit App 5
  'free.video.downloader.freevideodownloader2021.video.saver.videosaverlite', // Vidpal · audit App 6
];

const CORE = ['video downloader', 'all video downloader', 'video saver', 'download video', 'hd video downloader', 'video downloader app',
  'video downloader and saver', 'all video downloader and saver', 'fast video downloader', 'social video downloader', 'video downloader browser',
  'save video', 'downloader', 'video downloader and player', 'video downloader free', 'video saver downloader', 'private video downloader',
  'free video downloader', '4k video downloader', 'video download app', 'online video downloader', 'video downloader for android',
  'download videos', 'video downloader without ads'];
const PLATFORM = ['instagram video downloader', 'video downloader for instagram', 'reels downloader', 'story saver', 'status saver',
  'facebook video downloader', 'tiktok video downloader', 'twitter video downloader', 'insta downloader', 'reel saver',
  'fb video downloader app', 'story saver for instagram', 'status saver for whatsapp', 'whatsapp status saver', 'tiktok downloader no watermark',
  'x video downloader', 'pinterest video downloader', 'reels download app', 'vimeo video downloader', 'dailymotion video downloader',
  'linkedin video downloader', 'instagram reels downloader'];
const ADJACENT = ['video to mp3', 'mp3 converter', 'video cutter', 'video editor', 'video trimmer', 'video merger', 'private video vault',
  'hide videos', 'video locker', 'audio extractor', 'download manager', 'video player', 'offline video player', '4k video player',
  'video downloader with editor', 'extract audio from video', 'video compressor', 'watermark video', 'crop video', 'add music to video',
  'video crop and trim', 'hd video player'];
const PERIPHERAL = ['file manager', 'music downloader', 'photo downloader', 'image downloader', 'screen recorder', 'gallery vault',
  'browser', 'movie downloader'];

const ladder = kw => { const w = kw.split(' '); const s = []; for (let i = 0; i < w.length; i++) { const lead = i ? w.slice(0, i).join(' ') + ' ' : ''; if (!i) { s.push(w[0].slice(0, 3)); if (w[0].length > 3) s.push(w[0]); } else { s.push(lead + w[i][0]); if (w[i].length > 1) s.push(lead + w[i].slice(0, Math.ceil(w[i].length / 2))); if (w[i].length > 2) s.push(lead + w[i]); } } return [...new Set(s)]; };

(async () => {
  const t0 = Date.now();
  const seeds = ['video downl', 'all video', 'video sav', 'download vid', 'save vid', 'reels dow', 'story sav', 'status sav', 'video cut', 'video to m'];
  const harvest = await pool(seeds, 4, async s => ({ s, list: await suggest(s, 'US') }));
  const suggested = [...new Set(harvest.flatMap(h => h.list || []))]
    .filter(x => /video|download|saver|reel|story|status|mp3|cutter|editor/i.test(x) && !/youtube|\byt\b|tube/i.test(x) && x.split(' ').length <= 5 && !/20\d\d/.test(x));
  console.log('autocomplete gave', suggested.length, 'phrases');

  const KW = [...new Set([...CORE, ...PLATFORM, ...ADJACENT, ...PERIPHERAL, ...suggested])].slice(0, 104);
  const SECONDARY = KW.slice(0, 40);
  console.log('keywords:', KW.length, '| secondary:', SECONDARY.length);

  const jobs = [];
  KW.forEach(q => jobs.push({ q, gl: 'US' }));
  MARKETS.filter(m => m !== 'US').forEach(gl => SECONDARY.forEach(q => jobs.push({ q, gl })));
  console.log('searches to run:', jobs.length);
  const serps = await pool(jobs, 6, async j => {
    const r = await search(j.q, 30, j.gl);
    return { q: j.q, gl: j.gl, featured: r.featured || null, results: r.results.map(x => x.appId), titles: r.results.map(x => x.title || null) };
  });
  const bad = serps.filter(s => s.error);
  console.log('serps done', serps.length - bad.length, 'failed', bad.length, bad.slice(0, 5).map(b => b.item && b.item.q + '/' + b.item.gl).join(', '));

  const ids = new Set([MINE, ...COMPETITORS]);
  serps.forEach(s => { if (!s.error) s.results.slice(0, 10).forEach(id => ids.add(id)); });
  const apps = await pool([...ids], 6, async id => details(id, 'US'));
  const failed = apps.filter(a => a.error);
  console.log('details done', apps.length - failed.length, 'failed', failed.length, failed.slice(0, 3).map(f => f.item + ':' + f.error).join(' | '));

  const demandJobs = KW.map(q => ({ q, gl: 'US' }));
  MARKETS.filter(m => m !== 'US').forEach(gl => KW.slice(0, 12).forEach(q => demandJobs.push({ q, gl })));
  const demand = await pool(demandJobs, 6, async j => {
    const steps = ladder(j.q);
    for (let i = 0; i < steps.length; i++) {
      const list = await suggest(steps[i], j.gl);
      const pos = list.indexOf(j.q);
      if (pos >= 0) return { q: j.q, gl: j.gl, step: steps[i], pos, score: Math.round(100 * ((steps.length - Math.min(i, steps.length - 1)) / steps.length) * (1 - 0.06 * pos)) };
    }
    return { q: j.q, gl: j.gl, step: null, pos: -1, score: 0 };
  });
  console.log('demand measured:', demand.length, 'errors', demand.filter(d => d && d.error).length);

  fs.writeFileSync(path.join(__dirname, 'raw.json'), JSON.stringify({
    collectedAt: new Date().toISOString(), markets: MARKETS, mine: MINE, competitors: COMPETITORS,
    keywords: KW, secondary: SECONDARY, tiers: { CORE, PLATFORM, ADJACENT, PERIPHERAL },
    serps: serps.filter(s => !s.error), apps: apps.filter(a => !a.error && !a.missing), missing: apps.filter(a => a && a.missing).map(a => a.appId),
    demand: demand.filter(d => d && !d.error),
  }));
  console.log('wrote raw.json in', Math.round((Date.now() - t0) / 1000), 's');
})();
```

### research/aso-pipeline/convert.ps1

```powershell
Add-Type -AssemblyName System.Drawing
$root = Split-Path $PSScriptRoot -Parent
$srcRoot = Join-Path $root 'avd-graphics-src'
$dst = Join-Path $root 'avd-graphics'
$sheets = Join-Path $root 'avd-contact'
New-Item -ItemType Directory -Force $dst, $sheets | Out-Null
$jpeg = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }

function Save-Jpeg($img, $outPath, $maxLong, $quality) {
    $scale = [Math]::Min(1.0, $maxLong / [Math]::Max($img.Width, $img.Height))
    $w = [int][Math]::Round($img.Width * $scale); $h = [int][Math]::Round($img.Height * $scale)
    $bmp = New-Object System.Drawing.Bitmap($w, $h, [System.Drawing.Imaging.PixelFormat]::Format24bppRgb)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.Clear([System.Drawing.Color]::White)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.DrawImage($img, 0, 0, $w, $h)
    $ep = New-Object System.Drawing.Imaging.EncoderParameters(1)
    $ep.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, [long]$quality)
    $bmp.Save($outPath, $jpeg, $ep)
    $g.Dispose(); $bmp.Dispose()
}

$manifest = Get-Content (Join-Path $PSScriptRoot 'graphics-src.json') -Raw | ConvertFrom-Json
# Order by installs, highest first; renumber the folders to match.
$ordered = $manifest | Sort-Object { -[long]$_.installs }
$out = @()
$n = 0
foreach ($m in $ordered) {
    $n++
    $base = $m.slug -replace '^\d+-', ''
    $slug = ('{0:00}-{1}' -f $n, $base)
    $srcDir = Join-Path $srcRoot $m.slug
    $outDir = Join-Path $dst $slug
    New-Item -ItemType Directory -Force $outDir | Out-Null
    $entry = [ordered]@{ num = $n; slug = $slug; id = $m.id; title = $m.title; developer = $m.developer; installsLabel = $m.installsLabel; installs = $m.installs; score = $m.score; ratings = $m.ratings; genre = $m.genre; updated = $m.updated; released = $m.released; video = $m.video; url = $m.url; assets = @() }
    $tiles = @()
    # icon: keep the original file
    if ($m.icon) {
        $f = Join-Path $srcDir $m.icon.file
        $img = [System.Drawing.Image]::FromFile($f)
        Copy-Item $f (Join-Path $outDir $m.icon.file) -Force
        $entry.assets += [ordered]@{ kind = 'icon'; file = "$slug/$($m.icon.file)"; w = $img.Width; h = $img.Height; src = $m.icon.src; label = 'Icon 01' }
        $tiles += $f
        $img.Dispose()
    }
    if ($m.feature) {
        $f = Join-Path $srcDir $m.feature.file
        $img = [System.Drawing.Image]::FromFile($f)
        Save-Jpeg $img (Join-Path $outDir 'feature-graphic-01.jpg') 1024 88
        $entry.assets += [ordered]@{ kind = 'feature-graphic'; file = "$slug/feature-graphic-01.jpg"; w = $img.Width; h = $img.Height; src = $m.feature.src; label = 'Feature Graphic 01' }
        $tiles += $f
        $img.Dispose()
    }
    $k = 0
    foreach ($s in $m.shots) {
        if ($s.error) { continue }
        $k++
        $f = Join-Path $srcDir $s.file
        $img = [System.Drawing.Image]::FromFile($f)
        $name = 'screenshot-{0:00}.jpg' -f $k
        Save-Jpeg $img (Join-Path $outDir $name) 1100 80
        $entry.assets += [ordered]@{ kind = 'screenshot'; file = "$slug/$name"; w = $img.Width; h = $img.Height; src = $s.src; label = ('Screenshot {0:00}' -f $k) }
        if ($tiles.Count -lt 14) { $tiles += $f }
        $img.Dispose()
    }
    # contact sheet: up to 14 tiles, 7 per row, each tile 220 wide, labelled
    $cols = 7; $tw = 220; $th = 300; $pad = 10
    $rows = [Math]::Ceiling($tiles.Count / $cols)
    $sheet = New-Object System.Drawing.Bitmap(($cols * ($tw + $pad) + $pad), ($rows * ($th + $pad + 18) + $pad + 40))
    $g = [System.Drawing.Graphics]::FromImage($sheet)
    $g.Clear([System.Drawing.Color]::FromArgb(240, 240, 240))
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $font = New-Object System.Drawing.Font('Segoe UI', 11)
    $bold = New-Object System.Drawing.Font('Segoe UI', 13, [System.Drawing.FontStyle]::Bold)
    $brush = [System.Drawing.Brushes]::Black
    $g.DrawString(('{0}. {1} - {2} - {3}' -f $n, $m.title, $m.developer, $m.installsLabel), $bold, $brush, $pad, 8)
    $i = 0
    foreach ($t in $tiles) {
        $img = [System.Drawing.Image]::FromFile($t)
        $r = [Math]::Floor($i / $cols); $c = $i % $cols
        $x = $pad + $c * ($tw + $pad); $y = 40 + $pad + $r * ($th + $pad + 18)
        $scale = [Math]::Min($tw / $img.Width, $th / $img.Height)
        $w = [int]($img.Width * $scale); $h = [int]($img.Height * $scale)
        $g.DrawImage($img, $x + [int](($tw - $w) / 2), $y + [int](($th - $h) / 2), $w, $h)
        $g.DrawString([IO.Path]::GetFileNameWithoutExtension($t) + " $($img.Width)x$($img.Height)", $font, $brush, $x, $y + $th + 2)
        $img.Dispose(); $i++
    }
    $ep = New-Object System.Drawing.Imaging.EncoderParameters(1)
    $ep.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, [long]82)
    $sheet.Save((Join-Path $sheets ('{0:00}.jpg' -f $n)), $jpeg, $ep)
    $g.Dispose(); $sheet.Dispose()
    $out += $entry
    "{0:00} {1,-34} {2,-14} shots {3,2} · tiles {4}" -f $n, $m.title, $m.installsLabel, $k, $tiles.Count
}
$out | ConvertTo-Json -Depth 6 | Set-Content (Join-Path $PSScriptRoot 'graphics-manifest.json') -Encoding utf8
$all = Get-ChildItem $dst -Recurse -File
"outputs: $($all.Count) files · $([Math]::Round(($all | Measure-Object Length -Sum).Sum / 1MB, 1)) MB"
```

### research/aso-pipeline/discover.js

```js
// Discovery: our listing + who ranks on the video-downloader category's head terms in the US.
const fs = require('fs');
const path = require('path');
const { search, details, suggest, pool } = require('./lib');
const MINE = 'com.video.downloader.instagram.videosaver';

const HEAD = ['video downloader', 'all video downloader', 'video saver', 'download video', 'hd video downloader', 'video downloader app',
  'story saver', 'status saver', 'reels downloader', 'video downloader for instagram', 'instagram video downloader', 'facebook video downloader',
  'tiktok video downloader', 'twitter video downloader', 'video downloader and saver', 'fast video downloader', 'social video downloader',
  'video downloader browser', 'downloader', 'save video', 'reel saver', 'insta downloader', 'video downloader with editor', 'private video downloader'];

(async () => {
  const me = await details(MINE, 'US');
  console.log('=== MY APP ===');
  console.log(JSON.stringify({ ...me, description: (me.description || '').slice(0, 300) + '…', screenshots: (me.screenshots || []).length }, null, 1));
  const res = await pool(HEAD, 4, async q => ({ q, ...(await search(q, 30, 'US')) }));
  const seen = {};
  for (const r of res) {
    if (r.error) { console.log(r.item, 'ERROR', r.error); continue; }
    r.results.slice(0, 10).forEach((x, i) => {
      const s = seen[x.appId] = seen[x.appId] || { title: x.title, dev: x.developer, inst: x.installsLabel, n: 0, best: 99 };
      s.n++; s.best = Math.min(s.best, i + 1);
    });
  }
  const rank = Object.entries(seen).sort((a, b) => b[1].n - a[1].n || a[1].best - b[1].best);
  console.log('\n=== MOST VISIBLE APPS (top-10 appearances across ' + HEAD.length + ' head terms) ===');
  rank.slice(0, 40).forEach(([id, s], i) => console.log(`${String(i + 1).padStart(2)}. ${s.n}x best#${s.best} ${s.title} — ${s.dev} ${s.inst || ''} [${id}]`));
  const depth = res.filter(r => !r.error).map(r => `${r.q}:${r.results.length}`).join(' · ');
  console.log('\ndepths:', depth);
  console.log('my app in head terms:', res.filter(r => !r.error && r.results.some(x => x.appId === MINE)).map(r => `${r.q}#${r.results.findIndex(x => x.appId === MINE) + 1}`).join(', ') || 'none');
  const ac = await pool(['video down', 'all video', 'video sav', 'story sav', 'reels down', 'status sav', 'insta vid', 'fb video', 'tiktok down', 'x video'], 4, async s => ({ s, list: await suggest(s, 'US') }));
  ac.forEach(a => console.log('suggest', a.s, '→', (a.list || []).join(' | ')));
  fs.writeFileSync(path.join(__dirname, 'discover.json'), JSON.stringify({ me, head: res, visible: rank }, null, 1));
})();
```

### research/aso-pipeline/graphics.js

```js
// Download every competitor's icon, feature graphic and screenshots from its Play listing (US) into avd-graphics-src/.
const fs = require('fs');
const path = require('path');
const { details, pool } = require('./lib');
const raw = require('./raw.json');
const UA = 'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Mobile Safari/537.36';
const OUT = path.join(__dirname, '..', 'avd-graphics-src');
const SLUG = ['01-inshot', '02-gamma-play', '03-qr-code-scanner', '04-story-saver', '05-insaver', '06-hub-dosa', '07-fast-saver', '08-apptool', '09-saver-player-studio', '10-devbay', '11-sky-vision', '12-attractive-apps', '13-markhoor', '14-mobile-notepad', '15-vidow', '16-vidpal'];

async function grab(url, file, size) {
  const r = await fetch(url + size, { headers: { 'User-Agent': UA } });
  if (!r.ok) throw new Error('HTTP ' + r.status);
  const type = r.headers.get('content-type') || '';
  const ext = type.includes('png') ? 'png' : type.includes('webp') ? 'webp' : type.includes('gif') ? 'gif' : 'jpg';
  const buf = Buffer.from(await r.arrayBuffer());
  fs.writeFileSync(file + '.' + ext, buf);
  return { file: path.basename(file) + '.' + ext, bytes: buf.length, src: url };
}

(async () => {
  const manifest = [];
  await pool(raw.competitors, 3, async (id, i) => {
    const a = await details(id, 'US');
    const dir = path.join(OUT, SLUG[i]);
    fs.mkdirSync(dir, { recursive: true });
    const entry = { slug: SLUG[i], id, title: a.title, developer: a.developer, installsLabel: a.installsLabel, installs: a.realInstalls || a.minInstalls, score: a.score, ratings: a.ratings, genre: a.genre, updated: a.updated, released: a.released, video: !!a.video, url: `https://play.google.com/store/apps/details?id=${id}&hl=en&gl=US`, icon: null, feature: null, shots: [] };
    try { entry.icon = await grab(a.icon, path.join(dir, 'icon-01'), '=s512'); } catch (e) { entry.iconError = e.message; }
    if (a.featureGraphic) { try { entry.feature = await grab(a.featureGraphic, path.join(dir, 'feature-graphic-01'), '=w1024'); } catch (e) { entry.featureError = e.message; } }
    for (let k = 0; k < a.screenshots.length; k++) {
      try { entry.shots.push(await grab(a.screenshots[k], path.join(dir, 'screenshot-' + String(k + 1).padStart(2, '0')), '=s1400')); } catch (e) { entry.shots.push({ error: e.message, src: a.screenshots[k] }); }
    }
    manifest[i] = entry;
    console.log(`${SLUG[i]} · ${a.title} · icon ${entry.icon ? 'ok' : 'FAIL'} · feature ${entry.feature ? 'ok' : 'none'} · shots ${entry.shots.filter(s => !s.error).length}/${a.screenshots.length}`);
  });
  fs.writeFileSync(path.join(__dirname, 'graphics-src.json'), JSON.stringify(manifest, null, 1));
  const n = manifest.reduce((s, m) => s + m.shots.filter(x => !x.error).length + (m.icon ? 1 : 0) + (m.feature ? 1 : 0), 0);
  console.log('files:', n, '· bytes:', manifest.reduce((s, m) => s + m.shots.reduce((x, y) => x + (y.bytes || 0), 0) + (m.icon ? m.icon.bytes : 0) + (m.feature ? m.feature.bytes : 0), 0));
})();
```

### research/aso-pipeline/inspect.js

```js
const raw = require('./raw.json');
const d = require('./data.json');
console.log('ALL KEYWORDS:\n' + raw.keywords.map((k, i) => `${i + 1}.${k}`).join(' | '));
console.log('\nAudit competitors by market (top10 / any / best):');
d.profiles.slice(10, 16).forEach(p => console.log(`  ${p.developer.padEnd(28)} ${d.markets.map(gl => `${gl} ${p.perMarket[gl].top10}/${p.perMarket[gl].any}/${p.perMarket[gl].best || '—'}`).join(' · ')}`));
console.log('\nLive competitors by market (top10):');
d.profiles.slice(0, 10).forEach(p => console.log(`  ${p.developer.slice(0, 28).padEnd(28)} ${d.markets.map(gl => `${gl} ${p.perMarket[gl].top10}`).join(' · ')}`));
const me = raw.apps.find(a => a.appId === raw.mine);
console.log('\nOUR LISTING\nTITLE (' + me.title.length + '): ' + me.title + '\nSHORT (' + me.summary.length + '): ' + me.summary + '\nLONG (' + me.description.length + '):\n' + me.description);
console.log('\nshots', me.screenshots.length, '| feature', !!me.featureGraphic, '| video', !!me.video, '| iap', me.iap, '| privacy', me.privacyPolicy);
```

### research/aso-pipeline/lib.js

```js
// Play Store scraper for the document-reader study: search, details (per market, with assets + offers), autocomplete.
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const UA = 'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Mobile Safari/537.36';
const CACHE = path.join(__dirname, 'cache');
fs.mkdirSync(CACHE, { recursive: true });

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function cachedFetch(key, fn) {
  const f = path.join(CACHE, crypto.createHash('md5').update(key).digest('hex') + '.json');
  if (fs.existsSync(f)) return JSON.parse(fs.readFileSync(f, 'utf8'));
  let lastErr;
  for (let attempt = 0; attempt < 4; attempt++) {
    try {
      const v = await fn();
      fs.writeFileSync(f, JSON.stringify(v));
      return v;
    } catch (e) { lastErr = e; await sleep(1500 * (attempt + 1)); }
  }
  throw lastErr;
}

function parseDs(html) {
  const out = {};
  for (const b of html.match(/AF_initDataCallback[\s\S]*?<\/script/g) || []) {
    const k = b.match(/(ds:\d+)'/);
    const v = b.match(/data:([\s\S]*?), sideChannel: \{\}\}\);<\//);
    if (k && v) try { out[k[1]] = JSON.parse(v[1]); } catch {}
  }
  return out;
}

const g = (o, p) => p.reduce((n, i) => (n == null ? undefined : n[i]), o);
const firstAppId = node => { const m = JSON.stringify(node).match(/details\?id=([\w.]+)/); return m ? m[1] : null; };

async function fetchText(url, opts = {}) {
  const r = await fetch(url, { ...opts, headers: { 'User-Agent': UA, 'Accept-Language': 'en-US,en;q=0.9', ...(opts.headers || {}) } });
  if (r.status === 404) return { status: 404, text: '' };
  if (!r.ok) throw new Error('HTTP ' + r.status + ' ' + url);
  return { status: r.status, text: await r.text() };
}

async function search(q, depth = 30, gl = 'US') {
  return cachedFetch('avd-search|' + q + '|' + depth + '|' + gl, async () => {
    const { text } = await fetchText(`https://play.google.com/store/search?q=${encodeURIComponent(q)}&c=apps&hl=en&gl=${gl}`);
    const ds4 = parseDs(text)['ds:4'];
    const sections = g(ds4, [0, 1]) || [];
    const results = [];
    let block = null, featured = null;
    for (const s of sections) {
      if (!s) continue;
      if (s[23] && !block) { const id = firstAppId(s[23]); if (id) { featured = id; results.push({ appId: id, featured: true }); } }
      if (s[22] && !block) {
        block = s[22];
        for (const x of block[0] || []) {
          const it = x[0];
          const id = g(it, [0, 0]);
          if (!id || results.some(r => r.appId === id)) continue;
          results.push({ appId: id, title: g(it, [3]), developer: g(it, [14]), installsLabel: g(it, [15]), score: g(it, [4, 1]), genre: g(it, [5]) });
        }
      }
    }
    if (!block && !featured) throw new Error('no results block for ' + q);
    let token = block ? g(block, [1, 3, 1]) : null;
    let pages = 0;
    while (results.length < depth && token && pages < 4) {
      pages++;
      const req = JSON.stringify([[['qnKhOb', JSON.stringify([[null, [[10, [10, 50]], true, null, [96, 27, 4, 8, 57, 30, 110, 79, 11, 16, 49, 1, 3, 9, 12, 104, 55, 56, 51, 10, 34, 77]], null, token]]), null, 'generic']]]);
      await sleep(400);
      const { text: t } = await fetchText('https://play.google.com/_/PlayStoreUi/data/batchexecute?rpcids=qnKhOb&hl=en&gl=' + gl.toLowerCase() + '&authuser&soc-app=121&soc-platform=1&soc-device=1', {
        method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }, body: 'f.req=' + encodeURIComponent(req),
      });
      const outer = JSON.parse(t.slice(t.indexOf('[')));
      const data = JSON.parse(outer[0][2]);
      const items = g(data, [0, 0, 0]) || [];
      for (const it of items) {
        const id = g(it, [12, 0]) || firstAppId(it);
        if (id && !results.some(r => r.appId === id)) results.push({ appId: id, title: typeof g(it, [2]) === 'string' ? g(it, [2]) : null });
      }
      token = g(data, [0, 0, 7, 1]);
      if (!items.length) break;
    }
    return { q, gl, fetchedAt: new Date().toISOString(), featured, results: results.slice(0, depth) };
  });
}

const deHtml = s => (s || '').replace(/<br\s*\/?>/gi, '\n').replace(/<\/?(b|i|u|strong|em)>/gi, '').replace(/<[^>]+>/g, '')
  .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(+n)).replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');

// Full listing for one market, including store assets and any in-app offer/event copy Play exposes.
async function details(appId, gl = 'US') {
  return cachedFetch('avd-details|' + appId + '|' + gl, async () => {
    const { status, text } = await fetchText(`https://play.google.com/store/apps/details?id=${encodeURIComponent(appId)}&hl=en&gl=${gl}`);
    if (status === 404) return { appId, gl, missing: true };
    const d = parseDs(text)['ds:5'];
    if (!d) throw new Error('no ds:5 for ' + appId);
    const q = p => g(d, [1, 2].concat(p));
    const updated = q([145, 0, 1, 0]);
    const shots = (q([78, 0]) || []).map(s => g(s, [3, 2])).filter(Boolean);
    const plain = text.replace(/<[^>]+>/g, ' ');
    const offers = [...new Set([...plain.matchAll(/(?:Special offer|Limited time|In-app event|Event|Offer ends|Save \d+%|Free trial)[^.<]{0,120}/gi)].map(m => m[0].replace(/\s+/g, ' ').trim()))].slice(0, 6);
    return {
      appId, gl, fetchedAt: new Date().toISOString(),
      title: q([0, 0]), summary: deHtml(q([73, 0, 1])), description: deHtml(q([72, 0, 1])),
      installsLabel: q([13, 0]), minInstalls: q([13, 1]), realInstalls: q([13, 2]),
      score: q([51, 0, 1]), ratings: q([51, 2, 1]), reviews: q([51, 3, 1]),
      developer: q([68, 0]), developerSite: q([69, 0, 5, 2]) || null, privacyPolicy: q([99, 0, 5, 2]) || null,
      genre: q([79, 0, 0, 0]), released: q([10, 0]), updated: updated ? new Date(updated * 1000).toISOString().slice(0, 10) : null,
      containsAds: !!q([48]), iap: q([19, 0]) || null, contentRating: q([9, 0]) || null,
      version: q([140, 0, 0, 0]) || null, recentChanges: deHtml(q([144, 1, 1])) || null,
      icon: q([95, 0, 3, 2]) || null, featureGraphic: q([96, 0, 3, 2]) || null, video: q([100, 0, 0, 3, 2]) || null,
      screenshots: shots, offers,
    };
  });
}

async function suggest(term, gl = 'US') {
  return cachedFetch('avd-suggest|' + term + '|' + gl, async () => {
    const req = JSON.stringify([[['IJ4APc', JSON.stringify([[null, [term], [10], [2], 4]]), null, 'generic']]]);
    const { text: t } = await fetchText(`https://play.google.com/_/PlayStoreUi/data/batchexecute?rpcids=IJ4APc&hl=en&gl=${gl.toLowerCase()}&authuser&soc-app=121&soc-platform=1&soc-device=1`, {
      method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }, body: 'f.req=' + encodeURIComponent(req),
    });
    const outer = JSON.parse(t.slice(t.indexOf('[')));
    const data = outer[0][2] ? JSON.parse(outer[0][2]) : null;
    return (g(data, [0, 0]) || []).map(x => x[0]);
  });
}

async function pool(items, n, fn) {
  const out = new Array(items.length);
  let i = 0;
  await Promise.all(Array.from({ length: n }, async () => {
    while (i < items.length) {
      const idx = i++;
      try { out[idx] = await fn(items[idx], idx); } catch (e) { out[idx] = { error: e.message, item: items[idx] }; }
    }
  }));
  return out;
}

module.exports = { search, details, suggest, pool, sleep, g, deHtml };
```

### research/aso-pipeline/scope.js

```js
// Turn the existing dossier page into a scoped tab: CSS prefixed with #dossier, left scrubber removed, lightbox kept.
const fs = require('fs');
const path = require('path');
const src = fs.readFileSync(path.join(__dirname, 'dossier-source.html'), 'utf8');

const styles = [...src.matchAll(/<style>([\s\S]*?)<\/style>/g)].map(m => m[1]);
const css = styles.find(s => s.includes('--flame-1'));
const fonts = src.match(/<link rel="stylesheet" href="(https:\/\/fonts\.googleapis\.com[^"]+)">/)[1];

function scopeSel(list) {
  return list.split(',').map(s => s.trim()).map(s => {
    if (s === 'html') return null;
    if (s === 'body' || s === ':root') return '#dossier';
    if (s === '*') return '#dossier *';
    const m = s.match(/^(:root(?:\[[^\]]*\]|:not\([^)]*\))*)(.*)$/);
    if (m) return `${m[1]} #dossier${m[2]}`;
    return '#dossier ' + s;
  }).filter(Boolean).join(',');
}
function scopeCss(text) {
  let out = '', i = 0;
  while (i < text.length) {
    const open = text.indexOf('{', i);
    if (open < 0) break;
    let sel = text.slice(i, open).replace(/\/\*[\s\S]*?\*\//g, '').trim();
    if (sel.startsWith('@media')) {
      let depth = 1, j = open + 1;
      while (depth && j < text.length) { if (text[j] === '{') depth++; else if (text[j] === '}') depth--; j++; }
      out += `${sel}{${scopeCss(text.slice(open + 1, j - 1))}}\n`;
      i = j;
    } else {
      const close = text.indexOf('}', open);
      const body = text.slice(open + 1, close);
      const scoped = scopeSel(sel);
      if (scoped) out += `${scoped}{${body}}\n`;
      i = close + 1;
    }
  }
  return out;
}

const overrides = `
#dossier{min-height:100vh}
#dossier .shell{grid-template-columns:minmax(0,1fr);padding-block:40px 96px}
#dossier .bar{position:relative;top:auto;z-index:auto;border-bottom:0;backdrop-filter:none;-webkit-backdrop-filter:none}
#dossier .chips{margin-top:0}
#dossier .chip{font-family:var(--body)}
#dossier .legend{margin-bottom:0}
#dossier .sw{width:auto;height:auto;border-radius:0;display:grid}
#dossier th{font-family:var(--body)}
`;
const scopedCss = scopeCss(css) + overrides;

const main = src.match(/<main>([\s\S]*?)<\/main>/)[1];
const footer = src.match(/<footer>[\s\S]*?<\/footer>/)[0];
const dialog = src.match(/<dialog class="lightbox"[\s\S]*?<\/dialog>/)[0];
const title = src.match(/<title>([^<]*)<\/title>/)[1];
const sections = [...src.matchAll(/<li><a href="#([^"]+)">([^<]+)<\/a><\/li>/g)].map(m => ({ id: m[1], label: m[2].replace(/&amp;/g, '&') }));

const body = `<div id="dossier" data-tab="dossier" hidden>\n<div class="shell"><main>${main}</main></div>\n${footer}\n${dialog}\n</div>`;
fs.writeFileSync(path.join(__dirname, 'dossier-parts.json'), JSON.stringify({ title, fonts, css: scopedCss, body, sections }));
console.log('title:', title, '| sections:', sections.map(s => s.id).join(', '));
console.log('scoped css', scopedCss.length, 'chars ·', (scopedCss.match(/#dossier/g) || []).length, 'scoped selectors · body', body.length, 'chars');
console.log(scopedCss.split('\n').filter(l => /:root/.test(l)).map(l => l.slice(0, 90)).join('\n'));
```

### research/aso-pipeline/sep-16-build/build.js

```js
// Build the All Video Downloader page: Cloud Storage design system + this study's tabs + the scoped Product Dossier.
const fs = require('fs');
const path = require('path');
const data = require('./data.json');
const raw = require('./raw.json');
const offersRaw = require('./offers.json');
const assets = require('./myassets.json');
const features = require('./features.json');
const dossier = require('./dossier-parts.json');

const norm = s => s.toLowerCase().replace(/&/g, ' and ').match(/[a-z0-9]+/g) || [];
const US = data.board.US;
const takenNorm = new Set(raw.apps.filter(a => a.appId !== raw.mine).map(a => norm(a.title || '').join(' ')));
const scoreText = t => {
  const w = new Set(norm(t)), phrase = ' ' + norm(t).join(' ') + ' ';
  let s = 0; const hits = [], exact = [];
  for (const r of US) { if (r.tier === 'D') continue; const qw = norm(r.q); if (qw.every(x => w.has(x))) { const ex = phrase.includes(' ' + qw.join(' ') + ' '); s += r.P * (ex ? 1.5 : 1); hits.push(r.q); if (ex) exact.push(r.q); } }
  return { score: Math.round(s), hits, exact };
};
const CURRENT = raw.apps.find(a => a.appId === raw.mine);

// Titles: no platform names, no "free", no claims the app can't back (it contains ads).
const CANDS = [CURRENT.title, 'HD Video Downloader & Saver', 'All Video Downloader: HD Saver', 'Video Downloader: HD & Private', 'Video Downloader & Saver: HD',
  'HD Video Downloader & Cutter', 'All Video Downloader & Cutter', 'Fast Video Downloader & Saver', 'Private Video Downloader & Saver', 'Video Downloader & Cutter',
  'Video Saver: HD Downloader', 'All Video Downloader & Vault', 'HD Video Downloader: Save Link', 'Video Downloader: Save & Cut', 'Private Video Downloader: HD'];
const titles = [...new Set(CANDS)].map(t => ({ t, len: t.length, taken: takenNorm.has(norm(t).join(' ')), current: t === CURRENT.title, ...scoreText(t) }))
  .filter(c => c.len <= 30).sort((a, b) => b.score - a.score);
console.log('titles:'); titles.forEach(c => console.log(`  ${String(c.score).padStart(4)} ${c.len}c ${c.taken ? 'TAKEN ' : ''}${c.current ? 'CURRENT ' : ''}${c.t} (${c.hits.length}; exact ${c.exact.join(', ')})`));
const rec = titles.filter(c => !c.taken && !c.current).slice(0, 3);

const SHORTS = [
  'Save videos from any link in HD, then cut, merge and lock them in a private vault.',
  'HD video downloader with a video cutter, MP3 extractor and PIN-locked video vault',
  'Fast video saver: download HD videos, cut clips, extract MP3 and hide videos',
  'Download videos from links in HD. Video cutter, MP3 extractor and private vault.',
];
const shorts = SHORTS.map(s => ({ s, len: s.length, ...scoreText(rec[0].t + ' ' + s) })).filter(s => s.len <= 80).sort((a, b) => b.score - a.score);
console.log('shorts:'); shorts.forEach(s => console.log(`  ${s.score} ${s.len}c ${s.s}`));

const LONG = `{name} saves videos from a link in the quality you choose, with a built-in video cutter and a private vault. Copy a video link, paste it into the app and download video straight to your phone — then trim it, extract the audio or lock it away behind a PIN.

## Download videos from a link
• Paste a link or share it straight into the app to download video in one step
• Choose the quality before you save, from HD down to smaller files
• Download several videos at once with pause, resume and retry
• Downloads keep running in the background, even for large files
• Works with links from Facebook, Instagram, TikTok, X, LinkedIn, Dailymotion and Vimeo

## HD video saver and player
• All video downloader and player in one app
• Watch saved videos offline with the built-in video player
• Rename, share, delete or favourite any download
• Status saver for statuses you are allowed to keep

## Video cutter and editor · 9 tools
• Trim, split, crop and merge videos
• Change the aspect ratio with a colour or blur background
• Add music to a video, or extract audio and save it as MP3
• Filters and effects, plus an image or text watermark

## Private video downloader with a vault
• Hide videos, pictures and audio in a PIN-locked vault
• Unlock with your fingerprint, and reset your PIN with a security question
• Keep private downloads out of your gallery

## Made for everyone
• 9 languages: English, Urdu, Arabic, Hindi, Turkish, German, French, Portuguese and Chinese
• Right-to-left layouts for Urdu and Arabic
• A clean app built for fast, simple saving

## How to download a video
Copy the link of a video you have permission to save.
Open {name} and paste the link, or share the link into the app.
Pick the quality and tap Download.
Open the saved video to watch, cut or move it to the vault.

## Questions people ask
Where are my downloads saved? In the app, sorted into a folder for each platform. Move any video to the vault in one tap.
Will a large download stop if I leave the app? No. Downloads keep running in the background and resume after a network drop.
What does Premium change? Premium removes ads. Downloads work the same way with or without it.

## Important
Download only videos you own, videos in the public domain, or videos the owner lets you save. Please respect copyright.
{name} is an independent app and is not affiliated with, endorsed by or sponsored by any of the platforms named above.`;
const longPlain = LONG.replace(/\{name\}/g, rec[0].t).replace(/^## /gm, '').replace(/^• /gm, '');
const lw = norm(longPlain).length;
console.log('long chars', longPlain.length, 'words', lw);
['video downloader', 'video saver', 'hd video downloader', 'download video', 'private video downloader'].forEach(p => { const n = (' ' + norm(longPlain).join(' ') + ' ').split(' ' + p + ' ').length - 1; console.log(`  ${p}: ${n} (${(100 * n * p.split(' ').length / lw).toFixed(1)}%)`); });

// IAP ranges → numbers
const parseIap = s => { const m = (s || '').match(/\$([\d.]+)\s*-\s*\$([\d.]+)/) || (s || '').match(/\$([\d.]+)/); return m ? { min: +m[1], max: +(m[2] || m[1]) } : null; };
data.profiles.forEach(p => { p.iapRange = parseIap(p.iap); });

const offersChecked = Object.fromEntries(Object.entries(offersRaw).map(([id, byGl]) => [id, Object.values(byGl).some(o => o.section)]));
const payload = JSON.stringify({ data, assets, features, offersChecked, listing: {
  current: { title: CURRENT.title, summary: CURRENT.summary, description: CURRENT.description, iap: CURRENT.iap, ads: CURRENT.containsAds, privacy: CURRENT.privacyPolicy, site: CURRENT.developerSite, developer: CURRENT.developer, installs: CURRENT.installsLabel, url: `https://play.google.com/store/apps/details?id=${raw.mine}&hl=en&gl=US`, id: raw.mine, genre: CURRENT.genre, privacyStatus: 200 },
  titles, rec, shorts, long: LONG,
}, dossierSections: dossier.sections }).replace(/</g, '\\u003c');

const css = fs.readFileSync(path.join(__dirname, '..', 'aso', 'page.html'), 'utf8').match(/<style>([\s\S]*?)<\/style>/)[1];
const tpl = fs.readFileSync(path.join(__dirname, 'template.html'), 'utf8');
const html = tpl.replace('/*__CSS__*/', () => css).replace('/*__DOSSIER_CSS__*/', () => dossier.css).replace('<!--__DOSSIER__-->', () => dossier.body)
  .replace('__DOSSIER_FONTS__', () => dossier.fonts).replace('/*__PAYLOAD__*/null', () => payload);
const out = path.join(__dirname, '..', 'all-video-downloader.html');
fs.writeFileSync(out, html);
console.log('wrote', out, fs.statSync(out).size, 'bytes');
```

### research/tiksta-title-check/playcheck.ps1

```powershell
$ProgressPreference = 'SilentlyContinue'
$dir = $PSScriptRoot
$UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36'
$queries = @(
  'reels downloader', 'reels video downloader', 'reels saver', 'video downloader for reels',
  'insta downloader', 'insta saver', 'tiktok downloader', 'tik tok video downloader',
  'video downloader for tiktok', 'instagram downloader', 'video downloader for instagram',
  'tiksta', 'reels downloader app', 'social video downloader', 'private video downloader', 'save video'
)
$serps = [ordered]@{}
foreach ($q in $queries) {
  $u = 'https://play.google.com/store/search?q=' + [uri]::EscapeDataString($q) + '&c=apps&hl=en&gl=US'
  try {
    $r = Invoke-WebRequest -Uri $u -UseBasicParsing -Headers @{ 'User-Agent' = $UA; 'Accept-Language' = 'en-US,en;q=0.9' } -TimeoutSec 60
    $ids = [regex]::Matches($r.Content, 'details\?id=([A-Za-z0-9_.]+)') | ForEach-Object { $_.Groups[1].Value } | Select-Object -Unique
    $serps[$q] = @($ids)
  } catch { $serps[$q] = @(); Write-Output "search failed: $q $_" }
}
$all = $serps.Values | ForEach-Object { $_ } | Select-Object -Unique
Write-Output "queries: $($queries.Count) unique apps: $($all.Count)"

$pool = [runspacefactory]::CreateRunspacePool(1, 10); $pool.Open()
$work = {
  param($id, $UA)
  $ProgressPreference = 'SilentlyContinue'
  $o = [ordered]@{ id = $id; ok = $false }
  for ($try = 0; $try -lt 3 -and -not $o.ok; $try++) {
    try {
      $r = Invoke-WebRequest -Uri ("https://play.google.com/store/apps/details?id=$id&hl=en&gl=US") -UseBasicParsing -Headers @{ 'User-Agent' = $UA; 'Accept-Language' = 'en-US,en;q=0.9' } -TimeoutSec 60
      $c = $r.Content
      $t = [regex]::Match($c, '<meta property="og:title" content="([^"]*)"').Groups[1].Value
      $o.title = [System.Net.WebUtility]::HtmlDecode(($t -replace ' - Apps on Google Play$', ''))
      $inst = [regex]::Match($c, '"([\d,]+\+)",(\d+),(\d+),"([^"]+)"')
      if ($inst.Success) { $o.band = $inst.Groups[4].Value; $o.min = [int64]$inst.Groups[2].Value; $o.installs = [int64]$inst.Groups[3].Value }
      $ld = [regex]::Match($c, '<script type="application/ld\+json"[^>]*>(.*?)</script>', 'Singleline')
      if ($ld.Success) { try { $j = $ld.Groups[1].Value | ConvertFrom-Json; $o.dev = $j.author.name; if ($j.aggregateRating) { $o.score = $j.aggregateRating.ratingValue; $o.ratings = $j.aggregateRating.ratingCount } } catch {} }
      $dates = [regex]::Matches($c, '\["([A-Z][a-z]{2} \d{1,2}, \d{4})",\[(\d{9,11})') | ForEach-Object { [int64]$_.Groups[2].Value } | Sort-Object -Unique
      if ($dates) { $o.first = ([DateTimeOffset]::FromUnixTimeSeconds(($dates | Select-Object -First 1))).UtcDateTime.ToString('yyyy-MM-dd'); $o.last = ([DateTimeOffset]::FromUnixTimeSeconds(($dates | Select-Object -Last 1))).UtcDateTime.ToString('yyyy-MM-dd') }
      $o.ok = $true
    } catch { $o.err = "$_"; Start-Sleep -Seconds 2 }
  }
  [pscustomobject]$o
}
$jobs = foreach ($id in $all) { $ps = [powershell]::Create(); $ps.RunspacePool = $pool; [void]$ps.AddScript($work).AddArgument($id).AddArgument($UA); [pscustomobject]@{ ps = $ps; h = $ps.BeginInvoke() } }
$apps = foreach ($j in $jobs) { $j.ps.EndInvoke($j.h); $j.ps.Dispose() }
$pool.Close()
$outObj = [ordered]@{ collectedAt = (Get-Date).ToUniversalTime().ToString('o'); serps = $serps; apps = $apps }
[IO.File]::WriteAllText("$dir\playcheck.json", ($outObj | ConvertTo-Json -Depth 6), (New-Object Text.UTF8Encoding($false)))
Write-Output "details ok: $(($apps | Where-Object ok).Count) / $($apps.Count)"
```

### research/tiksta-title-check/score.ps1

```powershell
param([switch]$Detail)
$dir = $PSScriptRoot
$j = [IO.File]::ReadAllText("$dir\payload.json", [Text.Encoding]::UTF8) | ConvertFrom-Json
$long = [IO.File]::ReadAllText("$dir\tiksta-long.txt", [Text.Encoding]::UTF8).TrimEnd()
function normT($s) { ' ' + (($s.ToLower() -replace '&', ' and ' -replace '[^a-z0-9]+', ' ').Trim()) + ' ' }
function phraseN($text, $p) { $t = normT $text; $n = normT $p; $c = 0; $i = $t.IndexOf($n); while ($i -ge 0) { $c++; $i = $t.IndexOf($n, $i + $n.Length - 1) }; $c }
function words($s) { @((normT $s).Trim().Split(' ') | Where-Object { $_ }) }
function allIn($q, $set) { foreach ($w in (words $q)) { if (-not $set.Contains($w)) { return $false } }; $true }
function cov($q, $f) {
  if (phraseN $f.title $q) { return @('title', 1) }
  $ts = New-Object 'System.Collections.Generic.HashSet[string]'; (words $f.title) | ForEach-Object { [void]$ts.Add($_) }
  if (allIn $q $ts) { return @('titlew', 0.85) }
  if (phraseN $f.short $q) { return @('short', 0.7) }
  (words $f.short) | ForEach-Object { [void]$ts.Add($_) }
  if (allIn $q $ts) { return @('tsw', 0.7) }
  if (phraseN $f.long $q) { return @('long', 0.3) }
  @('none', 0)
}
$brand = '\b(instagram|insta|facebook|fb|tiktok|whatsapp|linkedin|pinterest|twitter|x|vimeo|dailymotion|youtube)\b'
$US = foreach ($r in $j.data.board.US) {
  $o = [pscustomobject]@{ q = $r.q; tier = $r.tier; tm = [bool]$r.tm; R = [double]$r.R; O = [double]$r.O; P = [int]$r.P; entry = $r.entry; c10 = $r.c10 }
  if ($o.tm -and $o.q -match '\breels?\b' -and $o.q -notmatch $brand) { $o.tm = $false; $o.R = [Math]::Round($o.R + 0.165, 3); $o.P = [int][Math]::Round(100 * $o.R * $o.R * $o.O); $o.tier = 'A'; $o | Add-Member cleared $true }
  $o
}
$US = $US | Sort-Object P -Descending
$FIN = @($US | Where-Object { ($_.tier -eq 'A' -or $_.tier -eq 'B') -and $_.R -ge 0.8 -and -not $_.tm -and $_.q -notmatch 'without ads|\bfree\b|\b4k\b' })
"finalized: $($FIN.Count)"
function score($f) {
  $got = 0; $all = 0; $strong = 0; $any = 0
  foreach ($r in $US) { if ($r.tier -eq 'D' -or $r.tm) { continue }; $c = cov $r.q $f; $all += $r.P; $got += $r.P * $c[1] }
  foreach ($r in $FIN) { $c = cov $r.q $f; if ($c[0] -ne 'none') { $any++ }; if ($c[0] -in 'title','titlew','short','tsw') { $strong++ } }
  [pscustomobject]@{ prio = [Math]::Round(100 * $got / $all, 1); fin = $any; strong = $strong }
}
$titles = 'Tiksta: Reels Video Downloader', 'Tiksta Social Video Downloader', 'Tiksta - Reels & Story Saver', 'Reels Downloader - Tiksta', 'Tiksta: Reels & Video Saver', 'Tiksta: Video Downloader', 'Tiksta: Reels Downloader App'
$shorts = @(
  'Save & download reels and social videos in HD from a link. Private saver app',
  'Download & save reels, social videos and stories in HD. Fast, private saver app',
  'Save & download reels and social videos in HD from a link. Fast story saver app',
  'Save & download reels & social videos in HD from any link. Fast, private saver app',
  'Save & download reels and all social videos in HD from a link. Fast saver app',
  'Save & download reels & social videos in HD from a link. Fast, private saver app',
  'Save & download reels & social videos in HD from a link. Private story saver app',
  'Save & download reels, stories & social videos in HD. Fast, private saver app',
  'Save & download reels & all social videos in HD from a link. Private saver app'
)
"long chars: $($long.Length)  words: $((words $long).Count)"
foreach ($t in $titles) { $s = score @{ title = $t; short = ''; long = $long }; "T {0,-34} len {1,2}  prio {2}  fin {3}/{4} strong {5}" -f $t, $t.Length, $s.prio, $s.fin, $FIN.Count, $s.strong }
foreach ($sh in $shorts) { $s = score @{ title = $titles[0]; short = $sh; long = $long }; "S len {0,2} prio {1} fin {2} strong {3} | {4}" -f $sh.Length, $s.prio, $s.fin, $s.strong, $sh }
if ($Detail) {
  $f = @{ title = $titles[0]; short = $shorts[[int]$env:SHORT_I]; long = $long }
  foreach ($r in $US) { if ($r.tier -eq 'D') { continue }; $c = cov $r.q $f; "{0,-4} P{1,-3} R{2,-6} tm={3} entry={4,-8} c10={5} {6,-7} longÃ—{7} | {8}" -f $r.tier, $r.P, $r.R, [int]$r.tm, $r.entry, $r.c10, $c[0], (phraseN $long $r.q), $r.q }
}
```

## Small data files

### research/aso-pipeline/batch1.txt

```text
{"path":"graphics/01-qr-code-scanner/feature-graphic-01.jpg"},{"path":"graphics/01-qr-code-scanner/icon-01.png"},{"path":"graphics/01-qr-code-scanner/screenshot-01.jpg"},{"path":"graphics/01-qr-code-scanner/screenshot-02.jpg"},{"path":"graphics/01-qr-code-scanner/screenshot-03.jpg"},{"path":"graphics/01-qr-code-scanner/screenshot-04.jpg"},{"path":"graphics/01-qr-code-scanner/screenshot-05.jpg"},{"path":"graphics/01-qr-code-scanner/screenshot-06.jpg"},{"path":"graphics/01-qr-code-scanner/screenshot-07.jpg"},{"path":"graphics/01-qr-code-scanner/screenshot-08.jpg"},{"path":"graphics/02-inshot/feature-graphic-01.jpg"},{"path":"graphics/02-inshot/icon-01.png"},{"path":"graphics/02-inshot/screenshot-01.jpg"},{"path":"graphics/02-inshot/screenshot-02.jpg"},{"path":"graphics/02-inshot/screenshot-03.jpg"},{"path":"graphics/02-inshot/screenshot-04.jpg"},{"path":"graphics/02-inshot/screenshot-05.jpg"},{"path":"graphics/02-inshot/screenshot-06.jpg"},{"path":"graphics/02-inshot/screenshot-07.jpg"},{"path":"graphics/02-inshot/screenshot-08.jpg"},{"path":"graphics/02-inshot/screenshot-09.jpg"},{"path":"graphics/02-inshot/screenshot-10.jpg"},{"path":"graphics/02-inshot/screenshot-11.jpg"},{"path":"graphics/02-inshot/screenshot-12.jpg"},{"path":"graphics/02-inshot/screenshot-13.jpg"},{"path":"graphics/02-inshot/screenshot-14.jpg"},{"path":"graphics/02-inshot/screenshot-15.jpg"},{"path":"graphics/02-inshot/screenshot-16.jpg"},{"path":"graphics/02-inshot/screenshot-17.jpg"},{"path":"graphics/03-vidow/feature-graphic-01.jpg"},{"path":"graphics/03-vidow/icon-01.png"},{"path":"graphics/03-vidow/screenshot-01.jpg"},{"path":"graphics/03-vidow/screenshot-02.jpg"},{"path":"graphics/03-vidow/screenshot-03.jpg"},{"path":"graphics/03-vidow/screenshot-04.jpg"},{"path":"graphics/03-vidow/screenshot-05.jpg"},{"path":"graphics/03-vidow/screenshot-06.jpg"},{"path":"graphics/03-vidow/screenshot-07.jpg"},{"path":"graphics/03-vidow/screenshot-08.jpg"},{"path":"graphics/03-vidow/screenshot-09.jpg"},{"path":"graphics/03-vidow/screenshot-10.jpg"},{"path":"graphics/03-vidow/screenshot-11.jpg"},{"path":"graphics/03-vidow/screenshot-12.jpg"},{"path":"graphics/03-vidow/screenshot-13.jpg"},{"path":"graphics/03-vidow/screenshot-14.jpg"},{"path":"graphics/03-vidow/screenshot-15.jpg"},{"path":"graphics/03-vidow/screenshot-16.jpg"},{"path":"graphics/03-vidow/screenshot-17.jpg"},{"path":"graphics/03-vidow/screenshot-18.jpg"},{"path":"graphics/04-vidpal/feature-graphic-01.jpg"},{"path":"graphics/04-vidpal/icon-01.png"},{"path":"graphics/04-vidpal/screenshot-01.jpg"},{"path":"graphics/04-vidpal/screenshot-02.jpg"},{"path":"graphics/04-vidpal/screenshot-03.jpg"},{"path":"graphics/04-vidpal/screenshot-04.jpg"},{"path":"graphics/04-vidpal/screenshot-05.jpg"},{"path":"graphics/04-vidpal/screenshot-06.jpg"},{"path":"graphics/04-vidpal/screenshot-07.jpg"},{"path":"graphics/04-vidpal/screenshot-08.jpg"},{"path":"graphics/04-vidpal/screenshot-09.jpg"},{"path":"graphics/04-vidpal/screenshot-10.jpg"},{"path":"graphics/04-vidpal/screenshot-11.jpg"},{"path":"graphics/04-vidpal/screenshot-12.jpg"},{"path":"graphics/04-vidpal/screenshot-13.jpg"},{"path":"graphics/04-vidpal/screenshot-14.jpg"},{"path":"graphics/04-vidpal/screenshot-15.jpg"},{"path":"graphics/04-vidpal/screenshot-16.jpg"},{"path":"graphics/04-vidpal/screenshot-17.jpg"},{"path":"graphics/04-vidpal/screenshot-18.jpg"},{"path":"graphics/04-vidpal/screenshot-19.jpg"},{"path":"graphics/04-vidpal/screenshot-20.jpg"},{"path":"graphics/04-vidpal/screenshot-21.jpg"},{"path":"graphics/04-vidpal/screenshot-22.jpg"},{"path":"graphics/04-vidpal/screenshot-23.jpg"},{"path":"graphics/04-vidpal/screenshot-24.jpg"},{"path":"graphics/04-vidpal/screenshot-25.jpg"},{"path":"graphics/04-vidpal/screenshot-26.jpg"},{"path":"graphics/04-vidpal/screenshot-27.jpg"},{"path":"graphics/04-vidpal/screenshot-28.jpg"},{"path":"graphics/04-vidpal/screenshot-29.jpg"},{"path":"graphics/04-vidpal/screenshot-30.jpg"},{"path":"graphics/04-vidpal/screenshot-31.jpg"},{"path":"graphics/04-vidpal/screenshot-32.jpg"},{"path":"graphics/04-vidpal/screenshot-33.jpg"},{"path":"graphics/04-vidpal/screenshot-34.jpg"},{"path":"graphics/04-vidpal/screenshot-35.jpg"},{"path":"graphics/05-devbay/feature-graphic-01.jpg"},{"path":"graphics/05-devbay/icon-01.png"},{"path":"graphics/05-devbay/screenshot-01.jpg"},{"path":"graphics/05-devbay/screenshot-02.jpg"},{"path":"graphics/05-devbay/screenshot-03.jpg"},{"path":"graphics/05-devbay/screenshot-04.jpg"},{"path":"graphics/05-devbay/screenshot-05.jpg"},{"path":"graphics/05-devbay/screenshot-06.jpg"},{"path":"graphics/05-devbay/screenshot-07.jpg"},{"path":"graphics/05-devbay/screenshot-08.jpg"},{"path":"graphics/05-devbay/screenshot-09.jpg"},{"path":"graphics/05-devbay/screenshot-10.jpg"},{"path":"graphics/05-devbay/screenshot-11.jpg"},{"path":"graphics/05-devbay/screenshot-12.jpg"},{"path":"graphics/05-devbay/screenshot-13.jpg"},{"path":"graphics/05-devbay/screenshot-14.jpg"},{"path":"graphics/05-devbay/screenshot-15.jpg"},{"path":"graphics/05-devbay/screenshot-16.jpg"},{"path":"graphics/05-devbay/screenshot-17.jpg"},{"path":"graphics/05-devbay/screenshot-18.jpg"},{"path":"graphics/05-devbay/screenshot-19.jpg"},{"path":"graphics/05-devbay/screenshot-20.jpg"},{"path":"graphics/05-devbay/screenshot-21.jpg"},{"path":"graphics/06-story-saver/feature-graphic-01.jpg"},{"path":"graphics/06-story-saver/icon-01.jpg"},{"path":"graphics/06-story-saver/screenshot-01.jpg"},{"path":"graphics/06-story-saver/screenshot-02.jpg"},{"path":"graphics/06-story-saver/screenshot-03.jpg"},{"path":"graphics/06-story-saver/screenshot-04.jpg"},{"path":"graphics/06-story-saver/screenshot-05.jpg"},{"path":"graphics/06-story-saver/screenshot-06.jpg"},{"path":"graphics/07-saver-player-studio/feature-graphic-01.jpg"},{"path":"graphics/07-saver-player-studio/icon-01.jpg"},{"path":"graphics/07-saver-player-studio/screenshot-01.jpg"},{"path":"graphics/07-saver-player-studio/screenshot-02.jpg"},{"path":"graphics/07-saver-player-studio/screenshot-03.jpg"},{"path":"graphics/07-saver-player-studio/screenshot-04.jpg"},{"path":"graphics/07-saver-player-studio/screenshot-05.jpg"},{"path":"graphics/07-saver-player-studio/screenshot-06.jpg"},{"path":"graphics/07-saver-player-studio/screenshot-07.jpg"},{"path":"graphics/07-saver-player-studio/screenshot-08.jpg"},{"path":"graphics/07-saver-player-studio/screenshot-09.jpg"},{"path":"graphics/07-saver-player-studio/screenshot-10.jpg"},{"path":"graphics/07-saver-player-studio/screenshot-11.jpg"},{"path":"graphics/07-saver-player-studio/screenshot-12.jpg"},{"path":"graphics/07-saver-player-studio/screenshot-13.jpg"},{"path":"graphics/07-saver-player-studio/screenshot-14.jpg"},{"path":"graphics/07-saver-player-studio/screenshot-15.jpg"},{"path":"graphics/07-saver-player-studio/screenshot-16.jpg"},{"path":"graphics/07-saver-player-studio/screenshot-17.jpg"},{"path":"graphics/07-saver-player-studio/screenshot-18.jpg"},{"path":"graphics/07-saver-player-studio/screenshot-19.jpg"},{"path":"graphics/07-saver-player-studio/screenshot-20.jpg"},{"path":"graphics/07-saver-player-studio/screenshot-21.jpg"},{"path":"graphics/08-attractive-apps/feature-graphic-01.jpg"},{"path":"graphics/08-attractive-apps/icon-01.png"},{"path":"graphics/08-attractive-apps/screenshot-01.jpg"},{"path":"graphics/08-attractive-apps/screenshot-02.jpg"},{"path":"graphics/08-attractive-apps/screenshot-03.jpg"},{"path":"graphics/08-attractive-apps/screenshot-04.jpg"},{"path":"graphics/08-attractive-apps/screenshot-05.jpg"},{"path":"graphics/08-attractive-apps/screenshot-06.jpg"},{"path":"graphics/08-attractive-apps/screenshot-07.jpg"},{"path":"graphics/08-attractive-apps/screenshot-08.jpg"},{"path":"graphics/08-attractive-apps/screenshot-09.jpg"},{"path":"graphics/08-attractive-apps/screenshot-10.jpg"},{"path":"graphics/08-attractive-apps/screenshot-11.jpg"},{"path":"graphics/08-attractive-apps/screenshot-12.jpg"},{"path":"graphics/08-attractive-apps/screenshot-13.jpg"},{"path":"graphics/08-attractive-apps/screenshot-14.jpg"},{"path":"graphics/08-attractive-apps/screenshot-15.jpg"},{"path":"graphics/08-attractive-apps/screenshot-16.jpg"},{"path":"graphics/08-attractive-apps/screenshot-17.jpg"},{"path":"graphics/08-attractive-apps/screenshot-18.jpg"}
```

### research/aso-pipeline/batch2.txt

```text
{"path":"graphics/09-fast-saver/feature-graphic-01.jpg"},{"path":"graphics/09-fast-saver/icon-01.png"},{"path":"graphics/09-fast-saver/screenshot-01.jpg"},{"path":"graphics/09-fast-saver/screenshot-02.jpg"},{"path":"graphics/09-fast-saver/screenshot-03.jpg"},{"path":"graphics/09-fast-saver/screenshot-04.jpg"},{"path":"graphics/09-fast-saver/screenshot-05.jpg"},{"path":"graphics/10-sky-vision/feature-graphic-01.jpg"},{"path":"graphics/10-sky-vision/icon-01.png"},{"path":"graphics/10-sky-vision/screenshot-01.jpg"},{"path":"graphics/10-sky-vision/screenshot-02.jpg"},{"path":"graphics/10-sky-vision/screenshot-03.jpg"},{"path":"graphics/10-sky-vision/screenshot-04.jpg"},{"path":"graphics/10-sky-vision/screenshot-05.jpg"},{"path":"graphics/10-sky-vision/screenshot-06.jpg"},{"path":"graphics/10-sky-vision/screenshot-07.jpg"},{"path":"graphics/10-sky-vision/screenshot-08.jpg"},{"path":"graphics/10-sky-vision/screenshot-09.jpg"},{"path":"graphics/10-sky-vision/screenshot-10.jpg"},{"path":"graphics/10-sky-vision/screenshot-11.jpg"},{"path":"graphics/10-sky-vision/screenshot-12.jpg"},{"path":"graphics/10-sky-vision/screenshot-13.jpg"},{"path":"graphics/10-sky-vision/screenshot-14.jpg"},{"path":"graphics/10-sky-vision/screenshot-15.jpg"},{"path":"graphics/10-sky-vision/screenshot-16.jpg"},{"path":"graphics/10-sky-vision/screenshot-17.jpg"},{"path":"graphics/10-sky-vision/screenshot-18.jpg"},{"path":"graphics/10-sky-vision/screenshot-19.jpg"},{"path":"graphics/10-sky-vision/screenshot-20.jpg"},{"path":"graphics/10-sky-vision/screenshot-21.jpg"},{"path":"graphics/11-apptool/feature-graphic-01.jpg"},{"path":"graphics/11-apptool/icon-01.png"},{"path":"graphics/11-apptool/screenshot-01.jpg"},{"path":"graphics/11-apptool/screenshot-02.jpg"},{"path":"graphics/11-apptool/screenshot-03.jpg"},{"path":"graphics/11-apptool/screenshot-04.jpg"},{"path":"graphics/11-apptool/screenshot-05.jpg"},{"path":"graphics/11-apptool/screenshot-06.jpg"},{"path":"graphics/11-apptool/screenshot-07.jpg"},{"path":"graphics/12-hub-dosa/feature-graphic-01.jpg"},{"path":"graphics/12-hub-dosa/icon-01.png"},{"path":"graphics/12-hub-dosa/screenshot-01.jpg"},{"path":"graphics/12-hub-dosa/screenshot-02.jpg"},{"path":"graphics/12-hub-dosa/screenshot-03.jpg"},{"path":"graphics/12-hub-dosa/screenshot-04.jpg"},{"path":"graphics/12-hub-dosa/screenshot-05.jpg"},{"path":"graphics/12-hub-dosa/screenshot-06.jpg"},{"path":"graphics/12-hub-dosa/screenshot-07.jpg"},{"path":"graphics/12-hub-dosa/screenshot-08.jpg"},{"path":"graphics/12-hub-dosa/screenshot-09.jpg"},{"path":"graphics/12-hub-dosa/screenshot-10.jpg"},{"path":"graphics/12-hub-dosa/screenshot-11.jpg"},{"path":"graphics/12-hub-dosa/screenshot-12.jpg"},{"path":"graphics/12-hub-dosa/screenshot-13.jpg"},{"path":"graphics/12-hub-dosa/screenshot-14.jpg"},{"path":"graphics/12-hub-dosa/screenshot-15.jpg"},{"path":"graphics/12-hub-dosa/screenshot-16.jpg"},{"path":"graphics/12-hub-dosa/screenshot-17.jpg"},{"path":"graphics/12-hub-dosa/screenshot-18.jpg"},{"path":"graphics/12-hub-dosa/screenshot-19.jpg"},{"path":"graphics/12-hub-dosa/screenshot-20.jpg"},{"path":"graphics/12-hub-dosa/screenshot-21.jpg"},{"path":"graphics/12-hub-dosa/screenshot-22.jpg"},{"path":"graphics/12-hub-dosa/screenshot-23.jpg"},{"path":"graphics/12-hub-dosa/screenshot-24.jpg"},{"path":"graphics/12-hub-dosa/screenshot-25.jpg"},{"path":"graphics/13-insaver/feature-graphic-01.jpg"},{"path":"graphics/13-insaver/icon-01.jpg"},{"path":"graphics/13-insaver/screenshot-01.jpg"},{"path":"graphics/13-insaver/screenshot-02.jpg"},{"path":"graphics/13-insaver/screenshot-03.jpg"},{"path":"graphics/13-insaver/screenshot-04.jpg"},{"path":"graphics/13-insaver/screenshot-05.jpg"},{"path":"graphics/13-insaver/screenshot-06.jpg"},{"path":"graphics/13-insaver/screenshot-07.jpg"},{"path":"graphics/14-markhoor/feature-graphic-01.jpg"},{"path":"graphics/14-markhoor/icon-01.jpg"},{"path":"graphics/14-markhoor/screenshot-01.jpg"},{"path":"graphics/14-markhoor/screenshot-02.jpg"},{"path":"graphics/14-markhoor/screenshot-03.jpg"},{"path":"graphics/14-markhoor/screenshot-04.jpg"},{"path":"graphics/14-markhoor/screenshot-05.jpg"},{"path":"graphics/14-markhoor/screenshot-06.jpg"},{"path":"graphics/14-markhoor/screenshot-07.jpg"},{"path":"graphics/14-markhoor/screenshot-08.jpg"},{"path":"graphics/14-markhoor/screenshot-09.jpg"},{"path":"graphics/14-markhoor/screenshot-10.jpg"},{"path":"graphics/14-markhoor/screenshot-11.jpg"},{"path":"graphics/14-markhoor/screenshot-12.jpg"},{"path":"graphics/14-markhoor/screenshot-13.jpg"},{"path":"graphics/14-markhoor/screenshot-14.jpg"},{"path":"graphics/14-markhoor/screenshot-15.jpg"},{"path":"graphics/14-markhoor/screenshot-16.jpg"},{"path":"graphics/14-markhoor/screenshot-17.jpg"},{"path":"graphics/14-markhoor/screenshot-18.jpg"},{"path":"graphics/14-markhoor/screenshot-19.jpg"},{"path":"graphics/14-markhoor/screenshot-20.jpg"},{"path":"graphics/14-markhoor/screenshot-21.jpg"},{"path":"graphics/14-markhoor/screenshot-22.jpg"},{"path":"graphics/14-markhoor/screenshot-23.jpg"},{"path":"graphics/14-markhoor/screenshot-24.jpg"},{"path":"graphics/14-markhoor/screenshot-25.jpg"},{"path":"graphics/14-markhoor/screenshot-26.jpg"},{"path":"graphics/14-markhoor/screenshot-27.jpg"},{"path":"graphics/15-mobile-notepad/feature-graphic-01.jpg"},{"path":"graphics/15-mobile-notepad/icon-01.png"},{"path":"graphics/15-mobile-notepad/screenshot-01.jpg"},{"path":"graphics/15-mobile-notepad/screenshot-02.jpg"},{"path":"graphics/15-mobile-notepad/screenshot-03.jpg"},{"path":"graphics/15-mobile-notepad/screenshot-04.jpg"},{"path":"graphics/15-mobile-notepad/screenshot-05.jpg"},{"path":"graphics/15-mobile-notepad/screenshot-06.jpg"},{"path":"graphics/15-mobile-notepad/screenshot-07.jpg"},{"path":"graphics/15-mobile-notepad/screenshot-08.jpg"},{"path":"graphics/15-mobile-notepad/screenshot-09.jpg"},{"path":"graphics/15-mobile-notepad/screenshot-10.jpg"},{"path":"graphics/15-mobile-notepad/screenshot-11.jpg"},{"path":"graphics/15-mobile-notepad/screenshot-12.jpg"},{"path":"graphics/15-mobile-notepad/screenshot-13.jpg"},{"path":"graphics/15-mobile-notepad/screenshot-14.jpg"},{"path":"graphics/15-mobile-notepad/screenshot-15.jpg"},{"path":"graphics/15-mobile-notepad/screenshot-16.jpg"},{"path":"graphics/15-mobile-notepad/screenshot-17.jpg"},{"path":"graphics/15-mobile-notepad/screenshot-18.jpg"},{"path":"graphics/15-mobile-notepad/screenshot-19.jpg"},{"path":"graphics/15-mobile-notepad/screenshot-20.jpg"},{"path":"graphics/15-mobile-notepad/screenshot-21.jpg"},{"path":"graphics/15-mobile-notepad/screenshot-22.jpg"},{"path":"graphics/15-mobile-notepad/screenshot-23.jpg"},{"path":"graphics/15-mobile-notepad/screenshot-24.jpg"},{"path":"graphics/15-mobile-notepad/screenshot-25.jpg"},{"path":"graphics/15-mobile-notepad/screenshot-26.jpg"},{"path":"graphics/15-mobile-notepad/screenshot-27.jpg"},{"path":"graphics/15-mobile-notepad/screenshot-28.jpg"},{"path":"graphics/15-mobile-notepad/screenshot-29.jpg"},{"path":"graphics/15-mobile-notepad/screenshot-30.jpg"},{"path":"graphics/15-mobile-notepad/screenshot-31.jpg"},{"path":"graphics/15-mobile-notepad/screenshot-32.jpg"},{"path":"graphics/16-gamma-play/feature-graphic-01.jpg"},{"path":"graphics/16-gamma-play/icon-01.jpg"},{"path":"graphics/16-gamma-play/screenshot-01.jpg"},{"path":"graphics/16-gamma-play/screenshot-02.jpg"},{"path":"graphics/16-gamma-play/screenshot-03.jpg"},{"path":"graphics/16-gamma-play/screenshot-04.jpg"},{"path":"graphics/16-gamma-play/screenshot-05.jpg"},{"path":"graphics/16-gamma-play/screenshot-06.jpg"},{"path":"graphics/16-gamma-play/screenshot-07.jpg"},{"path":"graphics/16-gamma-play/screenshot-08.jpg"},{"path":"graphics/16-gamma-play/screenshot-09.jpg"},{"path":"graphics/16-gamma-play/screenshot-10.jpg"},{"path":"graphics/16-gamma-play/screenshot-11.jpg"},{"path":"graphics/16-gamma-play/screenshot-12.jpg"},{"path":"graphics/16-gamma-play/screenshot-13.jpg"},{"path":"graphics/16-gamma-play/screenshot-14.jpg"},{"path":"graphics/16-gamma-play/screenshot-15.jpg"},{"path":"graphics/16-gamma-play/screenshot-16.jpg"},{"path":"graphics/16-gamma-play/screenshot-17.jpg"},{"path":"graphics/16-gamma-play/screenshot-18.jpg"},{"path":"graphics/16-gamma-play/screenshot-19.jpg"},{"path":"graphics/16-gamma-play/screenshot-20.jpg"},{"path":"graphics/16-gamma-play/screenshot-21.jpg"}
```

### research/aso-pipeline/features.json

```json
{
  "audit": {
    "apps": [
      {"n":"All Video Downloader","dev":"Our app","installs":"5+","ours":true,"comp":-1},
      {"n":"All Video Downloader & Saver","dev":"Sky Vision","installs":"10M+","comp":10},
      {"n":"All video downloader and saver","dev":"Attractive Apps Valley","installs":"10M+","comp":11},
      {"n":"Video Downloader & Save Video","dev":"Markhoor Studio","installs":"5M+","comp":12},
      {"n":"Video Downloader · Player","dev":"Mobile Notepad","installs":"5M+","comp":13},
      {"n":"Video Downloader HD","dev":"Vidow (VIDOXE)","installs":"100M+","comp":14},
      {"n":"4K Downloader","dev":"Vidpal","installs":"50M+","comp":15}
    ],
    "groups": [
      {
        "g": "Downloading",
        "rows": [
          {"f":"WebView browser + link sniffer","v":"FFFFFFF"},
          {"f":"HLS / DASH stream download","v":"FFFFFNF"},
          {"f":"Clipboard paste-to-download","v":"FFNFFNF"},
          {"f":"Offline library + background downloads","v":"FFFFFFF"},
          {"f":"Batch downloads","v":"FNNNNNN"}
        ]
      },
      {
        "g": "Saving & audio",
        "rows": [
          {"f":"WhatsApp status saver (+ WA Business)","v":"FNNFFNF"},
          {"f":"MP3 / audio extraction","v":"FNNNNNN"}
        ]
      },
      {
        "g": "Privacy",
        "rows": [{"f":"Private vault + biometric / PIN lock","v":"FNNNNNN"}]
      },
      {
        "g": "Playback & experience",
        "rows": [
          {"f":"Media3 / ExoPlayer player","v":"FFFFFFF"},
          {"f":"Onboarding + dark mode","v":"FFFFFFF"}
        ]
      }
    ],
    "excluded": "The slide also lists “Jetpack Compose modern UI” with our app marked ✓. The Product Dossier’s spec, read from app/build.gradle, shows Android Views + ViewBinding, so the row is left out rather than shown with a claim the build does not support."
  },
  "oursOnly": [
    {
      "h": "A 9-tool video editor",
      "p": "Trim, split, crop, merge, aspect ratio, add audio, extract audio, filters & effects and watermark — built on Media3 Transformer and checked frame by frame on a device."
    },
    {
      "h": "A private vault with PIN and biometrics",
      "p": "Hide videos, pictures and audio behind a 4-digit PIN with fingerprint unlock and a security question to reset. None of the six audited competitors ships a locked vault."
    },
    {"h":"MP3 and audio extraction","p":"Pick a range and save the audio. The only app in the audit that extracts audio."},
    {
      "h": "Batch downloads that survive the background",
      "p": "Parallel downloads with pause, resume and retry, kept alive by a foreground service. The only app in the audit with batch downloading."
    },
    {
      "h": "Nine languages, including right-to-left",
      "p": "English, Urdu, Arabic, Hindi, Turkish, German, French, Brazilian Portuguese and Chinese, with mirrored layouts for Urdu and Arabic."
    }
  ],
  "ourClaims": {"paste":1,"browser":1,"quality":1,"background":1,"multi":1,"story":1,"status":1,"mp3":1,"private":1,"editor":1,"player":1,"languages":1},
  "inventory": [
    {
      "screen": "Download",
      "items": [
        "Paste a link, share into the app, or pick from Quick Platforms",
        "Quick Platforms: Facebook, Instagram, TikTok, LinkedIn, X, Dailymotion, Likee, Snapchat, WhatsApp and WhatsApp Business",
        "Quality picker (for example 720p, 360p, 240p)", "Parallel downloads with pause, resume and retry",
        "Foreground service keeps large downloads alive"
      ]
    },
    {
      "screen": "Video cutter · 9 tools",
      "items": [
        "Cut & compress, crop, split and merge", "Aspect ratio with colour or blur fill", "Add audio and extract MP3", "Filters & effects",
        "Add watermark with image or styled text", "Trim start, trim middle, trim end, volume and speed"
      ]
    },
    {
      "screen": "Vault",
      "items": ["Hidden videos, pictures and audio","4-digit PIN with biometric unlock","Security question to reset the PIN","Change PIN"]
    },
    {
      "screen": "Manage & settings",
      "items": [
        "Rename, share, delete and favourite", "WhatsApp and WhatsApp Business status saver", "Download location and subscription settings",
        "Nine languages with right-to-left layouts"
      ]
    },
    {
      "screen": "Verified on a real phone",
      "items": [
        "TikTok, Facebook, Instagram (reels, videos, carousels), LinkedIn, X, Dailymotion and Vimeo downloaded end to end",
        "0 crashes and 0 ANRs across the device rounds", "QA score 95 / 100"
      ]
    }
  ],
  "edges": [
    {
      "h": "InShot · Video Downloader",
      "p": "The category leader: 100M+ installs, a 4.7 rating from about 2.7M ratings, a browser with auto-detect and a password-protected folder."
    },
    {"h":"Vidow · Video Downloader HD","p":"100M+ installs with a resolution picker and casting to a TV."},
    {"h":"Vidpal · 4K Downloader","p":"50M+ installs, paste-link downloading and a 4K player."}
  ],
  "plans": {
    "note": "Premium removes all ads. Prices as Google Play shows them in Pakistan.",
    "items": [
      {"p":"Weekly","price":"Rs 1,400","sku":"weekly_plan"},
      {"p":"Monthly","price":"Rs 5,600","sku":"monthly_plan"}
    ]
  }
}
```

### research/aso-pipeline/graphics-notes.json

```json
{
  "captured": "17 Sep 2026",
  "overview": [
    "The strongest references serve different purposes: InShot for the browser-first download tour that the category leader runs; Gamma Play for the one quiet, blue-accented set in a red crowd; Markhoor for the cleanest white system in the red-V family; and AppTool for a compact seven-frame story that still shows a PIN vault. These are visual judgments, not conversion rankings.",
    "Twelve of the 16 icons are a white V or a white down-arrow on a red, orange or black square. Six apps use the same white V on red (Vidow, Vidpal, Attractive Apps Valley, Sky Vision, Markhoor, Mobile Notepad); Gamma Play’s black square with a white arrow and orange tray is a near copy of InShot’s. Only Hub (a wordmark that mimics an adult site) and Saver & Player Studio break the pattern.",
    "Three listings sit at 100M+ (QR Code Scanner, InShot, Vidow), four at 50M+, seven at 10M+, Mobile Notepad at 5M+ and Gamma Play at 100K+. Install brackets do not show acquisition cost, momentum or creative conversion; on this category’s keywords, the six apps from your feature audit hold one top-10 placement between them across eight markets.",
    "Most sets fill their slots by repeating a handful of messages: Vidow shows six frames three times, Vidpal seven frames five times, Hub five frames five times, Mobile Notepad eight frames four times. Vidpal publishes every screenshot square (1080 × 1080); InShot, AppTool and Saver & Player Studio mix a landscape or a second canvas size into the carousel."
  ],
  "captureNote": "Original assets captured 17 Sep 2026 from each app’s public Google Play listing, requesting English / US. Apps are ordered by installs, highest first; duplicate links were removed by package name before ordering. Click an image to view it large; each caption links to the full-resolution original on Google Play.",
  "apps": {
    "1": {
      "name": "QR Code Scanner · All Video Downloader & Player",
      "notes": {
        "Icon": "A white V built from a film strip with a small download arrow, on a red-to-orange square with a badge in the corner. The film-strip idea separates it from the plain V family, but it still reads red-V at small sizes.",
        "Feature graphic": "Red banner with a faint grid of app icons and an italic “ALL Video Downloader” wordmark. Category name only; no benefit.",
        "Screenshot system": "Eight portraits at 710 × 1400 share a white headline band, a bold two-line black heading and a black phone frame with red accents. The sequence runs downloader, download all you see, built-in player, block ads, story downloader, 3× faster, download manager, share.",
        "Design assessment": "The tightest eight-frame story in the set, with one message per slot and no repetition. “Block Ads”, “3× Faster” and “Best Story Downloader” are claims rather than features shown; the download-manager and share frames are the most useful references."
      },
      "tags": ["film-strip V","red","white headline band","eight distinct messages","ad-block claim"]
    },
    "2": {
      "name": "InShot · Video Downloader",
      "notes": {
        "Icon": "A black rounded square with a white down arrow and a yellow tray bar. The simplest construction in the set and the one Gamma Play copies.",
        "Feature graphic": "Dark grid of faint icons with “Simple & Fast Downloader” in gold and white. A landscape promo screenshot repeats the wordmark with “#1”, “100M+ Installs” and a phone.",
        "Screenshot system": "One landscape (1400 × 788) leads, then dark portraits with an orange-and-white two-tone headline: the browser finds a video, “Video found” pops up, downloads progress, an SD-card picker, a PIN screen and a browser menu. Later frames are plain UI captures at 875 × 1400 with no headline.",
        "Design assessment": "A product tour of the browser flow rather than a poster set — the leader sells the mechanism. Two canvas widths (788 and 875) sit in one carousel, and the landscape carries superlatives (“#1”) that Play’s metadata policy discourages. Best reference for showing the sniffer flow honestly."
      },
      "tags": ["black arrow","browser tour","dark canvas","PIN vault","mixed widths","superlative claims"]
    },
    "3": {
      "name": "Vidow · Video Downloader HD",
      "notes": {
        "Icon": "A white V on a red square with a small pink download badge at the top right. One of six white-V-on-red icons in this set.",
        "Feature graphic": "Black banner with a gold “Fast Video Downloader — Download All Videos Fast & Without Login!” and a phone mockup.",
        "Screenshot system": "Eighteen portraits at 788 × 1400 on black with thin gold frame lines and a yellow-and-white headline: easy downloader (with F, S, D, V platform tiles), download & cast, progress list, HD player, quality picker from 1080p to 240p, share sheet. Six frames, repeated three times.",
        "Design assessment": "The black-and-gold palette is the clearest departure from the red-and-white crowd, and cast-to-TV is a feature nobody else shows. Filling 18 slots with six messages adds nothing; the platform tiles are trademark exposure."
      },
      "tags": ["white V on red","black and gold","cast to TV","quality picker","six frames repeated"]
    },
    "4": {
      "name": "Vidpal · Video Downloader and 4k Player",
      "notes": {
        "Icon": "A large 3D white V on a coral-red rounded square. Recognisable, but the V is the category’s most common mark.",
        "Feature graphic": "Dark red banner with scattered platform icons and “Fast and Private video downloader”.",
        "Screenshot system": "Thirty-five square screenshots (1080 × 1080) on a peach-to-white gradient with a black-and-red headline: HD downloader, download instantly, watch movies, quality chooser, floating player, download management, built-in player. Seven frames, repeated five times.",
        "Design assessment": "Square frames waste the vertical space a phone carousel gives, and 35 near-identical slots read as padding. “Watch Movies” shows third-party film posters, which is an intellectual-property exposure. The floating player is a genuine differentiator worth noting."
      },
      "tags": ["3D V","square screenshots","floating player","film posters","seven frames repeated"]
    },
    "5": {
      "name": "DevBay · All Video Downloader & Browser",
      "notes": {
        "Icon": "A white down arrow into a tray on a red-to-pink gradient rounded square.",
        "Feature graphic": "White banner with two phone mockups and “All Video Downloader App — Save Photos & Videos”. Calmer than most.",
        "Screenshot system": "Twenty-one portraits at 756 × 1400: white canvas with a red-pink diagonal sweep, a red-and-black headline and a phone whose home screen shows a paste-link field and a list of supported platforms. Frames cover HD download, a 4× rocket with 4K/1080/720/480 tags, built-in player, manage saved videos, short videos and a quality sheet. Seven frames, repeated three times.",
        "Design assessment": "A clean paste-link flow is the strongest thing here, and the quality sheet is well framed. The platform list with logos is trademark exposure and the 4× speed claim is unverifiable. Layout system nearly identical to Sky Vision and Attractive Apps Valley."
      },
      "tags": ["arrow on gradient","paste link","diagonal sweep","4× claim","platform logos"]
    },
    "6": {
      "name": "Story Saver · Video downloader - Story Saver",
      "notes": {
        "Icon": "A white circle with a down arrow on a pink-to-magenta gradient. The gradient reads as Instagram’s.",
        "Feature graphic": "Red-pink banner with “Download Videos & Photos — Save Stories” and a fan of phone screens.",
        "Screenshot system": "Six portraits at 788 × 1400 on white with a condensed pink headline and green arrows: copy link to save, share to save, story saver & repost, auto save from a pasted ig.com link, save reels, history. Built as numbered how-to steps.",
        "Design assessment": "The only set that teaches instead of promising, which suits a share-to-save flow. Every screen is Instagram-shaped and an ig.com URL is visible, so the listing depends on one platform’s look. Six slots used of eight."
      },
      "tags": ["Instagram gradient","how-to steps","share to save","six slots","platform-shaped UI"]
    },
    "7": {
      "name": "Saver & Player Studio · Video Downloader & Video Saver",
      "notes": {
        "Icon": "A black square with “All” in white and “Downloader” in an orange block. A wordmark, not a symbol.",
        "Feature graphic": "Dark banner with faint icons and “Video Downloader & File Saver”.",
        "Screenshot system": "Twenty-one screenshots at three sizes (720 × 1280, 788 × 1400, 1050 × 1400): black canvas with an orange diagonal wedge, italic white-and-orange headline, a phone on a Vimeo page, My Files, built-in player, share & repost sheet, dark theme, 4× rocket, private folder.",
        "Design assessment": "Three source resolutions in one carousel make the strip uneven in Play. The orange-and-black wedge is distinctive and the private folder frame is useful. Vimeo’s page and logo appear in the UI."
      },
      "tags": ["wordmark icon","orange wedge","three canvas sizes","private folder","Vimeo page"]
    },
    "8": {
      "name": "Attractive Apps Valley · All video downloader and saver",
      "notes": {
        "Icon": "A white V on a red square, indistinguishable from Sky Vision’s and Markhoor’s at listing size.",
        "Feature graphic": "Pink-to-orange gradient with a phone and “Video Downloader — Fast & Easy Download videos from anywhere with few clicks!”.",
        "Screenshot system": "Eighteen portraits at 788 × 1400 on an orange-to-red gradient with a white headline: all video downloader, download all you watch (a grid of eight platform logos), built-in player, high-resolution toggle, secure & fast rocket, social media downloader with a PASTE chip. Six frames, repeated three times.",
        "Design assessment": "The most prominent platform-logo grid in the set, front and centre in two frames. Otherwise the same template as Sky Vision and DevBay; the built-in player frame with a dancing subject is the most legible."
      },
      "tags": ["white V on red","orange gradient","platform logo grid","PASTE chip","six frames repeated"]
    },
    "9": {
      "name": "Fast Saver · Video Downloader & Story Saver",
      "notes": {
        "Icon": "A white circle with a down arrow on a red square — the Story Saver icon in red.",
        "Feature graphic": "Grey-white banner branded “Rposty — Fast download videos and photos. Save story.” with a phone. The brand does not match the listing title.",
        "Screenshot system": "Five portraits at 788 × 1400 on flat red with a white bold headline and an older phone frame, annotated with numbered steps: super easy steps, auto save, share and repost, built-in player, dark theme.",
        "Design assessment": "The smallest set: five slots, a dated device frame and a feature graphic that names a different product. Useful only as a reminder to keep brand, title and graphics consistent."
      },
      "tags": ["circle arrow on red","five slots","brand mismatch","numbered steps","dated frame"]
    },
    "10": {
      "name": "Sky Vision · All Video Downloader & Saver",
      "notes": {
        "Icon": "A white V on a red square, one of six in the set.",
        "Feature graphic": "Orange-red banner with a faint app-icon grid and “All Video Downloader”.",
        "Screenshot system": "Twenty-one portraits at 788 × 1400: white top with a pink-and-black headline, a red-pink diagonal sweep and a phone. Frames cover paste the link (PASTE chip, supported socials), fast downloader (speedometer, 4K / FULL HD / HD tags), quality chips from 144p to 1080p, trending videos, all video formats (MP4, MKV, FLV, AVI), easy manage & share. Seven frames, repeated three times.",
        "Design assessment": "This listing shares its exact title with yours. Its strongest idea is the format frame — MP4, MKV, FLV and AVI as tags — which no other set uses. The rest is the DevBay / Attractive template with a speedometer instead of a rocket."
      },
      "tags": ["white V on red","same title as ours","format tags","speedometer","seven frames repeated"]
    },
    "11": {
      "name": "AppTool · All Video Downloader & Player",
      "notes": {
        "Icon": "A white down arrow and tray on a yellow-to-orange square. The only warm-yellow icon in the set.",
        "Feature graphic": "Purple-to-pink gradient with “Download Videos From All Media — Simple & Fast” and an orange button.",
        "Screenshot system": "Six portraits at 788 × 1400 plus one landscape at 1400 × 788, white canvas, black-and-orange headline, dark phone UI: download any video in one tap (Fast / Easy / High Quality tags), HD & 4K quality list, auto-detect, 3× faster speedometer, keep your videos private (PIN pad with a shield), download from popular sites; the landscape shows the built-in player.",
        "Design assessment": "Seven distinct frames with no repetition and a landscape used for the one feature that suits it. The PIN frame is the clearest privacy message in the set. Platform logos appear in the UI and the 3× claim is unverifiable."
      },
      "tags": ["yellow arrow","seven distinct frames","one landscape","PIN pad","3× claim"]
    },
    "12": {
      "name": "DOSA · Hub Video Downloader",
      "notes": {
        "Icon": "“Browser” in white beside “hub” in an orange box on black — a direct imitation of an adult site’s wordmark.",
        "Feature graphic": "The same wordmark on black.",
        "Screenshot system": "Twenty-five portraits at 788 × 1400 on black with an orange-and-white headline and an orange-framed phone: all-websites downloader, social media downloader (paste link and four platform logos), private browser on an incognito Google page, multiple resolutions, 3× faster private downloader. Five frames, repeated five times.",
        "Design assessment": "Brand mimicry of an adult site, adult-adjacent thumbnails in the UI captures and a Google page in a screenshot — everything a listing should avoid. Included as a boundary reference, not a model."
      },
      "tags": ["adult-site wordmark","black and orange","private browser","five frames repeated","avoid"]
    },
    "13": {
      "name": "Story Saver · InSaver: All Video Downloader",
      "notes": {
        "Icon": "A white circle with a down arrow on an orange-to-yellow gradient — the Instagram gradient again, from the same developer as Story Saver.",
        "Feature graphic": "Red-pink banner with “Save Stories — All Video Downloader — Fast Easy Safe” and a phone.",
        "Screenshot system": "Seven portraits at 788 × 1400 on white with a condensed red headline: video downloader, story saver & repost, no watermark, live wallpapers & ringtones, history, batch download, auto save.",
        "Design assessment": "Seven distinct frames, but “No Watermark” promises to strip creator attribution and “Live Wallpapers & Ringtones” is off-category. Batch download is claimed here and by none of the audited competitors; the Instagram-shaped UI ties the listing to one platform."
      },
      "tags": ["Instagram gradient","no-watermark claim","batch download","off-category frames","seven distinct frames"]
    },
    "14": {
      "name": "Markhoor Studio · Video Downloader & Save Video",
      "notes": {
        "Icon": "A white V on a red square.",
        "Feature graphic": "White banner with an orange-cased phone, “Video Downloader” and three platform icons.",
        "Screenshot system": "Twenty-seven portraits at 788 × 1400 on white with a black headline and a small grey subtitle: all video downloader (a platform row across the top of the UI), paste link & download now (yellow arrow), browser downloader on a travel site, HD / SD / mp3 options with an audio-only choice, all sites, quick downloader with progress and mp3, private gallery behind a PIN. Seven frames, repeated about four times.",
        "Design assessment": "The whitest and most legible system in the red-V family, with the only frame in the set that offers an audio-only download, and a private-gallery PIN frame. Platform logos run along the top of every UI capture."
      },
      "tags": ["white V on red","white canvas","mp3 option","private gallery","platform row","seven frames repeated"]
    },
    "15": {
      "name": "Mobile Notepad · Video Downloader - Player",
      "notes": {
        "Icon": "A white V with a notch on a red square.",
        "Feature graphic": "Dark red banner with a phone and “VIDEO DOWNLOADER — Download All video Easy and Fast”.",
        "Screenshot system": "Thirty-two portraits at 788 × 1400 on white with a black-and-red headline and a dark phone UI with an orange circular download button: all video downloader (paste link), save HD videos with a rocket, shorts / reels downloader, fast video browser, social media downloader (a grid of site tiles), light / dark themes, protect your videos (Set Pin behind a red padlock), save & share. Eight frames, repeated four times.",
        "Design assessment": "The most slots in the set, reached through repetition. The PIN frame and the theme frame are useful references; the site-tile grid names other companies’ products and the rocket repeats the speed cliché."
      },
      "tags": ["notched V","orange FAB","PIN padlock","themes","site tiles","eight frames repeated"]
    },
    "16": {
      "name": "Gamma Play · Video Downloader - without ads",
      "notes": {
        "Icon": "A black square with a white down arrow and an orange tray — InShot’s icon with the yellow swapped for orange.",
        "Feature graphic": "A pale blue-white abstract banner with a blue play-and-download glyph and no text at all.",
        "Screenshot system": "Twenty-one portraits at 788 × 1400 on white with a plain black two-line headline and a dark phone UI with a blue accent: download any video in one tap, choose quality before downloading (1080p to 360p), built-in ad blocker, built-in player, instant story downloader, download to private vault, track progress in real time. Seven frames, repeated three times.",
        "Design assessment": "The quietest set and the only blue accent among sixteen red-and-orange listings, which makes it stand out in results. The private-vault frame is the closest match to your vault. The icon copies the leader; a listing named “without ads” has to stay ad-free to keep its claim."
      },
      "tags": ["copied icon","blue accent","text-free banner","private vault","quality before download","seven frames repeated"]
    }
  },
  "patterns": [
    {
      "h": "The red V",
      "html": "Six icons are a white V on red and six more are a white down-arrow on red, orange or black. A new red V or black arrow joins the crowd; your violet-to-orange square with a black arrow and cyan-pink edges (Product Dossier · Graphics) is already outside it — keep that."
    },
    {
      "h": "Two-tone headlines",
      "html": "Almost every set uses a two-line headline with one word in the accent colour and the rest in black or white, set above a phone. It is the category’s shared grammar; adopt the structure and change the palette."
    },
    {
      "h": "Speed multipliers",
      "html": "InShot (100 MB/s), DevBay and Saver & Player Studio (4×), AppTool, QR Code Scanner and Hub (3×) and Sky Vision (a speedometer) all sell speed with rockets and gauges. None can be verified from a listing; a real progress screen with a real file size says more."
    },
    {
      "h": "Platform logos in the UI",
      "html": "Ten of the 16 sets show other companies’ logos — as tiles, grids or a row across the app’s home. Play’s intellectual-property policy treats confusing use of other brands as a violation; “paste any link” with a generic link icon carries the same message without the exposure."
    },
    {
      "h": "Quality pickers",
      "html": "Eight sets show a resolution list (1080p to 240p, sometimes 4K). It is expected in this category and your quality picker (Vimeo: 720p, 360p, 240p) can be shown the same way."
    },
    {
      "h": "Privacy behind a PIN",
      "html": "InShot, AppTool, Markhoor, Mobile Notepad and Gamma Play each spend one frame on a PIN or vault. Your vault has a PIN, biometrics and a security question — one frame more than any competitor shows."
    },
    {
      "h": "Repetition to fill slots",
      "html": "Vidow, Vidpal, Hub, Mobile Notepad and Markhoor repeat five to eight frames to fill 18–35 slots. Play shows eight per device type; eight distinct messages beat 32 repeated ones."
    },
    {
      "h": "Dark or light canvas",
      "html": "InShot, Vidow, Saver & Player Studio and Hub run dark canvases; the rest run white. Both work — what matters is one canvas, one phone size and one headline position across the whole set."
    }
  ],
  "guidance": [
    {
      "h": "Keep the icon identity you have",
      "html": "The dossier’s icon — a black download arrow with cyan and pink edges on a violet-to-orange square — is the only one of its kind against these sixteen. Do not move toward a red V or a black arrow; test the current icon at 32, 48, 64 and 96 px on white to check the edge colours still read."
    },
    {
      "h": "Lead with what nobody shows",
      "html": "No competitor set shows a video editor. Frame two should be the cutter grid (nine tools), frame three the vault with fingerprint, frame four MP3 extraction. Then the paste-link flow, the quality picker, background downloads and status saver."
    },
    {
      "h": "Eight distinct frames, one system",
      "html": "Use one canvas colour, one phone size and one headline position for all eight. The two-line, two-tone headline is the category’s grammar; set the accent word in your flame orange (#FE5F02) on a light canvas so the set reads as yours."
    },
    {
      "h": "Show mechanisms, not multipliers",
      "html": "Replace rockets and “3×” with the real progress screen (296 MB at 62%, pause and cancel) and the quality picker. Every claim in a frame should be a screen the QA rounds verified."
    },
    {
      "h": "No platform logos, no brand names",
      "html": "Show “paste any link” with a generic link icon. Name supported sites only in the full description, factually, and never in a frame, the title or the short description."
    },
    {
      "h": "Frame the device captures",
      "html": "The dossier’s captures are 720 × 1600 (1 : 2.22), beyond Play’s 1 : 2 limit. Place each in a phone frame on a 1080 × 1920 canvas with the headline above, as every competitor does."
    },
    {
      "h": "Build the feature graphic",
      "html": "The listing needs a 1024 × 500 feature graphic and the dossier notes none exists locally. One benefit, the icon’s palette, no device imagery and no promotional wording, per Play’s guidance."
    },
    {
      "h": "Test one variable at a time",
      "html": "Hold the eight messages fixed and test light against dark canvas; then hold the canvas and test frame order (editor first against vault first). Play’s store listing experiments can run both."
    }
  ],
  "requirements": [
    "Google Play’s preview-asset guidance specifies a 512 × 512 PNG app icon and a 1024 × 500 JPEG or 24-bit PNG feature graphic. The feature graphic and landscape screenshots are distinct asset roles.",
    "Screenshots must be JPEG or 24-bit PNG with each side between 320 and 3,840 px and a long side at most twice the short side; up to eight per device type. 1080 × 1920 portrait is the recommended phone size.",
    "Google recommends keeping feature-graphic focal content away from cutoff zones and avoiding tiny details, icon duplication, device imagery and promotional wording. Several references use these treatments; observed competitor practice is not a template for compliance.",
    "Play’s intellectual-property policy bans confusing use of other companies’ brands and apps that facilitate downloading copyrighted content without authorisation. Platform logos in screenshots and “official” wording are the two most common exposures in this set."
  ],
  "scope": [
    "Snapshot collected on 17 Sep 2026 from the public Google Play listing of each app, requesting English and US listing context. The competitor set is the union of the Product Dossier’s market table (7 apps), the PlayStore Metadata tab’s competitor ranks (16) and the Features Comparison tab (16); duplicates were removed by package name, leaving 16 unique listings, ordered by installs.",
    "Original image responses were archived without redesign, cropping or recolouring. Dimensions and orientation were measured from the saved files. Asset roles follow the listing’s icon, feature-graphic and screenshot fields.",
    "For this page, screenshots were recompressed to at most 1,100 px on the long side and feature graphics to 1,024 px wide so that all 321 assets fit in one artifact. Icons are the original files. Every caption links to the full-resolution original on Google Play.",
    "Design reads describe composition, messaging and policy exposure as seen on contact sheets of each set. They assess the graphics, not the installed apps, their download success or measured conversion. Exact typefaces and experiment history cannot be established from these assets.",
    "Install brackets and ratings are the values Play returned on 17 Sep 2026. Graphics, names and brackets change; recheck listings before a new production round."
  ],
  "sources": [
    "Google. <a href=\"https://support.google.com/googleplay/android-developer/answer/9866151?hl=en\" target=\"_blank\" rel=\"noopener\">Add preview assets to showcase your app</a>. Play Console Help. Accessed 17 September 2026.",
    "Google. <a href=\"https://support.google.com/googleplay/android-developer/answer/9888072\" target=\"_blank\" rel=\"noopener\">Intellectual Property policy</a>. Play Console Help. Accessed 17 September 2026."
  ]
}
```

### research/aso-pipeline/myassets.json

```json
{
  "icon": {
    "file": "listing/icon.png",
    "src": "https://play-lh.googleusercontent.com/qLNXtLkR4z4KiAhmkwjlXx1TpuC4aaH6qsMoZgkWzjg1-ZaXUh-KMfdG1gXfayu_gkStOl6S1w4tCfe2WMPBbQ",
    "bytes": 369966
  },
  "feature": {
    "file": "listing/feature-graphic.png",
    "src": "https://play-lh.googleusercontent.com/q4weOoYNzbX0TD4RtvgBm1VsiywteBuYuZsb5Rr0JzQPEFYto2uU7Taj_ueFgCp65xXjCQ9zFHSZ9jwTq7lk8Q",
    "bytes": 315561
  },
  "screenshots": [
    {
      "file": "listing/screenshot-01.png",
      "src": "https://play-lh.googleusercontent.com/j2_25nIZRvSsEN0BlWJSIIRtIx-N1I7ugFgLUo5rDuBOnNTugt1bnMxlZt9p-RnjyAXdCFKK5KMAYzsaqTK8VA",
      "bytes": 626837
    },
    {
      "file": "listing/screenshot-02.png",
      "src": "https://play-lh.googleusercontent.com/TDaaCxqjFa48ZfwV0k4SNIeBK-v0Cwt33ue3sNB5cqdlGlK4sYIZGuNKiKX2zGtm62hpnf9h3Zmc8ajaon7LXg",
      "bytes": 668815
    },
    {
      "file": "listing/screenshot-03.png",
      "src": "https://play-lh.googleusercontent.com/iWFuKpcYqHVHeGgYoYhIrSjIrlR9FcRwAaGP1dZaP3WYRiq5zov4dfdatnjVHXoBdObNVJClXxRpLiWW2OhOTw",
      "bytes": 798268
    },
    {
      "file": "listing/screenshot-04.png",
      "src": "https://play-lh.googleusercontent.com/3n20NxyQhoOWJOgRndJyj48dCylpmBu1lIGTP9GG5lS89ovMzjfum-Ps_cLIDr_54bKevER-jTLc-Um63vy_nw",
      "bytes": 560921
    }
  ]
}
```

### research/aso-pipeline/offers.json

```json
{
  "video.downloader.videodownloader": {
    "US": {"section":false,"block":null,"flags":[]},
    "BR": {"section":false,"block":null,"flags":[]},
    "DE": {"section":false,"block":null,"flags":[]},
    "IN": {"section":false,"block":null,"flags":[]}
  },
  "com.gamma.videodownloader": {
    "US": {"section":false,"block":null,"flags":[]},
    "BR": {"section":false,"block":null,"flags":[]},
    "DE": {"section":false,"block":null,"flags":[]},
    "IN": {"section":false,"block":null,"flags":[]}
  },
  "videoplayer.videodownloader.downloader": {
    "US": {"section":false,"block":null,"flags":[]},
    "BR": {"section":false,"block":null,"flags":[]},
    "DE": {"section":false,"block":null,"flags":[]},
    "IN": {"section":false,"block":null,"flags":[]}
  },
  "instagram.video.downloader.story.saver.ig": {
    "US": {"section":false,"block":null,"flags":[]},
    "BR": {"section":false,"block":null,"flags":[]},
    "DE": {"section":false,"block":null,"flags":[]},
    "IN": {"section":false,"block":null,"flags":[]}
  },
  "instagram.video.downloader.story.saver.ig.insaver": {
    "US": {"section":false,"block":null,"flags":[]},
    "BR": {"section":false,"block":null,"flags":[]},
    "DE": {"section":false,"block":null,"flags":[]},
    "IN": {"section":false,"block":null,"flags":[]}
  },
  "hub.browser.video.downloader.saver": {
    "US": {"section":false,"block":null,"flags":[]},
    "BR": {"section":false,"block":null,"flags":[]},
    "DE": {"section":false,"block":null,"flags":[]},
    "IN": {"section":false,"block":null,"flags":[]}
  },
  "videodownloader.instagram.videosaver": {
    "US": {"section":false,"block":null,"flags":[]},
    "BR": {"section":false,"block":null,"flags":[]},
    "DE": {"section":false,"block":null,"flags":[]},
    "IN": {"section":false,"block":null,"flags":[]}
  },
  "com.videodownload.browser.videodownloader": {
    "US": {"section":false,"block":null,"flags":[]},
    "BR": {"section":false,"block":null,"flags":[]},
    "DE": {"section":false,"block":null,"flags":[]},
    "IN": {"section":false,"block":null,"flags":[]}
  },
  "downloader.video.download.free": {
    "US": {"section":false,"block":null,"flags":[]},
    "BR": {"section":false,"block":null,"flags":[]},
    "DE": {"section":false,"block":null,"flags":[]},
    "IN": {"section":false,"block":null,"flags":[]}
  },
  "instasaver.videodownloader.photodownloader.repost": {
    "US": {"section":false,"block":null,"flags":[]},
    "BR": {"section":false,"block":null,"flags":[]},
    "DE": {"section":false,"block":null,"flags":[]},
    "IN": {"section":false,"block":null,"flags":[]}
  },
  "com.allvideodownloader.hdvideodownloader.savevideos": {
    "US": {"section":false,"block":null,"flags":[]},
    "BR": {"section":false,"block":null,"flags":[]},
    "DE": {"section":false,"block":null,"flags":[]},
    "IN": {"section":false,"block":null,"flags":[]}
  },
  "allinone.videodownloader.savevideos": {
    "US": {"section":false,"block":null,"flags":[]},
    "BR": {"section":false,"block":null,"flags":[]},
    "DE": {"section":false,"block":null,"flags":[]},
    "IN": {"section":false,"block":null,"flags":[]}
  },
  "com.videosaver.savevideos.story.saverapp": {
    "US": {"section":false,"block":null,"flags":[]},
    "BR": {"section":false,"block":null,"flags":[]},
    "DE": {"section":false,"block":null,"flags":[]},
    "IN": {"section":false,"block":null,"flags":[]}
  },
  "com.videodownloder.alldownloadvideos": {
    "US": {"section":false,"block":null,"flags":[]},
    "BR": {"section":false,"block":null,"flags":[]},
    "DE": {"section":false,"block":null,"flags":[]},
    "IN": {"section":false,"block":null,"flags":[]}
  },
  "com.hdvideodownloader.downloaderapp": {
    "US": {"section":false,"block":null,"flags":[]},
    "BR": {"section":false,"block":null,"flags":[]},
    "DE": {"section":false,"block":null,"flags":[]},
    "IN": {"section":false,"block":null,"flags":[]}
  },
  "free.video.downloader.freevideodownloader2021.video.saver.videosaverlite": {
    "US": {"section":false,"block":null,"flags":[]},
    "BR": {"section":false,"block":null,"flags":[]},
    "DE": {"section":false,"block":null,"flags":[]},
    "IN": {"section":false,"block":null,"flags":[]}
  },
  "com.video.downloader.instagram.videosaver": {
    "US": {"section":false,"block":null,"flags":[]},
    "BR": {"section":false,"block":null,"flags":[]},
    "DE": {"section":false,"block":null,"flags":[]},
    "IN": {"section":false,"block":null,"flags":[]}
  }
}
```

### research/competitor-visual-memory/assets.json

```json
{
  "checkedAt": "2026-09-21",
  "source": "Public Google Play US English pages; no asset files downloaded",
  "records": [
    {
      "id": "video.downloader.videodownloader",
      "title": "Video Downloader",
      "developer": "InShot Inc.",
      "installs": "100M+",
      "rating": "4.7",
      "reviews": "2.72M",
      "portrait": 11,
      "landscape": 1,
      "square": 0,
      "note": "Mature portrait-led walkthrough with one landscape promo. Study its benefit labels, speed cue and private-video state.",
      "icon": "https://play-lh.googleusercontent.com/oju7a2AuqaQSc_l5O-2yRw8F_M0rUlHnBHjp_MqHNSAT3CXq7xbSqRVL7VSPNhMRjzaM2ft-LBoA05-q9hqmhg=w240-h480-rw",
      "shots": [
        "https://play-lh.googleusercontent.com/NSGdsgwWRfwmx4fvTHQxemryYBrNUhWqMU2V8kQsrPQ9s3Z7d_X4x1SSyYZQ4f11L2-lD-3N-X8bKzW009-G=w526-h296-rw",
        "https://play-lh.googleusercontent.com/gxUnDNwvtp0vd7HJX01UVlWG3OdKYfLHeSLUBcsRp3fe_ncRvXBTxjYs7-i19VEYvrXiqbzDDOaaXCHPoYtjxSA=w526-h296-rw",
        "https://play-lh.googleusercontent.com/WFcH-IvsVpbLiJQx1pQC0Tr147jjjJNgmwvXbfeqC8MJRDPtgb68Yr6IFA-oOlY_Psa_U_8H4_bDW-ECltzt2g=w526-h296-rw"
      ]
    },
    {
      "id": "instagram.video.downloader.story.saver.ig",
      "title": "Video downloader - Story Saver",
      "developer": "Video Downloader Story Saver",
      "installs": "50M+",
      "rating": "4.7",
      "reviews": "See Play listing",
      "portrait": 7,
      "landscape": 0,
      "square": 0,
      "note": "Portrait-only story-saving flow. Useful reference for keeping every screenshot focused on one job.",
      "icon": "https://play-lh.googleusercontent.com/TBQtIR4nBImNflXpt21UXPoOX_JykpbhIVoAjjwcJeJBVi5PKmV6_Gi4pul-aqz78ntdpUl8dvWN_yzBOvYcJA=w240-h480-rw",
      "shots": [
        "https://play-lh.googleusercontent.com/FfnMY9sP3fbYV4F1RoXhogXbDhJFz_fVSDFAIMYjb7lh5hnbTT6Xb7f_9MUtHUANxzwLHMOKoqSfkMZSZifOMiw=w526-h296-rw",
        "https://play-lh.googleusercontent.com/h0EMMiH0Y8pSs07Hc9_GTlQbfvOT_B20cd0tgQUPqVHaeoNnTlyIi4y5gOCe9pbA8NRvsgPHEaFbmIqM136n=w526-h296-rw",
        "https://play-lh.googleusercontent.com/D-OYINnka5W4ijAPRKz60xTdNFWfOHdcQOtybzrZP_aUSTMWXFMXSbwOGqimhONyW9MfTTcQx2BP39U4FN0JcR8=w526-h296-rw"
      ]
    },
    {
      "id": "instagram.video.downloader.story.saver.ig.insaver",
      "title": "InSaver: All Video Downloader",
      "developer": "Video Downloader Story Saver",
      "installs": "10M+",
      "rating": "4.7",
      "reviews": "See Play listing",
      "portrait": 7,
      "landscape": 0,
      "square": 0,
      "note": "Portrait-only feature sequence. Compare its tighter art direction with the sibling story-saver listing.",
      "icon": "https://play-lh.googleusercontent.com/Gxa3y2D4_k3xVRi4GcEoCz2VOJodVWgcLdCyUQY67w6_bier_KwRrqxVtGauUlciDHRfVdSgh3VO7UPAo7sS=w240-h480-rw",
      "shots": [
        "https://play-lh.googleusercontent.com/EJJGQ0VKtrjO-ZIjF9_T4g6INHFpPUYBsGXGPnxD9hDsJyHXxZOUoi3j3mIAxJqXLWhW0b40UNwi25pqB6CiAkE=w526-h296-rw",
        "https://play-lh.googleusercontent.com/YBRzMwVxKSM2fZQRcmBx_dD_NhZ7O8qXN38lpuWBI1NyKDdIeO13XMc9ti61N6Utcp3H1tR5wFYF_0GXZqG80w=w526-h296-rw",
        "https://play-lh.googleusercontent.com/98xatWrG5bp7YKrJa-fRtUl0An0LnhxthLRpwGG2n0j0zH1cxNX--wUjecRmEM8yuxs8hpcPKEzpJo_xOOzCvg=w526-h296-rw"
      ]
    },
    {
      "id": "com.gamma.videodownloader",
      "title": "Video Downloader - without ads",
      "developer": "Gamma Play",
      "installs": "100K+",
      "rating": "4.6",
      "reviews": "3.82K",
      "portrait": 7,
      "landscape": 0,
      "square": 0,
      "note": "Portrait-only product flow. Its no-ads positioning is a useful messaging contrast, not a claim to copy.",
      "icon": "https://play-lh.googleusercontent.com/KiAC3jnKeFH62hvzAekaT03wYxAPL7tIfqsBBgqHWz1j0Ll5rRdI_rcO0iiSS_VVllIpsu6uGkMFE4-eJNMwsw=w240-h480-rw",
      "shots": [
        "https://play-lh.googleusercontent.com/oYsZpI4a3bXy5PbjVvfXCNfa9uvjpRSzMPr6iHvCAs4Fcw8jisHC7JG--wymBT16ilE48aawj91WqS2L5oSiQQ=w526-h296-rw",
        "https://play-lh.googleusercontent.com/2wyStNfqs-_WeoJN3myADhm2536ljQO1XfJTADIb2fti1C66_Ia8eDkdA36tphFW_oZArzXX1oAorvH9GQcRNQ=w526-h296-rw",
        "https://play-lh.googleusercontent.com/PHM_AsD1T-vmvI1t2QmItglgPnyxKaFJKfqctNHBhql_XxeUo_FMLMy-YC511hwkIiIajvjvXVfZeGYBa4ZdO_M=w526-h296-rw"
      ]
    },
    {
      "id": "videoplayer.videodownloader.downloader",
      "title": "All Video Downloader & Player",
      "developer": "QR Code Scanner.",
      "installs": "100M+",
      "rating": "4.5",
      "reviews": "1.89M",
      "portrait": 8,
      "landscape": 0,
      "square": 0,
      "note": "Portrait-only UI walkthrough. It represents the high-install generic downloader/player segment.",
      "icon": "https://play-lh.googleusercontent.com/4v1gAVBRKoO9aUUOhYJLY-aa8FytPXj0LRNJbV8CT743B3sajF54fcEbvQjfE6kuJrS9ddaFkbo7PDcWZ-iQBcI=w240-h480-rw",
      "shots": [
        "https://play-lh.googleusercontent.com/aX4xYn_taZd_4YZVsNwfLauu8GCvJYLhyACRLQg_NL-y5wglpBnmbaG5QmUddK08k_2YKjv-mhETraz9kqg6Tw=w526-h296-rw",
        "https://play-lh.googleusercontent.com/f4SN_7jfp2haU4WQppjFz40nxZlI-ioLEuNXOw88Ez0c0q0D2zr7w5w5rj3NAhFZkdSvXfJRCjoigMEbIOJ7SzE=w526-h296-rw",
        "https://play-lh.googleusercontent.com/ZeWwBC7stXyThNLVA6jwWJeUeBdLbNfobRp3lcMLxFXLLJd-bRUGloCHHT9E-mOaieqoBj13233uyIJ5fHcdFA=w526-h296-rw"
      ]
    },
    {
      "id": "hub.browser.video.downloader.saver",
      "title": "Hub Video Downloader",
      "developer": "DOSA Apps",
      "installs": "10M+",
      "rating": "4.4",
      "reviews": "82.5K",
      "portrait": 10,
      "landscape": 0,
      "square": 0,
      "note": "Portrait-only browser/downloader presentation; useful for showing an end-to-end workflow without switching visual systems.",
      "icon": "https://play-lh.googleusercontent.com/KM2DCIFpt8qc_1150CumeH5rXCqgABmFVXFfQwQKC8wh8V5mF05R_8QNoX_wTNIWrytBpWP9ayRJ7_ayLM6jbws=w240-h480-rw",
      "shots": [
        "https://play-lh.googleusercontent.com/afj_Z-9anpIZVKelRKnkQejs3RK4l_1nnzUSfpW48FvnMG_kx0jBVV6DMdVlZxHYjtqoE6VXUCe7uf8kgjR8tz4=w526-h296-rw",
        "https://play-lh.googleusercontent.com/VkWpMEmastGGS-Pxks4_6hCXfU9BPCx9K_dWni4WpYITCIDZgUK_32HduUK9EEbFVGPQIISkImueXHNn0zP1ajQ=w526-h296-rw",
        "https://play-lh.googleusercontent.com/DjdzA6nlXknddQAUfnT3qSLC2mXZkPIUl9Ji25aOGO_m1PrgMgBVX9QVbN4B2Gm5y-6sOfoC6fthsyMyb50R9g=w526-h296-rw"
      ]
    },
    {
      "id": "videodownloader.instagram.videosaver",
      "title": "Video Downloader & Story Saver",
      "developer": "Video Downloader & Fast Saver",
      "installs": "10M+",
      "rating": "4.8",
      "reviews": "378K",
      "portrait": 5,
      "landscape": 0,
      "square": 0,
      "note": "Portrait-only short media-saving storyboard. Good reference for concise, outcome-led frames.",
      "icon": "https://play-lh.googleusercontent.com/wLtr4WqAcE6CWJkmK7sTpBds7m8rnv3V7lEmpo0IPsknqgSaYWQvk3L8cdmyM37aDIAkGHpemmjBUdu9pPlMjQ=w240-h480-rw",
      "shots": [
        "https://play-lh.googleusercontent.com/J6pkKwqFaZOljdiVyz4-AkJJ6D9m2qHVrJR2uSicX1DbSOTwKsM-bQlwU_J1p2m9uM6Vh0fmoA6iFsrYay-BBbc=w526-h296-rw",
        "https://play-lh.googleusercontent.com/cAaZ9N7-yf5_nECpM5RMMlWE0GqubpxAUqLtNkuadd9XK_vGOoCzngfXwq3FHkO1FEYDVPzwoNqjrw-7mSJRUJ8=w526-h296-rw",
        "https://play-lh.googleusercontent.com/9cu6wZIYGYKLxLcKHWudlwxYrnLUgnluyWtuxlTLYAoE8DC9vw4ZutHHbL5vGduY6KHu-c5x-4f3pkZHhaUo=w526-h296-rw"
      ]
    },
    {
      "id": "com.videodownload.browser.videodownloader",
      "title": "All Video Downloader & Player",
      "developer": "AppTool-Browser-Video",
      "installs": "10M+",
      "rating": "4.3",
      "reviews": "66.5K",
      "portrait": 6,
      "landscape": 1,
      "square": 0,
      "note": "A mixed carousel: standard portrait walkthrough plus one landscape promo. Reference for adapting one concept across orientations.",
      "icon": "https://play-lh.googleusercontent.com/5O3gW0o1MoJbI-z7ZxbzFkip1a74LSqN6xrL9U61lTg8FVAg6YX50zVbQHis2Bi1SAHX7VJ8hq2B2K_gVo6k-aw=w240-h480-rw",
      "shots": [
        "https://play-lh.googleusercontent.com/OpcFaGD48-58GHzVcBgimTrDUCrTEmX-bHoDhsAdaR7fpQ8PT9eoz-klcKYMoKWUDA3NsezwvraO_rLhL15um2w=w526-h296-rw",
        "https://play-lh.googleusercontent.com/RF8OPAx4EWstRwWeO-ZrFe-vI2feAArSuwbDYQb3a8lvPU7z5TyasEzO-v8XJYEsjaGShsgsUvloEf1L0KyuOg=w526-h296-rw",
        "https://play-lh.googleusercontent.com/QQ_U3Wu00kgZpTmMWQDFgs0KKk2GQQ3M_23rr6sb6iTLi-XSYuSbgo1QxbnG_BqMdazsy8KGpuORrCMrU6C4l0M=w526-h296-rw"
      ]
    },
    {
      "id": "downloader.video.download.free",
      "title": "Video Downloader & Video Saver",
      "developer": "All Video Downloader, Saver & Player Studio",
      "installs": "50M+",
      "rating": "4.4",
      "reviews": "358K",
      "portrait": 12,
      "landscape": 0,
      "square": 0,
      "note": "A long portrait-first asset run; valuable for studying screenshot sequence discipline and information density.",
      "icon": "https://play-lh.googleusercontent.com/Ljy0jnX79twImhfJgIS4T2pNk_4by-em_C1r_dldfvTSbTdqqKO4PsxsezJhIZGcLAnc03l1d62QyX9FaBCy=w240-h480-rw",
      "shots": [
        "https://play-lh.googleusercontent.com/s8QjR2fsZehuTv3VNe3VQQE3fQpKzGwY-dbM4ChAaPR1D1MWxVqH8sD-_1e6SCI-v7pgvdEl47go0RIo00M6Eu0=w526-h296-rw",
        "https://play-lh.googleusercontent.com/L1NmEIiLe8rtWPooDPZaZIiVliBtDMlBZVOYRCEnPBYc0-2j8X0usZMtCgczxfS6zO3MOIxlxF2X5tq9zjs_jA=w526-h296-rw",
        "https://play-lh.googleusercontent.com/Pv2OMBDlWDNYWR3RqlxuBIVLuUzI7D5XWVc0UBZaN789D54m5cD4SBStwGVlHCbxReLVBMDtWBIw9KmhaYxzJQ=w526-h296-rw"
      ]
    },
    {
      "id": "instasaver.videodownloader.photodownloader.repost",
      "title": "All Video Downloader & Browser",
      "developer": "Fast Video Downloader & Story Saver - DevBay",
      "installs": "50M+",
      "rating": "3.9",
      "reviews": "649K",
      "portrait": 7,
      "landscape": 0,
      "square": 0,
      "note": "Portrait-only browser-led funnel. Compare its density to the lighter story saver assets.",
      "icon": "https://play-lh.googleusercontent.com/8nlpQOLVFaDrO7HjaY3k09WhRgJCVelbHF3groZbL9zj7ZaM2RRDvOeb_G6ydASZd2UAGtMoux0iZL9zemXq1Q=w240-h480-rw",
      "shots": [
        "https://play-lh.googleusercontent.com/fLJClOftqkkO9dqAvudwMP1iBF-NG0jv0DVhPnbG563BLq94xlVwX2FtFj00VsaZcX6Two7xxNQurGgEevW6oA=w526-h296-rw",
        "https://play-lh.googleusercontent.com/KB1_2FN5EwzqR34bU5fEsz7cCUgAnhIHtKSMengBToq2aF5zQ-lWY2C3ClSxrhg56cJplqM5GGIXKJRXCHa8xw=w526-h296-rw",
        "https://play-lh.googleusercontent.com/K_gM9kwcnOpvVVZeBNlJLsq_m-3s1-RApVgpxfSKwJGh8_ASHmvtIzwVfOUf_9RVKgQ5CkGDoSzkR1gzJOSJkA=w526-h296-rw"
      ]
    },
    {
      "id": "com.allvideodownloader.hdvideodownloader.savevideos",
      "title": "All Video Downloader & Saver",
      "developer": "Sky Vision Apps Lab",
      "installs": "10M+",
      "rating": "4.1",
      "reviews": "24.7K",
      "portrait": 7,
      "landscape": 0,
      "square": 0,
      "note": "Portrait-only generic downloader/saver messaging. Useful baseline for avoiding category sameness.",
      "icon": "https://play-lh.googleusercontent.com/WYDfh31pnGcXOA47UxNqxtpja_wGFI7WoCSaaJ2ds5dP26aem1U0vT0oL6UIUIAeqac26Gb72y4be9VLRDpOfQ=w240-h480-rw",
      "shots": [
        "https://play-lh.googleusercontent.com/hcyKV8VTN9lfqV1F-8eav-4FeVQrRiFg8K5Nbzi0NxpJHvZWE8OzrnDuLDLYebFjFnJQBQXqwMaQDzgXqb6J=w526-h296-rw",
        "https://play-lh.googleusercontent.com/UUPCqAJrAAajYHdRapIAu5-c4Mfcc5MLYW_c98CSASpvdgdEAh1_3rwpWspFnAs3A9URushu62VocmxIXtZ4=w526-h296-rw",
        "https://play-lh.googleusercontent.com/DNu3H-FPml2vRXNenl1EJQT7xe8ysQL4X0-FhF-_PzNOKeqsk9ZblE9cG8gVgRDczTsnMJAmQjoCQBn3khtD7w=w526-h296-rw"
      ]
    },
    {
      "id": "allinone.videodownloader.savevideos",
      "title": "All video downloader and saver",
      "developer": "Attractive Apps Valley",
      "installs": "10M+",
      "rating": "4.0",
      "reviews": "23.5K",
      "portrait": 6,
      "landscape": 0,
      "square": 0,
      "note": "Portrait-only multi-purpose saver sequence. Reference for combining several use cases without a separate landscape board.",
      "icon": "https://play-lh.googleusercontent.com/N77NqpfhamAt-kjsqbI-JkmYQRjUiHUFuyArYqEBGAwPOR_8NMHXgJlrcr5HQSTLilOfWqGt83J_ihpnPWExILI=w240-h480-rw",
      "shots": [
        "https://play-lh.googleusercontent.com/uxK7mKZUTzy45V1_Lz-Dg7Ipwf8NzE4jQr_dIedo043xckmst0ism4hXlE1MzF7oKzGe38FxZyKxM2Fepz36=w526-h296-rw",
        "https://play-lh.googleusercontent.com/U_ZMWxVaNm339SvHpDwBY-dYD0-ONmwU7F32ITsvEO-q9ZasUJhSnJQBGGhbkDNGi8E9AYH1_ySFqTY_V0Wr=w526-h296-rw",
        "https://play-lh.googleusercontent.com/QOfY8a2u8I6sGDfyJS5xxn5LV62PvYbfNtRsFcgGPcsr738FAqpnicENhAGBuOq44x0U9ZmaAWvEpJYfpx59=w526-h296-rw"
      ]
    },
    {
      "id": "com.videosaver.savevideos.story.saverapp",
      "title": "Video Downloader & Save Video",
      "developer": "Markhoor Studio",
      "installs": "10M+",
      "rating": "4.0",
      "reviews": "9.72K",
      "portrait": 12,
      "landscape": 0,
      "square": 0,
      "note": "A long portrait-only gallery. Good comparator for visual repetition and feature order.",
      "icon": "https://play-lh.googleusercontent.com/PwdmwGsCYAewdUgshkWt8fMbOfYPOszRT-L7k0NunbyBL0UU_iPQsPkxEvgLOMHh1KC1SEjqW4Iys1ib9rQOPNk=w240-h480-rw",
      "shots": [
        "https://play-lh.googleusercontent.com/WTs1fV9jbtCTuWkWSzeFoH-YDL3FFGy4_Y0JaxClW059YEGFjnZRzkNsGoEXXX73RQPIQoUiCHFSpyGvlUCHYtI=w526-h296-rw",
        "https://play-lh.googleusercontent.com/mxiKrmMB_C34OwHo6aebNbUIM3gxuaQrd7cKlOATG6so5Fds6DnIYbmTSsgA9zlevRLkC2003XpwIHlW24aW0w=w526-h296-rw",
        "https://play-lh.googleusercontent.com/6CKhIJp4Lf3uqGBXENMI1OsjQL0_7bnUkZ3LXqhjfbIU0MpRrOUVbujO4Zh5a83vLfNw-8SShQYQ1Q022CA0Vg=w526-h296-rw"
      ]
    },
    {
      "id": "com.videodownloder.alldownloadvideos",
      "title": "Video Downloader",
      "developer": "Mobile Notepad Apps",
      "installs": "5M+",
      "rating": "3.8",
      "reviews": "7.47K",
      "portrait": 8,
      "landscape": 0,
      "square": 0,
      "note": "Portrait-only asset list. Use as a lower-scale comparison for clean feature separation.",
      "icon": "https://play-lh.googleusercontent.com/gUlLctSBw65S29hN4PVjRgblYBI40x4HYw5hjwGYp75c34jL_d9yUoD1OqrPmsYtvKIfCcbZN_YQMuXxrHNq=w240-h480-rw",
      "shots": [
        "https://play-lh.googleusercontent.com/7CDQaUcBx-kBNUKxJEYmrYX977DxE77iKvTQDO5siBNkfIVz7wMoZSQXZZnndHA0F7D40bPOrBbeiw1XkeR9=w526-h296-rw",
        "https://play-lh.googleusercontent.com/bdQutHXHv_72AO7j0ITmUKdv0Fw0Gf-NEwVjQfNW1nTC7cvfNw7m7ScfNTuv7u0Me8egoEOJxVUky4zFkAL0Q3s=w526-h296-rw",
        "https://play-lh.googleusercontent.com/kYRtECXa0V-IoPNv-Oxa_2VXeKAsyuQw8qwVCz1vinb48DvxHZ8VEgwUichcS7XQ-rnAhGyUxdPbxRAJv8VdA4A=w526-h296-rw"
      ]
    },
    {
      "id": "com.hdvideodownloader.downloaderapp",
      "title": "Video Downloader HD - Vidow",
      "developer": "Vidow™",
      "installs": "100M+",
      "rating": "4.0",
      "reviews": "335K",
      "portrait": 6,
      "landscape": 0,
      "square": 0,
      "note": "Portrait-only HD-focused sequence. Its reach makes it useful for title, icon, and screenshot competitiveness review.",
      "icon": "https://play-lh.googleusercontent.com/uFifs8KnukfNhGtIVf3NVSy2x6_pV3J_wkx5Uo1h5YxooDGn5mrUxaDFrRlbBDvKhv9CisADZ7ksZeH0M9OaHw=w240-h480-rw",
      "shots": [
        "https://play-lh.googleusercontent.com/4Xv2pwHlA0d624K_iI5mt1xV_vicz4-Rw6GoMY-2_GF-wmFlAOuUCjP4FWF9qEbX-pp0kosADqBIQ69DlrxOSw=w526-h296-rw",
        "https://play-lh.googleusercontent.com/OuwWTU3ash0ZQ7m6Ca8kp5IEpp4HJrJ2N-lLRuWJclj6ik-QvRCWE-rVuV0SjTdOkrV8IH4hlF0SZnderf4b=w526-h296-rw",
        "https://play-lh.googleusercontent.com/PuOBAJh-w1CTXtW359PFIcxTbS247a5SXgHobKHPs4pEGGdMiGm9xj5Cmn4xsFAo6rWgPIHWq3xJeDj91QUo=w526-h296-rw"
      ]
    },
    {
      "id": "free.video.downloader.freevideodownloader2021.video.saver.videosaverlite",
      "title": "Video Downloader and 4k Player",
      "developer": "Vidpal Apps Studio",
      "installs": "50M+",
      "rating": "4.3",
      "reviews": "403K",
      "portrait": 8,
      "landscape": 0,
      "square": 4,
      "note": "Mixed square and portrait screenshots, with no observed landscape board. Useful for testing how framing changes visual emphasis.",
      "icon": "https://play-lh.googleusercontent.com/-WK5MPf7RSP-MV6t_a5WJw9RGoPPuGOW6U1FVYXLtNPdwESR7Gi6HGKQKtsrhYxw1eHkgRfgBSYqCmPC5UbF=w240-h480-rw",
      "shots": [
        "https://play-lh.googleusercontent.com/-t92Hr0lKXo9B7nmBbUKNIclTQ1rZY2GHK6-X21yz65hIdpQlN1WoVarWAjUKswMrmExy8qeV_V9RpvA89mVAg=w526-h296-rw",
        "https://play-lh.googleusercontent.com/fwrYux1igU4tWRw9CdApr-jix2D08oUmmoO92PHegbqV0AI63zd2MobErNHhvu5NPs0aPubXLeqOn_aWXqVrilU=w526-h296-rw",
        "https://play-lh.googleusercontent.com/D2Jt5zosr9Xcd8HQ-7fiK7W1r1rKqO_MNEJ4dQPzVF85fw_35gZ3gBGIgGWQPnckm3H1AKXguZ71kA6XGpUK5EM=w526-h296-rw"
      ]
    }
  ]
}
```

### research/tiksta-title-check/pc.json

```json
{
  "collectedAt": "2026-09-16T11:41:23.7794628Z",
  "queries": [
    "reels downloader", "reels video downloader", "reels saver", "video downloader for reels", "insta downloader", "insta saver", "tiktok downloader",
    "tik tok video downloader", "video downloader for tiktok", "instagram downloader", "video downloader for instagram", "tiksta",
    "reels downloader app", "social video downloader", "private video downloader", "save video"
  ],
  "apps": 143,
  "terms": [
    {
      "key": "reels",
      "label": "Reels / Reel",
      "n": 22,
      "m1": 1,
      "y2": 6,
      "both": 1,
      "ex": [
        {"t":"Story Saver & Reels Downloader","b":"1M+","d":"PinKaal","f":"2024-03-16"},
        {"t":"Copy Caption Reels Downloader","b":"50K+","d":"Infast Video Downloader & Story Saver","f":"2023-05-02"},
        {"t":"All Video Downloader & Reels","b":"50K+","d":"Nubivio Apps","f":"2026-07-23"},
        {"t":"Reels Downloader","b":"50K+","d":"MobileByteSensei","f":"2025-02-24"}
      ]
    },
    {
      "key": "story",
      "label": "Story (generic baseline)",
      "n": 18,
      "m1": 7,
      "y2": 11,
      "both": 7,
      "ex": [
        {"t":"Video downloader - Story Saver","b":"50M+","d":"Video Downloader Story Saver","f":"2023-10-13"},
        {"t":"Video Downloader : Story Saver","b":"10M+","d":"Video Downloader & Photo Downloader & Saver","f":"2020-12-07"},
        {"t":"Video Downloader & Story Saver","b":"10M+","d":"Video Downloader & Fast Saver","f":"2024-03-28"},
        {"t":"Story Saver - Video Downloader","b":"5M+","d":"Story Saver&Video Downloader","f":"2023-02-09"}
      ]
    },
    {
      "key": "tik",
      "label": "Tik- prefix (the Tiksta name)",
      "n": 8,
      "m1": 3,
      "y2": 7,
      "both": 3,
      "ex": [
        {"t":"TikBoost - Followers & Likes","b":"1M+","d":"Stix LLC","f":"2021-08-12"},
        {"t":"TikMate: Download No Watermark","b":"1M+","d":"Video Downloader & Voice Translator & Story Saver","f":"2023-12-13"},
        {"t":"HD Tik Downloader No Watermark","b":"1M+","d":"TapGap Studio","f":"2022-11-20"},
        {"t":"Tikget - Video Downloader","b":"500K+","d":"Spaple","f":"2023-08-16"}
      ]
    },
    {
      "key": "insta",
      "label": "Insta",
      "n": 4,
      "m1": 0,
      "y2": 0,
      "both": 0,
      "ex": [
        {"t":"Insta Saver - Video Downloader","b":"1K+","d":"India apps","f":"2026-07-14"},
        {"t":"Reels Downloader | Insta Saver","b":"1K+","d":"Code Multiverse","f":"2026-04-18"},
        {"t":"Insta Reel Download & Organize","b":"100+","d":"Lan Apps","f":"2026-07-26"},
        {"t":"Insta Saver: Reel Downloader","b":"0+","d":"Jawad108","f":"2026-09-11"}
      ]
    },
    {
      "key": "tiktok",
      "label": "TikTok",
      "n": 4,
      "m1": 1,
      "y2": 2,
      "both": 1,
      "ex": [
        {"t":"Downloader for TikTok","b":"10M+","d":"application.development.studio","f":"2019-02-22"},
        {"t":"TikVid - TikTok Downloader","b":"100K+","d":"MobilesWorld","f":"2023-06-04"},
        {"t":"Video Downloader For Tiktok","b":"10K+","d":"IFM Project","f":"2025-06-15"},
        {"t":"Video Downloader for TikTok","b":"100+","d":"Vd Brains","f":"2026-06-15"}
      ]
    },
    {
      "key": "instagram",
      "label": "Instagram",
      "n": 3,
      "m1": 0,
      "y2": 2,
      "both": 0,
      "ex": [
        {"t":"Video Downloader for Instagram","b":"10K+","d":"Bytecode.one","f":"2024-08-21"},
        {"t":"Instagram Video Downloader","b":"10K+","d":"Nazar Tech","f":"2026-07-05"},
        {"t":"Video Downloader for Instagram","b":"1K+","d":"Hanif Abuvani","f":"2020-01-28"}
      ]
    }
  ],
  "serp": [
    {"t":"InSaver: All Video Downloader","b":"10M+","f":"2024-05-29","has":false},
    {"t":"Video downloader - Story Saver","b":"50M+","f":"2023-10-13","has":false},
    {"t":"Reels Downloader","b":"50K+","f":"2025-02-24","has":true},
    {"t":"Video Downloader","b":"100M+","f":"2018-03-16","has":false},
    {"t":"ReelSave - Reels Downloader","b":"1K+","f":"2026-09-03","has":true},
    {"t":"SaveReels - Reels Downloader","b":"1K+","f":"2026-05-08","has":true},
    {"t":"Video Downloader & Story Saver","b":"10M+","f":"2024-03-28","has":false},
    {"t":"Reel Saver - Video Downloader","b":"5K+","f":"2026-06-26","has":true},
    {"t":"iReels Save – Reels Downloader","b":"100+","f":"2026-04-04","has":true},
    {"t":"Social Video Downloader","b":"100K+","f":"2024-04-13","has":false}
  ],
  "tikstaSerp": [
    "TikTok - Videos, Shop & LIVE", "TkStar - Followers Likes Views", "TikTok Lite - Faster TikTok", "TikBoost - Followers & Likes", "TikTok Studio",
    "TikTok Pro - Events", "TickTick:To Do List & Calendar", "FanTick - Real Followers Likes", "TikBooster - Followers & Likes",
    "TickViral Gain Likes Followers"
  ],
  "tikstaNamed": 0
}
```

### research/tiksta-title-check/tiksta-long.txt

```text
Tiksta is a reels downloader and social video downloader in one fast app. Copy the link of a reel, a story or any public video, paste it into Tiksta and save video files straight to your phone in HD.

Download video from link in one tap, or share the link into the app. Built as an online video downloader for Android, Tiksta is also a private video downloader and video saver: keep downloads in a locked vault, watch them offline or cut them with the built-in editor.

SAVE REELS AND VIDEOS
• Paste a link or share it into Tiksta to download videos and reels
• Video downloader browser: open a page and Tiksta finds the video
• Choose the quality before you save, from HD 720p to smaller files
• Photo downloader too: saves every photo and video in a multi-item post
• Download several videos at once with pause, resume and retry
• Downloads keep running in the background, even for large files

REEL SAVER, STORY SAVER AND STATUS SAVER
• A story saver app for stories you are allowed to keep
• A status saver app for statuses shared with you, including business accounts
• Every download is filed in its own folder by source

HD VIDEO PLAYER AND DOWNLOAD MANAGER
• An all video downloader and player for everything you save
• Offline video player: watch saved videos without a connection
• Download manager to rename, share, delete or favourite any file

VIDEO DOWNLOADER WITH EDITOR
• Video cutter and video trimmer: trim the start, middle or end
• Video merger: split clips or join them into one
• Crop video and change the aspect ratio with a colour or blur fill
• Add music to video, or extract audio from video as MP3
• Filters, effects, speed and volume controls
• Watermark video with an image or styled text
• Video compressor: cut and compress files to save space

PRIVATE VIDEO VAULT
• Video locker with a 4-digit PIN for videos, pictures and audio
• Hide videos, unlock with your fingerprint and reset the PIN with a security question
• Private downloads stay out of your gallery

MADE FOR EVERYONE
• 9 languages, with right-to-left layouts for Urdu and Arabic
• A fast video downloader with dark mode and a clean, simple design

HOW TO DOWNLOAD REELS AND VIDEOS
1. Copy the link of a reel or video you have permission to save.
2. Open Tiksta and paste the link, or share the link into the app.
3. Pick the quality and tap Download.
4. Watch the video, cut it or move it to the vault.

QUESTIONS PEOPLE ASK
Where are my downloads saved? In Tiksta, sorted into a folder for each source. Move any video to the vault in one tap.
Will a large download stop if I leave the app? No. Downloads keep running in the background and resume after a network drop.
What does Premium change? Premium removes all ads, including the one shown before a download. Quality and speed stay the same.

IMPORTANT
Download only videos you own, videos in the public domain, or videos the owner lets you save. Please respect copyright.
Tiksta is an independent app and is not affiliated with, endorsed by or sponsored by any social media platform.
```

## Large data files (structure in the research index)

- [research/aso-pipeline/data.json](../../research/aso-pipeline/data.json) · 283 KB
- [research/aso-pipeline/discover.json](../../research/aso-pipeline/discover.json) · 160 KB
- [research/aso-pipeline/dossier-parts.json](../../research/aso-pipeline/dossier-parts.json) · 94 KB
- [research/aso-pipeline/graphics-manifest.json](../../research/aso-pipeline/graphics-manifest.json) · 159 KB
- [research/aso-pipeline/graphics-src.json](../../research/aso-pipeline/graphics-src.json) · 72 KB
- [research/aso-pipeline/raw.json](../../research/aso-pipeline/raw.json) · 2862 KB
- [research/tiksta-title-check/payload.json](../../research/tiksta-title-check/payload.json) · 301 KB
- [research/tiksta-title-check/playcheck.json](../../research/tiksta-title-check/playcheck.json) · 113 KB

Raw response caches (not listed file by file): `research/aso-pipeline/cache/`.
