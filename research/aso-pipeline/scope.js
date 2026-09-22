// Turn the existing dossier page into a scoped tab: CSS prefixed with #dossier, left scrubber removed, lightbox kept.
const fs = require('fs');
const path = require('path');
const src = fs.readFileSync(path.join(__dirname, 'dossier-source.html'), 'utf8');

const styles = [...src.matchAll(/<style>([\s\S]*?)<\/style>/g)].map(m => m[1]);
const css = styles.find(s => s.includes('--flame-1'));
const fonts = src.match(/<link rel="stylesheet" href="(https:\/\/fonts\.googleapis\.com[^"]+)">/)[1];

function scopeSel(list) {
  return list.split(',').map(s => s.trim()).map(s => {
    if (s === 'html') return null;
    if (s === 'body' || s === ':root') return '#dossier';
    if (s === '*') return '#dossier *';
    const m = s.match(/^(:root(?:\[[^\]]*\]|:not\([^)]*\))*)(.*)$/);
    if (m) return `${m[1]} #dossier${m[2]}`;
    return '#dossier ' + s;
  }).filter(Boolean).join(',');
}
function scopeCss(text) {
  let out = '', i = 0;
  while (i < text.length) {
    const open = text.indexOf('{', i);
    if (open < 0) break;
    let sel = text.slice(i, open).replace(/\/\*[\s\S]*?\*\//g, '').trim();
    if (sel.startsWith('@media')) {
      let depth = 1, j = open + 1;
      while (depth && j < text.length) { if (text[j] === '{') depth++; else if (text[j] === '}') depth--; j++; }
      out += `${sel}{${scopeCss(text.slice(open + 1, j - 1))}}\n`;
      i = j;
    } else {
      const close = text.indexOf('}', open);
      const body = text.slice(open + 1, close);
      const scoped = scopeSel(sel);
      if (scoped) out += `${scoped}{${body}}\n`;
      i = close + 1;
    }
  }
  return out;
}

const overrides = `
#dossier{min-height:100vh}
#dossier .shell{grid-template-columns:minmax(0,1fr);padding-block:40px 96px}
#dossier .bar{position:relative;top:auto;z-index:auto;border-bottom:0;backdrop-filter:none;-webkit-backdrop-filter:none}
#dossier .chips{margin-top:0}
#dossier .chip{font-family:var(--body)}
#dossier .legend{margin-bottom:0}
#dossier .sw{width:auto;height:auto;border-radius:0;display:grid}
#dossier th{font-family:var(--body)}
`;
const scopedCss = scopeCss(css) + overrides;

const main = src.match(/<main>([\s\S]*?)<\/main>/)[1];
const footer = src.match(/<footer>[\s\S]*?<\/footer>/)[0];
const dialog = src.match(/<dialog class="lightbox"[\s\S]*?<\/dialog>/)[0];
const title = src.match(/<title>([^<]*)<\/title>/)[1];
const sections = [...src.matchAll(/<li><a href="#([^"]+)">([^<]+)<\/a><\/li>/g)].map(m => ({ id: m[1], label: m[2].replace(/&amp;/g, '&') }));

const body = `<div id="dossier" data-tab="dossier" hidden>\n<div class="shell"><main>${main}</main></div>\n${footer}\n${dialog}\n</div>`;
fs.writeFileSync(path.join(__dirname, 'dossier-parts.json'), JSON.stringify({ title, fonts, css: scopedCss, body, sections }));
console.log('title:', title, '| sections:', sections.map(s => s.id).join(', '));
console.log('scoped css', scopedCss.length, 'chars ·', (scopedCss.match(/#dossier/g) || []).length, 'scoped selectors · body', body.length, 'chars');
console.log(scopedCss.split('\n').filter(l => /:root/.test(l)).map(l => l.slice(0, 90)).join('\n'));
