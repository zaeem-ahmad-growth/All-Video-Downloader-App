# Documentation: start here

Everything on the site at https://zaeem-ahmad-growth.github.io/All-Video-Downloader-App/ is in this repository as readable files, so any contributor or Claude session can answer questions and make changes without opening the site. The site came from the Claude artifact https://claude.ai/artifact/6tfDkSQ8xYfu2TEWBr9gxj; [parity.md](parity.md) shows it matches that artifact with no gaps.

## Answering a request

**"What does the site say about …?"** Search the tab snapshots in [tabs/](tabs/). Each is the full visible text of one tab (every heading, paragraph, table row, list item and image reference) with anchors such as `<a id="keywords">` for each section. For values the default view does not show (other markets, the live-listing version, rows hidden behind "show more"), read [assets/data.js](../assets/data.js) using the [data dictionary](data-dictionary.md).

**"Change …" or "Add …"** Find the section in the [code map](code-map.md): it gives the markup file and line, the function in [assets/app.js](../assets/app.js) that fills the section, and the data fields that function reads. Static wording lives in the tab's `index.html`; sentences built from numbers live in the named function; numbers and lists live in `assets/data.js`. After the change, commit and push; GitHub regenerates the generated docs by itself (see [CLAUDE.md](../CLAUDE.md)).

**"How does … work?" or a change to how a tab behaves** Load the tab's backend file in [backend/](backend/) (in Claude Code: `/backend <tab>`). It holds the full source of the code that draws the tab and the full data it reads. Wording-only requests do not need it.

**"Where did this number come from?"** The Google Play scrape and scoring scripts are in [research/](../research/) ([research/README.md](../research/README.md) lists each file); the methods are also written out in each tab's Method section. Every research script and small data file is in [backend/research.md](backend/research.md) in full, and every research file is listed with its structure in [research-index.md](research-index.md).

## What is where

| Path | What it is |
| --- | --- |
| [tabs/](../tabs/) | One folder per tab: `index.html` plus the images it uses |
| [assets/data.js](../assets/data.js) | `PAYLOAD`: all research data behind tabs 02-04, one field per line (plain JSON) |
| [assets/app.js](../assets/app.js) | Draws tabs 02-04 from `PAYLOAD`; `<body data-page>` picks the tab |
| [assets/site.css](../assets/site.css) · [assets/nav.js](../assets/nav.js) | Shared styles · the tab bar and its tab list |
| [assets/listing/](../assets/listing/) | The app's live Play Store icon, feature graphic and 4 screenshots |
| [docs/knowledge.md](knowledge.md) | Hand-written knowledge base: the key facts, findings and decisions. Imported into every Claude Code session by CLAUDE.md |
| [docs/tabs/](tabs/) | Generated: full text of each tab |
| [docs/code-map.md](code-map.md) | Generated: section → markup line → function → data fields |
| [docs/data-dictionary.md](data-dictionary.md) | Generated: every field in `assets/data.js`, with types, sizes and examples |
| [docs/backend/](backend/) | Generated: for each tab, the full code that draws it and the full data it reads; `research.md` holds every research script and small data file |
| [docs/research-index.md](research-index.md) | Generated: every file in `research/`, what it is and the structure of each data file |
| [docs/parity.md](parity.md) | Audit of the site against the original artifact |
| [tools/](../tools/) | `export-docs.js` regenerates the generated docs; `dom-to-md.js` is the page-to-Markdown converter it uses |
| [.github/workflows/docs.yml](../.github/workflows/docs.yml) | Runs `tools/export-docs.js` on GitHub after every push and commits the regenerated docs |
| [.claude/commands/backend.md](../.claude/commands/backend.md) | The `/backend <tab>` command for Claude Code |
| [research/](../research/) | Backend scripts, raw scrape and study files |

## The tabs

| Tab | Covers | Built from | Text snapshot |
| --- | --- | --- | --- |
| [Video Downloader](https://zaeem-ahmad-growth.github.io/All-Video-Downloader-App/tabs/01-video-downloader/) | Product dossier of the app (All Video Downloader 2.4, package `com.video.downloader.instagram.videosaver`): overview, spec, market research, versions and APK, monetization, 43 device screenshots, graphics, QA history | Static HTML in the page; images in `shots/` and `gfx/`; a small inline script for the screenshot viewer | [01-video-downloader.md](tabs/01-video-downloader.md) |
| [ASO Playbook](https://zaeem-ahmad-growth.github.io/All-Video-Downloader-App/tabs/02-aso-playbook/) | Who fills the top 10, the 16 competitors, keywords by competitor, events and offers, rank tracker, result slots, keyword board, 8 markets, ladder, proposed listing, practice, method | `app.js` render functions from `PAYLOAD.data`, `listing`, `assets` | [02-aso-playbook.md](tabs/02-aso-playbook.md) |
| [PlayStore Metadata](https://zaeem-ahmad-growth.github.io/All-Video-Downloader-App/tabs/03-playstore-metadata/) | The Tiksta listing copy (default) or the live listing: store assets, metadata, targeted and finalized keywords, platform-name keywords, ladder, competitor ranks, policy record, method | `renderMetadata()` from `PAYLOAD.tiksta`, `listing`, `data.board` | [03-playstore-metadata.md](tabs/03-playstore-metadata.md) |
| [Features Comparison](https://zaeem-ahmad-growth.github.io/All-Video-Downloader-App/tabs/04-features-comparison/) | Features only this app has, audit matrix against six competitor builds, listing claims of all 16, what ships, competitor strengths, IAP comparison, method | `renderFeatures()` from `PAYLOAD.features`, `data.profiles`, `data.claims` | [04-features-comparison.md](tabs/04-features-comparison.md) |

## The data in plain words

All of it was collected from Google Play on 16 Sep 2026 (`PAYLOAD.data.collectedAt`). Field-level detail is in the [data dictionary](data-dictionary.md).

| Field | What it holds | Shown on |
| --- | --- | --- |
| `data.markets` | The 8 markets: US, BR, DE, ES, IT, AU, AE, IN | Playbook market picker |
| `data.apps` | 392 apps seen in any result list, one record each: package id, title, developer, installs, rating, ratings count, release and update dates, brand flag, category, ads, in-app purchase range | Tooltips, result slots, tables everywhere |
| `data.mineIdx`, `data.compIdx`, `data.competitors` | This app's record and the 16 tracked competitors (indexes into `apps`) | Playbook, Features |
| `data.board.<market>` | The keyword board per market (100 US keywords, 40 elsewhere): intent tier, relevance, opportunity, priority, autocomplete demand, volume proxy, entry bar, each competitor's rank and the full result list | Keyword board, rank tracker, result slots, ladder, markets, metadata keywords |
| `data.profiles` | Full listing profile of each competitor and this app: title, descriptions, keyword density, placements per market, installs, rating, monetisation, feature claims | Competitors, keywords by competitor, features, IAP |
| `data.marketSummary`, `data.secondary` | Per-market summary (median entry bar, non-brand share) and the 40 keywords compared across markets | 8 markets |
| `data.claims`, `data.missing` | The 12 user features checked in every listing; searches that returned nothing | Listing claims, method |
| `listing` | The live listing (`current`), all scored title candidates, the 3 recommended titles, short descriptions and the proposed full description | Playbook listing, Metadata "Live listing" |
| `tiksta` | The Tiksta rebrand copy: recommended title and alternatives, short and full description, and `pc`, the Google Play check behind using "reels" | Metadata "Tiksta · new" (default view) |
| `assets` | The live store icon, feature graphic and screenshots (files in `assets/listing/`) | Metadata store assets, playbook listing card |
| `features` | The feature audit of six competitor builds, features only this app has, its claims, what ships per screen, competitor strengths, subscription plans | Features Comparison |
| `offersChecked` | Whether each listing showed an Events & offers card | Events & offers |
| `dossierSections` | The 8 dossier sections and their menu labels | Video Downloader tab menu |

## Views the snapshots do not show

The snapshots record each tab in its default state. These controls change what is on screen; the data for every option is already in `assets/data.js`.

- ASO Playbook: market picker (8 markets, remembered in the browser), competitor picker and "show all" in Keywords by competitor, "Show every keyword" in the rank tracker, "Show more searches" in result slots, tier filters, keyword search and column sorting on the keyword board, hover tooltips on ranks and slots.
- PlayStore Metadata: the version switch in the bar, "Tiksta · new" (default) or "Live listing" (`renderMetadata('live')`).
- Video Downloader: click any screenshot to enlarge it.

## Keeping this complete

- The generated files carry a "do not edit by hand" note. Nobody regenerates them by hand: after every push, GitHub runs `tools/export-docs.js` (the "Update docs" workflow) and commits the result, so it costs no one's Claude credits.
- `docs/knowledge.md` and this file are written by hand. When a change makes one of their facts wrong, correct it in the same commit.
- New tabs are picked up automatically from the `TABS` list in `assets/nav.js`.
- Put new backend material (scripts, raw data, reports as `.md`, `.json`, `.csv`) in `research/` and list it in `research/README.md`. Never commit secrets (see the content rules in [CLAUDE.md](../CLAUDE.md)).
