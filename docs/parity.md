# Artifact parity report

> Produced on 2026-09-22 by a one-off audit that compared each Claude artifact with this repository, line by line. Re-run the audit only when an artifact changes; day-to-day edits happen in this repository, which is the master copy.

## https://claude.ai/artifact/6tfDkSQ8xYfu2TEWBr9gxj

Artifact version `1789559766-527d` (the live version on 2026-09-22).

### Files

51 of 51 published files are in the repository, byte for byte (SHA-256).

| Artifact path | Repository path |
| --- | --- |
| `gfx/` | `tabs/01-video-downloader/gfx/` |
| `shots/` | `tabs/01-video-downloader/shots/` |
| `listing/` | `assets/listing/` |

### Data

**Identical.** Every value in the artifact's `PAYLOAD` (including `PAYLOAD.tiksta`) was compared with [assets/data.js](../assets/data.js) after undoing the one intended change: image paths now point into `assets/` (`listing/` → `../../assets/listing/`). `assets/data.js` is laid out one field per line; the values are unchanged.

### Script

[assets/app.js](../assets/app.js) is the artifact's script with only the changes needed to run one tab per page: 533 of 564 artifact lines are unchanged, 31 replaced and 22 added. What changed:

- At the top: `PAGE` (read from `<body data-page>`) and an `on(id, …)` helper that attaches a listener only if the element exists on this page.
- Listener lines that used `document.getElementById(id).addEventListener(…)` now use `on(id, …)`; lightbox listeners are guarded with `if (lb)`.
- The tab-switching block at the end (`setTab`, tab buttons, cross-tab anchor handling) is replaced by a block that runs only the current page's render functions and then scrolls to `#section` links.

<details><summary>Exact lines removed and added</summary>

```diff
-   document.getElementById('strips-more').addEventListener('click', () => { state.strips += 20; renderStrips(); });
-   // ---------- TAB 4 · dossier ----------
-   function renderDossierNav() {
-     document.getElementById('jump-dossier').innerHTML = PAYLOAD.dossierSections.map(s => `<a href="#${esc(s.id)}">${esc(s.label)}</a>`).join('');
-     const lbx = document.getElementById('lightbox'), img = document.getElementById('lb-img'), cap = document.getElementById('lb-cap');
-     if (!lbx) return;
-     document.querySelectorAll('#dossier .phone').forEach(b => b.addEventListener('click', () => { img.src = b.dataset.full; img.alt = b.querySelector('img').alt; cap.textContent = b.dataset.cap || ''; if (typeof lbx.showModal === 'function') lbx.showModal(); }));
-     document.getElementById('lb-close').addEventListener('click', () => lbx.close());
-     lbx.addEventListener('click', e => { if (e.target === lbx) lbx.close(); });
-   }
- 
-   // ---------- tabs ----------
-   addEventListener('resize', syncBar);
-   const TABS = ['dossier', 'playbook', 'metadata', 'features'];
-   function setTab(t, top) {
-     document.querySelectorAll('[data-tab]').forEach(el => { el.hidden = el.dataset.tab !== t; });
-     TABS.forEach(x => { document.getElementById('tab-' + x).setAttribute('aria-selected', String(x === t)); document.getElementById('jump-' + x).hidden = x !== t; });
-     document.getElementById('mk').hidden = t !== 'playbook';
-     document.getElementById('mv').hidden = t !== 'metadata';
-     tip.hidden = true; syncBar(); if (top) scrollTo(0, 0);
-   }
-   TABS.forEach(t => document.getElementById('tab-' + t).addEventListener('click', () => setTab(t, true)));
-   document.addEventListener('click', e => { const a = e.target.closest && e.target.closest('a[href^="#"]'); if (!a) return; const el = document.getElementById(a.getAttribute('href').slice(1)); if (!el) return; const host = el.closest('[data-tab]'); if (host && host.hidden) { e.preventDefault(); setTab(host.dataset.tab, false); el.scrollIntoView(); } });
-   document.getElementById('matrix-all').addEventListener('change', e => { state.all = e.target.checked; renderMatrix(); });
-   renderHeader(); renderMarketSel(); renderTierChips(); renderCompDetailSelect(); renderCompDetail(); renderEvents(); renderMarkets(); renderListing(); renderMetadata('tiksta'); renderFeatures();
-   document.querySelectorAll('#mv [data-ver]').forEach(b => b.addEventListener('click', () => {
-     document.querySelectorAll('#mv [data-ver]').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
-     renderMetadata(b.dataset.ver);
-   })); renderDossierNav(); renderScoped();
-   const h = decodeURIComponent(location.hash.slice(1)), el = h && document.getElementById(h), host = el && el.closest('[data-tab]');
-   if (host && host.dataset.tab !== 'dossier') { setTab(host.dataset.tab, false); el.scrollIntoView(); } else setTab('dossier', false);
+   const PAGE = document.body.dataset.page;
+   // ---------- page ----------
+   addEventListener('resize', syncBar); syncBar();
+ 
+   if (PAGE === 'playbook') {
+     document.getElementById('strips-more').addEventListener('click', () => { state.strips += 20; renderStrips(); });
+     document.getElementById('matrix-all').addEventListener('change', e => { state.all = e.target.checked; renderMatrix(); });
+     renderHeader(); renderMarketSel(); renderTierChips(); renderCompDetailSelect(); renderCompDetail(); renderEvents(); renderMarkets(); renderListing(); renderScoped();
+   } else if (PAGE === 'metadata') {
+     renderMetadata('tiksta');
+     document.querySelectorAll('#mv [data-ver]').forEach(b => b.addEventListener('click', () => {
+       document.querySelectorAll('#mv [data-ver]').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
+       renderMetadata(b.dataset.ver);
+     }));
+   } else if (PAGE === 'features') {
+     renderFeatures();
+   }
+ 
+   // Sections are drawn by this script, so jump to a #section link only after rendering.
+   const h = decodeURIComponent(location.hash.slice(1)), el = h && document.getElementById(h);
+   if (el) el.scrollIntoView();
+ 
```

</details>

### Styles

**Identical.** All 3 of the artifact's style blocks are in [assets/site.css](../assets/site.css) verbatim. Added after them: the rules for the tab links (`.tabs a`). The host page's own wrapper style is not needed; only its `img{max-width:100%}` rule is kept.

### Rendered text, tab by tab

The artifact and each tab page were rendered in headless Microsoft Edge with the same default settings (US market, default version and filters), and all visible text, tables, lists, links and image references were converted to Markdown with [tools/dom-to-md.js](../tools/dom-to-md.js) and compared line by line. Image and file links are compared by file name, since the folders moved. Because the data and the render code are the same, every other view (other markets, other versions, filters and sort orders) matches too.

| Tab | Artifact lines | Tab page lines | Result |
| --- | --- | --- | --- |
| [01-video-downloader](tabs/01-video-downloader.md) | 448 | 448 | identical |
| [02-aso-playbook](tabs/02-aso-playbook.md) | 654 | 654 | identical |
| [03-playstore-metadata](tabs/03-playstore-metadata.md) | 421 | 421 | identical |
| [04-features-comparison](tabs/04-features-comparison.md) | 146 | 146 | identical |

## Result

**No gaps.** Every file, every data value, every style rule and every line of visible text in the artifact is in this repository.

Intended differences, by design: each tab is its own page with a shared tab bar and a "Research data" link; the tab bar replaced the artifact's in-page tab buttons; pages carry `<meta name="robots" content="noindex">`.
