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
