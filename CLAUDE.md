# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — start the Vite dev server (default port 5173; Vite auto-increments if occupied).
- `npm run build` — production build to `dist/`.
- `npm run preview` — serve the production build locally.

There is no lint, typecheck, or test setup in this project — it's a plain JS (not TypeScript) Vite + React app with no test runner configured.

## Architecture

This is a single-page personal website: React Router SPA (`src/App.jsx`) where every route — including `Home` — is wrapped in `SubpageLayout` (adds the shared `Header`). Routes and nav labels are driven by `src/data.js` (`SECTIONS`) — add a route in both `App.jsx` and `SECTIONS` to introduce a new top-level page. `ScrollToTop.jsx` is mounted once at the top of `App.jsx` (inside `BrowserRouter`, outside `Routes`) — React Router doesn't reset scroll position on navigation by default, so without it, navigating to a new page while scrolled down keeps the old scroll offset.

Styling is a single global stylesheet, `src/index.css` — no CSS modules, no Tailwind, no styled-components. Classes are plain BEM-ish names (`.blog-card`, `.htimeline-track`, etc.). Theme colors are CSS variables in `:root`: saffron (`--accent-text`/`--accent-fill` + their `-hover` variants, used for work experience and primary CTAs) and indigo (`--accent-blue`/`--accent-blue-hover`, `#1f3a8a`, constant across themes, used for education and secondary contrast touches like the footer border). When adding UI, add classes here rather than introducing a new styling approach.

The site supports light/dark mode, defaulting to the OS preference (`prefers-color-scheme`) until the user overrides it via the switch in `Header.jsx`/`ThemeToggle.jsx`. All theme-dependent colors (backgrounds, text, borders — everything except `--accent-blue` and the two literal near-black `#141414` "text/icon on an accent-fill" spots, which are intentionally constant across themes) are CSS variables defined twice in `index.css`: base values in `:root` (dark, the default) and overrides in `:root[data-theme='light']`.

Saffron specifically is split into two roles, each with its own light/dark values, because one hex can't satisfy both contrast requirements at once:
- `--accent-text`/`--accent-text-hover` — saffron used as *text* on the page background (links, CTAs). Light mode darkens this (`#a85f1e`) since the vivid dark-mode value (`#e28d3a`) fails text contrast on a near-white background.
- `--accent-fill`/`--accent-fill-hover` — saffron used as a *solid fill* with literal `#141414` text/icons on top (buttons, filled dots/markers, the theme toggle thumb). Light mode brightens this (`#d9a429`) since the darkened text-safe tone is too muddy for `#141414` to read clearly on top of it.
- In dark mode both roles collapse to the same value — the page background and the on-fill text color are the same two colors either way round, so there's no tension there.
- `--accent-fill-rgb` mirrors `--accent-fill` as raw `R G B` channels for `rgb(var(--accent-fill-rgb) / alpha)` box-shadow usage, since CSS can't extract channels from a hex custom property.

When adding new saffron-colored UI, pick `--accent-text` for anything read as text and `--accent-fill` for anything with dark text/icons drawn on top of it — using the wrong one is exactly the kind of low-contrast bug this split exists to avoid.

- The actual `data-theme` attribute lives on `<html>`, set by an inline blocking script in `index.html`'s `<head>` (reads `localStorage.theme`, falling back to `matchMedia('(prefers-color-scheme: light)')`) so the correct theme applies before first paint — removing that script reintroduces a flash-of-wrong-theme on load.
- `ThemeToggle.jsx` mirrors that same resolution logic on mount, then keeps following the live OS preference via a `matchMedia` change listener *only until* the user clicks the toggle — an explicit click writes `localStorage.theme` and pins the choice, per the requirement that it defaults to the device setting but a manual override should stick.
- When adding new UI, use the existing semantic variables (`--bg`, `--surface`, `--surface-strong`, `--border`, `--border-strong`, `--text-heading`, `--text-body`, `--text-secondary`, `--text-muted`, `--text-faint`) rather than literal hex grays — a hardcoded gray will look wrong (or invisible) in one of the two themes.

Content areas are driven by static JS data modules or markdown rather than a CMS:
- `src/professionalData.js` — experience/education timeline + side projects + publications, consumed by `ProfessionalLife.jsx` + `HorizontalTimeline.jsx`.
- `src/content/deepdives/*.md` — long-form write-ups for individual roles/projects (see "Deep dives" below).
- `src/assets/photos/` — local images consumed by `PhotoGallery.jsx` (via PhotoSwipe).

The favicon (`public/favicon.svg`) is an "S / G" monogram — transparent background, characters filled with the site's white (`#f2f2f2`, matching `.site-title`), thin diagonal divider between the two letters. `public/apple-touch-icon.png` is a separately-rendered PNG of the same mark with a solid `#141414` backing (iOS renders transparent home-screen icons poorly, so it needs an opaque version). If the mark ever changes, regenerate the PNG from the SVG rather than hand-editing it.

### Home page

`Home.jsx`'s hero (photo + name/intro) has no container border — that was deliberately removed; don't re-add a box around it. The profile photo (`public/profile.jpg`) keeps its original white studio background inside a plain rounded `.avatar` box (`object-fit: cover`) — a transparent background-removed cutout was tried and explicitly reverted as poor quality, so don't redo that unless asked again. `SectionNav.jsx` renders `SECTIONS` (from `data.js`) as a 3-column card grid (`.section-grid`/`.section-card`, collapsing to 1 column under 720px) — a separate component/class pair from the `ProjectCard`/`.project-card` grid used for side projects.

### Professional Life timeline

`HorizontalTimeline.jsx` merges `EDUCATION` and `EXPERIENCES` (both from `professionalData.js`) onto one draggable horizontal axis, in two lanes: education renders above the ruler as a duration bar (start marker → end-date tick, since a degree spans a range), work renders below as a single point-in-time marker (positioned at `year`). Colors follow the legend: blue (`--accent-blue`) for education, orange (`--accent-fill`) for work.

- The view opens centered on a synthetic "Today" position (computed from the real client date, not a hardcoded value) with nothing selected (`activeId === null`) — it is *not* tied to any timeline entry. Dragging/clicking snaps to the nearest real entry as usual.
- `EDUCATION` entries need numeric `startYear`/`endYear` (fractional years are fine, e.g. `2027 + 4 / 12` for "May 2027") in addition to the display-only `dates` string.
- An `EXPERIENCES` entry gets a "Deep dive →" button in the detail panel by adding a `deepDive: '<slug>'` field, where `<slug>` matches a file in `src/content/deepdives/`. Only add this when real long-form content exists for that role — don't add it speculatively.
- The detail panel has a fixed-height bullets container (`.htimeline-detail-body`) *and* a fixed-height CTA row (`.htimeline-deepdive-row`) that's always rendered (empty when there's no deep dive) — both exist specifically so the panel's total height never changes as you step between entries. If you touch this panel, preserve that invariant; it used to visibly jitter the whole page.

Two gotchas already fixed once — don't reintroduce them:
- `dragState` (a ref) must default to `{}`, not an object with `startX: 0`. `onPointerMove`'s guard is `if (state.startX === undefined) return`; seeding `startX: 0` instead of leaving it `undefined` means a plain mouse *hover* (no click) gets misread as an in-progress drag from `clientX = 0`, snapping the view to the leftmost entry.
- The wheel handler only lets *horizontal*-dominant scroll (`|deltaX| > |deltaY|`) scrub the timeline. Plain vertical scroll is explicitly forwarded to `window.scrollBy` — Chromium/WebKit natively redirect vertical wheel input into horizontal scroll on any element that's `overflow-x: auto` + `overflow-y: hidden` (which this viewport is), so without the override, scrolling the page normally while the cursor passes over the timeline would hijack it.

### Deep dives

Long-form write-ups for specific roles/projects live at `src/content/deepdives/*.md` (flat `title`/`company` frontmatter, same hand-rolled parser style as blog posts) and render at `/professional-life/deepdive/:slug` via `DeepDive.jsx`, reusing the blog's `react-markdown` + `remark-gfm` + `rehype-raw` pipeline and `.blog-post-body` styling. Loaded by `src/lib/deepdives.js` (mirrors `src/lib/posts.js`).

- Images referenced from deep-dive markdown are self-hosted under `public/deepdive/<slug>/*.png`, not hotlinked to any external CDN.
- Figma prototypes embed via a raw `<iframe src="https://www.figma.com/embed?...">` in the markdown (works because `rehype-raw` is on). The embed URL must be the *exact* original share link including its `t=` token — a hand-simplified/reconstructed URL loads a blank iframe.
- `SIDE_PROJECTS` and `PUBLICATIONS` (both in `professionalData.js`) power the "Side Projects" and "Publications" sections below the timeline on `ProfessionalLife.jsx`, rendered via `ProjectCard.jsx`. A project's `deepDive` field routes its card to an internal deep-dive page; a plain `href` opens externally in a new tab instead — a project should have exactly one of the two.

### Blog ("Thoughts & More")

Blog posts are markdown files with frontmatter in `src/content/posts/*.md`. `src/lib/posts.js` loads them all at build time via `import.meta.glob(..., { query: '?raw', import: 'default', eager: true })`, hand-parses the `---` frontmatter block (no `gray-matter` dependency — keep it that way, the format is just flat `key: value` pairs), and derives:
- `slug` from the filename
- `excerpt` automatically from the post's first real paragraph (skips headings, raw HTML blocks, and table rows) — there is no separate excerpt/summary field in frontmatter by design, so don't add one; editing a post's opening line updates its card excerpt for free.

`ThoughtsAndMore.jsx` renders the `POSTS` list (sorted newest-first) as a 2-column card grid (`BlogCard.jsx`); `BlogPost.jsx` renders a single post at `/thoughts-and-more/:slug` via `react-markdown` with `remark-gfm` (tables, strikethrough) and `rehype-raw` (allows raw HTML inside `.md` files — used for things like embedded Spotify `<iframe>` playlists). Since `rehype-raw` is enabled, markdown content in this repo is trusted, not sanitized — only add `.md` files from trusted sources.

To add a new post: drop a `.md` file into `src/content/posts/` with `title` and `date` (`YYYY-MM-DD`) frontmatter; no other wiring is needed.
