# AGENTS.md

## Architecture
Static single-page wedding invitation, no build step. Netlify publishes `public/` (see `netlify.toml`).

- `public/index.html` — all content and markup, plus an inline SVG sprite (`#i-heart`, `#i-star`, crowns, sun, flower) at the bottom used via `<use href>`.
- `public/styles.css` — all styles and keyframes. Mobile-first, the page is a 480px "card" centered on a dark backdrop on desktop.
- `public/main.js` — intro envelope, colorful hero letters, generated bunting flags, September calendar, IntersectionObserver reveals, scroll-drawn timeline with travelling heart, countdown, RSVP AJAX submit, tap hearts.
- `public/img/` — AI-generated illustrations (Gemini via Netlify AI Gateway). `groom.png`/`bride.png` are placeholders for the couple's real photos.

## Conventions / non-obvious decisions
- Scroll animations: add `class="reveal" data-anim="up|left|right|zoom|draw|drop|swing-left|swing-right|pop"` and optional `style="--delay:.2s"`. JS adds `.is-in` once visible.
- Hero animations wait for `body.is-ready`, which is set after the envelope is opened.
- Illustrations have a cream background and use `mix-blend-mode: multiply` to melt into the page; keep backgrounds near `#fcf5e3`.
- Images are always referenced through Netlify Image CDN (`/.netlify/images?url=/img/...&w=...&fm=webp`), with `fit=cover` crops for the wide 16:9 sources.
- RSVP uses Netlify Forms (form name `rsvp`, fields: name, attendance, drinks, message). The checkbox group `drinks` is joined into one comma-separated value in JS before POSTing to `/`. The form must stay in static HTML for build-time detection.
- Wedding date lives in the `WEDDING` constant in `main.js` (with +03:00 offset); the calendar is hardcoded to September 2027.
- Copy is in Russian.
