# Research data

The backend data and scripts behind the site's tabs.

| Folder | What it holds | Tabs it feeds |
| --- | --- | --- |
| `aso-pipeline/` | The Google Play scrape of 16 Sep 2026 and the scripts that scored it | ASO Playbook, PlayStore Metadata, Features Comparison, Video Downloader |
| `tiksta-title-check/` | The Google Play title check for "reels" and the scoring of the Tiksta copy | PlayStore Metadata |
| `competitor-visual-memory/` | Review of the 16 competitors' store visuals (21 Sep 2026), links only | — |

## aso-pipeline/

The scripts run in this order; each writes the file the next one reads.

| Step | Writes | What it does |
| --- | --- | --- |
| `lib.js` | `cache/` | Google Play scraper (search, app details per market, autocomplete). Every response is cached by query; delete `cache/` to force a fresh scrape. |
| `discover.js` | `discover.json` | Finds who ranks on the category's head terms in the US |
| `collect.js` | `raw.json` | Result lists for every keyword in 8 markets, metadata for every app found, autocomplete demand |
| `analyze.js` | `data.json` | Classifies apps and keywords; scores relevance, opportunity and priority; builds the competitor rank tables |
| `assets.js` | `offers.json`, `myassets.json` | Checks competitors for Events & offers cards; records our own listing assets |
| `scope.js` | `dossier-parts.json` | Turns the original product dossier (`dossier-source.html`) into the Video Downloader tab |
| `build.js` + `template.html` | the one-page site | Injected the data into the page. This is the 17 Sep version, which adds a Competitor's Graphics tab; `sep-16-build/` holds the version the published artifact came from. |

Also here: `features.json`, the hand-edited feature audit; `inspect.js`, which prints keywords and competitor ranks for spot checks; and the 17 Sep competitor-graphics study (`graphics.js`, `convert.ps1`, `graphics-src.json`, `graphics-manifest.json`, `graphics-notes.json`, `batch1.txt`, `batch2.txt`). The competitor images that study downloaded are not in this repository.

Run the scripts with Node 18 or later, for example `node collect.js`. `build.js` also reads a stylesheet from the owner's local ASO toolkit, so it does not run from this folder. The live pages are no longer built from it: after a fresh scrape, carry the new numbers from `data.json` into `assets/data.js`.

## tiksta-title-check/

- `playcheck.ps1` searches Google Play for 16 reels- and brand-related queries and reads every app it finds (title, installs, dates) into `playcheck.json`. `pc.json` summarises how many long-lived apps carry each term in their title.
- `score.ps1` scores title and short-description candidates for Tiksta against the US keyword board in `payload.json`, using the full description in `tiksta-long.txt`. Add `-Detail` to list keyword by keyword.

Both run with Windows PowerShell 5.1 and read and write files next to themselves.

## Kept out on purpose

The repository is public, so these stay out: the Firebase config (`google-services.json`), AdMob unit IDs, release `.aab` builds, signing keys and copies of competitors' store images.
