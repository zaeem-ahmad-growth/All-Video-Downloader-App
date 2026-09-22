# Research index

> **Generated file: do not edit by hand.** Produced by `node tools/export-docs.js` (GitHub runs it after every push). Every file in [research/](../research/), folder by folder: what each script does and which files it reads and writes, the structure of each data file, and the full text of short notes. Reports saved as PDF, Word or RTF have a Markdown text version next to them. The hand-written overview of the studies is [research/README.md](../research/README.md).

## research/

1 files · 3 KB

- **[README.md](../research/README.md)** · 3 KB · Markdown: “Research data”, “aso-pipeline/”, “tiksta-title-check/”, “Kept out on purpose”

## research/aso-pipeline/

24 files · 3.8 MB

- **[analyze.js](../research/aso-pipeline/analyze.js)** · 11 KB · Node script, 148 lines. Analysis for the video downloader study: classify apps, score keywords, competitor ranks, listing feature claims → data.json Reads `raw.json`; writes `data.json`.
- **[assets.js](../research/aso-pipeline/assets.js)** · 3 KB · Node script, 45 lines. Real events/offers check on raw listing HTML (US + 3 markets) and download of our listing assets. Reads `raw.json`; writes `offers.json`, `myassets.json`.
- **[batch1.txt](../research/aso-pipeline/batch1.txt)** · 8 KB · first lines:

  ```text
  {"path":"graphics/01-qr-code-scanner/feature-graphic-01.jpg"},{"path":"graphics/01-qr-code-scanner/icon-01.png"},{"path":"graphics/01-qr-code-scanner/screenshot-01.jpg"},{"path":"graphics/01-qr-code-scanner/screenshot-02.jpg"},{"path":"graphics/01-qr-code-scanner/screenshot-03.jpg"},{"path":"graphics/01-qr-code-scanner/screenshot-04.jpg"},{"path":"graphics/01-qr-code-scanner/screenshot-05.jpg"},{"path":"graphics/01-qr-code-scanner/screenshot-06.jpg"},{"path":"graphics/01-qr-code-scanner/screenshot-07.jpg"},{"path":"graphics/01-qr-code-scanner/screenshot-08.jpg"},{"path":"graphics/02-inshot/feature-graphic-01.jpg"},{"path":"graphics/02-inshot/icon-01.png"},{"path":"graphics/02-inshot/screenshot-01.jpg"},{"path":"graphics/02-inshot/screenshot-02.jpg"},{"path":"graphics/02-inshot/screenshot-03.jpg"},{"path":"graphics/02-inshot/screenshot-04.jpg"},{"path":"graphics/02-inshot/screenshot-05.jpg"},{"path":"graphics/02-inshot/screenshot-06.jpg"},{"path":"graphics/02-inshot/screenshot-07.jpg"},{"path":"graphics/02-inshot/screenshot-08.jpg"},{"path":"graphics/02-inshot/screenshot-09.jpg"},{"path":"graphics/02-inshot/screenshot-10.jpg"},{"path":"graphics/02-inshot/screenshot-11.jpg"},{"path":"graphics/02-inshot/screenshot-12.jpg"},{"path":"graphics/02-inshot/screenshot-13.jpg"},{"path":"graphics/02-inshot/screenshot-14.jpg"},{"path":"graphics/02-inshot/screenshot-15.jpg"},{"path":"graphics/02-inshot/screenshot-16.jpg"},{"path":"graphics/02-inshot/screenshot-17.jpg"},{"path":"graphics/03-vidow/feature-graphic-01.jpg"},{"path":"graphics/03-vidow/icon-01.png"},{"path":"graphics/03-vidow/screenshot-01.jpg"},{"path":"graphics/03-vidow/screenshot-02.jpg"},{"path":"graphics/03-vidow/screenshot-03.jpg"},{"path":"graphics/03-vidow/screenshot-04.jpg"},{"path":"graphics/03-vidow/screenshot-05.jpg"},{"path":"graphics/03-vidow/screenshot-06.jpg"},{"path":"graphics/03-vidow/screenshot-07.jpg"},{"path":"graphics/03-vidow/screenshot-08.jpg"},{"path":"graphics/03-vidow/screenshot-09.jpg"},{"path":"graphics/03-vidow/screenshot-10.jpg"},{"path":"graphics/03-vidow/screenshot-11.jpg"},{"path":"graphics/03-vidow/screenshot-12.jpg"},{"path":"graphics/03-vidow/screenshot-13.jpg"},{"path":"graphics/03-vidow/screenshot-14.jpg"},{"path":"graphics/03-vidow/screenshot-15.jpg"},{"path":"graphics/03-vidow/screenshot-16.jpg"},{"path":"graphics/03-vidow/screenshot-17.jpg"},{"path":"graphics/03-vidow/screenshot-18.jpg"},{"path":"graphics/04-vidpal/feature-graphic-01.jpg"},{"path":"graphics/04-vidpal/icon-01.png"},{"path":"graphics/04-vidpal/screenshot-01.jpg"},{"path":"graphics/04-vidpal/screenshot-02.jpg"},{"path":"graphics/04-vidpal/screenshot-03.jpg"},{"path":"graphics/04-vidpal/screenshot-04.jpg"},{"path":"graphics/04-vidpal/screenshot-05.jpg"},{"path":"graphics/04-vidpal/screenshot-06.jpg"},{"path":"graphics/04-vidpal/screenshot-07.jpg"},{"path":"graphics/04-vidpal/screenshot-08.jpg"},{"path":"graphics/04-vidpal/screenshot-09.jpg"},{"path":"graphics/04-vidpal/screenshot-10.jpg"},{"path":"graphics/04-vidpal/screenshot-11.jpg"},{"path":"graphics/04-vidpal/screenshot-12.jpg"},{"path":"graphics/04-vidpal/screenshot-13.jpg"},{"path":"graphics/04-vidpal/screenshot-14.jpg"},{"path":"graphics/04-vidpal/screenshot-15.jpg"},{"path":"graphics/04-vidpal/screenshot-16.jpg"},{"path":"graphics/04-vidpal/screenshot-17.jpg"},{"path":"graphics/04-vidpal/screenshot-18.jpg"},{"path":"graphics/04-vidpal/screenshot-19.jpg"},{"path":"graphics/04-vidpal/screenshot-20.jpg"},{"path":"graphics/04-vidpal/screenshot-21.jpg"},{"path":"graphics/04-vidpal/screenshot-22.jpg"},{"path":"graphics/04-vidpal/screenshot-23.jpg"},{"path":"graphics/04-vidpal/screenshot-24.jpg"},{"path":"graphics/04-vidpal/screenshot-25.jpg"},{"path":"graphics/04-vidpal/screenshot-26.jpg"},{"path":"graphics/04-vidpal/screenshot-27.jpg"},{"path":"graphics/04-vidpal/screenshot-28.jpg"},{"path":"graphics/04-vidpal/screenshot-29.jpg"},{"path":"graphics/04-vidpal/screenshot-30.jpg"},{"path":"graphics/04-vidpal/screenshot-31.jpg"},{"path":"graphics/04-vidpal/screenshot-32.jpg"},{"path":"graphics/04-vidpal/screenshot-33.jpg"},{"path":"graphics/04-vidpal/screenshot-34.jpg"},{"path":"graphics/04-vidpal/screenshot-35.jpg"},{"path":"graphics/05-devbay/feature-graphic-01.jpg"},{"path":"graphics/05-devbay/icon-01.png"},{"path":"graphics/05-devbay/screenshot-01.jpg"},{"path":"graphics/05-devbay/screenshot-02.jpg"},{"path":"graphics/05-devbay/screenshot-03.jpg"},{"path":"graphics/05-devbay/screenshot-04.jpg"},{"path":"graphics/05-devbay/screenshot-05.jpg"},{"path":"graphics/05-devbay/screenshot-06.jpg"},{"path":"graphics/05-devbay/screenshot-07.jpg"},{"path":"graphics/05-devbay/screenshot-08.jpg"},{"path":"graphics/05-devbay/screenshot-09.jpg"},{"path":"graphics/05-devbay/screenshot-10.jpg"},{"path":"graphics/05-devbay/screenshot-11.jpg"},{"path":"graphics/05-devbay/screenshot-12.jpg"},{"path":"graphics/05-devbay/screenshot-13.jpg"},{"path":"graphics/05-devbay/screenshot-14.jpg"},{"path":"graphics/05-devbay/screenshot-15.jpg"},{"path":"graphics/05-devbay/screenshot-16.jpg"},{"path":"graphics/05-devbay/screenshot-17.jpg"},{"path":"graphics/05-devbay/screenshot-18.jpg"},{"path":"graphics/05-devbay/screenshot-19.jpg"},{"path":"graphics/05-devbay/screenshot-20.jpg"},{"path":"graphics/05-devbay/screenshot-21.jpg"},{"path":"graphics/06-story-saver/feature-graphic-01.jpg"},{"path":"graphics/06-story-saver/icon-01.jpg"},{"path":"graphics/06-story-saver/screenshot-01.jpg"},{"path":"graphics/06-story-saver/screenshot-02.jpg"},{"path":"graphics/06-story-saver/screenshot-03.jpg"},{"path":"graphics/06-story-saver/screenshot-04.jpg"},{"path":"graphics/06-story-saver/screenshot-05.jpg"},{"path":"graphics/06-story-saver/screenshot-06.jpg"},{"path":"graphics/07-saver-player-studio/feature-graphic-01.jpg"},{"path":"graphics/07-saver-player-studio/icon-01.jpg"},{"path":"graphics/07-saver-player-studio/screenshot-01.jpg"},{"path":"graphics/07-saver-player-studio/screenshot-02.jpg"},{"path":"graphics/07-saver-player-studio/screenshot-03.jpg"},{"path":"graphics/07-saver-player-studio/screenshot-04.jpg"},{"path":"graphics/07-saver-player-studio/screenshot-05.jpg"},{"path":"graphics/07-saver-player-studio/screenshot-06.jpg"},{"path":"graphics/07-saver-player-studio/screenshot-07.jpg"},{"path":"graphics/07-saver-player-studio/screenshot-08.jpg"},{"path":"graphics/07-saver-player-studio/screenshot-09.jpg"},{"path":"graphics/07-saver-player-studio/screenshot-10.jpg"},{"path":"graphics/07-saver-player-studio/screenshot-11.jpg"},{"path":"graphics/07-saver-player-studio/screenshot-12.jpg"},{"path":"graphics/07-saver-player-studio/screenshot-13.jpg"},{"path":"graphics/07-saver-player-studio/screenshot-14.jpg"},{"path":"graphics/07-saver-player-studio/screenshot-15.jpg"},{"path":"graphics/07-saver-player-studio/screenshot-16.jpg"},{"path":"graphics/07-saver-player-studio/screenshot-17.jpg"},{"path":"graphics/07-saver-player-studio/screenshot-18.jpg"},{"path":"graphics/07-saver-player-studio/screenshot-19.jpg"},{"path":"graphics/07-saver-player-studio/screenshot-20.jpg"},{"path":"graphics/07-saver-player-studio/screenshot-21.jpg"},{"path":"graphics/08-attractive-apps/feature-graphic-01.jpg"},{"path":"graphics/08-attractive-apps/icon-01.png"},{"path":"graphics/08-attractive-apps/screenshot-01.jpg"},{"path":"graphics/08-attractive-apps/screenshot-02.jpg"},{"path":"graphics/08-attractive-apps/screenshot-03.jpg"},{"path":"graphics/08-attractive-apps/screenshot-04.jpg"},{"path":"graphics/08-attractive-apps/screenshot-05.jpg"},{"path":"graphics/08-attractive-apps/screenshot-06.jpg"},{"path":"graphics/08-attractive-apps/screenshot-07.jpg"},{"path":"graphics/08-attractive-apps/screenshot-08.jpg"},{"path":"graphics/08-attractive-apps/screenshot-09.jpg"},{"path":"graphics/08-attractive-apps/screenshot-10.jpg"},{"path":"graphics/08-attractive-apps/screenshot-11.jpg"},{"path":"graphics/08-attractive-apps/screenshot-12.jpg"},{"path":"graphics/08-attractive-apps/screenshot-13.jpg"},{"path":"graphics/08-attractive-apps/screenshot-14.jpg"},{"path":"graphics/08-attractive-apps/screenshot-15.jpg"},{"path":"graphics/08-attractive-apps/screenshot-16.jpg"},{"path":"graphics/08-attractive-apps/screenshot-17.jpg"},{"path":"graphics/08-attractive-apps/screenshot-18.jpg"}
  
  ```
- **[batch2.txt](../research/aso-pipeline/batch2.txt)** · 8 KB · first lines:

  ```text
  {"path":"graphics/09-fast-saver/feature-graphic-01.jpg"},{"path":"graphics/09-fast-saver/icon-01.png"},{"path":"graphics/09-fast-saver/screenshot-01.jpg"},{"path":"graphics/09-fast-saver/screenshot-02.jpg"},{"path":"graphics/09-fast-saver/screenshot-03.jpg"},{"path":"graphics/09-fast-saver/screenshot-04.jpg"},{"path":"graphics/09-fast-saver/screenshot-05.jpg"},{"path":"graphics/10-sky-vision/feature-graphic-01.jpg"},{"path":"graphics/10-sky-vision/icon-01.png"},{"path":"graphics/10-sky-vision/screenshot-01.jpg"},{"path":"graphics/10-sky-vision/screenshot-02.jpg"},{"path":"graphics/10-sky-vision/screenshot-03.jpg"},{"path":"graphics/10-sky-vision/screenshot-04.jpg"},{"path":"graphics/10-sky-vision/screenshot-05.jpg"},{"path":"graphics/10-sky-vision/screenshot-06.jpg"},{"path":"graphics/10-sky-vision/screenshot-07.jpg"},{"path":"graphics/10-sky-vision/screenshot-08.jpg"},{"path":"graphics/10-sky-vision/screenshot-09.jpg"},{"path":"graphics/10-sky-vision/screenshot-10.jpg"},{"path":"graphics/10-sky-vision/screenshot-11.jpg"},{"path":"graphics/10-sky-vision/screenshot-12.jpg"},{"path":"graphics/10-sky-vision/screenshot-13.jpg"},{"path":"graphics/10-sky-vision/screenshot-14.jpg"},{"path":"graphics/10-sky-vision/screenshot-15.jpg"},{"path":"graphics/10-sky-vision/screenshot-16.jpg"},{"path":"graphics/10-sky-vision/screenshot-17.jpg"},{"path":"graphics/10-sky-vision/screenshot-18.jpg"},{"path":"graphics/10-sky-vision/screenshot-19.jpg"},{"path":"graphics/10-sky-vision/screenshot-20.jpg"},{"path":"graphics/10-sky-vision/screenshot-21.jpg"},{"path":"graphics/11-apptool/feature-graphic-01.jpg"},{"path":"graphics/11-apptool/icon-01.png"},{"path":"graphics/11-apptool/screenshot-01.jpg"},{"path":"graphics/11-apptool/screenshot-02.jpg"},{"path":"graphics/11-apptool/screenshot-03.jpg"},{"path":"graphics/11-apptool/screenshot-04.jpg"},{"path":"graphics/11-apptool/screenshot-05.jpg"},{"path":"graphics/11-apptool/screenshot-06.jpg"},{"path":"graphics/11-apptool/screenshot-07.jpg"},{"path":"graphics/12-hub-dosa/feature-graphic-01.jpg"},{"path":"graphics/12-hub-dosa/icon-01.png"},{"path":"graphics/12-hub-dosa/screenshot-01.jpg"},{"path":"graphics/12-hub-dosa/screenshot-02.jpg"},{"path":"graphics/12-hub-dosa/screenshot-03.jpg"},{"path":"graphics/12-hub-dosa/screenshot-04.jpg"},{"path":"graphics/12-hub-dosa/screenshot-05.jpg"},{"path":"graphics/12-hub-dosa/screenshot-06.jpg"},{"path":"graphics/12-hub-dosa/screenshot-07.jpg"},{"path":"graphics/12-hub-dosa/screenshot-08.jpg"},{"path":"graphics/12-hub-dosa/screenshot-09.jpg"},{"path":"graphics/12-hub-dosa/screenshot-10.jpg"},{"path":"graphics/12-hub-dosa/screenshot-11.jpg"},{"path":"graphics/12-hub-dosa/screenshot-12.jpg"},{"path":"graphics/12-hub-dosa/screenshot-13.jpg"},{"path":"graphics/12-hub-dosa/screenshot-14.jpg"},{"path":"graphics/12-hub-dosa/screenshot-15.jpg"},{"path":"graphics/12-hub-dosa/screenshot-16.jpg"},{"path":"graphics/12-hub-dosa/screenshot-17.jpg"},{"path":"graphics/12-hub-dosa/screenshot-18.jpg"},{"path":"graphics/12-hub-dosa/screenshot-19.jpg"},{"path":"graphics/12-hub-dosa/screenshot-20.jpg"},{"path":"graphics/12-hub-dosa/screenshot-21.jpg"},{"path":"graphics/12-hub-dosa/screenshot-22.jpg"},{"path":"graphics/12-hub-dosa/screenshot-23.jpg"},{"path":"graphics/12-hub-dosa/screenshot-24.jpg"},{"path":"graphics/12-hub-dosa/screenshot-25.jpg"},{"path":"graphics/13-insaver/feature-graphic-01.jpg"},{"path":"graphics/13-insaver/icon-01.jpg"},{"path":"graphics/13-insaver/screenshot-01.jpg"},{"path":"graphics/13-insaver/screenshot-02.jpg"},{"path":"graphics/13-insaver/screenshot-03.jpg"},{"path":"graphics/13-insaver/screenshot-04.jpg"},{"path":"graphics/13-insaver/screenshot-05.jpg"},{"path":"graphics/13-insaver/screenshot-06.jpg"},{"path":"graphics/13-insaver/screenshot-07.jpg"},{"path":"graphics/14-markhoor/feature-graphic-01.jpg"},{"path":"graphics/14-markhoor/icon-01.jpg"},{"path":"graphics/14-markhoor/screenshot-01.jpg"},{"path":"graphics/14-markhoor/screenshot-02.jpg"},{"path":"graphics/14-markhoor/screenshot-03.jpg"},{"path":"graphics/14-markhoor/screenshot-04.jpg"},{"path":"graphics/14-markhoor/screenshot-05.jpg"},{"path":"graphics/14-markhoor/screenshot-06.jpg"},{"path":"graphics/14-markhoor/screenshot-07.jpg"},{"path":"graphics/14-markhoor/screenshot-08.jpg"},{"path":"graphics/14-markhoor/screenshot-09.jpg"},{"path":"graphics/14-markhoor/screenshot-10.jpg"},{"path":"graphics/14-markhoor/screenshot-11.jpg"},{"path":"graphics/14-markhoor/screenshot-12.jpg"},{"path":"graphics/14-markhoor/screenshot-13.jpg"},{"path":"graphics/14-markhoor/screenshot-14.jpg"},{"path":"graphics/14-markhoor/screenshot-15.jpg"},{"path":"graphics/14-markhoor/screenshot-16.jpg"},{"path":"graphics/14-markhoor/screenshot-17.jpg"},{"path":"graphics/14-markhoor/screenshot-18.jpg"},{"path":"graphics/14-markhoor/screenshot-19.jpg"},{"path":"graphics/14-markhoor/screenshot-20.jpg"},{"path":"graphics/14-markhoor/screenshot-21.jpg"},{"path":"graphics/14-markhoor/screenshot-22.jpg"},{"path":"graphics/14-markhoor/screenshot-23.jpg"},{"path":"graphics/14-markhoor/screenshot-24.jpg"},{"path":"graphics/14-markhoor/screenshot-25.jpg"},{"path":"graphics/14-markhoor/screenshot-26.jpg"},{"path":"graphics/14-markhoor/screenshot-27.jpg"},{"path":"graphics/15-mobile-notepad/feature-graphic-01.jpg"},{"path":"graphics/15-mobile-notepad/icon-01.png"},{"path":"graphics/15-mobile-notepad/screenshot-01.jpg"},{"path":"graphics/15-mobile-notepad/screenshot-02.jpg"},{"path":"graphics/15-mobile-notepad/screenshot-03.jpg"},{"path":"graphics/15-mobile-notepad/screenshot-04.jpg"},{"path":"graphics/15-mobile-notepad/screenshot-05.jpg"},{"path":"graphics/15-mobile-notepad/screenshot-06.jpg"},{"path":"graphics/15-mobile-notepad/screenshot-07.jpg"},{"path":"graphics/15-mobile-notepad/screenshot-08.jpg"},{"path":"graphics/15-mobile-notepad/screenshot-09.jpg"},{"path":"graphics/15-mobile-notepad/screenshot-10.jpg"},{"path":"graphics/15-mobile-notepad/screenshot-11.jpg"},{"path":"graphics/15-mobile-notepad/screenshot-12.jpg"},{"path":"graphics/15-mobile-notepad/screenshot-13.jpg"},{"path":"graphics/15-mobile-notepad/screenshot-14.jpg"},{"path":"graphics/15-mobile-notepad/screenshot-15.jpg"},{"path":"graphics/15-mobile-notepad/screenshot-16.jpg"},{"path":"graphics/15-mobile-notepad/screenshot-17.jpg"},{"path":"graphics/15-mobile-notepad/screenshot-18.jpg"},{"path":"graphics/15-mobile-notepad/screenshot-19.jpg"},{"path":"graphics/15-mobile-notepad/screenshot-20.jpg"},{"path":"graphics/15-mobile-notepad/screenshot-21.jpg"},{"path":"graphics/15-mobile-notepad/screenshot-22.jpg"},{"path":"graphics/15-mobile-notepad/screenshot-23.jpg"},{"path":"graphics/15-mobile-notepad/screenshot-24.jpg"},{"path":"graphics/15-mobile-notepad/screenshot-25.jpg"},{"path":"graphics/15-mobile-notepad/screenshot-26.jpg"},{"path":"graphics/15-mobile-notepad/screenshot-27.jpg"},{"path":"graphics/15-mobile-notepad/screenshot-28.jpg"},{"path":"graphics/15-mobile-notepad/screenshot-29.jpg"},{"path":"graphics/15-mobile-notepad/screenshot-30.jpg"},{"path":"graphics/15-mobile-notepad/screenshot-31.jpg"},{"path":"graphics/15-mobile-notepad/screenshot-32.jpg"},{"path":"graphics/16-gamma-play/feature-graphic-01.jpg"},{"path":"graphics/16-gamma-play/icon-01.jpg"},{"path":"graphics/16-gamma-play/screenshot-01.jpg"},{"path":"graphics/16-gamma-play/screenshot-02.jpg"},{"path":"graphics/16-gamma-play/screenshot-03.jpg"},{"path":"graphics/16-gamma-play/screenshot-04.jpg"},{"path":"graphics/16-gamma-play/screenshot-05.jpg"},{"path":"graphics/16-gamma-play/screenshot-06.jpg"},{"path":"graphics/16-gamma-play/screenshot-07.jpg"},{"path":"graphics/16-gamma-play/screenshot-08.jpg"},{"path":"graphics/16-gamma-play/screenshot-09.jpg"},{"path":"graphics/16-gamma-play/screenshot-10.jpg"},{"path":"graphics/16-gamma-play/screenshot-11.jpg"},{"path":"graphics/16-gamma-play/screenshot-12.jpg"},{"path":"graphics/16-gamma-play/screenshot-13.jpg"},{"path":"graphics/16-gamma-play/screenshot-14.jpg"},{"path":"graphics/16-gamma-play/screenshot-15.jpg"},{"path":"graphics/16-gamma-play/screenshot-16.jpg"},{"path":"graphics/16-gamma-play/screenshot-17.jpg"},{"path":"graphics/16-gamma-play/screenshot-18.jpg"},{"path":"graphics/16-gamma-play/screenshot-19.jpg"},{"path":"graphics/16-gamma-play/screenshot-20.jpg"},{"path":"graphics/16-gamma-play/screenshot-21.jpg"}
  
  ```
- **[build.js](../research/aso-pipeline/build.js)** · 9 KB · Node script, 116 lines. Build the All Video Downloader page: Cloud Storage design system + this study's tabs + the scoped Product Dossier. Reads `data.json`, `raw.json`, `offers.json`, `myassets.json`, `features.json`, `dossier-parts.json`, `graphics-manifest.json`, `graphics-notes.json`, `template.html`; writes nothing on disk.
- **[collect.js](../research/aso-pipeline/collect.js)** · 7 KB · Node script, 97 lines. Collection for the video downloader study: keyword board (US deep + 7 markets), metadata, autocomplete demand. Reads nothing on disk; writes `raw.json`.
- **[convert.ps1](../research/aso-pipeline/convert.ps1)** · 5 KB · PowerShell script, 98 lines.  Functions: `Save-Jpeg`.
- **[data.json](../research/aso-pipeline/data.json)** · 283 KB · JSON, object with 12 keys:
  - `collectedAt` · string · e.g. `"2026-09-16T11:05:37.590Z"`
  - `markets[]` · array of 8 string · e.g. `["US","BR","DE","ES"]`
  - `mineIdx` · number · e.g. `0`
  - `compIdx[]` · array of 16 number · e.g. `[1,2,3,4]`
  - `competitors[]` · array of 16 string · e.g. `["video.downloader.videodownloader","com.gamma.videodownloader","videoplayer.videodownloader.downloader","instagram.video.downloader.story.saver.ig"]`
  - `apps[]` · array of 392 records, each an array of 12 values:
    - `[0]` · string · e.g. `"com.video.downloader.instagram.videosaver"`
    - `[1]` · string · e.g. `"All Video Downloader & Saver"`
    - `[2]` · string · e.g. `"Cell Cave"`
    - `[3]` · number · e.g. `9`
    - `[4]` · null or number · e.g. `4.722918`
    - `[5]` · null or number · e.g. `2719684`
    - `[6]` · null or string · e.g. `"Mar 16, 2018"`
    - `[7]` · null or string · e.g. `"2026-08-24"`
    - `[8]` · number · e.g. `1`
    - `[9]` · string · e.g. `"downloader"`
    - `[10]` · number · e.g. `1`
    - `[11]` · string or null · e.g. `"$4.99 - $19.99 per item"`
  - `board{}` · object keyed by 8 keys (US, BR, DE, ES, IT, AU, AE, IN); each value:
    - `<key>[]` · array of 100 objects with keys `q`, `tier`, `src`, `tm`, `depth`, `ids`, `nb`, `niche`, `vol`, `entry`, `entryRank`, `demand`, `demandAt`, `comps`, `c10`, `c30`, `R`, `O`, `P`, `entryIdx`
  - `profiles[]` · array of 17 objects:
    - `id` · string · e.g. `"video.downloader.videodownloader"`
    - `idx` · number · e.g. `1`
    - `title` · string · e.g. `"Video Downloader"`
    - `titleLen` · number · e.g. `16`
    - `summary` · string · e.g. `"A Simple app to download Video & Music from the Internet."`
    - `summaryLen` · number · e.g. `57`
    - `description` · string · e.g. `"Easily download videos and music directly from the Internet onto your …"`
    - `descLen` · number · e.g. `2283`
    - `descWords` · number · e.g. `353`
    - `developer` · string · e.g. `"InShot Inc."`
    - `installs` · number · e.g. `236276464`
    - `installsLabel` · string · e.g. `"100,000,000+"`
    - `score` · number · e.g. `4.722918`
    - `ratings` · number · e.g. `2719684`
    - `released` · string · e.g. `"Mar 16, 2018"`
    - `updated` · string · e.g. `"2026-08-24"`
    - `genre` · string · e.g. `"Video Players & Editors"`
    - `ads` · number · e.g. `1`
    - `iap` · string · e.g. `"$2.99 - $6.99 per item"`
    - `video` · number · e.g. `0`
    - `shots` · number · e.g. `17`
    - `titleKw[]` · array of 2 string · e.g. `["video downloader","downloader"]`
    - `kwDens[]` · array of 4 objects with keys `q`, `n`, `d`
    - `perMarket{}` · object keyed by 8 keys (US, BR, DE, ES, IT, AU, AE, IN); each value:
      - `<key>` · object with 4 keys: `top3`, `top10`, `any`, `best`
    - `claims` · object with 12 keys: `paste`, `browser`, `quality`, `background`, `multi`, `story`, `status`, `mp3`, `private`, `editor`, `player`, `languages`
    - `mine` · boolean · e.g. `false`
  - `marketSummary[]` · array of 8 objects:
    - `gl` · string · e.g. `"US"`
    - `keywords` · number · e.g. `40`
    - `avgNonBrand` · number · e.g. `9.6`
    - `medianEntry` · number · e.g. `157368`
    - `compTop10` · number · e.g. `155`
    - `avgDepth` · number · e.g. `28.8`
    - `best[]` · array of 6 objects with keys `q`, `P`, `nb`, `entry`, `c10`, `tm`
  - `secondary[]` · array of 40 string · e.g. `["video downloader","all video downloader","video saver","download video"]`
  - `claims[][]` · array of 12 arrays · e.g. `["paste","Paste link to download"]`
  - `missing[]` · array of 5 string · e.g. `["downloader.video.insta.free.videodownload","com.merryblue.facebookvideodownloader","com.newagedevs.facebook_video_downloader","com.fbvideodownloader.downloadfbvideos"]`
- **[discover.js](../research/aso-pipeline/discover.js)** · 3 KB · Node script, 35 lines. Discovery: our listing + who ranks on the video-downloader category's head terms in the US. Reads nothing on disk; writes `discover.json`.
- **[discover.json](../research/aso-pipeline/discover.json)** · 160 KB · JSON, object with 3 keys:
  - `me` · object with 24 keys:
    - `appId` · string · e.g. `"com.video.downloader.instagram.videosaver"`
    - `gl` · string · e.g. `"US"`
    - `fetchedAt` · string · e.g. `"2026-09-16T11:02:26.365Z"`
    - `title` · string · e.g. `"All Video Downloader & Saver"`
    - `summary` · string · e.g. `"Fast video downloader for HD videos, stories, clips and offline viewin…"`
    - `description` · string · e.g. `"Save the videos you love and enjoy them anytime with All Video Downloa…"`
    - `installsLabel` · string · e.g. `"5+"`
    - `minInstalls` · number · e.g. `5`
    - `realInstalls` · number · e.g. `9`
    - `developer` · string · e.g. `"Cell Cave"`
    - `developerSite` · string · e.g. `"https://cellcave.github.io/cell-cave-website/"`
    - `privacyPolicy` · string · e.g. `"https://cellcave.github.io/cell-cave-website/apps/all-video-downloader…"`
    - `genre` · string · e.g. `"Productivity"`
    - `updated` · null · e.g. `null`
    - `containsAds` · boolean · e.g. `true`
    - `iap` · string · e.g. `"$4.99 - $19.99 per item"`
    - `contentRating` · string · e.g. `"Everyone"`
    - `version` · null · e.g. `null`
    - `recentChanges` · null · e.g. `null`
    - `icon` · string · e.g. `"https://play-lh.googleusercontent.com/qLNXtLkR4z4KiAhmkwjlXx1TpuC4aaH6…"`
    - `featureGraphic` · string · e.g. `"https://play-lh.googleusercontent.com/q4weOoYNzbX0TD4RtvgBm1VsiywteBuY…"`
    - `video` · null · e.g. `null`
    - `screenshots[]` · array of 4 string · e.g. `["https://play-lh.googleusercontent.com/j2_25nIZRvSsEN0BlWJSIIRtIx-N1I7ugFgLUo5rDuBOnNTugt1bnMxlZt9p-RnjyAXdCFKK5KMAYzsaqTK8VA","https://play-lh.googleusercontent.com/TDaaCxqjFa48ZfwV0k4SNIeBK-v0Cwt33ue3sNB5cqdlGlK4sYIZGuNKiKX2zGtm62hpnf9h3Zmc8ajaon7LXg","https://play-lh.googleusercontent.com/iWFuKpcYqHVHeGgYoYhIrSjIrlR9FcRwAaGP1dZaP3WYRiq5zov4dfdatnjVHXoBdObNVJClXxRpLiWW2OhOTw","https://play-lh.googleusercontent.com/3n20NxyQhoOWJOgRndJyj48dCylpmBu1lIGTP9GG5lS89ovMzjfum-Ps_cLIDr_54bKevER-jTLc-Um63vy_nw"]`
    - `offers[]` · array of 6 string · e.g. `["events:none;content:\"\"}","events:none}","events:auto}","events:none}@media screen and (forced-colors:active){"]`
  - `head[]` · array of 24 objects:
    - `q` · string · e.g. `"video downloader"`
    - `gl` · string · e.g. `"US"`
    - `fetchedAt` · string · e.g. `"2026-09-16T11:02:27.664Z"`
    - `featured` · string · e.g. `"com.saveinsta.app.savevideo.saveclip"`
    - `results[]` · array of 30 objects with keys `appId`, `title`, `developer`, `installsLabel`, `score`, `genre`
  - `visible[][]` · array of 105 arrays · e.g. `["video.downloader.videodownloader",{"title":"Video Downloader","dev":"InShot Inc.","inst":"100,000,000+","n":21,"best":1}]`
- **[dossier-parts.json](../research/aso-pipeline/dossier-parts.json)** · 94 KB · JSON, object with 5 keys:
  - `title` · string · e.g. `"All Video Downloader"`
  - `fonts` · string · e.g. `"https://fonts.googleapis.com/css2?family=Anybody:wdth,wght@75..150,500…"`
  - `css` · string · e.g. `"#dossier{\n  --ground:#F3F1F5; --surface:#FFFFFF; --sunk:#EAE6EE; --ink…"`
  - `body` · string · e.g. `"<div id=\"dossier\" data-tab=\"dossier\" hidden>\n<div class=\"shell\"><main>…"`
  - `sections[]` · array of 8 objects:
    - `id` · string · e.g. `"overview"`
    - `label` · string · e.g. `"Overview"`
- **[dossier-source.html](../research/aso-pipeline/dossier-source.html)** · 92 KB · HTML page: “All Video Downloader”
- **[features.json](../research/aso-pipeline/features.json)** · 5 KB · JSON, object with 6 keys:
  - `audit` · object with 3 keys:
    - `apps[]` · array of 7 objects with keys `n`, `dev`, `installs`, `ours`, `comp`
    - `groups[]` · array of 4 objects with keys `g`, `rows`
    - `excluded` · string · e.g. `"The slide also lists “Jetpack Compose modern UI” with our app marked ✓…"`
  - `oursOnly[]` · array of 5 objects:
    - `h` · string · e.g. `"A 9-tool video editor"`
    - `p` · string · e.g. `"Trim, split, crop, merge, aspect ratio, add audio, extract audio, filt…"`
  - `ourClaims` · object with 12 keys:
    - `paste` · number · e.g. `1`
    - `browser` · number · e.g. `1`
    - `quality` · number · e.g. `1`
    - `background` · number · e.g. `1`
    - `multi` · number · e.g. `1`
    - `story` · number · e.g. `1`
    - `status` · number · e.g. `1`
    - `mp3` · number · e.g. `1`
    - `private` · number · e.g. `1`
    - `editor` · number · e.g. `1`
    - `player` · number · e.g. `1`
    - `languages` · number · e.g. `1`
  - `inventory[]` · array of 5 objects:
    - `screen` · string · e.g. `"Download"`
    - `items[]` · array of 5 string · e.g. `["Paste a link, share into the app, or pick from Quick Platforms","Quick Platforms: Facebook, Instagram, TikTok, LinkedIn, X, Dailymotion, Likee, Snapchat, WhatsApp and WhatsApp Business","Quality picker (for example 720p, 360p, 240p)","Parallel downloads with pause, resume and retry"]`
  - `edges[]` · array of 3 objects:
    - `h` · string · e.g. `"InShot · Video Downloader"`
    - `p` · string · e.g. `"The category leader: 100M+ installs, a 4.7 rating from about 2.7M rati…"`
  - `plans` · object with 2 keys:
    - `note` · string · e.g. `"Premium removes all ads. Prices as Google Play shows them in Pakistan."`
    - `items[]` · array of 2 objects with keys `p`, `price`, `sku`
- **[graphics-manifest.json](../research/aso-pipeline/graphics-manifest.json)** · 156 KB · JSON, array of 16:
  - `(root)[]` · array of 16 objects:
    - `num` · number · e.g. `1`
    - `slug` · string · e.g. `"01-qr-code-scanner"`
    - `id` · string · e.g. `"videoplayer.videodownloader.downloader"`
    - `title` · string · e.g. `"All Video Downloader & Player"`
    - `developer` · string · e.g. `"QR Code Scanner."`
    - `installsLabel` · string · e.g. `"100,000,000+"`
    - `installs` · number · e.g. `383593932`
    - `score` · number · e.g. `4.5262523`
    - `ratings` · number · e.g. `1880043`
    - `genre` · string · e.g. `"Tools"`
    - `updated` · string · e.g. `"2026-09-16"`
    - `released` · string · e.g. `"Jan 29, 2022"`
    - `video` · boolean · e.g. `false`
    - `url` · string · e.g. `"https://play.google.com/store/apps/details?id=videoplayer.videodownloa…"`
    - `assets[]` · array of 10 objects with keys `kind`, `file`, `w`, `h`, `src`, `label`
- **[graphics-notes.json](../research/aso-pipeline/graphics-notes.json)** · 25 KB · JSON, object with 9 keys:
  - `captured` · string · e.g. `"17 Sep 2026"`
  - `overview[]` · array of 4 string · e.g. `["The strongest references serve different purposes: InShot for the browser-first download tour that the category leader runs; Gamma Play for the one quiet, blue-accented set in a red crowd; Markhoor for the cleanest white system in the red-V family; and AppTool for a compact seven-frame story that still shows a PIN vault. These are visual judgments, not conversion rankings.","Twelve of the 16 icons are a white V or a white down-arrow on a red, orange or black square. Six apps use the same white V on red (Vidow, Vidpal, Attractive Apps Valley, Sky Vision, Markhoor, Mobile Notepad); Gamma Play’s black square with a white arrow and orange tray is a near copy of InShot’s. Only Hub (a wordmark that mimics an adult site) and Saver & Player Studio break the pattern.","Three listings sit at 100M+ (QR Code Scanner, InShot, Vidow), four at 50M+, seven at 10M+, Mobile Notepad at 5M+ and Gamma Play at 100K+. Install brackets do not show acquisition cost, momentum or creative conversion; on this category’s keywords, the six apps from your feature audit hold one top-10 placement between them across eight markets.","Most sets fill their slots by repeating a handful of messages: Vidow shows six frames three times, Vidpal seven frames five times, Hub five frames five times, Mobile Notepad eight frames four times. Vidpal publishes every screenshot square (1080 × 1080); InShot, AppTool and Saver & Player Studio mix a landscape or a second canvas size into the carousel."]`
  - `captureNote` · string · e.g. `"Original assets captured 17 Sep 2026 from each app’s public Google Pla…"`
  - `apps{}` · object keyed by 16 keys (1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, …); each value:
    - `<key>` · object with 3 keys: `name`, `notes`, `tags`
  - `patterns[]` · array of 8 objects:
    - `h` · string · e.g. `"The red V"`
    - `html` · string · e.g. `"Six icons are a white V on red and six more are a white down-arrow on …"`
  - `guidance[]` · array of 8 objects:
    - `h` · string · e.g. `"Keep the icon identity you have"`
    - `html` · string · e.g. `"The dossier’s icon — a black download arrow with cyan and pink edges o…"`
  - `requirements[]` · array of 4 string · e.g. `["Google Play’s preview-asset guidance specifies a 512 × 512 PNG app icon and a 1024 × 500 JPEG or 24-bit PNG feature graphic. The feature graphic and landscape screenshots are distinct asset roles.","Screenshots must be JPEG or 24-bit PNG with each side between 320 and 3,840 px and a long side at most twice the short side; up to eight per device type. 1080 × 1920 portrait is the recommended phone size.","Google recommends keeping feature-graphic focal content away from cutoff zones and avoiding tiny details, icon duplication, device imagery and promotional wording. Several references use these treatments; observed competitor practice is not a template for compliance.","Play’s intellectual-property policy bans confusing use of other companies’ brands and apps that facilitate downloading copyrighted content without authorisation. Platform logos in screenshots and “official” wording are the two most common exposures in this set."]`
  - `scope[]` · array of 5 string · e.g. `["Snapshot collected on 17 Sep 2026 from the public Google Play listing of each app, requesting English and US listing context. The competitor set is the union of the Product Dossier’s market table (7 apps), the PlayStore Metadata tab’s competitor ranks (16) and the Features Comparison tab (16); duplicates were removed by package name, leaving 16 unique listings, ordered by installs.","Original image responses were archived without redesign, cropping or recolouring. Dimensions and orientation were measured from the saved files. Asset roles follow the listing’s icon, feature-graphic and screenshot fields.","For this page, screenshots were recompressed to at most 1,100 px on the long side and feature graphics to 1,024 px wide so that all 321 assets fit in one artifact. Icons are the original files. Every caption links to the full-resolution original on Google Play.","Design reads describe composition, messaging and policy exposure as seen on contact sheets of each set. They assess the graphics, not the installed apps, their download success or measured conversion. Exact typefaces and experiment history cannot be established from these assets."]`
  - `sources[]` · array of 2 string · e.g. `["Google. <a href=\"https://support.google.com/googleplay/android-developer/answer/9866151?hl=en\" target=\"_blank\" rel=\"noopener\">Add preview assets to showcase your app</a>. Play Console Help. Accessed 17 September 2026.","Google. <a href=\"https://support.google.com/googleplay/android-developer/answer/9888072\" target=\"_blank\" rel=\"noopener\">Intellectual Property policy</a>. Play Console Help. Accessed 17 September 2026."]`
- **[graphics-src.json](../research/aso-pipeline/graphics-src.json)** · 72 KB · JSON, array of 16:
  - `(root)[]` · array of 16 objects:
    - `slug` · string · e.g. `"01-inshot"`
    - `id` · string · e.g. `"video.downloader.videodownloader"`
    - `title` · string · e.g. `"Video Downloader"`
    - `developer` · string · e.g. `"InShot Inc."`
    - `installsLabel` · string · e.g. `"100,000,000+"`
    - `installs` · number · e.g. `236276464`
    - `score` · number · e.g. `4.722918`
    - `ratings` · number · e.g. `2719684`
    - `genre` · string · e.g. `"Video Players & Editors"`
    - `updated` · string · e.g. `"2026-08-24"`
    - `released` · string · e.g. `"Mar 16, 2018"`
    - `video` · boolean · e.g. `false`
    - `url` · string · e.g. `"https://play.google.com/store/apps/details?id=video.downloader.videodo…"`
    - `icon` · object with 3 keys: `file`, `bytes`, `src`
    - `feature` · object with 3 keys: `file`, `bytes`, `src`
    - `shots[]` · array of 17 objects with keys `file`, `bytes`, `src`
- **[graphics.js](../research/aso-pipeline/graphics.js)** · 3 KB · Node script, 39 lines. Download every competitor's icon, feature graphic and screenshots from its Play listing (US) into avd-graphics-src/. Reads `raw.json`; writes `graphics-src.json`.
- **[inspect.js](../research/aso-pipeline/inspect.js)** · 1 KB · Node script, 11 lines.  Reads `raw.json`, `data.json`; writes nothing on disk.
- **[lib.js](../research/aso-pipeline/lib.js)** · 7 KB · Node script, 145 lines. Play Store scraper for the document-reader study: search, details (per market, with assets + offers), autocomplete.
- **[myassets.json](../research/aso-pipeline/myassets.json)** · 1 KB · JSON, object with 3 keys:
  - `icon` · object with 3 keys:
    - `file` · string · e.g. `"listing/icon.png"`
    - `src` · string · e.g. `"https://play-lh.googleusercontent.com/qLNXtLkR4z4KiAhmkwjlXx1TpuC4aaH6…"`
    - `bytes` · number · e.g. `369966`
  - `feature` · object with 3 keys:
    - `file` · string · e.g. `"listing/feature-graphic.png"`
    - `src` · string · e.g. `"https://play-lh.googleusercontent.com/q4weOoYNzbX0TD4RtvgBm1VsiywteBuY…"`
    - `bytes` · number · e.g. `315561`
  - `screenshots[]` · array of 4 objects:
    - `file` · string · e.g. `"listing/screenshot-01.png"`
    - `src` · string · e.g. `"https://play-lh.googleusercontent.com/j2_25nIZRvSsEN0BlWJSIIRtIx-N1I7u…"`
    - `bytes` · number · e.g. `626837`
- **[offers.json](../research/aso-pipeline/offers.json)** · 5 KB · JSON, object with 17 keys:
  - `video.downloader.videodownloader{}` · object keyed by 4 keys (US, BR, DE, IN); each value:
    - `<key>` · object with 3 keys: `section`, `block`, `flags`
  - `com.gamma.videodownloader{}` · object keyed by 4 keys (US, BR, DE, IN); each value:
    - `<key>` · object with 3 keys: `section`, `block`, `flags`
  - `videoplayer.videodownloader.downloader{}` · object keyed by 4 keys (US, BR, DE, IN); each value:
    - `<key>` · object with 3 keys: `section`, `block`, `flags`
  - `instagram.video.downloader.story.saver.ig{}` · object keyed by 4 keys (US, BR, DE, IN); each value:
    - `<key>` · object with 3 keys: `section`, `block`, `flags`
  - `instagram.video.downloader.story.saver.ig.insaver{}` · object keyed by 4 keys (US, BR, DE, IN); each value:
    - `<key>` · object with 3 keys: `section`, `block`, `flags`
  - `hub.browser.video.downloader.saver{}` · object keyed by 4 keys (US, BR, DE, IN); each value:
    - `<key>` · object with 3 keys: `section`, `block`, `flags`
  - `videodownloader.instagram.videosaver{}` · object keyed by 4 keys (US, BR, DE, IN); each value:
    - `<key>` · object with 3 keys: `section`, `block`, `flags`
  - `com.videodownload.browser.videodownloader{}` · object keyed by 4 keys (US, BR, DE, IN); each value:
    - `<key>` · object with 3 keys: `section`, `block`, `flags`
  - `downloader.video.download.free{}` · object keyed by 4 keys (US, BR, DE, IN); each value:
    - `<key>` · object with 3 keys: `section`, `block`, `flags`
  - `instasaver.videodownloader.photodownloader.repost{}` · object keyed by 4 keys (US, BR, DE, IN); each value:
    - `<key>` · object with 3 keys: `section`, `block`, `flags`
  - `com.allvideodownloader.hdvideodownloader.savevideos{}` · object keyed by 4 keys (US, BR, DE, IN); each value:
    - `<key>` · object with 3 keys: `section`, `block`, `flags`
  - `allinone.videodownloader.savevideos{}` · object keyed by 4 keys (US, BR, DE, IN); each value:
    - `<key>` · object with 3 keys: `section`, `block`, `flags`
  - `com.videosaver.savevideos.story.saverapp{}` · object keyed by 4 keys (US, BR, DE, IN); each value:
    - `<key>` · object with 3 keys: `section`, `block`, `flags`
  - `com.videodownloder.alldownloadvideos{}` · object keyed by 4 keys (US, BR, DE, IN); each value:
    - `<key>` · object with 3 keys: `section`, `block`, `flags`
  - `com.hdvideodownloader.downloaderapp{}` · object keyed by 4 keys (US, BR, DE, IN); each value:
    - `<key>` · object with 3 keys: `section`, `block`, `flags`
  - `free.video.downloader.freevideodownloader2021.video.saver.videosaverlite{}` · object keyed by 4 keys (US, BR, DE, IN); each value:
    - `<key>` · object with 3 keys: `section`, `block`, `flags`
  - `com.video.downloader.instagram.videosaver{}` · object keyed by 4 keys (US, BR, DE, IN); each value:
    - `<key>` · object with 3 keys: `section`, `block`, `flags`
- **[raw.json](../research/aso-pipeline/raw.json)** · 2.8 MB · JSON, object with 11 keys:
  - `collectedAt` · string · e.g. `"2026-09-16T11:05:37.590Z"`
  - `markets[]` · array of 8 string · e.g. `["US","BR","DE","ES"]`
  - `mine` · string · e.g. `"com.video.downloader.instagram.videosaver"`
  - `competitors[]` · array of 16 string · e.g. `["video.downloader.videodownloader","com.gamma.videodownloader","videoplayer.videodownloader.downloader","instagram.video.downloader.story.saver.ig"]`
  - `keywords[]` · array of 104 string · e.g. `["video downloader","all video downloader","video saver","download video"]`
  - `secondary[]` · array of 40 string · e.g. `["video downloader","all video downloader","video saver","download video"]`
  - `tiers` · object with 4 keys:
    - `CORE[]` · array of 24 string · e.g. `["video downloader","all video downloader","video saver","download video"]`
    - `PLATFORM[]` · array of 22 string · e.g. `["instagram video downloader","video downloader for instagram","reels downloader","story saver"]`
    - `ADJACENT[]` · array of 22 string · e.g. `["video to mp3","mp3 converter","video cutter","video editor"]`
    - `PERIPHERAL[]` · array of 8 string · e.g. `["file manager","music downloader","photo downloader","image downloader"]`
  - `serps[]` · array of 384 objects:
    - `q` · string · e.g. `"video downloader"`
    - `gl` · string · e.g. `"US"`
    - `featured` · string · e.g. `"com.saveinsta.app.savevideo.saveclip"`
    - `results[]` · array of 30 string · e.g. `["video.downloader.videodownloader","videoplayer.videodownloader.downloader","hub.browser.video.downloader.saver","com.sun.ai.app.tube.videodownloader"]`
    - `titles[]` · array of 30 string · e.g. `["Video Downloader","All Video Downloader & Player","Hub Video Downloader","Tube Video Downloader"]`
  - `apps[]` · array of 404 objects:
    - `appId` · string · e.g. `"com.video.downloader.instagram.videosaver"`
    - `gl` · string · e.g. `"US"`
    - `fetchedAt` · string · e.g. `"2026-09-16T11:02:26.365Z"`
    - `title` · string · e.g. `"All Video Downloader & Saver"`
    - `summary` · string · e.g. `"Fast video downloader for HD videos, stories, clips and offline viewin…"`
    - `description` · string · e.g. `"Save the videos you love and enjoy them anytime with All Video Downloa…"`
    - `installsLabel` · string · e.g. `"5+"`
    - `minInstalls` · number · e.g. `5`
    - `realInstalls` · number · e.g. `9`
    - `developer` · string · e.g. `"Cell Cave"`
    - `developerSite` · string · e.g. `"https://cellcave.github.io/cell-cave-website/"`
    - `privacyPolicy` · string · e.g. `"https://cellcave.github.io/cell-cave-website/apps/all-video-downloader…"`
    - `genre` · string · e.g. `"Productivity"`
    - `updated` · string · e.g. `"2026-08-24"`
    - `containsAds` · boolean · e.g. `true`
    - `iap` · string · e.g. `"$4.99 - $19.99 per item"`
    - `contentRating` · string · e.g. `"Everyone"`
    - `version` · string · e.g. `"2.6.9"`
    - `recentChanges` · string · e.g. `"Optimize the user experience"`
    - `icon` · string · e.g. `"https://play-lh.googleusercontent.com/qLNXtLkR4z4KiAhmkwjlXx1TpuC4aaH6…"`
    - `featureGraphic` · string · e.g. `"https://play-lh.googleusercontent.com/q4weOoYNzbX0TD4RtvgBm1VsiywteBuY…"`
    - `video` · string · e.g. `"https://www.youtube.com/watch?v=uhyrZi-qE14"`
    - `screenshots[]` · array of 4 string · e.g. `["https://play-lh.googleusercontent.com/j2_25nIZRvSsEN0BlWJSIIRtIx-N1I7ugFgLUo5rDuBOnNTugt1bnMxlZt9p-RnjyAXdCFKK5KMAYzsaqTK8VA","https://play-lh.googleusercontent.com/TDaaCxqjFa48ZfwV0k4SNIeBK-v0Cwt33ue3sNB5cqdlGlK4sYIZGuNKiKX2zGtm62hpnf9h3Zmc8ajaon7LXg","https://play-lh.googleusercontent.com/iWFuKpcYqHVHeGgYoYhIrSjIrlR9FcRwAaGP1dZaP3WYRiq5zov4dfdatnjVHXoBdObNVJClXxRpLiWW2OhOTw","https://play-lh.googleusercontent.com/3n20NxyQhoOWJOgRndJyj48dCylpmBu1lIGTP9GG5lS89ovMzjfum-Ps_cLIDr_54bKevER-jTLc-Um63vy_nw"]`
    - `offers[]` · array of 6 string · e.g. `["events:none;content:\"\"}","events:none}","events:auto}","events:none}@media screen and (forced-colors:active){"]`
    - `score` · number · e.g. `4.722918`
    - `ratings` · number · e.g. `2719684`
    - `reviews` · number · e.g. `53344`
    - `released` · string · e.g. `"Mar 16, 2018"`
  - `missing[]` · array of 5 string · e.g. `["downloader.video.insta.free.videodownload","com.merryblue.facebookvideodownloader","com.newagedevs.facebook_video_downloader","com.fbvideodownloader.downloadfbvideos"]`
  - `demand[]` · array of 188 objects:
    - `q` · string · e.g. `"video downloader"`
    - `gl` · string · e.g. `"US"`
    - `step` · string · e.g. `"vid"`
    - `pos` · number · e.g. `0`
    - `score` · number · e.g. `100`
- **[scope.js](../research/aso-pipeline/scope.js)** · 3 KB · Node script, 65 lines. Turn the existing dossier page into a scoped tab: CSS prefixed with #dossier, left scrubber removed, lightbox kept. Reads `dossier-source.html`; writes `dossier-parts.json`.
- **[template.html](../research/aso-pipeline/template.html)** · 102 KB · HTML page: “All Video Downloader”

## research/aso-pipeline/cache/

1268 files · 3.7 MB

A cache of 1268 .json files named by a hash of the request that produced them: raw responses saved by the scraper so a run can be repeated without fetching again. Delete the folder to force a fresh scrape.

## research/aso-pipeline/sep-16-build/

2 files · 94 KB

- **[build.js](../research/aso-pipeline/sep-16-build/build.js)** · 7 KB · Node script, 107 lines. Build the All Video Downloader page: Cloud Storage design system + this study's tabs + the scoped Product Dossier. Reads `data.json`, `raw.json`, `offers.json`, `myassets.json`, `features.json`, `dossier-parts.json`, `template.html`; writes nothing on disk.
- **[template.html](../research/aso-pipeline/sep-16-build/template.html)** · 87 KB · HTML page: “All Video Downloader”

## research/competitor-visual-memory/

4 files · 67 KB

- **[LINKS.md](../research/competitor-visual-memory/LINKS.md)** · 2 KB · Markdown: “Deduplicated competitor links”
- **[MEMORY.md](../research/competitor-visual-memory/MEMORY.md)** · 12 KB · Markdown: “All Video Downloader competitor visual memory”, “Scope and evidence”, “Visual asset inventory”, “Competitive positioning from the supplied audit”, “Recommended screenshot storyline for a future listing”, “Final deduplicated competitor links”, “Per-app visual notes”, “1. Video Downloader”, “2. Video downloader - Story Saver”, “3. InSaver: All Video Downloader”, “4. Video Downloader - without ads”, “5. All Video Downloader & Player”, “6. Hub Video Downloader”, “7. Video Downloader & Story Saver”
- **[assets.json](../research/competitor-visual-memory/assets.json)** · 16 KB · JSON, object with 3 keys:
  - `checkedAt` · string · e.g. `"2026-09-21"`
  - `source` · string · e.g. `"Public Google Play US English pages; no asset files downloaded"`
  - `records[]` · array of 16 objects:
    - `id` · string · e.g. `"video.downloader.videodownloader"`
    - `title` · string · e.g. `"Video Downloader"`
    - `developer` · string · e.g. `"InShot Inc."`
    - `installs` · string · e.g. `"100M+"`
    - `rating` · string · e.g. `"4.7"`
    - `reviews` · string · e.g. `"2.72M"`
    - `portrait` · number · e.g. `11`
    - `landscape` · number · e.g. `1`
    - `square` · number · e.g. `0`
    - `note` · string · e.g. `"Mature portrait-led walkthrough with one landscape promo. Study its be…"`
    - `icon` · string · e.g. `"https://play-lh.googleusercontent.com/oju7a2AuqaQSc_l5O-2yRw8F_M0rUlHn…"`
    - `shots[]` · array of 3 string · e.g. `["https://play-lh.googleusercontent.com/NSGdsgwWRfwmx4fvTHQxemryYBrNUhWqMU2V8kQsrPQ9s3Z7d_X4x1SSyYZQ4f11L2-lD-3N-X8bKzW009-G=w526-h296-rw","https://play-lh.googleusercontent.com/gxUnDNwvtp0vd7HJX01UVlWG3OdKYfLHeSLUBcsRp3fe_ncRvXBTxjYs7-i19VEYvrXiqbzDDOaaXCHPoYtjxSA=w526-h296-rw","https://play-lh.googleusercontent.com/WFcH-IvsVpbLiJQx1pQC0Tr147jjjJNgmwvXbfeqC8MJRDPtgb68Yr6IFA-oOlY_Psa_U_8H4_bDW-ECltzt2g=w526-h296-rw"]`
- **[index.html](../research/competitor-visual-memory/index.html)** · 36 KB · HTML page: “All Video Downloader — Competitor Visual Library”

## research/tiksta-title-check/

6 files · 427 KB

- **[payload.json](../research/tiksta-title-check/payload.json)** · 301 KB · JSON, object with 6 keys:
  - `data` · object with 12 keys:
    - `collectedAt` · string · e.g. `"2026-09-16T11:05:37.590Z"`
    - `markets[]` · array of 8 string · e.g. `["US","BR","DE","ES"]`
    - `mineIdx` · number · e.g. `0`
    - `compIdx[]` · array of 16 number · e.g. `[1,2,3,4]`
    - `competitors[]` · array of 16 string · e.g. `["video.downloader.videodownloader","com.gamma.videodownloader","videoplayer.videodownloader.downloader","instagram.video.downloader.story.saver.ig"]`
    - `apps[]` · array of 392 records, each an array of 12 values:
      - `[0]` · string · e.g. `"com.video.downloader.instagram.videosaver"`
      - `[1]` · string · e.g. `"All Video Downloader & Saver"`
      - `[2]` · string · e.g. `"Cell Cave"`
      - `[3]` · number · e.g. `9`
      - `[4]` · null or number · e.g. `4.722918`
      - `[5]` · null or number · e.g. `2719684`
      - `[6]` · null or string · e.g. `"Mar 16, 2018"`
      - `[7]` · null or string · e.g. `"2026-08-24"`
      - `[8]` · number · e.g. `1`
      - `[9]` · string · e.g. `"downloader"`
      - `[10]` · number · e.g. `1`
      - `[11]` · string or null · e.g. `"$4.99 - $19.99 per item"`
    - `board{}` · object keyed by 8 keys (US, BR, DE, ES, IT, AU, AE, IN); each value:
      - `<key>[]` · array of 100 objects with keys `q`, `tier`, `src`, `tm`, `depth`, `ids`, `nb`, `niche`, `vol`, `entry`, `entryRank`, `demand`, `demandAt`, `comps`, `c10`, `c30`, `R`, `O`, `P`, `entryIdx`
    - `profiles[]` · array of 17 objects with keys `id`, `idx`, `title`, `titleLen`, `summary`, `summaryLen`, `description`, `descLen`, `descWords`, `developer`, `installs`, `installsLabel`, `score`, `ratings`, `released`, `updated`, `genre`, `ads`, `iap`, `video`
    - `marketSummary[]` · array of 8 objects with keys `gl`, `keywords`, `avgNonBrand`, `medianEntry`, `compTop10`, `avgDepth`, `best`
    - `secondary[]` · array of 40 string · e.g. `["video downloader","all video downloader","video saver","download video"]`
    - `claims[][]` · array of 12 arrays · e.g. `["paste","Paste link to download"]`
    - `missing[]` · array of 5 string · e.g. `["downloader.video.insta.free.videodownload","com.merryblue.facebookvideodownloader","com.newagedevs.facebook_video_downloader","com.fbvideodownloader.downloadfbvideos"]`
  - `assets` · object with 3 keys:
    - `icon` · object with 3 keys: `file`, `src`, `bytes`
    - `feature` · object with 3 keys: `file`, `src`, `bytes`
    - `screenshots[]` · array of 4 objects with keys `file`, `src`, `bytes`
  - `features` · object with 6 keys:
    - `audit` · object with 3 keys: `apps`, `groups`, `excluded`
    - `oursOnly[]` · array of 5 objects with keys `h`, `p`
    - `ourClaims` · object with 12 keys: `paste`, `browser`, `quality`, `background`, `multi`, `story`, `status`, `mp3`, `private`, `editor`, `player`, `languages`
    - `inventory[]` · array of 5 objects with keys `screen`, `items`
    - `edges[]` · array of 3 objects with keys `h`, `p`
    - `plans` · object with 2 keys: `note`, `items`
  - `offersChecked{}` · object keyed by 17 keys (video.downloader.videodownloader, com.gamma.videodownloader, videoplayer.videodownloader.downloader, instagram.video.downloader.story.saver.ig, instagram.video.downloader.story.saver.ig.insaver, hub.browser.video.downloader.saver, videodownloader.instagram.videosaver, com.videodownload.browser.videodownloader, downloader.video.download.free, instasaver.videodownloader.photodownloader.repost, com.allvideodownloader.hdvideodownloader.savevideos, allinone.videodownloader.savevideos, …); each value:
    - `<key>` · boolean · e.g. `false`
  - `listing` · object with 5 keys:
    - `current` · object with 13 keys: `title`, `summary`, `description`, `iap`, `ads`, `privacy`, `site`, `developer`, `installs`, `url`, `id`, `genre`, `privacyStatus`
    - `titles[]` · array of 14 objects with keys `t`, `len`, `taken`, `current`, `score`, `hits`, `exact`
    - `rec[]` · array of 3 objects with keys `t`, `len`, `taken`, `current`, `score`, `hits`, `exact`
    - `shorts[]` · array of 2 objects with keys `s`, `len`, `score`, `hits`, `exact`
    - `long` · string · e.g. `"{name} saves videos from a link in the quality you choose, with a buil…"`
  - `dossierSections[]` · array of 8 objects:
    - `id` · string · e.g. `"overview"`
    - `label` · string · e.g. `"Overview"`
- **[pc.json](../research/tiksta-title-check/pc.json)** · 4 KB · JSON, object with 7 keys:
  - `collectedAt` · string · e.g. `"2026-09-16T11:41:23.7794628Z"`
  - `queries[]` · array of 16 string · e.g. `["reels downloader","reels video downloader","reels saver","video downloader for reels"]`
  - `apps` · number · e.g. `143`
  - `terms[]` · array of 6 objects:
    - `key` · string · e.g. `"reels"`
    - `label` · string · e.g. `"Reels / Reel"`
    - `n` · number · e.g. `22`
    - `m1` · number · e.g. `1`
    - `y2` · number · e.g. `6`
    - `both` · number · e.g. `1`
    - `ex[]` · array of 4 objects with keys `t`, `b`, `d`, `f`
  - `serp[]` · array of 10 objects:
    - `t` · string · e.g. `"InSaver: All Video Downloader"`
    - `b` · string · e.g. `"10M+"`
    - `f` · string · e.g. `"2024-05-29"`
    - `has` · boolean · e.g. `false`
  - `tikstaSerp[]` · array of 10 string · e.g. `["TikTok - Videos, Shop & LIVE","TkStar - Followers Likes Views","TikTok Lite - Faster TikTok","TikBoost - Followers & Likes"]`
  - `tikstaNamed` · number · e.g. `0`
- **[playcheck.json](../research/tiksta-title-check/playcheck.json)** · 111 KB · JSON, object with 3 keys:
  - `collectedAt` · string · e.g. `"2026-09-16T11:41:23.7794628Z"`
  - `serps` · object with 16 keys:
    - `reels downloader[]` · array of 30 string · e.g. `["instagram.video.downloader.story.saver.ig.insaver","instagram.video.downloader.story.saver.ig","com.sensei.social","video.downloader.videodownloader"]`
    - `reels video downloader[]` · array of 30 string · e.g. `["video.downloader.videodownloader","instagram.video.downloader.story.saver.ig","instagram.video.downloader.story.saver.ig.insaver","com.gamma.videodownloader"]`
    - `reels saver[]` · array of 30 string · e.g. `["instagram.video.downloader.story.saver.ig.insaver","instagram.video.downloader.story.saver.ig","com.haariug.video.downloader.story.saver.reel.saver","com.quickostudio.reelsave"]`
    - `video downloader for reels[]` · array of 30 string · e.g. `["video.downloader.videodownloader","instagram.video.downloader.story.saver.ig.insaver","instagram.video.downloader.story.saver.ig","com.gamma.videodownloader"]`
    - `insta downloader[]` · array of 30 string · e.g. `["instagram.video.downloader.story.saver.ig","instagram.video.downloader.story.saver.ig.insaver","com.instadownloader.instasave.igsave.ins","videodownloader.instagram.videosaver"]`
    - `insta saver[]` · array of 30 string · e.g. `["com.instadownloader.instasave.igsave.ins","instagram.video.downloader.story.saver.ig","instagram.video.downloader.story.saver.ig.insaver","moris.ins.download.free"]`
    - `tiktok downloader[]` · array of 30 string · e.g. `["tiktok.video.downloader.nowatermark.tiktokdownload","repost.share.tiktok.nowatermark.videosave.download.videodownloader.saver","tiktok.video.downloader.nowatermark.tiktokdownload.snaptik","com.downloaderfor.tiktok"]`
    - `tik tok video downloader[]` · array of 20 string · e.g. `["tiktok.video.downloader.nowatermark.tiktokdownload","tiktok.video.downloader.nowatermark.tiktokdownload.snaptik","ru.codeluck.tiktok.downloader","com.downloaderfor.tiktok"]`
    - `video downloader for tiktok[]` · array of 30 string · e.g. `["com.downloaderfor.tiktok","com.dba.tiktokvideosaver.nowatermark","tiktok.video.downloader.nowatermark.tiktokdownload","tiktok.video.downloader.nowatermark.tiktokdownload.snaptik"]`
    - `instagram downloader[]` · array of 30 string · e.g. `["instagram.video.downloader.story.saver.ig","instagram.video.downloader.story.saver.ig.insaver","videodownloader.instagram.videosaver","com.shirokovapp.instasave"]`
    - `video downloader for instagram[]` · array of 30 string · e.g. `["reels.stories.video.downloader","instagram.video.downloader.story.saver.ig","instagram.video.downloader.story.saver.ig.insaver","videodownloader.instagram.videosaver"]`
    - `tiksta[]` · array of 12 string · e.g. `["com.zhiliaoapp.musically","xyz.tikstar.likes.followers.app","com.tiktok.lite.go","cc.stix.tikboost"]`
    - `reels downloader app[]` · array of 30 string · e.g. `["com.sensei.social","instagram.video.downloader.story.saver.ig","instagram.video.downloader.story.saver.ig.insaver","online.savereels.app"]`
    - `social video downloader[]` · array of 30 string · e.g. `["com.linhiev.videodownloader","video.downloader.videodownloader","com.xbuddymobile.app","com.gamma.videodownloader"]`
    - `private video downloader[]` · array of 30 string · e.g. `["io.browser.xbrowsers","video.downloader.videodownloader","downloader.video.download.free","hub.browser.video.downloader.saver"]`
    - `save video[]` · array of 7 string · e.g. `["com.saveinsta.app.savevideo.saveclip","video.downloader.videodownloader","tweeter.gif.twittervideodownloader","com.linhiev.videodownloader"]`
  - `apps[]` · array of 143 objects:
    - `id` · string · e.g. `"instagram.video.downloader.story.saver.ig.insaver"`
    - `ok` · boolean · e.g. `true`
    - `title` · string · e.g. `"InSaver: All Video Downloader"`
    - `band` · string · e.g. `"10M+"`
    - `min` · number · e.g. `10000000`
    - `installs` · number · e.g. `13028866`
    - `dev` · string · e.g. `"Video Downloader Story Saver"`
    - `score` · string · e.g. `"4.747220039367676"`
    - `ratings` · string · e.g. `"295431"`
    - `first` · string · e.g. `"2024-05-29"`
    - `last` · string · e.g. `"2026-09-14"`
- **[playcheck.ps1](../research/tiksta-title-check/playcheck.ps1)** · 3 KB · PowerShell script, 50 lines.  Reads nothing on disk; writes `playcheck.json`.
- **[score.ps1](../research/tiksta-title-check/score.ps1)** · 4 KB · PowerShell script, 53 lines.  Functions: `normT`, `phraseN`, `words`, `allIn`, `cov`, `score`. Reads `payload.json`, `tiksta-long.txt`; writes nothing on disk.
- **[tiksta-long.txt](../research/tiksta-title-check/tiksta-long.txt)** · 3 KB · full text:

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

