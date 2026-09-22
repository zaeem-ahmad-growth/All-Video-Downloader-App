# Features Comparison

> **Generated file: do not edit by hand.** Full visible text of the tab as it renders by default, produced by `node tools/export-docs.js`, which GitHub runs after every push.
> Live page: https://zaeem-ahmad-growth.github.io/All-Video-Downloader-App/tabs/04-features-comparison/ · Source: [tabs/04-features-comparison/index.html](../../tabs/04-features-comparison/index.html) · Drawn by [assets/app.js](../../assets/app.js) from [assets/data.js](../../assets/data.js) · Where each section comes from: [code map](../code-map.md#04-features-comparison)
> Controls on the page (market pickers, version switches, filters, "show more") change the view; this snapshot shows their default state. The data behind every state is in [assets/data.js](../../assets/data.js), described in the [data dictionary](../data-dictionary.md).

<a id="features"></a>

<a id="f-overview"></a>

**Features Comparison** · Feature audit · listing claims · IAP · Verified against the Product Dossier

# Features Comparison

Our app against six audited competitor builds and all 16 tracked listings. It is the only app in the audit with MP3 extraction, batch downloads and a PIN-locked vault, and the only one anywhere in the set that pairs a downloader with a 9-tool video editor.

3 · audited features only our app ships · 10/10 · audit coverage · best competitor 7 · 12/12 · user features shipped · best competitor listing claims 8 · 9 · editing tools · no audited competitor has one

<a id="f-lead"></a>

Where we lead

## What only this app does

Only in our app

### A 9-tool video editor

Trim, split, crop, merge, aspect ratio, add audio, extract audio, filters & effects and watermark — built on Media3 Transformer and checked frame by frame on a device.

Only in our app

### A private vault with PIN and biometrics

Hide videos, pictures and audio behind a 4-digit PIN with fingerprint unlock and a security question to reset. None of the six audited competitors ships a locked vault.

Only in our app

### MP3 and audio extraction

Pick a range and save the audio. The only app in the audit that extracts audio.

Only in our app

### Batch downloads that survive the background

Parallel downloads with pause, resume and retry, kept alive by a foreground service. The only app in the audit with batch downloading.

Only in our app

### Nine languages, including right-to-left

English, Urdu, Arabic, Hindi, Turkish, German, French, Brazilian Portuguese and Chinese, with mirrored layouts for Urdu and Arabic.

<a id="f-audit"></a>

The audit · seven apps · static APK analysis

## Feature audit matrix

Your team’s audit of six competitor builds against ours, grouped by job. The last column counts how many of the six ship each feature. Each competitor’s header shows how many US keywords it ranks in the top 10 for, from the ASO Playbook.

Ships · Not in the build

| Feature | Our app<br>5+ | Sky Vision<br>10M+<br>0 top-10s · 8 mkts | Attractive Apps Valley<br>10M+<br>1 top-10s · 8 mkts | Markhoor Studio<br>5M+<br>0 top-10s · 8 mkts | Mobile Notepad<br>5M+<br>0 top-10s · 8 mkts | Vidow (VIDOXE)<br>100M+<br>0 top-10s · 8 mkts | Vidpal<br>50M+<br>0 top-10s · 8 mkts | Competitors with it |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Downloading |  |  |  |  |  |  |  |  |
| WebView browser + link sniffer | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | **6** / 6 |
| HLS / DASH stream download | ✓ | ✓ | ✓ | ✓ | ✓ | ✕ | ✓ | **5** / 6 |
| Clipboard paste-to-download | ✓ | ✓ | ✕ | ✓ | ✓ | ✕ | ✓ | **4** / 6 |
| Offline library + background downloads | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | **6** / 6 |
| Batch downloads | ✓ | ✕ | ✕ | ✕ | ✕ | ✕ | ✕ | **0** / 6 |
| Saving & audio |  |  |  |  |  |  |  |  |
| WhatsApp status saver (+ WA Business) | ✓ | ✕ | ✕ | ✓ | ✓ | ✕ | ✓ | **3** / 6 |
| MP3 / audio extraction | ✓ | ✕ | ✕ | ✕ | ✕ | ✕ | ✕ | **0** / 6 |
| Privacy |  |  |  |  |  |  |  |  |
| Private vault + biometric / PIN lock | ✓ | ✕ | ✕ | ✕ | ✕ | ✕ | ✕ | **0** / 6 |
| Playback & experience |  |  |  |  |  |  |  |  |
| Media3 / ExoPlayer player | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | **6** / 6 |
| Onboarding + dark mode | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | **6** / 6 |
| Coverage | 10 | 6 | 5 | 7 | 7 | 4 | 7 | of 10 |

The slide also lists “Jetpack Compose modern UI” with our app marked ✓. The Product Dossier’s spec, read from app/build.gradle, shows Android Views + ViewBinding, so the row is left out rather than shown with a claim the build does not support.

<a id="f-claims"></a>

Listing claims · all 16 competitors · live Play descriptions

## What each listing tells users it can do

Read from every competitor’s live title, short and full description. Our column shows what the app ships; a “not in listing” mark means the feature exists but your current listing never mentions it.

| Feature | Our app<br>product | InShot<br>100,000,000+ | Gamma Play<br>100,000+ | QR Code Scanner<br>100,000,000+ | Story Saver<br>50,000,000+ | InSaver<br>10,000,000+ | Hub (DOSA)<br>10,000,000+ | Fast Saver<br>10,000,000+ | AppTool<br>10,000,000+ | Saver & Player Studio<br>50,000,000+ | DevBay<br>50,000,000+ | Sky Vision<br>10,000,000+ | Attractive Apps<br>10,000,000+ | Markhoor<br>10,000,000+ | Mobile Notepad<br>5,000,000+ | Vidow<br>100,000,000+ | Vidpal<br>50,000,000+ | Listings claiming it |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Paste link to download | ✓ | ✕ | ✓ | ✕ | ✓ | ✓ | ✕ | ✓ | ✕ | ✓ | ✓ | ✓ | ✓ | ✕ | ✕ | ✓ | ✓ | **10** / 16 |
| Built-in browser with auto-detect | ✓<br>not in listing | ✓ | ✓ | ✓ | ✕ | ✕ | ✓ | ✕ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✕ | ✓ | **12** / 16 |
| Choose video quality / HD | ✓ | ✓ | ✓ | ✓ | ✕ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | **15** / 16 |
| Background downloads · pause & resume | ✓<br>not in listing | ✓ | ✓ | ✓ | ✕ | ✕ | ✓ | ✕ | ✓ | ✓ | ✓ | ✕ | ✕ | ✓ | ✓ | ✓ | ✕ | **10** / 16 |
| Multiple / batch downloads | ✓<br>not in listing | ✓ | ✓ | ✕ | ✓ | ✓ | ✓ | ✕ | ✓ | ✓ | ✓ | ✕ | ✕ | ✓ | ✕ | ✓ | ✕ | **10** / 16 |
| Story & reels saver | ✓ | ✕ | ✓ | ✕ | ✓ | ✓ | ✕ | ✓ | ✕ | ✕ | ✓ | ✓ | ✓ | ✓ | ✓ | ✕ | ✕ | **9** / 16 |
| WhatsApp status saver | ✓ | ✕ | ✕ | ✕ | ✕ | ✕ | ✕ | ✕ | ✕ | ✕ | ✓ | ✕ | ✕ | ✕ | ✕ | ✕ | ✕ | **1** / 16 |
| MP3 / audio extraction | ✓<br>not in listing | ✓ | ✕ | ✕ | ✓ | ✓ | ✕ | ✕ | ✕ | ✕ | ✕ | ✕ | ✕ | ✓ | ✓ | ✕ | ✕ | **5** / 16 |
| Private folder / vault / lock | ✓<br>not in listing | ✓ | ✓ | ✓ | ✕ | ✕ | ✓ | ✕ | ✓ | ✓ | ✕ | ✓ | ✕ | ✓ | ✓ | ✕ | ✕ | **9** / 16 |
| Built-in video editor (cut, crop, merge) | ✓<br>not in listing | ✕ | ✕ | ✕ | ✕ | ✕ | ✕ | ✕ | ✕ | ✕ | ✕ | ✕ | ✕ | ✕ | ✕ | ✕ | ✕ | **0** / 16 |
| Video player | ✓<br>not in listing | ✓ | ✕ | ✓ | ✕ | ✕ | ✕ | ✕ | ✓ | ✓ | ✓ | ✕ | ✓ | ✓ | ✓ | ✓ | ✓ | **10** / 16 |
| Multi-language interface | ✓<br>not in listing | ✕ | ✕ | ✕ | ✕ | ✕ | ✕ | ✕ | ✕ | ✕ | ✕ | ✕ | ✕ | ✕ | ✕ | ✕ | ✕ | **0** / 16 |
| Claims | 12 | 7 | 7 | 5 | 4 | 5 | 5 | 3 | 6 | 7 | 8 | 5 | 5 | 8 | 7 | 5 | 4 |  |

Competitor columns show what each listing claims, not a code audit — an app may ship a feature its listing never mentions. Your current listing mentions 4 of the 12 features your app ships; the ones it leaves out are built-in browser with auto-detect, background downloads · pause & resume, multiple / batch downloads, mp3 / audio extraction, private folder / vault / lock, built-in video editor (cut, crop, merge), video player, multi-language interface.

<a id="f-inventory"></a>

Evidence · device-tested build

## What ships in the app

From the Product Dossier and the app’s own screens.

Download

- Paste a link, share into the app, or pick from Quick Platforms
- Quick Platforms: Facebook, Instagram, TikTok, LinkedIn, X, Dailymotion, Likee, Snapchat, WhatsApp and WhatsApp Business
- Quality picker (for example 720p, 360p, 240p)
- Parallel downloads with pause, resume and retry
- Foreground service keeps large downloads alive

Video cutter · 9 tools

- Cut & compress, crop, split and merge
- Aspect ratio with colour or blur fill
- Add audio and extract MP3
- Filters & effects
- Add watermark with image or styled text
- Trim start, trim middle, trim end, volume and speed

Vault

- Hidden videos, pictures and audio
- 4-digit PIN with biometric unlock
- Security question to reset the PIN
- Change PIN

Manage & settings

- Rename, share, delete and favourite
- WhatsApp and WhatsApp Business status saver
- Download location and subscription settings
- Nine languages with right-to-left layouts

Verified on a real phone

- TikTok, Facebook, Instagram (reels, videos, carousels), LinkedIn, X, Dailymotion and Vimeo downloaded end to end
- 0 crashes and 0 ANRs across the device rounds
- QA score 95 / 100

<a id="f-edges"></a>

Honest read

## Where competitors are strong

Competitor strength

### InShot · Video Downloader

The category leader: 100M+ installs, a 4.7 rating from about 2.7M ratings, a browser with auto-detect and a password-protected folder.

Competitor strength

### Vidow · Video Downloader HD

100M+ installs with a resolution picker and casting to a TV.

Competitor strength

### Vidpal · 4K Downloader

50M+ installs, paste-link downloading and a 4K player.

Search visibility

### InShot Inc. owns the search results

51 US top-10 placements and 4.72 stars from 2.7M ratings. Features win the comparison; ratings volume and ranking history are where the leaders are hardest to catch.

<a id="f-iap"></a>

IAP comparison · Google Play · United States

## In-app purchase ranges

The price range each listing shows for in-app purchases in the US, alongside ads. The bar spans each app’s cheapest to most expensive item on a $0–$100 scale.

| App | Installs | Rating | Ads | In-app purchases (US) | Range · $0–$100 |
| --- | --- | --- | --- | --- | --- |
| **All Video Downloader & Player**<br>QR Code Scanner. | 100,000,000+ | 4.5 | Ads | None | — |
| **Video Downloader**<br>InShot Inc. | 100,000,000+ | 4.7 | Ads | $2.99 - $6.99 per item |  |
| **Video Downloader HD - Vidow**<br>Vidow™ | 100,000,000+ | 4.0 | Ads | $14.99 per item |  |
| **Video Downloader and 4k Player**<br>Vidpal Apps Studio | 50,000,000+ | 4.3 | Ads | $1.99 - $34.99 per item |  |
| **All Video Downloader & Browser**<br>Fast Video Downloader & Story Saver - DevBay | 50,000,000+ | 3.9 | Ads | $2.99 - $49.99 per item |  |
| **Video downloader - Story Saver**<br>Video Downloader Story Saver | 50,000,000+ | 4.7 | Ads | $0.09 - $119.99 per item |  |
| **Video Downloader & Video Saver**<br>All Video Downloader, Saver & Player Studio | 50,000,000+ | 4.4 | Ads | None | — |
| **All video downloader and saver**<br>Attractive Apps Valley | 10,000,000+ | 4.0 | Ads | $6.49 - $29.99 per item |  |
| **Video Downloader & Story Saver**<br>Video Downloader & Fast Saver | 10,000,000+ | 4.8 | Ads | $0.99 - $8.99 per item |  |
| **All Video Downloader & Saver**<br>Sky Vision Apps Lab | 10,000,000+ | 4.1 | Ads | $3.99 - $14.99 per item |  |
| **All Video Downloader & Player**<br>AppTool-Browser-Video | 10,000,000+ | 4.4 | No ads | None | — |
| **Hub Video Downloader**<br>DOSA Apps | 10,000,000+ | 4.4 | Ads | $0.99 - $99.99 per item |  |
| **InSaver: All Video Downloader**<br>Video Downloader Story Saver | 10,000,000+ | 4.7 | Ads | $1.99 - $29.99 per item |  |
| **Video Downloader & Save Video**<br>Markhoor Studio | 10,000,000+ | 4.0 | Ads | $3.49 per item |  |
| **Video Downloader - Player**<br>Mobile Notepad Apps | 5,000,000+ | 3.8 | Ads | $1.99 - $14.99 per item |  |
| **Video Downloader - without ads**<br>Gamma Play | 100,000+ | 4.6 | No ads | None | — |
| **All Video Downloader & Saver**<br>Your app | 5+ | — | Ads | $4.99 - $19.99 per item |  |

### Our plans

Weekly · Rs 1,400 · weekly_plan · Monthly · Rs 5,600 · monthly_plan

Premium removes all ads. Prices as Google Play shows them in Pakistan. In the US, Play shows the app’s in-app items at $4.99 - $19.99 per item. Premium removes ads; it does not unlock faster or unlimited downloads.

<a id="f-method"></a>

Method

## Where this comes from

**Feature audit.** The matrix is your team’s static analysis of six competitor APKs against ours (Slide 7). One row, “Jetpack Compose modern UI”, is left out because the Product Dossier’s spec shows the app is built with Android Views.

**Listing claims.** Each competitor’s live Google Play title, short and full description (US, English) was searched for wording that describes each feature. A ✕ means the listing does not claim it, not that the app lacks it.

**Our column.** Features come from the Product Dossier: the build’s spec and the device-tested QA rounds. “Not in listing” marks features your current Play listing never mentions.

**IAP.** Price ranges are the “In-app purchases” line each listing shows in the United States. Our plan prices are the Pakistan prices recorded in the dossier.
