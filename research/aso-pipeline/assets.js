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
