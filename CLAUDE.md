# All Video Downloader App: rules for Claude

This repository is the shared, public research site for the Android app **All Video Downloader** (package `com.video.downloader.instagram.videosaver`, developer Cell Cave), which is being relaunched on Google Play as **Tiksta**. Several people edit it, each from their own VS Code and their own Claude account. GitHub Pages publishes the `main` branch as it is: there is no build step, and a push goes live about a minute later at `https://zaeem-ahmad-growth.github.io/All-Video-Downloader-App/`.

The site started as the Claude artifact https://claude.ai/artifact/6tfDkSQ8xYfu2TEWBr9gxj. Only the account that owns an artifact can update it, so this repository is now the master copy. Edit here, not the artifact.

**Start with [docs/README.md](docs/README.md).** It says where everything is and how to answer a request. [docs/tabs/](docs/tabs/) holds the full visible text of every tab, [docs/code-map.md](docs/code-map.md) maps every section to its markup line, the function that fills it and the data it reads, and [docs/data-dictionary.md](docs/data-dictionary.md) describes every field in `assets/data.js`. [docs/parity.md](docs/parity.md) records that the site matches the original artifact with no gaps.

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
docs/                          start with docs/README.md; tabs/, code-map.md and data-dictionary.md are generated
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

Every page works when opened straight from disk: open `tabs/<NN>-<slug>/index.html` in a browser, click through the tabs and the section links, and look for errors in the browser console.

## Saving and publishing

1. `git pull --rebase`
2. If you changed a tab, `assets/app.js` or `assets/data.js`, run `node tools/export-docs.js` (Node 18+, with Edge or Chrome installed). It regenerates `docs/tabs/`, `docs/code-map.md` and `docs/data-dictionary.md`; commit them with your change. If it cannot run on your machine, say so to the user rather than editing the generated files by hand.
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
