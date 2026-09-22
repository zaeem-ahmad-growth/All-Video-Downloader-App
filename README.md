# All Video Downloader App

Research site for the Android app **All Video Downloader** (`com.video.downloader.instagram.videosaver`, Cell Cave), which is being relaunched on Google Play as **Tiksta: Reels Video Downloader**.

**Live site:** https://zaeem-ahmad-growth.github.io/All-Video-Downloader-App/

| Tab | What it covers |
| --- | --- |
| [Video Downloader](https://zaeem-ahmad-growth.github.io/All-Video-Downloader-App/tabs/01-video-downloader/) | Product dossier: overview, spec, market research, versions and APK, monetization, screenshots, graphics, QA history |
| [ASO Playbook](https://zaeem-ahmad-growth.github.io/All-Video-Downloader-App/tabs/02-aso-playbook/) | Competitors, keyword ranks in 8 markets, result slots, keyword board, keyword ladder, listing recommendation |
| [PlayStore Metadata](https://zaeem-ahmad-growth.github.io/All-Video-Downloader-App/tabs/03-playstore-metadata/) | The Tiksta listing copy against the live listing, store assets, keyword coverage, policy record |
| [Features Comparison](https://zaeem-ahmad-growth.github.io/All-Video-Downloader-App/tabs/04-features-comparison/) | Feature audit against competitor builds, listing claims, in-app purchase comparison |

Each section of a tab has its own link, for example `.../tabs/02-aso-playbook/#keywords`.

## Documentation

Start with [docs/README.md](docs/README.md): the full text of every tab ([docs/tabs/](docs/tabs/)), a [code map](docs/code-map.md) from each section to its markup, code and data, a [data dictionary](docs/data-dictionary.md) of every field, and a [parity report](docs/parity.md) against the original Claude artifact. `node tools/export-docs.js` regenerates the generated parts.

## How it is built

Plain HTML, CSS and JavaScript, published by GitHub Pages straight from the `main` branch; there is no build step. Every page opens from disk too. `CLAUDE.md` describes the layout and the editing rules, and Claude Code loads it automatically. `CONTRIBUTING.md` covers getting access and making changes.

The pages were split from the Claude artifact https://claude.ai/artifact/6tfDkSQ8xYfu2TEWBr9gxj on 22 Sep 2026. This repository is now the master copy.

## Data

The Google Play data behind tabs 02-04 (collected 16 Sep 2026) is in `assets/data.js`. The scripts and raw data that produced it go in [`research/`](research/).
