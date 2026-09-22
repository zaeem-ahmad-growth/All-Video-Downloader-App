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
