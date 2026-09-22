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
