# All Video Downloader: knowledge base

Loaded automatically in every Claude session in this repo. Facts as of 16-21 Sep 2026 (ASO, QA and title-check data collected 16 Sep 2026; competitor visual review 21 Sep 2026); detail lives in the files linked below.

## The app

- **Name / package**: All Video Downloader · `com.video.downloader.instagram.videosaver` · developer **Cell Cave**.
- **Version**: 2.4 (versionCode 6) · minSdk 26 (Android 8.0+) · target/compile SDK 37 · ABI arm64-v8a only · Kotlin 2.2.10, Java 17 · 347 Java + 278 Kotlin source files.
- **Languages**: 9 — English, Urdu, Arabic, Hindi, Turkish, German, French, Portuguese (BR), Chinese. Urdu and Arabic mirror the layout (RTL); video timelines stay left-to-right.
- **Editing tools**: 9 — trim, split, crop, merge, aspect ratio, add audio, extract audio, filters & effects, watermark. Built on Media3 Transformer 1.10.1, no FFmpeg.
- **Debug APK**: 35.6 MB (35,644,604 bytes), built 16 Sep 2026 13:54, SHA-256 `c078338d50b4eef346fa113667999c8e566cdebf7f1892464b4e3e7e922deba6`. A debug APK cannot go to Play; before upload: set `ADS_ENABLED = true`, commit the 16 Sep fixes, build a signed release AAB.
- **Platforms verified end to end on a real phone** (14-15 Sep 2026, Infinix X6728B): TikTok, Facebook, Instagram, LinkedIn, X, Dailymotion, Vimeo. Pinterest's API key was rejected. `supportedweb.txt` lists 102 sites; only the ones above were downloaded end to end.
- **Monetization**: AdMob with Meta Audience Network mediation (rewarded gate before free downloads, app open, interstitial, banner/MREC/native). Premium removes all ads only — no speed, quality or unlimited-download claim. Weekly **Rs 1,400** (`weekly_plan`) · Monthly **Rs 5,600** (`monthly_plan`), prices as Google Play shows them in Pakistan. Current live US listing: IAP $4.99-$19.99 per item, Contains ads.
- **QA score**: **95 / 100** (16 Sep 2026), started at 72 in the 19-category audit, target line 90. 167 bugs found across 7 rounds (10 Aug-15 Sep 2026), 165 fixed (99% fix rate), 2 still open: #19 (text overlap in the link flow, needs retest at more screen sizes) and #25 ("Add media to Vault", never built — a missing feature, not a defect). 0 critical/high/medium/low bugs open.
- **Current live Play listing**: title "All Video Downloader & Saver" · installs **5+** (real installs 9, per the scrape) · not enough ratings to show a score · category Productivity. The title is identical to Sky Vision Apps Lab's 10M+ app, which hurts search and invites confusion.
- **Known blockers before any Play update**: the privacy-policy link in the live listing 404s (site moved, app already points at the new address internally); the in-app/launcher name is still "All Video Downloader", not Tiksta.

## Tiksta relaunch

- **Positioning**: a reels downloader and social video downloader; no brand names anywhere in the copy.
- **Recommended title**: **"Tiksta: Reels Video Downloader"** (30/30 chars). Carries "video downloader" (US priority 83, the category's top keyword) and "reels" (low entry bar — smallest app in the top 10 for "reels downloader app" has 1.5K installs). Reaches 44% priority coverage with the short/full description below.
  - Alt 1: "Tiksta Social Video Downloader" (30/30) — keeps "social video downloader" as an exact phrase (2 competitors in its top 10, smallest app 9.6K installs), drops reels positioning; 45% coverage.
  - Alt 2: "Tiksta: Reels Downloader App" (28/30) — carries every word of "reels downloader app" (P74) but gives up the exact phrase "video downloader"; 27% coverage.
- **Short description** (80/80): "Save & download reels & social videos in HD from a link. Private story saver app." Alternative (79/80): "Save & download reels and social videos in HD from a link. Fast story saver app."
- **Full description**: 3,033 / 4,000 characters, 532 words. Full text: [`research/tiksta-title-check/tiksta-long.txt`](../research/tiksta-title-check/tiksta-long.txt).
- **Keyword decisions**: targets 52 of the 100 US board keywords; 33 of 37 finalized keywords used, 24 of those in the title or short description. 4 finalized keywords not in this version: video saver mp4 downloader, all video downloader and saver, download video browser, status save. Most-repeated board phrase: "video downloader" ×7 (2.6% of 532 words). 0 brand names in the text.
- **Reels title-check result** (Google Play, 16 Sep 2026, 16 English searches, 143 distinct apps, brand-owner apps excluded):

  | Term | Live titles | 1M+ installs | Listed 2+ yrs | Decision |
  | --- | --- | --- | --- | --- |
  | Reels / Reel | 22 | 1 | 6 | **Used** (title, short, full) — tolerated but thin at scale |
  | Story (baseline) | 18 | 7 | 11 | **Used** — proven at scale |
  | Tik- prefix (the Tiksta name) | 8 | 3 | 7 | **Used** for the brand name only — store check, not a trademark clearance |
  | Insta | 4 | 0 | 0 | **Not used** — fails the check; Meta bans combining "Insta" with your own brand |
  | TikTok / Instagram | 4 / 3 | 1 / 0 | 2 / 2 | **Not used** — brand names, kept out by owner's decision |

  A search for "tiksta" itself returned no app using that name.
- **What must change before shipping**: rename the launcher label and in-app name to Tiksta (the build currently reports "All Video Downloader"); update the privacy-policy URL in the Play listing; set `ADS_ENABLED = true` and build a signed release AAB (current build is debug, ads off for testing); frame the dossier's 720×1600 (ratio 1:2.22) device captures to Play's ≤1:2 limit before uploading as screenshots; add screenshots for the editor and vault (listing currently uses 4 of 8 phone slots — feature graphic and icon already meet Play's spec).

## What the research found

- Your live listing is invisible in search: it appears in none of the 380 result lists scraped across 8 markets.
- The 6 feature-audit-only competitors (Sky Vision, Attractive Apps Valley, Markhoor, Mobile Notepad, Vidow, Vidpal) hold just 1 top-10 placement between them across all 8 markets (Attractive Apps Valley, India) — their installs come from outside keyword search.
- There is no brand wall in this category: 9.6 of every top 10 results are independent, non-brand apps.
- Generic phrasing leads the US priority board: video downloader (P83), hd video downloader (P80), all video downloader (P79), private video downloader (P77), save video downloader app (P77), fast video downloader (P75).
- No competitor runs an Events & offers card — checked on all 17 listings (16 competitors + this app) in the US, Brazil, Germany and India.
- India is the easiest of the 8 markets: median entry bar 99K installs vs. 157K in the US.
- Entry bar for the recommended opening keyword "private video downloader": 27K installs (Private Video Vault Downloader, #8) — a non-brand app under 60K installs already holds a top-10 slot there.
- InShot Inc.'s "Video Downloader" holds 51 US top-10 placements and 4.72★ from 2,718,938 ratings — the category leader by search visibility.
- Method: live Google Play scrape (English), 100 US keywords plus the first 40 of those in the other 7 markets, 380 result lists 30 deep, collected 16 Sep 2026; 392 apps profiled, 16 tracked competitors.

## Competitors

US top-10 placements ("in results" from the live search scrape), best rank, installs and rating. Full table: [tabs/02-aso-playbook.md](tabs/02-aso-playbook.md#competitors).

| Competitor (developer) | Top-10 · results | Best rank | Installs | Rating |
| --- | --- | --- | --- | --- |
| Video Downloader (InShot Inc.) | 51 · 57 | #1 | 100M+ | 4.7 · 2.7M ratings |
| Video downloader - Story Saver | 36 · 52 | #1 | 50M+ | 4.7 · 1.4M ratings |
| InSaver: All Video Downloader | 33 · 54 | #1 | 10M+ | 4.7 · 295K ratings |
| Video Downloader - without ads (Gamma Play) | 32 · 47 | #1 | 100K+ | 4.6 · 3.1K ratings |
| All Video Downloader & Player (QR Code Scanner) | 26 · 42 | #2 | 100M+ | 4.5 · 1.9M ratings |
| Hub Video Downloader (DOSA Apps) | 26 · 39 | #3 | 10M+ | 4.4 · 82K ratings |
| Video Downloader & Story Saver (Fast Saver) | 22 · 47 | #1 | 10M+ | 4.8 · 377K ratings |
| All Video Downloader & Player (AppTool) | 17 · 38 | #3 | 10M+ | 4.4 · 66K ratings |
| Video Downloader & Video Saver (Saver & Player Studio) | 8 · 26 | #1 | 50M+ | 4.4 · 357K ratings |
| All Video Downloader & Browser (DevBay) | 6 · 39 | #6 | 50M+ | 3.9 · 649K ratings |

The 6 feature-audit-only apps (Sky Vision Apps Lab, Attractive Apps Valley, Markhoor Studio, Mobile Notepad Apps, Vidow/VIDOXE, Vidpal Apps Studio) installs range 5M-100M+, ratings 3.8-4.3★, but hold only 1 US/8-market top-10 placement combined — see "What the research found" above.

## Features and gaps

- **Audited features only this app ships** (3, from the static-APK audit of 6 competitor builds): private vault with PIN/biometric lock, MP3/audio extraction, and batch downloads that survive the background — 0 of the 6 competitors ship any of these.
- Also unique in the wider feature set: the 9-tool video editor (no audited competitor has one) and 9 languages including RTL.
- **Competitor strengths**: InShot (100M+, 4.72★/2.7M ratings, browser with auto-detect, password-protected folder); Vidow (100M+, resolution picker, cast to TV); Vidpal (50M+, paste-link download, 4K player). InShot Inc. also owns search: 51 US top-10 placements.
- **Listing claim gap**: the current live listing mentions only 4 of the 12 features this app ships. Missing from the listing copy: built-in browser with auto-detect, background downloads (pause & resume), multiple/batch downloads, MP3/audio extraction, private folder/vault/lock, built-in video editor, video player, multi-language interface.

## Competitor graphics

Tab 05 (`tabs/05-competitors-graphics/`), captured 23 Sep 2026: **our own listing plus 16 competitors, 164 assets** — 17 icons, 17 feature graphics, 130 screenshots (128 portrait, 2 landscape), stored in `tabs/05-competitors-graphics/graphics/<NN>-<slug>/` (20 MB; screenshots and feature graphics as JPEG up to 1400 px on the long side, icons at 512 px). **Our app is first in every section** — icon lineup, feature graphics, app-by-app library and summary table — marked with an "ours" pill (`00-our-app`, `PAYLOAD.graphics.ours`).

**The list.** The deduplicated union of the Video Downloader dossier, the ASO Playbook annotations and the Features Comparison audit — the same 16 listings recorded in `research/competitor-visual-memory/` on 21 Sep 2026. Duplicate assets removed in two passes: by URL (288 raw references → 156, Play serves one screenshot across several device slots), then by inspection (26 more). DOSA publishes the same five creatives twice at identical size; Saver & Player Studio publishes seven creatives at four pixel sizes; Vidpal publishes its seven as both portrait and 1080×1080 squares. Markhoor's two visual systems and Mobile Notepad's two heading sets are genuine variants and both are kept, as are InShot's unlabelled device captures.

**Where we stand.** *For us:* our rainbow-gradient icon is the most distinctive mark in the library, and our four headings state outcomes rather than restating the title — a failure mode visible in DevBay and Attractive Apps, which spend three or four frames repeating their own name. We carry no speed multiplier and no "no watermark" claim. *Against us:* we publish **4 screenshots against a category median of 7** (leaders run 12–16), so half our phone slots are empty; the vault, the 9-tool editor and MP3 extraction — the three things **0 of 6** audited competitors ship — have barely one frame between them; and **screenshot 1 shows a row of platform brand marks**, which our own no-brand-names rule points away from.

**Category patterns.** 15 of 17 icons sit in three families: 7 red "V" marks (Sky Vision, Attractive Apps, Markhoor, Mobile Notepad and Vidow are near-interchangeable), 5 download arrows on a flat square (ours, InShot, Gamma Play, AppTool, DevBay — InShot's and Gamma Play's are almost identical to each other), 3 ring-and-arrow gradients. Only Hub and Saver & Player Studio use wordmarks. Four feature graphics are the same dark media-tile grid (InShot, QR Code Scanner, AppTool, Sky Vision). Speed claims ("3x", "4x", "Ultra-Fast", "100MB/s") run across seven listings — a register we cannot use. **13 of 17 listings show platform logos or third-party UI in their screenshots; Gamma Play is the only one that does not**, using invented source apps ("TravelHub", "FREEVIDEOS") — the compliant pattern, from the smallest app in the set. Only InShot and AppTool publish a landscape frame, confirming the 21 Sep finding independently.

**Craft does not track rating.** Highest rated is Fast Saver at 4.80★/377K on five screenshots, a typo ("Build-in Player") and a banner branded "Rposty" rather than its listing name. Lowest is Mobile Notepad at 3.83★ with the largest carousel (16 frames). InShot leads the category on search with half its carousel unlabelled. Other published typos: "Video downlaoder" (Story Saver, 50M+), "Instsaver" (InSaver), "Instgram" (Attractive Apps).

**Note:** Sky Vision Apps Lab's listing title is word-for-word our current title, "All Video Downloader & Saver", on a 10M-install app — already flagged under "The app" above.

**Guidance recorded on the tab:** fill the four empty phone slots first (vault, editor, MP3, batch downloads); take the platform marks out of frame 1 and follow Gamma Play's invented-source-app pattern; keep the gradient icon; replace speed claims with capability claims; say something specific in every heading; never run two visual systems at once; landscape is optional and differentiating.

## Rules for any change

- **No brand names** in store-listing copy: no TikTok, Instagram, Facebook, WhatsApp, YouTube, or "Insta". "Reels" may be used — checked live on Google Play, tolerated (see Tiksta relaunch above).
- **No claim the app can't back**: no "free", no "without ads" (the app contains ads), no YouTube references (Play removes apps that facilitate YouTube downloads), no "no watermark" promise. Every feature claim in shipped copy must map to the device-tested build in the Product Dossier.
- Every page on the site carries `<meta name="robots" content="noindex">` — keep it on new pages.
- **Public repo — no secrets**: never commit API keys, `google-services.json`, AdMob unit IDs, signing keys, release `.aab`/`.apk` builds or personal email addresses.
- **Competitors' store images** are kept in the repo for the Competitor's Graphics tab (`tabs/05-competitors-graphics/graphics/`), captured from public Play listings for research and credited to their original file on every figure. This replaces the earlier rule against storing them, which the 21 Sep 2026 visual review followed by linking to Play instead. Never use a competitor's artwork, UI, icon or wording in our own store assets.

## Where the detail is

| Question | File |
| --- | --- |
| Full text of a tab as rendered | [tabs/01-video-downloader.md](tabs/01-video-downloader.md) · [02-aso-playbook.md](tabs/02-aso-playbook.md) · [03-playstore-metadata.md](tabs/03-playstore-metadata.md) · [04-features-comparison.md](tabs/04-features-comparison.md) |
| How a tab works (calculations, filters, data flow) or a code change | `docs/backend/<tab>.md` (or `/backend <tab>`) — the full code that draws the tab and the full data it reads |
| Which markup line / render function / data field fills a section | [code-map.md](code-map.md) |
| A field in `assets/data.js` (`PAYLOAD`) | [data-dictionary.md](data-dictionary.md) |
| How the data was collected or scored | `docs/backend/research.md` (or `/backend research`), [research-index.md](research-index.md), [../research/README.md](../research/README.md) |
| Site structure, how to edit or add a tab | [README.md](README.md) |
| Whether the site still matches the original artifact | [parity.md](parity.md) |
