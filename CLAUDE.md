# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — start the Vite dev server (default port 5173; Vite auto-increments if occupied).
- `npm run build` — production build to `dist/`.
- `npm run preview` — serve the production build locally.

There is no lint, typecheck, or test setup in this project — it's a plain JS (not TypeScript) Vite + React app with no test runner configured.

## Architecture

This is a single-page personal website: React Router SPA (`src/App.jsx`) with a `Home` route and a set of subpages wrapped in `SubpageLayout` (adds the shared `Header`). Routes and nav labels are driven by `src/data.js` (`SECTIONS`) — add a route in both `App.jsx` and `SECTIONS` to introduce a new top-level page.

Styling is a single global stylesheet, `src/index.css` — no CSS modules, no Tailwind, no styled-components. Classes are plain BEM-ish names (`.blog-card`, `.htimeline-track`, etc.) and the dark theme's two colors (`--accent`, `--accent-hover`) are CSS variables in `:root`. When adding UI, add classes here rather than introducing a new styling approach.

Two content areas are driven by static JS data modules rather than a CMS:
- `src/professionalData.js` — experience/education timeline consumed by `ProfessionalLife.jsx` + `HorizontalTimeline.jsx`.
- `src/assets/photos/` — local images consumed by `PhotoGallery.jsx` (via PhotoSwipe).

### Blog ("Thoughts & More")

Blog posts are markdown files with frontmatter in `src/content/posts/*.md`. `src/lib/posts.js` loads them all at build time via `import.meta.glob(..., { query: '?raw', import: 'default', eager: true })`, hand-parses the `---` frontmatter block (no `gray-matter` dependency — keep it that way, the format is just flat `key: value` pairs), and derives:
- `slug` from the filename
- `excerpt` automatically from the post's first real paragraph (skips headings, raw HTML blocks, and table rows) — there is no separate excerpt/summary field in frontmatter by design, so don't add one; editing a post's opening line updates its card excerpt for free.

`ThoughtsAndMore.jsx` renders the `POSTS` list (sorted newest-first) as a 2-column card grid (`BlogCard.jsx`); `BlogPost.jsx` renders a single post at `/thoughts-and-more/:slug` via `react-markdown` with `remark-gfm` (tables, strikethrough) and `rehype-raw` (allows raw HTML inside `.md` files — used for things like embedded Spotify `<iframe>` playlists). Since `rehype-raw` is enabled, markdown content in this repo is trusted, not sanitized — only add `.md` files from trusted sources.

To add a new post: drop a `.md` file into `src/content/posts/` with `title` and `date` (`YYYY-MM-DD`) frontmatter; no other wiring is needed.
