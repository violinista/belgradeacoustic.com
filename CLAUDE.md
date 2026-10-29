# CLAUDE.md

Guidance for Claude Code when working in this repository.

## What this is

A static marketing site for **Beogradski Akustični Orkestar** (BAO), a Belgrade
band that plays weddings and private celebrations. Built with **Eleventy 3** and
**Tailwind CSS 3**.

It is a migration of the old WordPress site at `belgradeacoustic.com` (Avada
theme). The original five pages were collapsed into **one landing page** whose
navigation uses in-page anchors: `#bend`, `#muzika`, `#pitanja`, `#kontakt`.

The site is purely informational: there is no backend, no CMS and no contact
form. The **only JavaScript** is the cookie banner that loads Google Analytics
(see *Analytics* below).

## Commands

```bash
npm install       # once
npm start         # dev server at http://localhost:8080 (Tailwind + Eleventy in parallel)
npm run build     # production build into _site/
```

`npm start` and `npm run build` both compile the CSS. Running `eleventy` alone
produces an unstyled page, because Tailwind writes to `_tmp/static/css/style.css`
which Eleventy only copies through.

## Architecture

- `src/index.html` is the entire page. Sections in order: `#pocetna` (hero),
  `#zasto`, `#bend`, testimonial, `#muzika`, `#pitanja`, `#kontakt`.
- `src/_includes/default.html` is the only layout. `partials/navbar.html`,
  `partials/footer.html` and `partials/analytics.html` (production only) are
  its pieces.
- **All copy lives in `src/_data/*.yaml`**, one file per section. Change text
  there, not in the markup.
- Every section needs `scroll-mt-24` so its heading clears the sticky navbar.

## Conventions

- **Content is Serbian (Latin script).** Preserve diacritics (č, ć, š, ž, đ)
  exactly; files are UTF-8. Do not translate content into English.
- **Never hand-write `<img>`.** Use the shortcodes in `.eleventy.js`:
  - `{% raw %}{% image src, alt, sizes, classes, loading %}{% endraw %}` — photos and heroes;
    AVIF/WebP/**JPEG** fallback.
  - `{% raw %}{% imageFixed src, alt, widths, classes, loading %}{% endraw %}` — avatars and the
    logo; AVIF/WebP/**PNG** fallback, preserving transparency.

  The JPEG-vs-PNG split matters: the hero sources are PNGs, and a PNG fallback
  made the build 7.3 MB instead of 1.6 MB. Keep photos on the `image` shortcode.
- Do not pass widths larger than a source image — `eleventy-img` will not upscale
  and the extra entries are silently dropped. The hero source is 1200×800; the
  section backgrounds are ~1362×508; avatars are 128×128.
- `alt` is mandatory on `image`; the build throws without it.
- **No JavaScript** beyond `partials/analytics.html`. The mobile menu and the
  FAQ accordion are native `<details>`/`<summary>`. If something seems to need
  JS, prefer a CSS solution. Alpine.js was deliberately removed from the
  original template.

## Content rules

- The band has **7 members** listed in `src/_data/bend.yaml`. A former member,
  **Nevena Zlatić, was intentionally removed** during the migration, along with
  her photo. Do not reintroduce her name, biography or image file
  (`IMG_5556-Copy.png`) — if band data is ever re-synced from the old WordPress
  site, drop that entry again.
- The old site embedded 69 YouTube videos across four tabs. By decision, only
  **four highlights** are embedded (one per category: Narodne pesme, Zabavne
  pesme, Instrumentalna muzika, BAO sa gostima), plus a link to the YouTube
  channel. Do not restore the full set.
- The old Contact Form 7 form was **replaced by `mailto:`/`tel:` links** on
  purpose, since a static site has no backend. Do not add a form.

## Analytics

Google Analytics 4, ID in `settings.yaml` (`google_analytics_id`), behind a
cookie banner whose copy lives in `src/_data/kolacici.yaml`.

- **Consent first, by decision.** gtag.js is injected only after the visitor
  clicks *Prihvatam*; until then nothing is requested from Google. Do not move
  the snippet into `<head>` or add a `preconnect` to googletagmanager.com —
  both would contact Google before consent.
- The choice is stored in `localStorage` (`bao-analytics`). The footer
  *Kolačići* link reopens the banner; declining after accepting deletes the
  `_ga*` cookies and reloads the page.
- Clicks on `mailto:`/`tel:` links are sent as a `contact` event (`method`,
  `link_url`).
- **Production only**: rendered when `NODE_ENV=production` (`npm run build`),
  never by `npm start`. Preview with `npm run build && npx serve _site`.

## `impulse-theme/`

The original third-party template (Novolio "Impulse"). It is **reference
material only** — it is not built, not deployed and not part of the site. Its
fonts and visual language were carried over; its blog, categories and Netlify
CMS were not. Leave it untouched.

## Gotchas

- `@11ty/eleventy-img` v7 exports the callable as `.default`, not as the module
  itself: `const { default: eleventyImage, generateHTML } = require(...)`.
- Tailwind is pinned to **v3**. v4 abandons the `tailwind.config.js` format the
  font setup relies on.
- Generated directories are `_site/`, `_tmp/` and `.cache/`. Never edit or
  commit them.
- An element shown/hidden via the `hidden` attribute must not carry a Tailwind
  display utility (`flex`, `block`, …): the utility overrides `[hidden]` and
  the element stays visible. Put the layout classes on an inner wrapper.
