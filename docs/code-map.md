# Code map

> **Generated file: do not edit by hand.** Produced by `node tools/export-docs.js` on 2026-09-22.
> For every section of every tab: the anchor id, where its markup is (file and line), which function in [assets/app.js](../assets/app.js) fills it, and which fields of [assets/data.js](../assets/data.js) that function reads (paths as in the [data dictionary](data-dictionary.md)). To change a section's wording, edit the markup for static text or the named function for text built from data; to change numbers, edit the data.

<a id="01-video-downloader"></a>

## Video Downloader

Markup: [tabs/01-video-downloader/index.html](../tabs/01-video-downloader/index.html) · `<body data-page="dossier">` · self-contained page (static HTML plus the inline script at the bottom of the file) · [text snapshot](tabs/01-video-downloader.md)

| Section | Menu label | Heading in the markup | Markup line | Filled by (assets/app.js) | Data read |
| --- | --- | --- | --- | --- | --- |
| [#overview](tabs/01-video-downloader.md#overview) | Overview | All VideoDownloader | [L32](../tabs/01-video-downloader/index.html#L32) | static markup / inline script |  |
| [#spec](tabs/01-video-downloader.md#spec) | Spec | What ships inside the APK | [L114](../tabs/01-video-downloader/index.html#L114) | static markup / inline script |  |
| [#market](tabs/01-video-downloader.md#market) | Market research | A crowded shelf, an unusual toolkit | [L185](../tabs/01-video-downloader/index.html#L185) | static markup / inline script |  |
| [#versions](tabs/01-video-downloader.md#versions) | Versions & APK | From 1.0 to a QA'd 2.4 | [L241](../tabs/01-video-downloader/index.html#L241) | static markup / inline script |  |
| [#money](tabs/01-video-downloader.md#money) | Monetization | Ads by default, a subscription to switch them off | [L279](../tabs/01-video-downloader/index.html#L279) | static markup / inline script |  |
| [#shots](tabs/01-video-downloader.md#shots) | Screenshots | Captured during testing | [L320](../tabs/01-video-downloader/index.html#L320) | static markup / inline script |  |
| [#graphics](tabs/01-video-downloader.md#graphics) | Graphics | Brand assets and store readiness | [L376](../tabs/01-video-downloader/index.html#L376) | static markup / inline script |  |
| [#qa](tabs/01-video-downloader.md#qa) | QA history | Five weeks of testing, one real phone at a time | [L405](../tabs/01-video-downloader/index.html#L405) | static markup / inline script |  |

<a id="02-aso-playbook"></a>

## ASO Playbook

Markup: [tabs/02-aso-playbook/index.html](../tabs/02-aso-playbook/index.html) · `<body data-page="playbook">` · content drawn by assets/app.js · [text snapshot](tabs/02-aso-playbook.md)

| Section | Menu label | Heading in the markup | Markup line | Filled by (assets/app.js) | Data read |
| --- | --- | --- | --- | --- | --- |
| [#categories](tabs/02-aso-playbook.md#categories) | Categories | Who fills the top-10 slots | [L46](../tabs/02-aso-playbook/index.html#L46) | `renderCategories()` [L76-87](../assets/app.js#L76) | `data.apps`, `data.compIdx` |
| [#competitors](tabs/02-aso-playbook.md#competitors) | Competitors | The 16 video downloaders you compete with | [L58](../tabs/02-aso-playbook/index.html#L58) | `renderCompetitors()` [L88-103](../assets/app.js#L88) | `data.profiles` |
| [#comp-keywords](tabs/02-aso-playbook.md#comp-keywords) | Keywords by competitor | Keywords by competitor | [L67](../tabs/02-aso-playbook/index.html#L67) | `renderCompDetailSelect()` [L104-109](../assets/app.js#L104)<br>`renderCompDetail()` [L110-138](../assets/app.js#L110) | `data.profiles`, `data.board.US`, `data.claims`, `data.compIdx`, `data.markets` |
| [#events](tabs/02-aso-playbook.md#events) | Events & offers | Events & offers | [L83](../tabs/02-aso-playbook/index.html#L83) | `renderEvents()` [L139-146](../assets/app.js#L139) | `data.profiles`, `offersChecked` |
| [#matrix](tabs/02-aso-playbook.md#matrix) | Rank tracker | Where each competitor ranks, keyword by keyword | [L92](../tabs/02-aso-playbook/index.html#L92) | `renderScoped()` [L534-558](../assets/app.js#L534)<br>`renderMatrix()` [L147-153](../assets/app.js#L147) | `data.apps`, `data.compIdx` |
| [#serps](tabs/02-aso-playbook.md#serps) | Result slots | Every search, slot by slot | [L105](../tabs/02-aso-playbook/index.html#L105) | `renderStrips()` [L154-161](../assets/app.js#L154)<br>`renderScoped()` [L534-558](../assets/app.js#L534) |  |
| [#keywords](tabs/02-aso-playbook.md#keywords) | Keyword board | Keyword opportunity board, relevance first | [L116](../tabs/02-aso-playbook/index.html#L116) | `renderTierChips()` [L162-167](../assets/app.js#L162)<br>`renderBoard()` [L168-181](../assets/app.js#L168) |  |
| [#markets](tabs/02-aso-playbook.md#markets) | 8 markets | How the category differs by market | [L130](../tabs/02-aso-playbook/index.html#L130) | `renderMarkets()` [L182-197](../assets/app.js#L182) | `data.board`, `data.marketSummary`, `data.markets`, `data.profiles`, `data.secondary` |
| [#ladder](tabs/02-aso-playbook.md#ladder) | Ladder | Launch keyword ladder | [L143](../tabs/02-aso-playbook/index.html#L143) | `renderLadder()` [L208-212](../assets/app.js#L208) | `data.apps` |
| [#listing](tabs/02-aso-playbook.md#listing) | Listing | Proposed ASO package | [L152](../tabs/02-aso-playbook/index.html#L152) | `renderListing()` [L257-282](../assets/app.js#L257) | `assets.icon.file`, `data.board.US`, `listing.current.developer`, `listing.current.genre`, `listing.long`, `listing.rec`, `listing.shorts`, `listing.titles` |
| [#practice](tabs/02-aso-playbook.md#practice) | Practice | What works in this category | [L166](../tabs/02-aso-playbook/index.html#L166) | static markup |  |
| [#method](tabs/02-aso-playbook.md#method) | Method | (built by script) | [L188](../tabs/02-aso-playbook/index.html#L188) | `renderHeader()` [L43-69](../assets/app.js#L43) | `data.apps`, `data.board.US`, `data.collectedAt`, `data.marketSummary`, `data.markets`, `data.profiles` |

<a id="03-playstore-metadata"></a>

## PlayStore Metadata

Markup: [tabs/03-playstore-metadata/index.html](../tabs/03-playstore-metadata/index.html) · `<body data-page="metadata">` · content drawn by assets/app.js · [text snapshot](tabs/03-playstore-metadata.md)

| Section | Menu label | Heading in the markup | Markup line | Filled by (assets/app.js) | Data read |
| --- | --- | --- | --- | --- | --- |
| [#metadata](tabs/03-playstore-metadata.md#metadata) |  | Graphics on the listing | [L33](../tabs/03-playstore-metadata/index.html#L33) | `renderMetadata()` [L297-478](../assets/app.js#L297) | `assets.feature.file`, `assets.feature.src`, `assets.icon.file`, `assets.icon.src`, `assets.screenshots`, `data.apps`, `data.board.US`, `data.claims`, `data.compIdx`, `data.profiles.claims`, `features.ourClaims`, `listing.current.ads`, `listing.current.developer`, `listing.current.genre` |
| [#m-overview](tabs/03-playstore-metadata.md#m-overview) | Listing | (built by script) | [L34](../tabs/03-playstore-metadata/index.html#L34) | `renderMetadata()` [L297-478](../assets/app.js#L297) | `assets.feature.file`, `assets.feature.src`, `assets.icon.file`, `assets.icon.src`, `assets.screenshots`, `data.apps`, `data.board.US`, `data.claims`, `data.compIdx`, `data.profiles.claims`, `features.ourClaims`, `listing.current.ads`, `listing.current.developer`, `listing.current.genre` |
| [#m-assets](tabs/03-playstore-metadata.md#m-assets) | Store assets | Graphics on the listing | [L40](../tabs/03-playstore-metadata/index.html#L40) | `renderMetadata()` [L297-478](../assets/app.js#L297) | `assets.feature.file`, `assets.feature.src`, `assets.icon.file`, `assets.icon.src`, `assets.screenshots`, `data.apps`, `data.board.US`, `data.claims`, `data.compIdx`, `data.profiles.claims`, `features.ourClaims`, `listing.current.ads`, `listing.current.developer`, `listing.current.genre` |
| [#m-current](tabs/03-playstore-metadata.md#m-current) | Metadata | Title, short description and full description | [L51](../tabs/03-playstore-metadata/index.html#L51) | `renderMetadata()` [L297-478](../assets/app.js#L297) | `assets.feature.file`, `assets.feature.src`, `assets.icon.file`, `assets.icon.src`, `assets.screenshots`, `data.apps`, `data.board.US`, `data.claims`, `data.compIdx`, `data.profiles.claims`, `features.ourClaims`, `listing.current.ads`, `listing.current.developer`, `listing.current.genre` |
| [#m-targets](tabs/03-playstore-metadata.md#m-targets) | Targeted keywords | Every keyword this metadata targets | [L66](../tabs/03-playstore-metadata/index.html#L66) | `renderMetadata()` [L297-478](../assets/app.js#L297) | `assets.feature.file`, `assets.feature.src`, `assets.icon.file`, `assets.icon.src`, `assets.screenshots`, `data.apps`, `data.board.US`, `data.claims`, `data.compIdx`, `data.profiles.claims`, `features.ourClaims`, `listing.current.ads`, `listing.current.developer`, `listing.current.genre` |
| [#m-platform](tabs/03-playstore-metadata.md#m-platform) | Platform-name keywords | Keywords that name another company’s product | [L76](../tabs/03-playstore-metadata/index.html#L76) | `renderMetadata()` [L297-478](../assets/app.js#L297) | `assets.feature.file`, `assets.feature.src`, `assets.icon.file`, `assets.icon.src`, `assets.screenshots`, `data.apps`, `data.board.US`, `data.claims`, `data.compIdx`, `data.profiles.claims`, `features.ourClaims`, `listing.current.ads`, `listing.current.developer`, `listing.current.genre` |
| [#m-keywords](tabs/03-playstore-metadata.md#m-keywords) | Finalized keywords | Finalized keywords | [L85](../tabs/03-playstore-metadata/index.html#L85) | `renderMetadata()` [L297-478](../assets/app.js#L297) | `assets.feature.file`, `assets.feature.src`, `assets.icon.file`, `assets.icon.src`, `assets.screenshots`, `data.apps`, `data.board.US`, `data.claims`, `data.compIdx`, `data.profiles.claims`, `features.ourClaims`, `listing.current.ads`, `listing.current.developer`, `listing.current.genre` |
| [#m-ladder](tabs/03-playstore-metadata.md#m-ladder) | Ladder | Launch keyword ladder of this metadata | [L97](../tabs/03-playstore-metadata/index.html#L97) | `renderMetadata()` [L297-478](../assets/app.js#L297) | `assets.feature.file`, `assets.feature.src`, `assets.icon.file`, `assets.icon.src`, `assets.screenshots`, `data.apps`, `data.board.US`, `data.claims`, `data.compIdx`, `data.profiles.claims`, `features.ourClaims`, `listing.current.ads`, `listing.current.developer`, `listing.current.genre` |
| [#m-used](tabs/03-playstore-metadata.md#m-used) | Competitor ranks | How your competitors rank on the keywords you use | [L106](../tabs/03-playstore-metadata/index.html#L106) | `renderMetadata()` [L297-478](../assets/app.js#L297) | `assets.feature.file`, `assets.feature.src`, `assets.icon.file`, `assets.icon.src`, `assets.screenshots`, `data.apps`, `data.board.US`, `data.claims`, `data.compIdx`, `data.profiles.claims`, `features.ourClaims`, `listing.current.ads`, `listing.current.developer`, `listing.current.genre` |
| [#m-policy](tabs/03-playstore-metadata.md#m-policy) | Policy record | Metadata policy record | [L115](../tabs/03-playstore-metadata/index.html#L115) | `renderMetadata()` [L297-478](../assets/app.js#L297) | `assets.feature.file`, `assets.feature.src`, `assets.icon.file`, `assets.icon.src`, `assets.screenshots`, `data.apps`, `data.board.US`, `data.claims`, `data.compIdx`, `data.profiles.claims`, `features.ourClaims`, `listing.current.ads`, `listing.current.developer`, `listing.current.genre` |
| [#m-method](tabs/03-playstore-metadata.md#m-method) | Method | How this tab was built | [L121](../tabs/03-playstore-metadata/index.html#L121) | `renderMetadata()` [L297-478](../assets/app.js#L297) | `assets.feature.file`, `assets.feature.src`, `assets.icon.file`, `assets.icon.src`, `assets.screenshots`, `data.apps`, `data.board.US`, `data.claims`, `data.compIdx`, `data.profiles.claims`, `features.ourClaims`, `listing.current.ads`, `listing.current.developer`, `listing.current.genre` |

<a id="04-features-comparison"></a>

## Features Comparison

Markup: [tabs/04-features-comparison/index.html](../tabs/04-features-comparison/index.html) · `<body data-page="features">` · content drawn by assets/app.js · [text snapshot](tabs/04-features-comparison.md)

| Section | Menu label | Heading in the markup | Markup line | Filled by (assets/app.js) | Data read |
| --- | --- | --- | --- | --- | --- |
| [#features](tabs/04-features-comparison.md#features) |  | Features Comparison | [L29](../tabs/04-features-comparison/index.html#L29) | `renderFeatures()` [L480-530](../assets/app.js#L480) | `data.apps`, `data.board.US`, `data.claims`, `data.markets`, `data.profiles.claims`, `features.audit`, `features.edges`, `features.inventory`, `features.oursOnly`, `features.plans.items`, `features.plans.note`, `listing.current.iap` |
| [#f-overview](tabs/04-features-comparison.md#f-overview) | Overview | Features Comparison | [L30](../tabs/04-features-comparison/index.html#L30) | `renderFeatures()` [L480-530](../assets/app.js#L480) | `data.apps`, `data.board.US`, `data.claims`, `data.markets`, `data.profiles.claims`, `features.audit`, `features.edges`, `features.inventory`, `features.oursOnly`, `features.plans.items`, `features.plans.note`, `listing.current.iap` |
| [#f-lead](tabs/04-features-comparison.md#f-lead) | Only in our app | What only this app does | [L37](../tabs/04-features-comparison/index.html#L37) | `renderFeatures()` [L480-530](../assets/app.js#L480) | `data.apps`, `data.board.US`, `data.claims`, `data.markets`, `data.profiles.claims`, `features.audit`, `features.edges`, `features.inventory`, `features.oursOnly`, `features.plans.items`, `features.plans.note`, `listing.current.iap` |
| [#f-audit](tabs/04-features-comparison.md#f-audit) | Audit matrix | Feature audit matrix | [L42](../tabs/04-features-comparison/index.html#L42) | `renderFeatures()` [L480-530](../assets/app.js#L480) | `data.apps`, `data.board.US`, `data.claims`, `data.markets`, `data.profiles.claims`, `features.audit`, `features.edges`, `features.inventory`, `features.oursOnly`, `features.plans.items`, `features.plans.note`, `listing.current.iap` |
| [#f-claims](tabs/04-features-comparison.md#f-claims) | Listing claims | What each listing tells users it can do | [L53](../tabs/04-features-comparison/index.html#L53) | `renderFeatures()` [L480-530](../assets/app.js#L480) | `data.apps`, `data.board.US`, `data.claims`, `data.markets`, `data.profiles.claims`, `features.audit`, `features.edges`, `features.inventory`, `features.oursOnly`, `features.plans.items`, `features.plans.note`, `listing.current.iap` |
| [#f-inventory](tabs/04-features-comparison.md#f-inventory) | What ships | What ships in the app | [L63](../tabs/04-features-comparison/index.html#L63) | `renderFeatures()` [L480-530](../assets/app.js#L480) | `data.apps`, `data.board.US`, `data.claims`, `data.markets`, `data.profiles.claims`, `features.audit`, `features.edges`, `features.inventory`, `features.oursOnly`, `features.plans.items`, `features.plans.note`, `listing.current.iap` |
| [#f-edges](tabs/04-features-comparison.md#f-edges) | Competitor strengths | Where competitors are strong | [L68](../tabs/04-features-comparison/index.html#L68) | `renderFeatures()` [L480-530](../assets/app.js#L480) | `data.apps`, `data.board.US`, `data.claims`, `data.markets`, `data.profiles.claims`, `features.audit`, `features.edges`, `features.inventory`, `features.oursOnly`, `features.plans.items`, `features.plans.note`, `listing.current.iap` |
| [#f-iap](tabs/04-features-comparison.md#f-iap) | IAP comparison | In-app purchase ranges | [L73](../tabs/04-features-comparison/index.html#L73) | `renderFeatures()` [L480-530](../assets/app.js#L480) | `data.apps`, `data.board.US`, `data.claims`, `data.markets`, `data.profiles.claims`, `features.audit`, `features.edges`, `features.inventory`, `features.oursOnly`, `features.plans.items`, `features.plans.note`, `listing.current.iap` |
| [#f-method](tabs/04-features-comparison.md#f-method) | Method | Where this comes from | [L83](../tabs/04-features-comparison/index.html#L83) | `renderFeatures()` [L480-530](../assets/app.js#L480) | `data.apps`, `data.board.US`, `data.claims`, `data.markets`, `data.profiles.claims`, `features.audit`, `features.edges`, `features.inventory`, `features.oursOnly`, `features.plans.items`, `features.plans.note`, `listing.current.iap` |

## All functions in assets/app.js

| Function | Lines | Data read |
| --- | --- | --- |
| `esc` | [L7-16](../assets/app.js#L7) | `data.apps`, `data.board.US`, `data.compIdx`, `data.profiles` |
| `fmt` | [L17-17](../assets/app.js#L17) |  |
| `band` | [L18-20](../assets/app.js#L18) | `data.board.US` |
| `tmPill` | [L21-23](../assets/app.js#L21) | `data.board` |
| `rows` | [L24-24](../assets/app.js#L24) | `data.board` |
| `slotClass` | [L25-25](../assets/app.js#L25) | `data.apps`, `data.compIdx` |
| `compRanks` | [L26-26](../assets/app.js#L26) | `data.compIdx` |
| `compTop10` | [L27-27](../assets/app.js#L27) |  |
| `compNames` | [L28-28](../assets/app.js#L28) |  |
| `entryCell` | [L29-29](../assets/app.js#L29) | `data.apps` |
| `rkCell` | [L30-42](../assets/app.js#L30) | `data.apps`, `data.compIdx` |
| `renderHeader` | [L43-69](../assets/app.js#L43) | `data.apps`, `data.board.US`, `data.collectedAt`, `data.marketSummary`, `data.markets`, `data.profiles` |
| `renderMarketSel` | [L70-75](../assets/app.js#L70) | `data.markets` |
| `renderCategories` | [L76-87](../assets/app.js#L76) | `data.apps`, `data.compIdx` |
| `renderCompetitors` | [L88-103](../assets/app.js#L88) | `data.profiles` |
| `renderCompDetailSelect` | [L104-109](../assets/app.js#L104) | `data.profiles` |
| `renderCompDetail` | [L110-138](../assets/app.js#L110) | `data.board.US`, `data.claims`, `data.compIdx`, `data.markets`, `data.profiles` |
| `renderEvents` | [L139-146](../assets/app.js#L139) | `data.profiles`, `offersChecked` |
| `renderMatrix` | [L147-153](../assets/app.js#L147) | `data.apps`, `data.compIdx` |
| `renderStrips` | [L154-161](../assets/app.js#L154) |  |
| `renderTierChips` | [L162-167](../assets/app.js#L162) |  |
| `renderBoard` | [L168-181](../assets/app.js#L168) |  |
| `renderMarkets` | [L182-197](../assets/app.js#L182) | `data.board`, `data.marketSummary`, `data.markets`, `data.profiles`, `data.secondary` |
| `ladderPhases` | [L198-207](../assets/app.js#L198) |  |
| `renderLadder` | [L208-212](../assets/app.js#L208) | `data.apps` |
| `reEsc` | [L213-213](../assets/app.js#L213) |  |
| `normT` | [L214-214](../assets/app.js#L214) |  |
| `phraseN` | [L215-215](../assets/app.js#L215) |  |
| `wordSet` | [L216-216](../assets/app.js#L216) |  |
| `allIn` | [L217-217](../assets/app.js#L217) |  |
| `nWords` | [L218-218](../assets/app.js#L218) |  |
| `plainLong` | [L219-220](../assets/app.js#L219) |  |
| `coverageOf` | [L221-229](../assets/app.js#L221) |  |
| `covPill` | [L230-230](../assets/app.js#L230) |  |
| `prioCoverage` | [L231-235](../assets/app.js#L231) | `data.board.US`, `listing.current.description`, `listing.current.summary`, `listing.current.title`, `listing.long`, `listing.rec`, `listing.shorts` |
| `highlight` | [L236-241](../assets/app.js#L236) |  |
| `longHtml` | [L242-254](../assets/app.js#L242) | `data.apps` |
| `meter` | [L255-256](../assets/app.js#L255) |  |
| `renderListing` | [L257-282](../assets/app.js#L257) | `assets.icon.file`, `data.board.US`, `listing.current.developer`, `listing.current.genre`, `listing.long`, `listing.rec`, `listing.shorts`, `listing.titles` |
| `compTitlesWith` | [L283-293](../assets/app.js#L283) | `data.board.US`, `data.profiles`, `tiksta.long`, `tiksta.pc`, `tiksta.short`, `tiksta.title` |
| `brandsIn` | [L294-294](../assets/app.js#L294) |  |
| `pDate` | [L295-296](../assets/app.js#L295) |  |
| `renderMetadata` | [L297-478](../assets/app.js#L297) | `assets.feature.file`, `assets.feature.src`, `assets.icon.file`, `assets.icon.src`, `assets.screenshots`, `data.apps`, `data.board.US`, `data.claims`, `data.compIdx`, `data.profiles.claims`, `features.ourClaims`, `listing.current.ads` |
| `fsc` | [L479-479](../assets/app.js#L479) |  |
| `renderFeatures` | [L480-530](../assets/app.js#L480) | `data.apps`, `data.board.US`, `data.claims`, `data.markets`, `data.profiles.claims`, `features.audit`, `features.edges`, `features.inventory`, `features.oursOnly`, `features.plans.items`, `features.plans.note`, `listing.current.iap` |
| `syncBar` | [L531-533](../assets/app.js#L531) |  |
| `renderScoped` | [L534-558](../assets/app.js#L534) |  |
