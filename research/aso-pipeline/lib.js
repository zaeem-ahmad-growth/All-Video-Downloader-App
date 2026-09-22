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
