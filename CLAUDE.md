# All Video Downloader App: rules for Claude

This repository is the shared, public research site for the Android app **All Video Downloader** (package `com.video.downloader.instagram.videosaver`, developer Cell Cave), which is being relaunched on Google Play as **Tiksta**. Several people edit it, each from their own VS Code and their own Claude account. GitHub Pages publishes the `main` branch as it is: there is no build step, and a push goes live about a minute later at `https://zaeem-ahmad-growth.github.io/All-Video-Downloader-App/`.

The site started as the Claude artifact https://claude.ai/artifact/6tfDkSQ8xYfu2TEWBr9gxj. Only the account that owns an artifact can update it, so this repository is now the master copy. Edit here, not the artifact.

## Knowledge base (always loaded)

The file below is imported into every Claude Code session in this repository, so the key facts are known before any request.

@docs/knowledge.md

## Load only what the request needs

Keep every request cheap. Answer from the knowledge base when you can, and open other files only when the request needs them:

| The request is about | Open | Do not |
| --- | --- | --- |
| Wording, numbers or a new paragraph on a tab | `docs/tabs/<tab>.md` to find the text, then the file and line the [code map](docs/code-map.md) points to (the tab's `index.html`, or `assets/data.js`) | load backend files, or run scripts, browsers, builds or checks |
| How a tab works (calculations, filters, data flow, behaviour) or a change to its code | `docs/backend/<tab>.md` first, or run `/backend <tab>`: the full code that draws the tab and the full data it reads | run anything the user did not ask for |
| How the data was collected or scored | `docs/backend/research.md` (or `/backend research`), `docs/research-index.md`, `research/README.md` | re-run the scrapers unless the user asks |
| What a data field means | `docs/data-dictionary.md` | |
| Anything else about the repository | `docs/README.md` | |

## Layout

```
index.html                     redirects to the first tab
assets/
  nav.js                       the tab bar on every page; the TABS list sets the tabs and their order
  site.css                     shared styles (the Video Downloader tab's styles are scoped under #dossier)
  data.js                      PAYLOAD: the research data behind tabs 02-04
  app.js                       draws tabs 02-04 from PAYLOAD; <body data-page="..."> picks which part runs
  listing/                     the app's Play Store icon, feature graphic and screenshots
tabs/
  01-video-downloader/         product dossier: static HTML, images in shots/ and gfx/
  02-aso-playbook/             data-driven (data-page="playbook")
  03-playstore-metadata/       data-driven (data-page="metadata")
  04-features-comparison/      data-driven (data-page="features")
docs/                          knowledge.md (always loaded) and README.md are written by hand; everything else is generated
  backend/                     per tab: the full code that draws it and the full data it reads; research.md: every research script
.github/workflows/docs.yml     regenerates docs/ on GitHub after every push
.claude/commands/backend.md    the /backend command, which loads a tab's code and data
tools/                         export-docs.js regenerates docs/; dom-to-md.js converts a rendered page to Markdown
research/                      backend data and scripts behind the pages
```

## Editing an existing tab

- Tab 01 is plain HTML: edit `tabs/01-video-downloader/index.html` directly. Keep its section menu (the `.jump` links in the bar) in step with the section `id`s.
- Tabs 02-04 are mostly drawn by `assets/app.js` from `assets/data.js`. Numbers and tables come from `PAYLOAD`; most sentences are written in the render function for that tab (`renderHeader`, `renderListing`, `renderMetadata`, `renderFeatures` and so on). Static headings and section intros are in the tab's `index.html`.
- `app.js` and `data.js` are shared by three tabs. After changing them, open all three tabs and check that nothing broke (see "Checking your work").
- `assets/data.js` is laid out one field per line. The value after each `= ` is plain JSON, so keep it valid JSON: double quotes, no trailing commas, no comments inside.

## Adding a tab

1. Run `git pull --rebase` first.
2. Create `tabs/<NN>-<slug>/index.html`. `NN` is one more than the highest number in `tabs/`; `<slug>` is short, lowercase and hyphenated.
3. Start from the page skeleton of an existing tab: the `<head>` (fonts and `../../assets/site.css`), the `<nav class="bar" id="bar">` block with an empty `<div class="tabs" id="site-tabs">`, and the `<script src="../../assets/nav.js"></script>` line straight after the nav. Set `<body data-page="<slug>">` and a `<title>` of the form `<Tab label> · All Video Downloader`.
4. Put the tab's own CSS and JS inline, or in files inside the tab folder. Save its images and data files in the tab folder and use relative paths (`img/chart.png`), never `/img/...` and never a claude.ai URL.
5. Add one line to `TABS` in `assets/nav.js`: `{ slug: '<NN>-<slug>', label: '<Tab label>' }`.
6. The page must work at phone width and in light and dark mode. Reuse the CSS variables in `site.css` (`--surface`, `--ink`, `--accent`, `--line` and so on) instead of fixed colours.

To turn a Claude artifact into a tab: read it with the Artifact tool (`action: "read"`), fetch every file it references (`action: "read"` with `paths`) into the tab folder, then wrap it in the skeleton above.

## Checking your work

Only after a code change (`assets/app.js`, a page's `<script>`, or the structure of `assets/data.js`): open the affected tab pages from disk in a browser, click through them and look for errors in the browser console. Skip this for wording and number edits.

## Saving and publishing

1. `git pull --rebase`
2. Do not run `tools/export-docs.js` and do not edit the generated files in `docs/`: after your push, GitHub regenerates them (the "Update docs" workflow) and commits the result within a few minutes, so run `git pull --rebase` before your next change. If your change makes a fact in `docs/knowledge.md` wrong, correct that line in the same commit.
3. `git add` only the files you changed, then `git commit -m "<Tab label>: <what changed>"`.
4. `git push`. If it is rejected because someone pushed first, run `git pull --rebase` and push again. Never force-push.
5. Tell the user the change is live about a minute after the push, at `https://zaeem-ahmad-growth.github.io/All-Video-Downloader-App/tabs/<NN>-<slug>/`.

## Other people's work

- Change or delete only what the user asked for. Before rewriting someone else's section or tab, check who wrote it with `git log --format=%an -- <path>` and confirm with the user.
- Never renumber or rename other tabs. Do not restructure `assets/` unless the repository owner asks.

## Content rules

- The repository and site are public. Never commit API keys, tokens, passwords, `google-services.json`, AdMob unit IDs, signing keys, release `.aab`/`.apk` builds or personal email addresses.
- Store-listing copy written for this app (title, short and full description) must not contain other companies' brand names: no TikTok, Instagram, Facebook, WhatsApp, YouTube, and no "Insta". A borderline term that is generic in the niche, such as "reels", may be used only after a Google Play title check shows many long-lived apps with good installs carry it in their titles.
- Competitor names are fine in research content.
- The site carries `<meta name="robots" content="noindex">` on every page to keep it out of search engines. Keep it on new pages.
