# Video Downloader: code and data

> **Generated file: do not edit by hand.** Produced by `node tools/export-docs.js` (GitHub runs it after every push).
> Everything behind the [Video Downloader](../../tabs/01-video-downloader/index.html) tab in one place: how the page is put together, the full source of the code that draws it, and the full data it reads. **Load it when a question or change concerns how this tab works** (its calculations, data, filters or behaviour); wording-only edits do not need it. The visible text is in [docs/tabs/01-video-downloader.md](../tabs/01-video-downloader.md); where the data came from is in [research.md](research.md).

## How the page is put together

- Markup: [tabs/01-video-downloader/index.html](../../tabs/01-video-downloader/index.html) (746 lines), `<body data-page="dossier">`
- Self-contained: static HTML with its own styles and the inline script below; tab bar from [assets/nav.js](../../assets/nav.js)
- Sections and the functions that fill them: see the [code map](../code-map.md#01-video-downloader)

## Code

The page's content is static HTML in [index.html](../../tabs/01-video-downloader/index.html); its text is in [docs/tabs/01-video-downloader.md](../tabs/01-video-downloader.md). Its inline script, in full:

```js
// Screenshot lightbox: click a phone screenshot to see it full size.
(function () {
  const lbx = document.getElementById('lightbox'), img = document.getElementById('lb-img'), cap = document.getElementById('lb-cap');
  if (!lbx) return;
  document.querySelectorAll('#dossier .phone').forEach(b => b.addEventListener('click', () => { img.src = b.dataset.full; img.alt = b.querySelector('img').alt; cap.textContent = b.dataset.cap || ''; if (typeof lbx.showModal === 'function') lbx.showModal(); }));
  document.getElementById('lb-close').addEventListener('click', () => lbx.close());
  lbx.addEventListener('click', e => { if (e.target === lbx) lbx.close(); });
  const bar = document.getElementById('bar');
  const syncBar = () => document.documentElement.style.setProperty('--barh', bar.offsetHeight + 'px');
  addEventListener('resize', syncBar); syncBar();
})();
```

## Data this tab reads

None from `assets/data.js`: every number is in the page itself.
