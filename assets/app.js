// Shared script for the ASO Playbook, PlayStore Metadata and Features Comparison pages.
// Each page sets <body data-page="playbook|metadata|features|graphics"> and only that page's render functions run.
// The data comes from data.js (PAYLOAD), which every one of those pages loads first.
(function () {
  const PAGE = document.body.dataset.page;
  const D = PAYLOAD.data, L = PAYLOAD.listing, F = PAYLOAD.features, AS = PAYLOAD.assets;
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const A = D.apps.map(a => ({ id: a[0], t: a[1], dev: a[2], i: a[3], s: a[4], r: a[5], rel: a[6], upd: a[7], b: a[8], cat: a[9], ads: a[10], iap: a[11] }));
  const COMP = D.compIdx;
  const PROF = D.profiles.filter(p => !p.mine), MYP = D.profiles.find(p => p.mine);
  const SHORT = ['InShot', 'Gamma Play', 'QR Code Scanner', 'Story Saver', 'InSaver', 'Hub (DOSA)', 'Fast Saver', 'AppTool', 'Saver & Player Studio', 'DevBay', 'Sky Vision', 'Attractive Apps', 'Markhoor', 'Mobile Notepad', 'Vidow', 'Vidpal'];
  const MN = { US: 'United States', BR: 'Brazil', DE: 'Germany', ES: 'Spain', IT: 'Italy', AU: 'Australia', AE: 'UAE', IN: 'India' };
  const TIER = { A: 'Core', B: 'Adjacent', C: 'Peripheral', D: 'Off-intent' };
  const TIER_PILL = { A: 'p-good', B: 'p-acc', C: 'p-warn', D: 'p-risk' };
  const SRC = { core: 'Core list', plat: 'Platform list', adj: 'Adjacent list', per: 'Peripheral list', ac: 'Play autocomplete' };
  const CAT = { downloader: 'Video downloader', platform: 'Platform-specific downloader', saver: 'Story / status saver', browser: 'Browser', player: 'Video player', editor: 'Video editor', audio: 'Audio / MP3', vault: 'Vault', other: 'Other' };
  const fmt = n => n == null ? '—' : n >= 1e9 ? +(n / 1e9).toFixed(1) + 'B' : n >= 1e6 ? +(n / 1e6).toFixed(n >= 1e7 ? 0 : 1) + 'M' : n >= 1e3 ? +(n / 1e3).toFixed(n >= 1e4 ? 0 : 1) + 'K' : String(n);
  const band = r => r <= 3 ? 'b1' : r <= 10 ? 'b2' : r <= 20 ? 'b3' : 'b4';
  const US = D.board.US;
  const totalSerps = Object.values(D.board).reduce((s, rows) => s + rows.length, 0);
  const tmPill = r => r.tm ? ' <span class="tm" title="Names another company’s product">™ platform</span>' : r.cleared ? ' <span class="pill p-acc" title="Platform-name flag lifted after the Google Play title check">reels · checked on Play</span>' : '';
  let state = { gl: 'US', all: false, sort: 'P', dir: -1, tier: 'all', q: '', strips: 20, cd: 0, cdAll: false };
  try { const s = localStorage.getItem('avd-gl'); if (s && D.board[s]) state.gl = s; } catch (e) {}
  const rows = () => D.board[state.gl];
  const slotClass = idx => { if (idx < 0) return 'none'; if (COMP.includes(idx)) return 'comp'; const a = A[idx]; if (a.b) return 'brand'; return a.cat === 'downloader' || a.cat === 'platform' ? 'niche' : ['saver', 'browser', 'player', 'editor', 'audio', 'vault'].includes(a.cat) ? 'adj' : 'off'; };
  const compRanks = r => COMP.map((c, k) => ({ k, rank: c >= 0 ? r.ids.indexOf(c) + 1 : 0 })).filter(x => x.rank > 0).sort((a, b) => a.rank - b.rank);
  const compTop10 = r => compRanks(r).filter(x => x.rank <= 10).length;
  const compNames = r => { const cr = compRanks(r); return cr.length ? cr.slice(0, 5).map(x => `<span class="nowrap"><b>${esc(SHORT[x.k])}</b> #${x.rank}</span>`).join('<br>') + (cr.length > 5 ? `<br><span class="muted">+${cr.length - 5} more</span>` : '') : '<span class="muted">None in results</span>'; };
  const entryCell = r => { const e = r.entryIdx != null ? A[r.entryIdx] : null; return r.entry == null ? '—' : `<b>${r.entry < 1000 ? 'under 1K' : fmt(r.entry)}</b><div class="small muted" style="max-width:190px">${esc(e ? e.t : '')} · #${r.entryRank}</div>`; };
  const rkCell = (rank, idx, q) => rank ? `<span class="rk ${band(rank)}" data-a="${idx}" data-r="${rank}" data-q="${esc(q)}">${rank}</span>` : '<span class="rk b0" aria-label="not in results">·</span>';

  // ---------- tooltip ----------
  const tip = document.getElementById('tip');
  document.addEventListener('mouseover', e => {
    const el = e.target.closest && e.target.closest('[data-a]'); if (!el) { tip.hidden = true; return; }
    const a = A[+el.dataset.a]; if (!a) return;
    tip.innerHTML = `<b>${esc(a.t)}</b><br>${esc(a.dev)} · ${fmt(a.i)} installs${a.s ? ' · ★ ' + a.s.toFixed(1) : ''}<br><span class="tmono">${a.b ? 'Brand' : COMP.includes(+el.dataset.a) ? 'Tracked competitor' : CAT[a.cat]}${el.dataset.r ? ' · #' + el.dataset.r + ' for “' + esc(el.dataset.q) + '”' : ''}</span>`;
    tip.hidden = false;
  });
  document.addEventListener('mousemove', e => { if (tip.hidden) return; tip.style.left = Math.min(e.clientX + 14, innerWidth - 300) + 'px'; tip.style.top = (e.clientY + 16) + 'px'; });

  // ---------- header ----------
  function renderHeader() {
    const date = new Date(D.collectedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    document.getElementById('p-date').textContent = 'Collected ' + date;
    document.getElementById('p-chips').innerHTML = [`${US.length} US keywords`, '8 markets', `${totalSerps} live result lists`, `${A.length} apps profiled`, '16 tracked competitors', '0 events & offers running', '0 fetch failures'].map(c => `<span class="chip">${c}</span>`).join('');
    const top = US[0];
    const leader = PROF.slice().sort((a, b) => b.perMarket.US.top10 - a.perMarket.US.top10)[0];
    const audit = PROF.slice(10);
    const auditTop10 = audit.reduce((s, p) => s + D.markets.reduce((x, gl) => x + p.perMarket[gl].top10, 0), 0);
    const mk = D.marketSummary.slice().sort((a, b) => a.medianEntry - b.medianEntry);
    const pvd = US.find(r => r.q === 'private video downloader');
    document.getElementById('p-verdict').innerHTML = `There is no brand wall in this category — ${D.marketSummary.find(m => m.gl === 'US').avgNonBrand} of every top 10 are independent apps — but the bar is high: the median entry bar is ${fmt(D.marketSummary.find(m => m.gl === 'US').medianEntry)} installs. <strong>${esc(leader.title)}</strong> by ${esc(leader.developer)} holds ${leader.perMarket.US.top10} US top-10 placements. Your listing ranks for none of the ${US.length} US keywords and shares its exact title with Sky Vision’s app. The opening: <strong>“${esc(pvd ? pvd.q : top.q)}”</strong>${pvd ? `, where a ${fmt(pvd.entry)}-install app already sits at #${pvd.entryRank}` : ''}, carried by the editor, MP3 extraction and PIN vault that almost no competitor lists.`;
    document.getElementById('p-findings').innerHTML = [
      `<strong>Your listing is invisible in search.</strong> It does not appear in any of the ${totalSerps} result lists across eight markets.`,
      `<strong>The audit apps don’t rank either.</strong> Sky Vision, Attractive Apps Valley, Markhoor, Mobile Notepad, Vidow and Vidpal hold ${auditTop10} top-10 placements between them across all eight markets — their installs come from outside keyword search.`,
      `<strong>Generic phrasing leads the board.</strong> ${US.slice(0, 4).map(r => `“${esc(r.q)}”`).join(', ')} top the US priority list; platform-name searches score high too but carry trademark risk.`,
      `<strong>No one runs Events &amp; offers.</strong> None of the 16 competitors shows a card in the US, Brazil, Germany or India.`,
      `<strong>India is the easiest market.</strong> The median entry bar is ${fmt(mk[0].medianEntry)} installs in ${MN[mk[0].gl]} against ${fmt(D.marketSummary.find(m => m.gl === 'US').medianEntry)} in the US.`,
    ].map(x => `<li>${x}</li>`).join('');
    document.getElementById('p-tiles').innerHTML = [
      [`P${top.P}`, `“${esc(top.q)}” · #1 US priority`],
      [`${leader.perMarket.US.top10}`, `US top-10 placements · ${esc(leader.developer)}`],
      [pvd ? fmt(pvd.entry) : '—', `entry bar on “private video downloader”`],
      ['0', 'keywords your listing ranks for'],
    ].map(([n, l]) => `<div class="tile"><div class="n">${n}</div><div class="l">${l}</div></div>`).join('');
    document.getElementById('p-method').innerHTML = `<strong>Method, ${date}:</strong> Google Play web search (English) scraped live for ${US.length} keywords in the United States and the first 40 of those in Brazil, Germany, Spain, Italy, Australia, the UAE and India — ${totalSerps} result lists, 30 deep. Keywords came from a core downloader list, a platform-name list, an adjacent editing and vault list, a peripheral list and Play autocomplete; YouTube keywords and phrases with adult-site or piracy intent were removed. Full listing metadata was fetched for every app in any top 10 plus the 16 tracked competitors — ${A.length} apps. Events &amp; offers were read from each competitor’s listing page in four markets. Demand comes from Play autocomplete, typed out letter by letter.`;
  }

  function renderMarketSel() {
    const sel = document.getElementById('market-sel');
    sel.innerHTML = D.markets.map(m => `<option value="${m}"${m === state.gl ? ' selected' : ''}>${m} · ${MN[m]}</option>`).join('');
    sel.addEventListener('change', () => { state.gl = sel.value; try { localStorage.setItem('avd-gl', state.gl); } catch (e) {} renderScoped(); });
  }

  function renderCategories() {
    const counts = {}; let total = 0; const devs = {};
    rows().forEach(r => r.ids.slice(0, 10).forEach(idx => {
      if (idx < 0) return; total++;
      const a = A[idx]; const k = COMP.includes(idx) ? 'Tracked competitors' : a.b ? 'Platform brands' : CAT[a.cat];
      counts[k] = (counts[k] || 0) + 1; devs[a.dev] = (devs[a.dev] || 0) + 1;
    }));
    const list = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    document.getElementById('cat-share').innerHTML = `<thead><tr><th>Who holds the slot</th><th class="num">Slots</th><th>Share</th></tr></thead><tbody>` + list.map(([k, n]) => `<tr><td>${esc(k)}</td><td class="num">${n}</td><td style="min-width:150px"><div class="sharebar"><div class="track"><div class="fill" style="width:${(100 * n / total).toFixed(1)}%;${k === 'Tracked competitors' ? 'background:var(--s-comp)' : k === 'Platform brands' ? 'background:var(--s-brand)' : ''}"></div></div><span class="small num">${Math.round(100 * n / total)}%</span></div></td></tr>`).join('') + '</tbody>';
    document.getElementById('cat-devs').innerHTML = `<thead><tr><th>Developer</th><th class="num">Top-10 slots</th></tr></thead><tbody>` + Object.entries(devs).sort((a, b) => b[1] - a[1]).slice(0, 10).map(([d, n]) => `<tr><td>${esc(d)}</td><td class="num">${n}</td></tr>`).join('') + '</tbody>';
  }

  function renderCompetitors() {
    const gl = state.gl;
    const list = PROF.map((p, k) => ({ p, k })).sort((a, b) => b.p.perMarket[gl].top10 - a.p.perMarket[gl].top10 || b.p.perMarket[gl].any - a.p.perMarket[gl].any);
    document.getElementById('comp-table').innerHTML = `<thead><tr><th>App</th><th class="num">Top-10 · in results</th><th class="num">Best rank</th><th class="num">Installs</th><th class="num">Rating</th><th>Updated</th><th>Monetisation</th><th>Title phrases</th><th>Source</th></tr></thead><tbody>` +
      list.map(({ p, k }) => { const m = p.perMarket[gl]; return `<tr>
        <td style="min-width:230px"><div class="comp-name">${esc(p.title)}</div><div class="small muted">${esc(p.developer)} · <a href="https://play.google.com/store/apps/details?id=${esc(p.id)}&hl=en&gl=US" target="_blank" rel="noopener">listing ↗</a></div></td>
        <td class="num"><span class="bignum">${m.top10}</span> <span class="muted">· ${m.any}</span></td>
        <td class="num">${m.best ? '#' + m.best : '—'}</td>
        <td class="num">${esc(p.installsLabel || fmt(p.installs))}</td>
        <td class="num">${p.score ? p.score.toFixed(1) : '—'}${p.ratings ? `<div class="small muted">${fmt(p.ratings)} ratings</div>` : ''}</td>
        <td class="nowrap small">${esc(p.updated || '—')}</td>
        <td class="small">${p.ads ? '<span class="pill p-warn">Ads</span> ' : '<span class="pill p-good">No ads</span> '}${p.iap ? `<div class="muted">${esc(p.iap)}</div>` : ''}</td>
        <td style="min-width:170px"><b class="num">${p.titleKw.length}</b><div class="kwlist">${p.titleKw.map(q => `<span>${esc(q)}</span>`).join('')}</div></td>
        <td class="small">${k >= 10 ? '<span class="pill p-acc">Feature audit</span>' : '<span class="pill p-mute">Live search</span>'}</td></tr>`; }).join('') + '</tbody>';
  }

  function renderCompDetailSelect() {
    const sel = document.getElementById('cd-select');
    sel.innerHTML = PROF.map((p, k) => `<option value="${k}">${esc(p.title)} — ${esc(p.developer)}</option>`).join('');
    sel.addEventListener('change', () => { state.cd = +sel.value; state.cdAll = false; renderCompDetail(); });
    document.getElementById('cd-more').addEventListener('click', () => { state.cdAll = !state.cdAll; renderCompDetail(); });
  }
  function renderCompDetail() {
    const p = PROF[state.cd], k = state.cd, cid = COMP[k];
    document.getElementById('cd-meta').innerHTML = `
      <div class="meta-field"><div class="field-label"><span>Title</span><span>${p.titleLen} / 30</span></div><p><b>${esc(p.title)}</b></p></div>
      <div class="meta-field"><div class="field-label"><span>Short description</span><span>${p.summaryLen} / 80</span></div><p>${esc(p.summary)}</p></div>
      <div class="meta-field"><div class="field-label"><span>Full description</span><span>${p.descLen.toLocaleString('en-US')} / 4,000 · ${p.descWords} words</span></div>
        <details class="desc"><summary>Show the full description</summary><pre>${esc(p.description)}</pre></details></div>`;
    const dens = p.kwDens.slice().sort((a, b) => b.n - a.n);
    const claims = D.claims.filter(([c]) => p.claims[c]).map(([, l]) => l);
    document.getElementById('cd-side').innerHTML = `
      <div class="panel" style="padding:16px 18px"><h3 style="margin-bottom:8px">Events &amp; offers</h3><p class="small muted">No events or offers on the listing in the US, Brazil, Germany or India.</p></div>
      <div class="panel" style="padding:16px 18px"><h3 style="margin-bottom:8px">Listing facts</h3><table><tbody>
        <tr><td>Installs</td><td class="num">${esc(p.installsLabel)}</td></tr><tr><td>Rating</td><td class="num">${p.score ? p.score.toFixed(2) + ' · ' + fmt(p.ratings) : '—'}</td></tr>
        <tr><td>Released · updated</td><td class="num">${esc(p.released || '—')} · ${esc(p.updated || '—')}</td></tr><tr><td>Monetisation</td><td class="num">${p.ads ? 'Ads' : 'No ads'} · ${esc(p.iap || 'no IAP')}</td></tr>
        <tr><td>Screenshots · video</td><td class="num">${p.shots} · ${p.video ? 'yes' : 'no'}</td></tr><tr><td>Category</td><td class="num">${esc(p.genre)}</td></tr>
      </tbody></table></div>
      <div class="panel" style="padding:16px 18px"><h3 style="margin-bottom:8px">Features its listing claims</h3><div class="kwlist">${claims.map(c => `<span>${esc(c)}</span>`).join('') || '<span>none detected</span>'}</div></div>
      <div class="panel" style="padding:16px 18px"><h3 style="margin-bottom:8px">Top board phrases in its description</h3>${dens.length ? `<table><thead><tr><th>Phrase</th><th class="num">Uses</th><th class="num">Density</th></tr></thead><tbody>${dens.map(d => `<tr><td class="kw">${esc(d.q)}</td><td class="num">${d.n}</td><td class="num">${d.d}%</td></tr>`).join('')}</tbody></table>` : '<p class="small muted">None of the top 14 US keywords appears as a phrase.</p>'}</div>`;
    const kws = new Map();
    D.markets.forEach(gl => D.board[gl].forEach(r => { const rank = r.comps[k]; if (!rank) return; const e = kws.get(r.q) || { q: r.q, ranks: {} }; e.ranks[gl] = rank; kws.set(r.q, e); }));
    const list = [...kws.values()].map(e => ({ ...e, us: US.find(r => r.q === e.q), best: Math.min(...Object.values(e.ranks)) })).sort((a, b) => (a.ranks.US || 99) - (b.ranks.US || 99) || a.best - b.best);
    const t10 = list.filter(e => e.best <= 10).length;
    document.getElementById('cd-kw-h').textContent = list.length ? `${p.title} ranks for ${list.length} keywords · ${t10} with a top-10 position somewhere` : `${p.title} does not rank for any tracked keyword in the eight markets`;
    const shown = state.cdAll ? list : list.slice(0, 25);
    document.getElementById('cd-more').textContent = list.length > 25 ? (state.cdAll ? 'Show the top 25 only' : `Show all ${list.length} keywords`) : '';
    document.getElementById('cd-kw').innerHTML = list.length ? `<thead><tr><th>Keyword</th><th>Tier</th><th class="num">US priority</th>${D.markets.map(m => `<th class="ch">${m}</th>`).join('')}</tr></thead><tbody>` +
      shown.map(e => `<tr><td class="kwc"><span class="kw">${esc(e.q)}</span>${e.us ? tmPill(e.us) : ''}</td><td>${e.us ? `<span class="pill ${TIER_PILL[e.us.tier]}">${TIER[e.us.tier]}</span>` : ''}</td><td class="num small">${e.us ? e.us.P : '—'}</td>${D.markets.map(gl => { const measured = D.board[gl].some(r => r.q === e.q); return `<td>${measured ? rkCell(e.ranks[gl], cid, e.q) : '<span class="small muted">n/m</span>'}</td>`; }).join('')}</tr>`).join('') + '</tbody>' : '';
  }

  function renderEvents() {
    const checked = PROF.concat([MYP]);
    const any = checked.filter(p => PAYLOAD.offersChecked[p.id]);
    document.getElementById('events-body').innerHTML = `<div class="callout-open"><h3 style="margin-bottom:6px">${any.length ? any.length + ' listings run events or offers' : 'No competitor runs events or offers'}</h3>
      <p class="sub">All ${checked.length} listings — the 16 competitors and yours — were checked in the United States, Brazil, Germany and India. ${any.length ? '' : 'Not one shows an “Events & offers” card, so any dated card you publish (a feature launch, a trial, a seasonal event) has the promotional space to itself.'}</p>
      <div class="kwlist" style="margin-top:10px">${checked.map(p => `<span>${esc(p.mine ? 'Your app' : p.developer)} · ${PAYLOAD.offersChecked[p.id] ? 'running' : 'none'}</span>`).join('')}</div></div>`;
  }

  function renderMatrix() {
    const list = state.all ? rows() : rows().slice(0, 30);
    document.getElementById('matrix-table').innerHTML = `<thead><tr><th>Keyword</th><th class="num">Priority</th>${COMP.map((c, i) => `<th class="ch" title="${esc(c >= 0 ? A[c].t : '')}">${esc(SHORT[i])}</th>`).join('')}</tr></thead><tbody>` +
      list.map(r => `<tr><td class="kwc"><span class="kw">${esc(r.q)}</span>${tmPill(r)}</td><td class="num small">${r.P}</td>${COMP.map((c, k) => `<td>${rkCell(r.comps[k], c, r.q)}</td>`).join('')}</tr>`).join('') +
      `</tbody><tfoot><tr><td class="kwc">Top-10 placements</td><td></td>${COMP.map((c, k) => `<td>${list.filter(r => r.comps[k] && r.comps[k] <= 10).length}</td>`).join('')}</tr></tfoot>`;
  }

  function renderStrips() {
    document.getElementById('strip-legend').innerHTML = [['comp', 'Tracked competitors'], ['brand', 'Brand'], ['niche', 'Video downloader'], ['adj', 'Saver, browser, player, editor'], ['off', 'Other'], ['none', 'Beyond Play’s results']].map(([c, l]) => `<span><i class="sw slot ${c}" style="height:14px"></i>${l}</span>`).join('');
    const list = rows().slice(0, state.strips);
    const ruler = `<div class="strip-ruler"><span>Keyword</span><div class="slots ruler-slots">${Array.from({ length: 30 }, (_, i) => (i === 10 ? '<span></span>' : '') + `<span>${i === 0 || i === 9 || i === 10 || i === 19 || i === 29 ? i + 1 : ''}</span>`).join('')}</div></div>`;
    document.getElementById('strips').innerHTML = ruler + list.map(r => `<div class="strip-row"><div class="strip-head"><div class="strip-kw"><span class="kw">${esc(r.q)}</span><span class="meta">P${r.P} · ${r.depth} results · ${r.c10} competitors in top 10</span></div><div class="slots">${Array.from({ length: 30 }, (_, i) => { const idx = i < r.ids.length ? r.ids[i] : -1; return (i === 10 ? '<span class="slot gap"></span>' : '') + `<span class="slot ${i < r.ids.length ? slotClass(idx) : 'none'}"${idx >= 0 ? ` data-a="${idx}" data-r="${i + 1}" data-q="${esc(r.q)}"` : ''}></span>`; }).join('')}</div></div></div>`).join('');
    document.getElementById('strips-more').textContent = state.strips >= rows().length ? '' : `Show ${Math.min(rows().length, state.strips + 20) - state.strips} more searches`;
  }

  function renderTierChips() {
    const el = document.getElementById('tier-chips');
    el.innerHTML = [['all', 'All tiers'], ['A', 'Core'], ['B', 'Adjacent'], ['C', 'Peripheral'], ['tm', '™ Platform names']].map(([k, l]) => `<button type="button" data-t="${k}" aria-pressed="${state.tier === k}">${l}</button>`).join('');
    el.onclick = e => { const b = e.target.closest('button'); if (!b) return; state.tier = b.dataset.t; renderTierChips(); renderBoard(); };
    document.getElementById('kw-search').oninput = e => { state.q = e.target.value.trim().toLowerCase(); renderBoard(); };
  }
  function renderBoard() {
    const cols = [['q', 'Keyword'], ['P', 'Priority'], ['R', 'Relevance'], ['nb', 'Winnable'], ['demand', 'Demand'], ['vol', 'Volume proxy'], ['entry', 'Entry bar'], ['c10', 'Competitors top 10'], ['depth', 'Results']];
    let list = rows().filter(r => (state.tier === 'all' || (state.tier === 'tm' ? r.tm : r.tier === state.tier)) && (!state.q || r.q.includes(state.q)));
    list = list.slice().sort((a, b) => { const x = a[state.sort], y = b[state.sort]; if (state.sort === 'q') return state.dir * x.localeCompare(y); return state.dir * ((x == null ? -1 : x) - (y == null ? -1 : y)); });
    const maxP = Math.max(...rows().map(r => r.P));
    document.getElementById('board').innerHTML = `<thead><tr>${cols.map(([k, l]) => `<th${k !== 'q' ? ' class="num"' : ''} aria-sort="${state.sort === k ? (state.dir < 0 ? 'descending' : 'ascending') : 'none'}"><button type="button" data-k="${k}">${l}</button></th>`).join('')}</tr></thead><tbody>` +
      list.map(r => `<tr><td style="min-width:220px"><span class="kw">${esc(r.q)}</span><div class="kwmeta"><span class="pill ${TIER_PILL[r.tier]}">${TIER[r.tier]}</span><span class="pill p-mute">${SRC[r.src]}</span>${tmPill(r)}</div></td>
        <td><div class="pbar"><div class="track"><div class="fill" style="width:${(100 * r.P / maxP).toFixed(1)}%"></div></div><b>${r.P}</b></div></td>
        <td class="num">${Math.round(r.R * 100)}</td><td class="num">${r.nb}<span class="muted">/10</span></td>
        <td class="num">${r.demand}<div class="small muted">${r.demandAt ? `after “${esc(r.demandAt)}”` : 'not suggested'}</div></td>
        <td class="num">${fmt(r.vol)}</td><td class="num">${entryCell(r)}</td><td class="num">${r.c10}<span class="muted">/16</span></td><td class="num">${r.depth}</td></tr>`).join('') + '</tbody>';
    document.querySelectorAll('#board th button').forEach(b => b.onclick = () => { const k = b.dataset.k; if (state.sort === k) state.dir *= -1; else { state.sort = k; state.dir = k === 'q' ? 1 : -1; } renderBoard(); });
  }

  function renderMarkets() {
    document.getElementById('mkt-cards').innerHTML = D.marketSummary.map(m => `<div class="mkt"><h3>${MN[m.gl]} <small>${m.gl}</small></h3><dl>
      <dt>Non-brand apps in top 10</dt><dd>${m.avgNonBrand} / 10</dd><dt>Median entry bar</dt><dd>${fmt(m.medianEntry)}</dd><dt>Competitor top-10s</dt><dd>${m.compTop10}</dd><dt>Avg results per search</dt><dd>${m.avgDepth}</dd></dl>
      <div class="small muted">Top keywords</div><div class="kwlist">${m.best.slice(0, 3).map(b => `<span>${esc(b.q)} · P${b.P}</span>`).join('')}</div></div>`).join('');
    const kws = D.secondary;
    const P = (gl, q) => D.board[gl].find(x => x.q === q) || null;
    const maxP = Math.max(...D.markets.flatMap(gl => kws.map(q => (P(gl, q) || { P: 0 }).P)));
    const sorted = kws.filter(q => P('US', q)).sort((a, b) => P('US', b).P - P('US', a).P);
    document.getElementById('mkt-heat').innerHTML = `<thead><tr><th>Keyword</th>${D.markets.map(m => `<th class="ch">${m}</th>`).join('')}</tr></thead><tbody>` +
      sorted.map(q => { const vals = D.markets.map(gl => (P(gl, q) || { P: 0 }).P); const best = Math.max(...vals); return `<tr><td class="kwc"><span class="kw">${esc(q)}</span>${tmPill(P('US', q))}</td>${vals.map(v => `<td class="h${v === best ? ' best' : ''}" style="background:color-mix(in srgb, var(--accent) ${Math.round(8 + 45 * v / maxP)}%, transparent)">${v}</td>`).join('')}</tr>`; }).join('') + '</tbody>';
    const counts = PROF.map((p, k) => D.markets.map(gl => D.board[gl].filter(r => kws.includes(r.q) && r.comps[k] && r.comps[k] <= 10).length));
    const maxC = Math.max(1, ...counts.flat());
    document.getElementById('mkt-comp').innerHTML = `<thead><tr><th>Competitor</th>${D.markets.map(m => `<th class="ch">${m}</th>`).join('')}</tr></thead><tbody>` +
      PROF.map((p, k) => `<tr><td class="kwc"><b>${esc(SHORT[k])}</b><div class="small muted">${esc(p.title)}</div></td>${counts[k].map(n => `<td class="h" style="background:color-mix(in srgb, var(--s-comp) ${Math.round(4 + 50 * n / maxC)}%, transparent)">${n}</td>`).join('')}</tr>`).join('') + '</tbody>';
  }

  function ladderPhases(list, ex = /without ads/) {
    const used = new Set();
    const take = (pred, n) => { const out = list.filter(r => !r.tm && (r.tier === 'A' || r.tier === 'B') && !used.has(r.q) && !ex.test(r.q) && pred(r)).slice(0, n); out.forEach(r => used.add(r.q)); return out; };
    return [
      ['Phase 0', 'launch → 10K · weeks 0–6', take(r => r.R >= 0.9 && r.entry != null && r.entry < 60000, 6), 'A non-brand app under 60K installs already holds a top-10 slot here.'],
      ['Phase 1', '10K → 100K', take(r => r.R >= 0.85 && r.entry != null && r.entry < 200000, 6), 'The smallest app in the top 10 has under 200K installs.'],
      ['Phase 2', '100K → 1M', take(r => r.R >= 0.85 && r.entry != null && r.entry < 800000, 6), 'Entry bars in the hundreds of thousands: a scaled app is needed.'],
      ['Phase 3', '1M+', take(r => r.R >= 0.8, 6), 'Head terms held by 10M+ apps.'],
    ];
  }
  function renderLadder() {
    document.getElementById('ladder-list').innerHTML = ladderPhases(rows()).map(([ph, sub, list, why]) => `<div class="rung"><div class="ph">${ph}<small>${sub}</small></div><div><ul>${list.map(r => `<li>${esc(r.q)} <i>P${r.P} · ${r.c10} comp.</i></li>`).join('') || '<li>none at this bar</li>'}</ul><p class="proof">${why} ${list[0] && list[0].entry ? `Smallest non-brand app on “${esc(list[0].q)}”: ${esc((A[list[0].entryIdx] || {}).t || '')} with ${fmt(list[0].entry)} installs at #${list[0].entryRank}.` : ''}</p></div></div>`).join('');
  }

  // ---------- listing helpers ----------
  const reEsc = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const normT = s => ' ' + String(s || '').toLowerCase().replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, ' ').trim() + ' ';
  const phraseN = (text, p) => { const t = normT(text), n = normT(p); let c = 0, i = t.indexOf(n); while (i >= 0) { c++; i = t.indexOf(n, i + n.length - 1); } return c; };
  const wordSet = s => new Set(normT(s).trim().split(' ').filter(Boolean));
  const allIn = (q, set) => normT(q).trim().split(' ').every(w => set.has(w));
  const nWords = s => normT(s).trim().split(' ').filter(Boolean).length;
  const plainLong = t => t.replace(/^## /gm, '').replace(/^• /gm, '');
  const COV = { title: ['T', 'p-good'], titlew: ['T', 'p-good'], short: ['S', 'p-acc'], tsw: ['T+S', 'p-acc'], long: ['L', 'p-warn'], none: ['—', 'p-mute'] };
  function coverageOf(q, f) {
    const longN = phraseN(f.long, q);
    if (phraseN(f.title, q)) return { key: 'title', label: 'Title · exact phrase', w: 1, longN };
    if (allIn(q, wordSet(f.title))) return { key: 'titlew', label: 'Title · all words', w: 0.85, longN };
    if (phraseN(f.short, q)) return { key: 'short', label: 'Short · exact phrase', w: 0.7, longN };
    if (allIn(q, wordSet(f.title + ' ' + f.short))) return { key: 'tsw', label: 'Title + short · all words', w: 0.7, longN };
    if (longN) return { key: 'long', label: `Full description ×${longN}`, w: 0.3, longN };
    return { key: 'none', label: 'Not used', w: 0, longN };
  }
  const covPill = c => `<span class="pill ${COV[c.key][1]}">${c.label}${c.longN && c.key !== 'long' ? ` · full ×${c.longN}` : ''}</span>`;
  const prioCoverage = (f, board = US) => { let got = 0, all = 0; board.forEach(r => { if (r.tier === 'D' || r.tm) return; all += r.P; got += r.P * coverageOf(r.q, f).w; }); return 100 * got / all; };
  const REC = L.rec[0];
  const PROP = { title: REC.t, short: L.shorts[0].s, long: plainLong(L.long.replace(/\{name\}/g, REC.t)) };
  const CUR = { title: L.current.title, short: L.current.summary, long: L.current.description };
  const FINAL = US.filter(r => (r.tier === 'A' || r.tier === 'B') && r.R >= 0.8 && !r.tm && !/without ads/.test(r.q)).slice(0, 24);
  function highlight(text, kws) {
    let html = esc(text); const marks = [];
    const hold = h => { marks.push(h); return ` ${marks.length - 1} `; };
    [...kws].sort((a, b) => b.length - a.length).forEach(k => { const pat = k.split(' ').map(reEsc).join('\\s+').replace(/\\s\+and\\s\+/g, '\\s+(?:and|&amp;)\\s+'); html = html.replace(new RegExp('\\b' + pat + '\\b', 'gi'), m => hold(`<mark class="kwm">${m}</mark>`)); });
    return html.replace(/ (\d+) /g, (_, i) => marks[+i]);
  }
  function longHtml(text, kws) {
    let html = '', inList = false;
    for (const raw of text.split('\n')) {
      const line = raw.replace(/\s+$/, '');
      if (/^[●•]/.test(line)) { if (!inList) { html += '<ul>'; inList = true; } html += `<li>${highlight(line.replace(/^[●•]\s*/, ''), kws)}</li>`; continue; }
      if (inList) { html += '</ul>'; inList = false; }
      if (!line.trim()) continue;
      if (/^## /.test(line)) html += `<h4>${highlight(line.slice(3), kws)}</h4>`;
      else if (/^[A-Z0-9 &?:,'’\-!]+$/.test(line) && /[A-Z]{3}/.test(line)) html += `<h4>${highlight(line, kws)}</h4>`;
      else html += `<p>${highlight(line, kws)}</p>`;
    }
    return html + (inList ? '</ul>' : '');
  }
  const meter = (n, max) => `<div class="meter"><div class="track"><div class="fill${n > max ? ' over' : ''}" style="width:${Math.min(100, 100 * n / max)}%"></div></div>${n}/${max}</div>`;

  function renderListing() {
    const cur = L.titles.find(t => t.current);
    document.getElementById('titles').innerHTML = L.rec.map((t, i) => { const top = US.slice(0, 12).filter(r => (t.exact || []).includes(r.q)); return `<div class="topt${i === 0 ? ' rec' : ''}"><div class="tag">${i === 0 ? 'Recommended title' : 'Alternative ' + i}</div><div class="tt">${esc(t.t)}</div>${meter(t.len, 30)}<div class="why">Covers every word of ${t.hits.length} board keywords (score ${t.score}${cur ? `, against ${cur.score} for the current title` : ''}). ${top.length ? `Carries ${top.map(r => `“${esc(r.q)}” (#${US.indexOf(r) + 1})`).join(' and ')} as an exact phrase.` : ''}</div><div class="covered">${t.hits.slice(0, 8).map(h => `<span>${esc(h)}</span>`).join('')}</div></div>`; }).join('');
    document.getElementById('title-table').innerHTML = `<thead><tr><th>Title</th><th class="num">Chars</th><th class="num">Score</th><th class="num">Keywords</th><th>Status</th></tr></thead><tbody>` + L.titles.map(t => `<tr${t.current ? ' style="background:var(--accent-soft)"' : ''}><td><b>${esc(t.t)}</b></td><td class="num">${t.len}</td><td class="num">${t.score}</td><td class="num">${t.hits.length}</td><td>${t.current ? '<span class="pill p-warn">current · same title as Sky Vision</span>' : t.taken ? '<span class="pill p-risk">in use by another app</span>' : '<span class="pill p-good">available</span>'}</td></tr>`).join('') + '</tbody>';
    const fk = FINAL.map(r => r.q);
    document.getElementById('listing-card').innerHTML = `
      <div class="apphead"><img src="${AS.icon.file}" alt="" width="56" height="56" style="border-radius:14px;box-shadow:0 0 0 1px var(--line)"><div><div class="t">${esc(PROP.title)}</div><div class="d">${esc(L.current.developer)} · ${esc(L.current.genre)}</div></div></div>
      <div class="field"><div class="field-label"><span>Title</span><span>${PROP.title.length} / 30</span></div><p>${highlight(PROP.title, fk)}</p></div>
      <div class="field"><div class="field-label"><span>Short description</span><span>${PROP.short.length} / 80</span></div><p>${highlight(PROP.short, fk)}</p>${L.shorts[1] ? `<p class="small muted" style="margin-top:6px">Alternative (${L.shorts[1].len}/80): ${esc(L.shorts[1].s)}</p>` : ''}</div>
      <div class="field longdesc"><div class="field-label"><span>Full description</span><span>${PROP.long.length.toLocaleString('en-US')} / 4,000</span></div>${longHtml(L.long.replace(/\{name\}/g, REC.t), fk)}</div>`;
    const wc = nWords(PROP.long);
    const phr = US.filter(r => r.tier !== 'D' && !r.tm && phraseN(PROP.long, r.q)).map(r => ({ r, n: phraseN(PROP.long, r.q), d: 100 * phraseN(PROP.long, r.q) * nWords(r.q) / wc })).sort((x, y) => y.n - x.n || y.r.P - x.r.P).slice(0, 14);
    const strong = x => FINAL.filter(r => ['title', 'titlew', 'short', 'tsw'].includes(coverageOf(r.q, x).key)).length;
    document.getElementById('listing-side').innerHTML = `
      <div class="panel"><h3>Measured against the current listing</h3><table><thead><tr><th></th><th class="num">Current</th><th class="num">Proposed</th></tr></thead><tbody>
        <tr><td>Priority coverage</td><td class="num">${prioCoverage(CUR).toFixed(0)}%</td><td class="num"><b>${prioCoverage(PROP).toFixed(0)}%</b></td></tr>
        <tr><td>Finalized keywords used</td><td class="num">${FINAL.filter(r => coverageOf(r.q, CUR).key !== 'none').length} / 24</td><td class="num"><b>${FINAL.filter(r => coverageOf(r.q, PROP).key !== 'none').length} / 24</b></td></tr>
        <tr><td>…in title or short</td><td class="num">${strong(CUR)}</td><td class="num"><b>${strong(PROP)}</b></td></tr>
        <tr><td>Title shared with another app</td><td class="num">yes</td><td class="num"><b>no</b></td></tr>
        <tr><td>Full description</td><td class="num">${CUR.long.length.toLocaleString('en-US')}</td><td class="num">${PROP.long.length.toLocaleString('en-US')}</td></tr>
      </tbody></table></div>
      <div class="panel"><h3>Board phrases in the proposed description</h3><p class="small muted" style="margin-bottom:6px">${wc} words · platform-name phrases excluded from this count</p><table><thead><tr><th>Phrase</th><th class="num">Uses</th><th class="num">Density</th></tr></thead><tbody>${phr.map(x => `<tr><td class="kw">${esc(x.r.q)}</td><td class="num">${x.n}</td><td class="num">${x.d.toFixed(1)}%</td></tr>`).join('')}</tbody></table></div>
      <div class="panel"><h3>Every claim maps to the Product Dossier</h3><ul class="checks"><li>Paste or share a link · quality picker · parallel downloads with pause, resume, retry</li><li>Foreground service for large background downloads</li><li>9-tool video cutter, including extract audio and watermark</li><li>Vault with PIN, biometrics and a security question</li><li>Status saver · 9 languages with RTL</li><li>Platforms named are the seven downloaded end to end on a device</li></ul><p class="small muted" style="margin-top:8px">Left out on purpose: platform names in the title and short description, “free”, “without ads” (the app contains ads), YouTube, and “no watermark”.</p></div>`;
  }

  // ---------- TAB 2 · metadata ----------
  const compTitlesWith = q => PROF.map((p, i) => ({ p, i })).filter(x => x.p.titleKw.includes(q));
  const TK = PAYLOAD.tiksta, PC = TK.pc;
  const BRAND_RE = /\b(instagram|insta|facebook|fb|tik\s?tok|whatsapp|youtube|pinterest|twitter|linkedin|vimeo|dailymotion|snapchat|likee)\b/i;
  // Rows flagged only because of "reels" are re-scored as core intent (0.55 × (1 − 0.7) = +0.165 relevance) after the Google Play title check.
  const US_T = US.map(r => { if (!(r.tm && /\breels?\b/.test(r.q) && !BRAND_RE.test(r.q))) return r; const R = Math.round((r.R + 0.165) * 1000) / 1000; return { ...r, tm: 0, cleared: true, tier: 'A', R0: r.R, P0: r.P, R, P: Math.round(100 * R * R * r.O) }; }).sort((a, b) => b.P - a.P);
  const EX_T = /without ads|\bfree\b|\b4k\b/;
  const FINAL_T = US_T.filter(r => (r.tier === 'A' || r.tier === 'B') && r.R >= 0.8 && !r.tm && !EX_T.test(r.q));
  const VER = {
    tiksta: { f: { title: TK.title, short: TK.short, long: TK.long }, B: US_T, FIN: FINAL_T, ex: EX_T },
    live: { f: CUR, B: US, FIN: FINAL, ex: /without ads/ },
  };
  const brandsIn = s => [...new Set((String(s).match(new RegExp(BRAND_RE.source, 'gi')) || []).map(x => x.toLowerCase()))];
  const pDate = s => s ? new Date(s + 'T00:00:00Z').toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' }) : '—';

  function renderMetadata(vk) {
    const V = VER[vk], f = V.f, B = V.B, FIN = V.FIN, nF = FIN.length, isT = vk === 'tiksta';
    const fk = B.filter(r => r.tier !== 'D').map(r => r.q), strongKeys = ['title', 'titlew', 'short', 'tsw'];
    const used = B.filter(r => r.tier !== 'D' && coverageOf(r.q, f).key !== 'none');
    const withC = used.filter(r => compRanks(r).length > 0);
    const all = [f.title, f.short, f.long].join('\n'), brands = brandsIn(all);
    const pill = s => s === 'met' ? '<span class="pill p-good">✓ Met</span>' : s === 'not' ? '<span class="pill p-risk">✕ Not met</span>' : '<span class="pill p-mute">• Recorded</span>';
    const pWas = r => r.cleared ? `<div class="small muted">was ${r.P0}</div>` : '';
    const strong = x => FIN.filter(r => strongKeys.includes(coverageOf(r.q, x).key)).length;

    document.getElementById('m-src').textContent = isT ? 'Proposed metadata · Tiksta' : 'Live Google Play listing';
    const facts = isT
      ? ['Proposed · not yet live', `Replaces “${esc(CUR.title)}”`, esc(L.current.developer), esc(L.current.genre), L.current.ads ? 'Contains ads' : 'No ads', L.current.iap ? 'In-app purchases ' + esc(L.current.iap) : 'No in-app purchases', `${brands.length} brand names in the text`]
      : [esc(L.current.developer), esc(L.current.genre), L.current.installs + ' installs', L.current.ads ? 'Contains ads' : 'No ads', L.current.iap ? 'In-app purchases ' + esc(L.current.iap) : 'No in-app purchases', `${AS.screenshots.length} screenshots`, 'Feature graphic 1024×500', 'No promo video', 'No events & offers'];
    document.getElementById('m-app').innerHTML = `<img src="${AS.icon.file}" alt="App icon" width="92" height="92">
      <div style="flex:1 1 360px;min-width:0"><h1>${esc(f.title)}</h1>
        <div class="m-facts">${facts.map(c => `<span class="chip">${c}</span>`).join('')}</div>
        <div class="m-links"><a href="${esc(L.current.url)}" target="_blank" rel="noopener">${isT ? 'Live listing it replaces ↗' : 'Google Play listing ↗'}</a>${L.current.privacy ? `<a href="${esc(L.current.privacy)}" target="_blank" rel="noopener">Privacy policy ↗</a>` : ''}${L.current.site ? `<a href="${esc(L.current.site)}" target="_blank" rel="noopener">Developer site ↗</a>` : ''}<span class="muted">${esc(L.current.id)}</span></div></div>`;
    const tiles = [[`${f.title.length}<small>/30</small>`, 'title characters'], [`${f.short.length}<small>/80</small>`, 'short description characters'], [`${f.long.length.toLocaleString('en-US')}<small>/4,000</small>`, 'full description characters'], [`${used.length}<small>/${B.length}</small>`, 'board keywords targeted'], [`${FIN.filter(r => coverageOf(r.q, f).key !== 'none').length}<small>/${nF}</small>`, 'finalized keywords targeted']]
      .concat([isT ? [`${strong(f)}<small>/${nF}</small>`, 'finalized keywords in the title or short description'] : [`${AS.screenshots.length}<small>/8</small>`, 'phone screenshot slots used']]);
    document.getElementById('m-tiles').innerHTML = tiles.map(([n, l]) => `<div class="tile"><div class="n">${n}</div><div class="l">${l}</div></div>`).join('');
    document.getElementById('m-tiles').style.gridTemplateColumns = 'repeat(auto-fit,minmax(150px,1fr))';

    document.getElementById('m-assets-top').innerHTML = `<figure class="fgfig"><img src="${AS.feature.file}" alt="Feature graphic" loading="lazy"><figcaption>Feature graphic · 1024 × 500 · <a href="${esc(AS.feature.src)}" target="_blank" rel="noopener">original ↗</a></figcaption></figure>
      <figure class="fgfig" style="max-width:220px"><img src="${AS.icon.file}" alt="App icon" loading="lazy" style="border-radius:22%"><figcaption>App icon · 512 × 512 · <a href="${esc(AS.icon.src)}" target="_blank" rel="noopener">original ↗</a></figcaption></figure>`;
    document.getElementById('m-shots').innerHTML = AS.screenshots.map((s, i) => `<figure><img src="${s.file}" alt="Store screenshot ${i + 1}" loading="lazy"><figcaption>Slot ${i + 1} · <a href="${esc(s.src)}" target="_blank" rel="noopener">original ↗</a></figcaption></figure>`).join('');
    const ac = [['met', 'App icon', '512 × 512 PNG, as Play requires.'], ['met', 'Feature graphic', 'Exactly 1024 × 500, as Play requires.'], [AS.screenshots.length >= 8 ? 'met' : 'rec', 'Phone screenshots', `${AS.screenshots.length} of 8 slots used, all 9:16. The editor and the vault are not yet shown.`], ['rec', 'Device captures in the dossier', 'The dossier’s test captures are 720 × 1600 (1 : 2.22); Play allows at most 1 : 2, so they need framing before upload.'], ['rec', 'Promo video', 'None on the listing.']];
    document.getElementById('m-asset-checks').innerHTML = `<thead><tr><th>Status</th><th>Asset</th><th>Detail</th></tr></thead><tbody>` + ac.map(([s, a, d]) => `<tr><td>${pill(s)}</td><td><b>${esc(a)}</b></td><td>${esc(d)}</td></tr>`).join('') + '</tbody>';

    // ---- title, short and full description
    document.getElementById('m-cur-kicker').textContent = isT ? 'Metadata · United States · proposed for Tiksta' : 'Metadata · United States';
    document.getElementById('m-cur-sub').textContent = isT
      ? 'A new version positioned as a reels downloader. The title joins the brand, the category’s top keyword and a low-competition term. The strongest rankable keywords sit in the first two paragraphs, and the features follow as short sections with bullets. No brand names appear anywhere.'
      : 'The listing’s metadata as live on Google Play. Every keyword it targets from the playbook’s US board is marked.';
    const opt = document.getElementById('m-options');
    opt.hidden = !isT;
    if (isT) {
      const row = q => B.find(r => r.q === q) || {};
      const vd = row('video downloader'), rda = row('reels downloader app'), svd = row('social video downloader');
      const why = [
        `“Video Downloader” is the category’s top keyword (priority ${vd.P}). “Reels” adds the positioning and a low bar: the smallest app in the top 10 for “reels downloader app” has ${fmt(rda.entry)} installs.`,
        `Keeps “social video downloader” as an exact phrase: ${svd.c10} competitors in its top 10, smallest app ${fmt(svd.entry)} installs. Drops the reels positioning.`,
        `Carries every word of “reels downloader app” (priority ${rda.P}) but gives up the exact phrase “video downloader”.`,
      ];
      const exactIn = t => B.filter(r => r.tier !== 'D' && !r.tm && (phraseN(t, r.q) || allIn(r.q, wordSet(t)))).sort((a, b) => b.P - a.P).map(r => r.q);
      opt.innerHTML = `<div class="titles">${TK.titles.map((t, i) => { const fx = { title: t, short: TK.short, long: TK.long }, hits = exactIn(t); return `<div class="topt${i === 0 ? ' rec' : ''}"><div class="tag">${i === 0 ? 'Recommended title' : 'Alternative ' + i}</div><div class="tt">${esc(t)}</div>${meter(t.length, 30)}<div class="why">${esc(why[i])} With the short and full description below, it reaches ${prioCoverage(fx, B).toFixed(0)}% priority coverage.</div><div class="covered">${hits.slice(0, 8).map(h => `<span>${esc(h)}</span>`).join('')}</div></div>`; }).join('')}</div>`;
    }
    const phr = B.filter(r => r.tier !== 'D' && phraseN(f.long, r.q)).map(r => ({ r, n: phraseN(f.long, r.q), d: 100 * phraseN(f.long, r.q) * nWords(r.q) / nWords(f.long) })).sort((x, y) => y.n - x.n || y.r.P - x.r.P);
    document.getElementById('m-listing').innerHTML = `
      <div class="apphead"><img src="${AS.icon.file}" alt="" width="56" height="56" style="border-radius:14px;box-shadow:0 0 0 1px var(--line)"><div><div class="t">${esc(f.title)}</div><div class="d">${esc(L.current.developer)} · ${esc(L.current.genre)}</div></div></div>
      <div class="field"><div class="field-label"><span>Title</span><span>${f.title.length} / 30</span></div><p>${highlight(f.title, fk)}</p></div>
      <div class="field"><div class="field-label"><span>Short description</span><span>${f.short.length} / 80</span></div><p>${highlight(f.short, fk)}</p>${isT && TK.shortAlt ? `<p class="small muted" style="margin-top:6px">Alternative (${TK.shortAlt.length}/80): ${esc(TK.shortAlt)}</p>` : ''}</div>
      <div class="field longdesc"><div class="field-label"><span>Full description</span><span>${f.long.length.toLocaleString('en-US')} / 4,000</span></div>${longHtml(f.long, fk)}</div>`;
    const side = [`<div class="panel"><h3>Board keywords in the full description</h3><p class="small muted" style="margin-bottom:6px">${nWords(f.long)} words</p><table><thead><tr><th>Phrase</th><th class="num">Uses</th><th class="num">Density</th><th>Tier</th></tr></thead><tbody>${phr.map(x => `<tr><td class="kw">${esc(x.r.q)}</td><td class="num">${x.n}</td><td class="num">${x.d.toFixed(1)}%</td><td><span class="pill ${TIER_PILL[x.r.tier]}">${TIER[x.r.tier]}</span></td></tr>`).join('')}</tbody></table></div>`,
      `<div class="panel"><h3>Finalized keywords by field</h3><table><tbody>${[['In the title', ['title', 'titlew']], ['Title + short description', ['short', 'tsw']], ['Full description', ['long']], ['Not in this version', ['none']]].map(([lab, keys]) => { const list = FIN.filter(r => keys.includes(coverageOf(r.q, f).key)); return `<tr><td class="nowrap">${lab}</td><td class="num"><b>${list.length}</b></td></tr><tr><td colspan="2" class="small muted" style="border-top:0;padding-top:0">${list.map(r => esc(r.q)).join(' · ') || '—'}</td></tr>`; }).join('')}</tbody></table></div>`];
    if (isT) side.push(`<div class="panel"><h3>Measured against the live listing</h3><p class="small muted" style="margin-bottom:6px">Both scored on the re-scored US board</p><table><thead><tr><th></th><th class="num">Live</th><th class="num">Tiksta</th></tr></thead><tbody>
        <tr><td>Priority coverage</td><td class="num">${prioCoverage(CUR, B).toFixed(0)}%</td><td class="num"><b>${prioCoverage(f, B).toFixed(0)}%</b></td></tr>
        <tr><td>Finalized keywords used</td><td class="num">${FIN.filter(r => coverageOf(r.q, CUR).key !== 'none').length} / ${nF}</td><td class="num"><b>${FIN.filter(r => coverageOf(r.q, f).key !== 'none').length} / ${nF}</b></td></tr>
        <tr><td>…in title or short</td><td class="num">${strong(CUR)}</td><td class="num"><b>${strong(f)}</b></td></tr>
        <tr><td>Reels keywords used</td><td class="num">${B.filter(r => r.cleared && coverageOf(r.q, CUR).key !== 'none').length}</td><td class="num"><b>${B.filter(r => r.cleared && coverageOf(r.q, f).key !== 'none').length}</b></td></tr>
        <tr><td>Brand names in the text</td><td class="num">${brandsIn([CUR.title, CUR.short, CUR.long].join('\n')).length}</td><td class="num"><b>${brands.length}</b></td></tr>
        <tr><td>Full description</td><td class="num">${CUR.long.length.toLocaleString('en-US')}</td><td class="num">${f.long.length.toLocaleString('en-US')}</td></tr>
      </tbody></table></div>`);
    document.getElementById('m-side').innerHTML = side.join('');
    const copy = document.getElementById('m-copy');
    copy.hidden = !isT;
    if (isT) copy.innerHTML = `<details class="desc"><summary>Plain text to paste into Play Console</summary><div class="copyf">${[['Title', f.title, 1], ['Short description', f.short, 2], ['Full description', f.long, 24]].map(([l, v, rowsN]) => `<label><span class="field-label"><span>${l}</span><span>${v.length.toLocaleString('en-US')} characters</span></span><textarea readonly rows="${rowsN}" spellcheck="false">${esc(v)}</textarea></label>`).join('')}</div></details>`;

    // ---- every keyword this metadata targets
    const groups = [['In the title', ['title', 'titlew']], ['Title + short description', ['short', 'tsw']], ['Full description', ['long']]];
    const trow = r => { const ct = compTitlesWith(r.q); return `<tr><td style="min-width:190px"><span class="kw">${esc(r.q)}</span><div class="kwmeta"><span class="pill ${TIER_PILL[r.tier]}">${TIER[r.tier]}</span>${tmPill(r)}</div></td><td><span class="pill p-mute">${SRC[r.src]}</span></td><td class="num">${r.P}${pWas(r)}</td><td class="num">${Math.round(r.R * 100)}</td><td class="num">${r.demand}</td><td class="num">${compTop10(r)}<span class="muted"> / 16</span></td><td class="small" style="min-width:170px">${ct.length ? `<b>${ct.length}</b> · ${ct.map(x => esc(SHORT[x.i])).join(', ')}` : '<span class="muted">none</span>'}</td><td class="small">${entryCell(r)}</td></tr>`; };
    document.getElementById('m-targets-sub').textContent = 'All board keywords carried by the title, short description and full description, grouped by field, with how many competitors hold a top-10 rank and which competitors carry the keyword in their own title.' + (isT ? ' Reels keywords show their re-scored priority.' : '');
    document.getElementById('m-targets-table').innerHTML = `<thead><tr><th>Keyword</th><th>Source</th><th class="num">Priority</th><th class="num">Relevance</th><th class="num">Demand</th><th class="num">Competitors in top 10</th><th>In competitors’ titles</th><th>Smallest app in top 10</th></tr></thead><tbody>` +
      groups.map(([label, keys]) => { const list = used.filter(r => keys.includes(coverageOf(r.q, f).key)).sort((x, y) => y.P - x.P); return list.length ? `<tr class="grp"><td colspan="8">${label} · ${list.length}</td></tr>` + list.map(trow).join('') : ''; }).join('') + '</tbody>';
    document.getElementById('m-targets-note').textContent = `This metadata targets ${used.length} of the ${B.length} US board keywords. Competitors hold top-10 ranks on ${used.filter(r => compTop10(r) > 0).length} of them, and ${used.filter(r => compTitlesWith(r.q).length).length} sit word for word in at least one competitor’s title.`;

    // ---- keywords that name another company's product: shown only when the text names one
    const plat = B.filter(r => r.tm).sort((a, b) => b.P - a.P);
    const showPlat = brands.length > 0 || plat.some(r => coverageOf(r.q, f).key !== 'none');
    document.getElementById('m-platform').hidden = !showPlat;
    document.getElementById('jl-platform').hidden = !showPlat;
    document.getElementById('m-platform-table').innerHTML = !showPlat ? '' : `<thead><tr><th>Keyword</th><th class="num">Priority</th><th class="num">Demand</th><th class="num">Entry bar</th><th>Competitors ranking (US)</th><th>In your metadata</th></tr></thead><tbody>` +
      plat.map(r => `<tr><td style="min-width:200px"><span class="kw">${esc(r.q)}</span>${tmPill(r)}</td><td class="num">${r.P}</td><td class="num">${r.demand}<div class="small muted">${r.demandAt ? `after “${esc(r.demandAt)}”` : 'not suggested'}</div></td><td class="num">${entryCell(r)}</td><td class="small" style="min-width:170px">${compNames(r)}</td><td>${covPill(coverageOf(r.q, f))}</td></tr>`).join('') + '</tbody>';

    // ---- finalized keywords
    document.getElementById('m-kw-sub').textContent = isT
      ? `The ${nF} US keywords with core or adjacent intent, relevance of 80 or above and no brand name, on the board re-scored for reels. “Free”, “without ads” and “4K” keywords are left out because this listing makes none of those claims. Split by whether this metadata targets them.`
      : 'The 24 highest-priority US keywords with core or adjacent intent, relevance of 80 or above and no platform name, split by whether this metadata targets them.';
    const maxP = FIN[0].P;
    const kwRow = (r, w) => `<tr><td class="num muted">${FIN.indexOf(r) + 1}</td><td style="min-width:200px"><span class="kw">${esc(r.q)}</span><div class="kwmeta"><span class="pill ${TIER_PILL[r.tier]}">${TIER[r.tier]}</span><span class="pill p-mute">${SRC[r.src]}</span>${tmPill(r)}</div></td><td><div class="pbar"><div class="track"><div class="fill" style="width:${(100 * r.P / maxP).toFixed(1)}%"></div></div><b>${r.P}</b></div>${pWas(r)}</td><td class="num">${Math.round(r.R * 100)}</td><td class="num">${r.nb}<span class="muted">/10</span></td><td class="num">${r.demand}</td><td class="num">${entryCell(r)}</td><td class="small" style="min-width:170px">${compNames(r)}</td>${w ? `<td>${covPill(coverageOf(r.q, f))}</td>` : ''}</tr>`;
    const head = w => `<thead><tr><th class="num">#</th><th>Keyword</th><th>Priority</th><th class="num">Relevance</th><th class="num">Winnable</th><th class="num">Demand</th><th class="num">Entry bar</th><th>Competitors ranking (US)</th>${w ? '<th>Targeted in</th>' : ''}</tr></thead>`;
    const now = FIN.filter(r => coverageOf(r.q, f).key !== 'none'), future = FIN.filter(r => coverageOf(r.q, f).key === 'none');
    document.getElementById('m-kw-now-h').textContent = `Targeted in this metadata · ${now.length} of ${nF}`;
    document.getElementById('m-kw-future-h').textContent = `Not in this version · ${future.length} of ${nF}`;
    document.getElementById('m-kw-now').innerHTML = head(true) + '<tbody>' + now.map(r => kwRow(r, true)).join('') + '</tbody>';
    document.getElementById('m-kw-future').innerHTML = future.length ? head(false) + '<tbody>' + future.map(r => kwRow(r, false)).join('') + '</tbody>' : '<tbody><tr><td class="muted">Every finalized keyword is targeted.</td></tr></tbody>';

    // ---- ladder
    document.getElementById('m-ladder-sub').textContent = (isT ? 'The US ladder rebuilt on the re-scored board, so reels keywords take the phase their entry bars earn. ' : 'The US ladder with each keyword marked by how this metadata covers it. ') + 'T = title, T+S = every word across title and short description, S = short description, L = full description, and a dash = not in this version.';
    document.getElementById('m-ladder-list').innerHTML = ladderPhases(B, V.ex).map(([ph, sub, list]) => { const cov = list.map(r => coverageOf(r.q, f).key); return `<div class="rung"><div class="ph">${ph}<small>${sub}</small></div><div><ul>${list.map(r => { const c = coverageOf(r.q, f); return `<li>${esc(r.q)} <i>P${r.P}</i><span class="cov pill ${COV[c.key][1]}">${COV[c.key][0]}</span> <i>· ${compTop10(r)} comp. top-10 · smallest app ${r.entry == null ? '—' : r.entry < 1000 ? 'under 1K' : fmt(r.entry)}</i></li>`; }).join('') || '<li>none at this bar</li>'}</ul><p class="proof">This metadata carries <b>${cov.filter(k => strongKeys.includes(k)).length}</b> in the title or short description and <b>${cov.filter(k => k === 'long').length}</b> in the full description; <b>${cov.filter(k => k === 'none').length}</b> not in this version.</p></div></div>`; }).join('');

    // ---- competitor ranks on the keywords used
    const sorted = used.slice().sort((x, y) => (compRanks(y).length > 0) - (compRanks(x).length > 0) || y.R - x.R || y.P - x.P);
    const noC = sorted.filter(r => !compRanks(r).length), cols = 3 + COMP.length + 1;
    const urow = r => `<tr><td class="kwc"><span class="kw">${esc(r.q)}</span>${tmPill(r)}<div style="margin-top:3px">${covPill(coverageOf(r.q, f))}</div></td><td class="num small">${Math.round(r.R * 100)}</td><td class="num small">${r.P}</td>${COMP.map((c, k) => `<td>${rkCell(r.comps[k], c, r.q)}</td>`).join('')}<td class="num"><b>${compTop10(r)}</b><span class="muted"> / 16</span></td></tr>`;
    document.getElementById('m-used-table').innerHTML = `<thead><tr><th>Keyword · where this metadata uses it</th><th class="num">Relevance</th><th class="num">Priority</th>${COMP.map((c, i) => `<th class="ch">${esc(SHORT[i])}</th>`).join('')}<th class="num">Top 10</th></tr></thead><tbody><tr class="grp"><td colspan="${cols}">Competitors rank on these · ${withC.length}</td></tr>${sorted.filter(r => compRanks(r).length).map(urow).join('')}${noC.length ? `<tr class="grp"><td colspan="${cols}">No competitor in the results · ${noC.length}</td></tr>${noC.map(urow).join('')}` : ''}</tbody>`;

    // ---- policy record
    const rec = [], add = (s, rule, detail) => rec.push({ s, rule, detail });
    const sameT = PROF.find(p => p.title.toLowerCase() === f.title.toLowerCase());
    add(f.title.length <= 30 ? 'met' : 'not', 'Title within 30 characters', `${f.title.length} / 30.`);
    add(/(\bbest\b|#1|\bfree\b|\bsale\b)/i.test(f.title) ? 'not' : 'met', 'Title free of “best”, “#1”, “free” and sale wording', 'None present.');
    if (isT) {
      const clash = A.find(a => normT(a.t).includes(' tiksta '));
      add(clash || PC.tikstaNamed ? 'not' : 'met', 'Title distinct from other apps’ titles', clash ? `“${clash.t}” uses the name.` : `No app among the ${A.length} in the playbook or the ${PC.apps} checked on 16 Sep 2026 is named Tiksta.`);
      add(brands.length ? 'not' : 'met', 'No brand names in the title, short or full description', brands.length ? `Present: ${brands.join(', ')}.` : 'None of Instagram, Insta, Facebook, TikTok, WhatsApp, YouTube, Pinterest, X / Twitter, LinkedIn, Vimeo, Dailymotion, Snapchat or Likee appear.');
      const tr = PC.terms.find(t => t.key === 'reels'), tt = PC.terms.find(t => t.key === 'tik');
      add('rec', '“Reels” used as a generic term', `Checked on Google Play: ${tr.n} live app titles carry it, ${tr.y2} of them listed for 2+ years, ${tr.m1} with 1M+ installs. Meta’s Instagram brand rules name “Insta” and “gram”, not “Reels”. Tolerated, but the proof at scale is thin; see the check below.`);
      add('rec', 'Brand name “Tiksta”', `No app on Google Play uses the name, and it contains neither “Insta” nor “gram”. ${tt.n} live titles use a “Tik” name, ${tt.y2} of them listed for 2+ years (for example ${[tt.ex[2], tt.ex[3]].filter(Boolean).map(e => `${e.t}, ${e.b}`).join('; ')}). This is a store check, not a trademark clearance.`);
      add('rec', 'App name inside the APK', 'The build’s app name is “All Video Downloader” (dossier spec). Rename the launcher label and in-app name to Tiksta in the same release as this title, so the installed app matches the listing.');
      add('rec', 'Package name', `${L.current.id} contains “instagram”. A published app’s package name cannot change; it shows in the listing URL, not in the metadata text.`);
    } else {
      add(sameT ? 'not' : 'met', 'Title distinct from competitors’ titles', sameT ? `Identical to “${sameT.title}” by ${sameT.developer}.` : 'Distinct.');
      const platIn = [f.title, f.short].join(' ').match(/\b(instagram|facebook|tiktok|twitter|whatsapp|youtube|pinterest)\b/i);
      add(platIn ? 'not' : 'met', 'No platform names in title or short description', platIn ? `“${platIn[0]}” present.` : 'None present.');
    }
    add(/youtube/i.test(all) ? 'not' : 'met', 'No YouTube references', /youtube/i.test(all) ? 'YouTube is mentioned.' : 'None present.');
    if (isT) add(/no watermark|watermark remover|remove (the )?watermark/i.test(all) ? 'not' : 'met', 'No “no watermark” promise', 'The only watermark mention is the editor adding your own.');
    add(/not affiliated/i.test(all) ? 'met' : 'not', 'Non-affiliation statement', /not affiliated/i.test(all) ? 'Present at the end of the full description.' : 'Missing.');
    add(/copyright/i.test(all) ? 'met' : 'not', 'Copyright notice', /copyright/i.test(all) ? 'Present: download only content you own or may save.' : 'Missing.');
    add(/\bno ads\b|without ads|ad-free/i.test(all) && L.current.ads ? 'not' : 'met', 'Ad wording matches the “Contains ads” label', isT ? 'Premium is described as removing ads; there is no ad-free claim for the app itself.' : 'No ad-free claim in the text.');
    if (isT) add(/premium removes all ads/i.test(all) && !/unlimited|faster downloads|1080p/i.test(all) ? 'met' : 'not', 'Premium described as it works', 'Premium removes all ads, including the one before a download. No speed, quality or unlimited-download promise.');
    add(f.short.length <= 80 ? 'met' : 'not', 'Short description within 80 characters', `${f.short.length} / 80.`);
    add(f.long.length <= 4000 ? 'met' : 'not', 'Full description within 4,000 characters', `${f.long.length.toLocaleString('en-US')} / 4,000 · ${(4000 - f.long.length).toLocaleString('en-US')} unused.`);
    if (isT) {
      const top = phr.filter(x => nWords(x.r.q) > 1)[0];
      add('rec', 'Keyword repetition', top ? `Most repeated board phrase: “${top.r.q}” ×${top.n}, ${top.d.toFixed(1)}% of ${nWords(f.long)} words. Headings and bullets carry the keywords; no phrase is stacked in a list.` : 'No repeated board phrase.');
      add('met', 'Every feature claim is in the Product Dossier', 'Paste or share a link · built-in browser · quality picker · photos and multi-item posts · parallel downloads with pause, resume, retry · background downloads · status saver · 9-tool editor · vault with PIN, fingerprint and security question · 9 languages with RTL · dark mode.');
    } else add('rec', 'Features the listing doesn’t mention', `${D.claims.filter(([c]) => F.ourClaims[c] && !MYP.claims[c]).map(([, l]) => l).join(', ')}.`);
    add('met', 'Privacy policy link', `Linked and loading (HTTP ${L.current.privacyStatus}).`);
    document.getElementById('m-policy-table').innerHTML = `<thead><tr><th>Status</th><th>Rule</th><th>Detail</th></tr></thead><tbody>` + rec.map(x => `<tr><td>${pill(x.s)}</td><td><b>${esc(x.rule)}</b></td><td>${esc(x.detail)}</td></tr>`).join('') + '</tbody>';

    // ---- borderline terms, checked on Google Play (Tiksta only)
    const tw = document.getElementById('m-terms');
    tw.hidden = !isT;
    if (isT) {
      const DEC = {
        reels: ['p-good', 'Used', 'Not named in Meta’s Instagram brand rules', 'title, short, full'],
        story: ['p-good', 'Used', 'Everyday word; the baseline for “proven”', 'short, full'],
        tik: ['p-acc', 'Name only', 'No store evidence against it; get a trademark check', 'the Tiksta brand'],
        insta: ['p-risk', 'Not used', 'Meta: “Don’t combine ‘Insta’ or ‘gram’ with your own brand”', 'fails the check'],
        tiktok: ['p-mute', 'Not used', 'Brand name, kept out by your decision', 'brand name'],
        instagram: ['p-mute', 'Not used', 'Meta allows only a descriptive “for Instagram”; kept out by your decision', 'brand name'],
      };
      const tr = PC.terms.find(t => t.key === 'reels'), st = PC.terms.find(t => t.key === 'story'), it = PC.terms.find(t => t.key === 'insta');
      const serpHas = PC.serp.map((s, i) => ({ ...s, rank: i + 1 })).filter(s => s.has);
      const newest = serpHas.slice().sort((a, b) => (b.f || '').localeCompare(a.f || ''))[0], smallest = serpHas[serpHas.length - 1];
      tw.innerHTML = `<h3 style="margin:30px 0 6px">Borderline terms, checked on Google Play</h3>
        <p class="sub" style="margin-bottom:14px">${PC.queries.length} US English searches on ${new Date(PC.collectedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}, ${PC.apps} distinct apps, each app page read for its title, installs and first listing date. Apps published by the brand owner are not counted.</p>
        <div class="tscroll"><table class="checks-table"><thead><tr><th>Term</th><th class="num">Live titles</th><th class="num">1M+ installs</th><th class="num">Listed 2+ years</th><th>Largest examples</th><th>Brand owner’s rules</th><th>Decision</th></tr></thead><tbody>${PC.terms.map(t => { const d = DEC[t.key]; return `<tr><td class="nowrap"><b>${esc(t.label)}</b></td><td class="num">${t.n}</td><td class="num">${t.m1}</td><td class="num">${t.y2}</td><td class="small" style="min-width:260px">${t.ex.map(e => `${esc(e.t)} <span class="muted">· ${esc(e.b)} · since ${pDate(e.f)}</span>`).join('<br>') || '—'}</td><td class="small" style="min-width:180px">${esc(d[2])}</td><td><span class="pill ${d[0]}">${esc(d[1])}</span><div class="small muted" style="margin-top:4px">${esc(d[3])}</div></td></tr>`; }).join('')}</tbody></table></div>
        <div class="g-cols" style="margin-top:16px">
          <p><b>Does a crowded title prove a term is safe?</b> Only partly. Google Play acts on complaints from the brand owner, so apps removed after a complaint no longer appear in a count like this. Many small, new apps show a term is tolerated today; titles that have stayed live for two years with a million installs are the stronger proof. By that test “Story” is proven (${st.m1} titles with 1M+ installs, ${st.y2} listed 2+ years), “Reels” is tolerated but thin at scale (${tr.n} titles, ${tr.y2} listed 2+ years, ${tr.m1} with 1M+), and “Insta” fails (${it.n} titles, none past 1K+ installs or a year old, and Meta bans it by name).</p>
          <p><b>Why “Reels” is still worth the title.</b> On “reels downloader”, ${serpHas.length} of the top 10 apps carry reels in their title${newest ? `, including ${esc(newest.t)} (${esc(newest.b)} installs, listed ${pDate(newest.f)}) at #${newest.rank}` : ''}${smallest && smallest !== newest ? ` and ${esc(smallest.t)} (${esc(smallest.b)}) at #${smallest.rank}` : ''}. The 10M+ leaders rank there without the word, so a new app wins those slots by naming it. A search for “tiksta” returns ${esc(PC.tikstaSerp.slice(0, 3).join(', '))} and other apps; none uses the name. Source for Meta’s rule: <a href="https://www.meta.com/brand/resources/instagram/instagram-brand/" target="_blank" rel="noopener">Instagram brand guidelines ↗</a>.</p>
        </div>`;
    }

    // ---- method
    document.getElementById('m-method-text').innerHTML = (isT ? [
      `<b>The copy.</b> Title, short and full description written for Tiksta on 16 Sep 2026 from the playbook’s US board. Every feature claim maps to the device-tested build in the Product Dossier; the header facts, links and assets are the live listing’s.`,
      '<b>Reels re-score.</b> Board rows flagged only for “reels” are scored as core intent after the Google Play check: relevance rises by 0.55 × (1 − 0.7) = 0.165 and priority = 100 · relevance² · opportunity. Rows that also name a brand, such as “instagram reels downloader”, keep their flag.',
      `<b>Finalized keywords.</b> The ${nF} rows with core or adjacent intent, relevance of 80 or above and no brand name. “Free”, “without ads” (the app contains ads) and “4K” (not a verified quality) are left out.`,
      '<b>Keyword coverage.</b> Text is lowercased and “&” is read as “and”. A keyword counts as in the title when its exact phrase or all its words appear there; as title + short when all its words appear across both; otherwise its exact-phrase uses in the full description are counted. Ranks belong to the 16 competitors, from the playbook’s US results.',
    ] : [
      `<b>The listing.</b> Title, short and full description, monetisation labels and store assets were fetched from Google Play for <span class="quote">${esc(L.current.id)}</span> (English, United States). The privacy policy link was requested live.`,
      '<b>No own-app ranking.</b> Every rank on this tab belongs to one of the 16 competitors, from the same US results used across the playbook.',
      '<b>Keyword coverage.</b> Text is lowercased and “&” is read as “and”. A keyword counts as in the title when its exact phrase or all its words appear there; as title + short when all its words appear across both; otherwise its exact-phrase uses in the full description are counted.',
      '<b>Finalized keywords.</b> US board rows with core or adjacent intent, relevance of 80 or above and no platform name, ranked by priority. “Without ads” phrases are excluded because the app contains ads.',
    ]).map(p => `<p>${p}</p>`).join('');
  }

  // ---------- TAB 3 · features ----------
  const FV = { F: ['✓', 'full', 'Yes'], P: ['◐', 'basic', 'Partial'], N: ['✕', 'none', 'No'], U: ['?', 'unk', 'Not determinable'] };
  const fsc = v => v === 'F' ? 1 : v === 'P' ? 0.5 : 0;
  function renderFeatures() {
    const au = F.audit, apps = au.apps, rowsAll = au.groups.flatMap(g => g.rows), n = apps.length;
    const score = i => rowsAll.reduce((s, r) => s + fsc(r.v[i]), 0);
    const onlyUs = rowsAll.filter(r => r.v[0] === 'F' && ![...r.v.slice(1)].includes('F'));
    const best = Math.max(...apps.slice(1).map((a, i) => score(i + 1)));
    const claimKeys = D.claims.map(c => c[0]);
    const claimCount = p => claimKeys.filter(k => p.claims[k]).length;
    const bestClaims = PROF.slice().sort((a, b) => claimCount(b) - claimCount(a))[0];
    document.getElementById('f-lede').textContent = `Our app against six audited competitor builds and all 16 tracked listings. It is the only app in the audit with MP3 extraction, batch downloads and a PIN-locked vault, and the only one anywhere in the set that pairs a downloader with a 9-tool video editor.`;
    document.getElementById('f-tiles').innerHTML = [
      [`${onlyUs.length}`, 'audited features only our app ships'],
      [`${score(0)}<small>/${rowsAll.length}</small>`, `audit coverage · best competitor ${best}`],
      [`${claimKeys.length}<small>/${claimKeys.length}</small>`, `user features shipped · best competitor listing claims ${claimCount(bestClaims)}`],
      ['9', 'editing tools · no audited competitor has one'],
    ].map(([v, l]) => `<div class="tile"><div class="n">${v}</div><div class="l">${l}</div></div>`).join('');
    document.getElementById('f-only').innerHTML = F.oursOnly.map(a => `<div class="card"><div class="tag">Only in our app</div><h3 style="font-size:1rem;margin-bottom:6px">${esc(a.h)}</h3><p>${esc(a.p)}</p></div>`).join('');

    document.getElementById('f-legend').innerHTML = [['F', 'Ships'], ['N', 'Not in the build']].map(([k, l]) => `<span><i class="fv ${FV[k][1]}" aria-hidden="true">${FV[k][0]}</i>${l}</span>`).join('');
    const colHead = apps.map((a, i) => { const p = a.comp >= 0 ? PROF[a.comp] : null; const t10 = p ? D.markets.reduce((s, gl) => s + p.perMarket[gl].top10, 0) : null; return `<th class="ch${i === 0 ? ' ours-col' : ''}">${esc(a.dev)}<div class="small muted">${esc(a.installs)}</div>${p ? `<div class="liveb">${t10} top-10s · 8 mkts</div>` : ''}</th>`; }).join('');
    document.getElementById('f-audit-table').innerHTML = `<thead><tr><th>Feature</th>${colHead}<th class="num">Competitors with it</th></tr></thead><tbody>` +
      au.groups.map(g => `<tr class="grp"><td colspan="${n + 2}">${esc(g.g)}</td></tr>` + g.rows.map(r => `<tr><td class="kwc" style="min-width:220px">${esc(r.f)}</td>${[...r.v].map((v, i) => `<td${i === 0 ? ' class="ours-col"' : ''}><span class="fv ${FV[v][1]}" title="${FV[v][2]}">${FV[v][0]}</span></td>`).join('')}<td class="num"><b>${[...r.v.slice(1)].filter(v => v === 'F').length}</b><span class="muted"> / 6</span></td></tr>`).join('')).join('') +
      `</tbody><tfoot><tr><td class="kwc">Coverage</td>${apps.map((a, i) => `<td${i === 0 ? ' class="ours-col"' : ''}>${score(i)}</td>`).join('')}<td class="num">of ${rowsAll.length}</td></tr></tfoot>`;
    document.getElementById('f-excluded').textContent = au.excluded;

    const cols = [{ ours: true }].concat(PROF.map((p, k) => ({ p, k })));
    document.getElementById('f-claims-table').innerHTML = `<thead><tr><th>Feature</th><th class="ch ours-col">Our app<div class="small muted">product</div></th>${PROF.map((p, k) => `<th class="ch" title="${esc(p.title)}">${esc(SHORT[k])}<div class="small muted">${esc(p.installsLabel)}</div></th>`).join('')}<th class="num">Listings claiming it</th></tr></thead><tbody>` +
      D.claims.map(([key, label]) => `<tr><td class="kwc" style="min-width:220px">${esc(label)}</td><td class="ours-col"><span class="fv full" title="Ships in the app">✓</span>${MYP.claims[key] ? '' : '<div><span class="fv gap" title="Your listing does not mention it">not in listing</span></div>'}</td>${PROF.map(p => `<td><span class="fv ${p.claims[key] ? 'full' : 'none'}" title="${p.claims[key] ? 'Claimed in listing' : 'Not claimed'}">${p.claims[key] ? '✓' : '✕'}</span></td>`).join('')}<td class="num"><b>${PROF.filter(p => p.claims[key]).length}</b><span class="muted"> / 16</span></td></tr>`).join('') +
      `</tbody><tfoot><tr><td class="kwc">Claims</td><td class="ours-col">${claimKeys.length}</td>${PROF.map(p => `<td>${claimCount(p)}</td>`).join('')}<td></td></tr></tfoot>`;
    const gaps = D.claims.filter(([k]) => !MYP.claims[k]).map(([, l]) => l);
    document.getElementById('f-claims-note').textContent = `Competitor columns show what each listing claims, not a code audit — an app may ship a feature its listing never mentions. Your current listing mentions ${claimKeys.length - gaps.length} of the ${claimKeys.length} features your app ships; the ones it leaves out are ${gaps.join(', ').toLowerCase()}.`;

    document.getElementById('f-inv').innerHTML = F.inventory.map(s => `<div class="card"><div class="tag">${esc(s.screen)}</div><ul class="checks" style="margin-top:4px">${s.items.map(i => `<li>${esc(i)}</li>`).join('')}</ul></div>`).join('');
    const inshot = PROF[0];
    document.getElementById('f-edge-cards').innerHTML = F.edges.map(c => `<div class="card"><div class="tag">Competitor strength</div><h3 style="font-size:1rem;margin-bottom:6px">${esc(c.h)}</h3><p>${esc(c.p)}</p></div>`).join('') +
      `<div class="card"><div class="tag">Search visibility</div><h3 style="font-size:1rem;margin-bottom:6px">${esc(inshot.developer)} owns the search results</h3><p>${inshot.perMarket.US.top10} US top-10 placements and ${inshot.score ? inshot.score.toFixed(2) : '—'} stars from ${fmt(inshot.ratings)} ratings. Features win the comparison; ratings volume and ranking history are where the leaders are hardest to catch.</p></div>`;

    const iapRows = PROF.concat([MYP]).map(p => ({ p, r: p.iapRange })).sort((a, b) => (b.p.installs || 0) - (a.p.installs || 0));
    document.getElementById('f-iap-table').innerHTML = `<thead><tr><th>App</th><th class="num">Installs</th><th class="num">Rating</th><th>Ads</th><th>In-app purchases (US)</th><th style="min-width:200px">Range · $0–$100</th></tr></thead><tbody>` +
      iapRows.map(({ p, r }) => `<tr${p.mine ? ' style="background:var(--accent-soft)"' : ''}><td style="min-width:210px"><b>${esc(p.title)}</b><div class="small muted">${esc(p.mine ? 'Your app' : p.developer)}</div></td><td class="num">${esc(p.installsLabel)}</td><td class="num">${p.score ? p.score.toFixed(1) : '—'}</td><td>${p.ads ? '<span class="pill p-warn">Ads</span>' : '<span class="pill p-good">No ads</span>'}</td><td class="money">${esc(p.iap || 'None')}</td><td>${r ? `<div class="range${p.mine ? ' ours' : ''}" role="img" aria-label="$${r.min} to $${r.max}"><span style="left:${Math.min(100, r.min)}%;width:${Math.max(1, Math.min(100, r.max) - Math.min(100, r.min))}%"></span></div>` : '<span class="muted small">—</span>'}</td></tr>`).join('') + '</tbody>';
    document.getElementById('f-plans').innerHTML = `<h3 style="margin-bottom:8px">Our plans</h3><div class="kwlist">${F.plans.items.map(x => `<span>${esc(x.p)} · ${esc(x.price)} · ${esc(x.sku)}</span>`).join('')}</div><p class="small muted" style="margin-top:8px">${esc(F.plans.note)} In the US, Play shows the app’s in-app items at ${esc(L.current.iap)}. Premium removes ads; it does not unlock faster or unlimited downloads.</p>`;

    document.getElementById('f-method-text').innerHTML = [
      '<b>Feature audit.</b> The matrix is your team’s static analysis of six competitor APKs against ours (Slide 7). One row, “Jetpack Compose modern UI”, is left out because the Product Dossier’s spec shows the app is built with Android Views.',
      '<b>Listing claims.</b> Each competitor’s live Google Play title, short and full description (US, English) was searched for wording that describes each feature. A ✕ means the listing does not claim it, not that the app lacks it.',
      '<b>Our column.</b> Features come from the Product Dossier: the build’s spec and the device-tested QA rounds. “Not in listing” marks features your current Play listing never mentions.',
      '<b>IAP.</b> Price ranges are the “In-app purchases” line each listing shows in the United States. Our plan prices are the Pakistan prices recorded in the dossier.',
    ].map(p => `<p>${p}</p>`).join('');
  }

  // ---------- TAB 5 · competitor's graphics ----------
  // Self-contained: this block brings its own listener helper and image viewer, so the other
  // pages are untouched. Elements referenced here exist only on the graphics page.
  const G = PAYLOAD.graphics;
  const gOn = (id, ev, fn) => { const el = document.getElementById(id); if (el) el.addEventListener(ev, fn); };
  const GA = [];
  if (G) G.apps.forEach(app => app.assets.forEach(a => { a.app = app; a.url = 'graphics/' + a.file; a.i = GA.length; GA.push(a); }));
  const iconOf = app => app.assets.find(a => a.kind === 'icon');
  const fgOf = app => app.assets.find(a => a.kind === 'feature-graphic');
  const pkgOf = url => (url.match(/id=([\w.]+)/) || [])[1];

  function gFigure(a, extra = '') {
    const search = [a.app.name, a.app.title, a.app.publisher, a.app.tags.join(' '), a.label, a.caption, a.alt].join(' ').toLowerCase();
    return `<figure class="shot" data-i="${a.i}" data-kind="${a.kind}" data-orient="${a.orient}" data-app="${a.app.id}" data-search="${esc(search)}">
      <button type="button" class="frame" style="aspect-ratio:${a.w} / ${a.h}" data-open="${a.i}" aria-label="View ${esc(a.app.name)} ${esc(a.label)} large"><img loading="lazy" src="${a.url}" alt="${esc(a.alt)}" width="${a.w}" height="${a.h}"></button>
      <figcaption>${extra}<span class="lab">${esc(a.label)}</span><span class="dim">${a.w} × ${a.h} · ${a.orient}</span><span>${esc(a.caption)}</span><a class="src" href="${esc(a.src)}" target="_blank" rel="noopener">Original image on Google Play ↗</a></figcaption></figure>`;
  }

  // Ties this tab back to the keyword board: how the listing ranks on the 100 US keywords.
  function gVisibility(pkg) {
    const p = D.profiles.find(x => x.id === pkg);
    if (!p || !p.perMarket || !p.perMarket.US) return 'Not tracked on the US keyword board.';
    const m = p.perMarket.US;
    return `US keyword board (16 Sep): <b>${m.top10}</b> top-10 · <b>${m.any}</b> placements on 100 keywords · best #${m.best || '—'}`;
  }

  function renderGraphics() {
    const shots = GA.filter(a => a.kind === 'screenshot');
    document.getElementById('g-chips').innerHTML = [
      `Our app + ${G.apps.length - 1} competitors`, `${GA.filter(a => a.kind === 'icon').length} icons`,
      `${GA.filter(a => a.kind === 'feature-graphic').length} feature graphics`, `${shots.length} screenshots`,
      `${shots.filter(a => a.orient === 'portrait').length} portrait · ${shots.filter(a => a.orient === 'landscape').length} landscape`
    ].map(c => `<span class="chip">${c}</span>`).join('');
    document.getElementById('g-overview-text').innerHTML = G.overview.map(p => `<p>${esc(p)}</p>`).join('');
    document.getElementById('g-capture').textContent = G.captureNote;

    const sizes = [96, 64, 48, 32];
    document.getElementById('g-iconwall').innerHTML = `<thead><tr><th class="sz"></th>${G.apps.map(app => `<th${app.ours ? ' class="is-ours"' : ''}><a href="#g-${app.id}">${esc(app.name)}</a>${app.ours ? '<div class="ourtag">our app</div>' : ''}</th>`).join('')}</tr></thead><tbody>` +
      sizes.map(s => `<tr><td class="sz">${s} px</td>${G.apps.map(app => { const ic = iconOf(app); return `<td><span class="icoplate" style="width:${s + 20}px;height:${s + 20}px"><img src="graphics/${ic.file}" width="${s}" height="${s}" alt="${s === 96 ? esc(app.name + ' icon') : ''}"></span></td>`; }).join('')}</tr>`).join('') +
      `<tr><td class="sz">Downloads</td>${G.apps.map(app => `<td class="small"><b>${esc(app.downloads)}</b><div class="muted">${esc(app.publisher)}</div></td>`).join('')}</tr></tbody>`;

    document.getElementById('g-fg').innerHTML = G.apps.map(app => gFigure(fgOf(app),
      `<a class="lab" href="#g-${app.id}">${app.num} · ${esc(app.name)}</a><span class="small muted">${esc(app.publisher)} · ${esc(app.downloads)} downloads</span>`))
      .join('').replace(/<span class="lab">Feature Graphic 01<\/span>/g, '');

    document.getElementById('g-summary').innerHTML = `<thead><tr><th>#</th><th>App</th><th>Publisher</th><th class="num">Downloads</th><th class="num">Rating</th><th class="num">Portrait</th><th class="num">Landscape</th><th>Listing</th></tr></thead><tbody>` +
      G.table.map(t => { const app = G.apps.find(a => a.id === t.id); return `<tr${t.ours ? ' class="is-ours"' : ''}><td class="num muted">${app.num}</td><td><a href="#g-${t.id}"><b>${esc(t.name)}</b></a>${t.ours ? ' <span class="pill p-acc">ours</span>' : ''}<div class="small muted">${esc(app.title)}</div></td><td>${esc(t.publisher)}</td><td class="num">${esc(t.downloads)}</td><td class="num">${esc(t.rating)}</td><td class="num">${t.portrait}</td><td class="num">${t.landscape}</td><td class="nowrap"><a href="${esc(app.playUrl)}" target="_blank" rel="noopener">Google Play ↗</a></td></tr>`; }).join('') + '</tbody>';

    document.getElementById('g-app').innerHTML = `<option value="">All ${G.apps.length} listings</option>` + G.apps.map(app => `<option value="${app.id}">${app.num} · ${esc(app.name)}</option>`).join('');

    document.getElementById('g-applist').innerHTML = G.apps.map(app => {
      const row = G.table.find(t => t.id === app.id);
      const portrait = app.assets.filter(a => a.kind === 'screenshot' && a.orient === 'portrait');
      const landscape = app.assets.filter(a => a.kind === 'screenshot' && a.orient === 'landscape');
      return `<article class="g-app${app.ours ? ' is-ours' : ''}" id="g-${app.id}" data-app="${app.id}">
        <div class="g-apphead"><img src="graphics/${iconOf(app).file}" alt="" width="72" height="72">
          <div class="g-appmeta"><div class="g-num">${app.ours ? 'Our app' : app.num + ' · ' + esc(app.publisher)}</div><h3>${esc(app.name)}${app.ours ? ' <span class="pill p-acc">ours</span>' : ''}</h3>
            <div class="small muted">“${esc(app.title)}” · ${esc(app.downloads)} downloads · rating ${esc(row.rating)} · ${row.portrait} portrait and ${row.landscape} landscape screenshots</div>
            <div class="small g-vis" style="margin-top:2px">${gVisibility(pkgOf(app.playUrl))}</div></div>
          <a class="g-play" href="${esc(app.playUrl)}" target="_blank" rel="noopener">Open listing on Google Play ↗</a></div>
        <div class="g-notes">${Object.entries(app.notes).map(([h, p]) => `<div class="g-note"><h4>${esc(h)}</h4><p>${esc(p)}</p></div>`).join('')}</div>
        <div class="tagrow">${app.tags.map(t => `<span>${esc(t)}</span>`).join('')}</div>
        <div class="g-group"><div class="g-row-label">Icon and feature graphic</div><div class="grid-lead">${gFigure(iconOf(app))}${gFigure(fgOf(app))}</div></div>
        ${portrait.length ? `<div class="g-group"><div class="g-row-label">Portrait screenshots · ${portrait.length}</div><div class="grid-portrait">${portrait.map(a => gFigure(a)).join('')}</div></div>` : ''}
        ${landscape.length ? `<div class="g-group"><div class="g-row-label">Landscape screenshots · ${landscape.length}</div><div class="grid-landscape">${landscape.map(a => gFigure(a)).join('')}</div></div>` : '<p class="note g-nolandscape">Landscape screenshots: not observed in this snapshot.</p>'}
      </article>`;
    }).join('');

    document.getElementById('g-patterns-list').innerHTML = G.patterns.map(p => `<div class="card"><div class="tag">${esc(p.h)}</div><p>${p.html}</p></div>`).join('');
    document.getElementById('g-guidance-list').innerHTML = G.guidance.map(p => `<div class="card"><div class="tag">${esc(p.h)}</div><p>${p.html}</p></div>`).join('');
    document.getElementById('g-req').innerHTML = G.requirements.map(p => `<p>${p}</p>`).join('');
    document.getElementById('g-scope-text').innerHTML = G.scope.map(p => `<p>${esc(p)}</p>`).join('');
    document.getElementById('g-sources-list').innerHTML = G.sources.map(s => `<li>${s}</li>`).join('');
    applyGraphicsFilter();
  }

  function applyGraphicsFilter() {
    const q = document.getElementById('g-q').value.trim().toLowerCase();
    const app = document.getElementById('g-app').value, kind = document.getElementById('g-kind').value, orient = document.getElementById('g-orient').value;
    const list = document.getElementById('g-applist');
    let n = 0;
    list.querySelectorAll('figure.shot').forEach(f => {
      const show = (!q || f.dataset.search.includes(q)) && (!app || f.dataset.app === app) && (!kind || f.dataset.kind === kind) && (!orient || f.dataset.orient === orient);
      f.hidden = !show; if (show) n++;
    });
    list.querySelectorAll('.g-group').forEach(g => { g.hidden = !g.querySelector('figure.shot:not([hidden])'); });
    list.querySelectorAll('.g-nolandscape').forEach(p => { p.hidden = !!(kind && kind !== 'screenshot') || orient === 'portrait' || orient === 'square'; });
    list.querySelectorAll('.g-app').forEach(a => { a.hidden = !a.querySelector('figure.shot:not([hidden])'); });
    document.getElementById('g-count').textContent = `${n} of ${GA.length} assets shown`;
  }
  ['g-q', 'g-app', 'g-kind', 'g-orient'].forEach(id => gOn(id, 'input', applyGraphicsFilter));

  // ---------- image viewer (graphics page only) ----------
  const lb = document.getElementById('lb'), lbImg = document.getElementById('lb-img'), lbCap = document.getElementById('lb-cap');
  let lbList = [], lbPos = 0;
  function lbShow() {
    const a = GA[lbList[lbPos]];
    lbImg.src = a.url; lbImg.alt = a.alt;
    lbCap.innerHTML = `<b>${esc(a.app.num)} · ${esc(a.app.name)}</b> · ${esc(a.label)} · ${a.w} × ${a.h} ${a.orient} · ${esc(a.caption)}<br><a href="${esc(a.src)}" target="_blank" rel="noopener">Original image on Google Play ↗</a> · ${lbPos + 1} of ${lbList.length}`;
  }
  function lbStep(d) { if (!lbList.length) return; lbPos = (lbPos + d + lbList.length) % lbList.length; lbShow(); }
  gOn('graphics', 'click', e => {
    const b = e.target.closest('[data-open]'); if (!b) return;
    const scope = b.closest('#g-fg, #g-applist');
    lbList = [...scope.querySelectorAll('figure.shot:not([hidden])')].map(f => +f.dataset.i);
    lbPos = Math.max(0, lbList.indexOf(+b.dataset.open));
    lbShow();
    if (typeof lb.showModal === 'function') lb.showModal(); else lb.setAttribute('open', '');
  });
  gOn('lb-close', 'click', () => lb.close());
  gOn('lb-prev', 'click', () => lbStep(-1));
  gOn('lb-next', 'click', () => lbStep(1));
  if (lb) {
    lb.addEventListener('click', e => { if (e.target === lb || e.target.id === 'lb-in') lb.close(); });
    lb.addEventListener('keydown', e => { if (e.key === 'ArrowLeft') lbStep(-1); if (e.key === 'ArrowRight') lbStep(1); });
    lb.addEventListener('close', () => { lbImg.removeAttribute('src'); });
  }

  // ---------- page ----------
  const bar = document.getElementById('bar');
  const syncBar = () => document.documentElement.style.setProperty('--barh', bar.offsetHeight + 'px');
  addEventListener('resize', syncBar); syncBar();

  function renderScoped() {
    document.querySelectorAll('[data-scope]').forEach(s => { s.textContent = MN[state.gl]; });
    state.strips = 20;
    renderCategories(); renderCompetitors(); renderMatrix(); renderStrips(); renderBoard(); renderLadder();
  }

  if (PAGE === 'playbook') {
    document.getElementById('strips-more').addEventListener('click', () => { state.strips += 20; renderStrips(); });
    document.getElementById('matrix-all').addEventListener('change', e => { state.all = e.target.checked; renderMatrix(); });
    renderHeader(); renderMarketSel(); renderTierChips(); renderCompDetailSelect(); renderCompDetail(); renderEvents(); renderMarkets(); renderListing(); renderScoped();
  } else if (PAGE === 'metadata') {
    renderMetadata('tiksta');
    document.querySelectorAll('#mv [data-ver]').forEach(b => b.addEventListener('click', () => {
      document.querySelectorAll('#mv [data-ver]').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
      renderMetadata(b.dataset.ver);
    }));
  } else if (PAGE === 'graphics') {
    renderGraphics();
  } else if (PAGE === 'features') {
    renderFeatures();
  }

  // Sections are drawn by this script, so jump to a #section link only after rendering.
  const h = decodeURIComponent(location.hash.slice(1)), el = h && document.getElementById(h);
  if (el) el.scrollIntoView();
})();
