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
