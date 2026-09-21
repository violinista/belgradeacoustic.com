# belgradeacoustic.com

Statički sajt **Beogradskog Akustičnog Orkestra** (BAO), izgrađen pomoću
[Eleventy (11ty)](https://www.11ty.dev/) i [Tailwind CSS](https://tailwindcss.com/).

Sajt je jedna stranica (single landing page) sa navigacijom koja vodi na sekcije
unutar iste stranice: `#bend`, `#muzika`, `#pitanja`, `#kontakt`.

---

## Requirements

| Tool | Version |
| --- | --- |
| Node.js | 18 or newer (developed on Node 23) |
| npm | 9 or newer |

Check yours:

```bash
node -v
npm -v
```

## Install

Clone the repo, then from the project root:

```bash
npm install
```

## Run locally

```bash
npm start
```

Then open **<http://localhost:8080>**.

This runs two processes in parallel:

1. **Tailwind/PostCSS** in watch mode — compiles `src/static/css/tailwind.css`
   into `_tmp/static/css/style.css`.
2. **Eleventy** with `--serve` — builds the site into `_site/` and serves it with
   live reload.

Edit anything under `src/` and the browser refreshes automatically.

> **First run is slower.** Eleventy generates AVIF/WebP/JPEG variants of every
> image on the first build. They are cached afterwards, so later builds are fast.

### Build for production

```bash
npm run build
```

The finished, deployable site is written to `_site/`. It is entirely static —
host it on any static host (Netlify, Vercel, GitHub Pages, nginx, S3).

To preview the production build locally:

```bash
npx serve _site
```

### Available scripts

| Script | What it does |
| --- | --- |
| `npm start` | Dev server with live reload on <http://localhost:8080> |
| `npm run build` | Production build into `_site/` |
| `npm run css:build` | Compile Tailwind once |
| `npm run css:watch` | Compile Tailwind in watch mode |
| `npm run eleventy:serve` | Run only Eleventy (expects CSS to exist already) |

> If you ever run Eleventy on its own without building the CSS first, the page
> will load unstyled. Run `npm run css:build` once, or just use `npm start`.

---

## Editing the content

**All text lives in YAML files in `src/_data/` — you do not need to touch HTML
to change copy.**

| File | Contents |
| --- | --- |
| `settings.yaml` | Site name, e-mail, phone numbers, social links, footer stats |
| `navigation.yaml` | Menu items and the anchors they point to |
| `home.yaml` | Hero heading, the three value propositions, the testimonial |
| `bend.yaml` | Band intro and the member list (name, photo, biography) |
| `muzika.yaml` | Repertoire text and the four highlighted YouTube videos |
| `pitanja.yaml` | Frequently asked questions |
| `kontakt.yaml` | Contact section text |

### Add or remove a band member

Edit `src/_data/bend.yaml`. Each member is an entry under `members:`:

```yaml
  - name: Ime Prezime
    photo: static/img/ime-prezime.png
    bio: >-
      Biografija...
```

Put the photo in `src/static/img/`. A square image works best (existing ones are
128×128); it is rendered as a circular avatar.

### Change a highlighted video

Edit `src/_data/muzika.yaml` and replace `video_id` with the ID from the YouTube
URL — in `https://www.youtube.com/watch?v=ABC123xyz` the ID is `ABC123xyz`.

---

## Project structure

```
.
├── .eleventy.js          Eleventy config + image shortcodes
├── tailwind.config.js    Tailwind theme (fonts)
├── postcss.config.js
├── package.json
├── impulse-theme/        Original template, kept as reference only (not built)
└── src/
    ├── index.html        The whole landing page, section by section
    ├── _data/            All site copy (YAML)
    ├── _includes/
    │   ├── default.html  Base layout: <head>, fonts, nav, footer
    │   └── partials/     navbar.html, footer.html
    └── static/
        ├── css/tailwind.css
        └── img/          Source images
```

Generated folders — never edit, never commit: `_site/`, `_tmp/`, `.cache/`,
`node_modules/`.

## Images

Images are optimized at build time by the official
[`@11ty/eleventy-img`](https://www.11ty.dev/docs/plugins/image/) plugin. It
generates AVIF, WebP and a JPEG/PNG fallback at several widths and outputs a
`<picture>` element, so each browser downloads the smallest format it supports.

Use the shortcodes in templates rather than writing `<img>` by hand:

```njk
{% raw %}{% image "static/img/photo.jpg", "Opis slike", "100vw", "css-classes" %}
{% imageFixed "static/img/avatar.png", "Ime", "128", "rounded-full" %}{% endraw %}
```

- `image` — responsive photos (heroes, section backgrounds). JPEG fallback.
- `imageFixed` — small fixed-size images (avatars, logo). PNG fallback, keeps
  transparency.

`alt` text is required; the build fails without it.

## Fonts

Three Google Fonts, loaded in `src/_includes/default.html` and mapped to Tailwind
utilities in `tailwind.config.js`:

| Utility | Font | Used for |
| --- | --- | --- |
| `font-display` | Playfair Display | Headings |
| `font-heading` | Fira Sans Condensed | Navigation, buttons, labels |
| `font-sans` | Overpass | Body text |

## Notes

- The site is in Serbian (Latin script). Keep diacritics (č, ć, š, ž, đ) intact —
  files are UTF-8.
- There is **no contact form**. The contact section uses `mailto:` and `tel:`
  links, so no backend or form service is required.
- The FAQ accordion and the mobile menu use native `<details>`/`<summary>`.
  **The site ships zero JavaScript.**
