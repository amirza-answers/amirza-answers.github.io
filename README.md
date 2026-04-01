# امیرزا — فیلتر کلمات (Amirza word filter)

Static web app (RTL Persian) that filters a Persian dictionary by **allowed letters** and **word length**. It targets games such as امیرزا (استاد میرزا، رقابت آنلاین، بازی روزانه) and similar word games. The UI is a small PWA with offline-friendly caching via a service worker.

**Live site:** [https://amirza-answers.github.io](https://amirza-answers.github.io) (GitHub Pages on the `main` branch of this repo.)

## Features

- Enter allowed حروف (letters), set min/max length, then list matching words from the bundled `words` file.
- Normalizes common Arabic/Persian letter variants (e.g. ی/ي, ک/ك, ا variants, diacritics).
- PWA: `site.webmanifest`, install prompt where supported, and `sw.js` precache for core assets.
- Styles built with [Tailwind CSS](https://tailwindcss.com/) v3.

## Requirements

- **Node.js** 18+ recommended (for npm and the Tailwind CLI).

## Setup

```bash
npm install
```

## Build

CSS is compiled from `src/styles/main.css` into `dist/assets/css/styles.css` (committed output is used by `index.html`):

```bash
npm run build
```

This runs the same as `npm run build:css`. Run a build after changing Tailwind sources or `tailwind.config.js` so the deployed CSS stays in sync.

### npm / Browserslist

If you see a **Browserslist / caniuse-lite** notice during build, refresh the browser support database (safe to run anytime):

```bash
npx update-browserslist-db@latest
```

### Deprecated `glob` warning

Older lockfiles could pull `glob@10.x` through transitive dependencies. Regenerating the lockfile with a current `tailwindcss` 3.4.x install resolves this: current releases use updated tooling (e.g. `sucrase` without the deprecated `glob` chain). If a warning persists, run `rm -rf node_modules package-lock.json && npm install` and commit the new `package-lock.json`.

## Project layout

| Path | Role |
|------|------|
| `index.html` | App shell, inline script, UI |
| `words` | Newline-separated Persian word list |
| `src/styles/main.css` | Tailwind entry (`@tailwind` directives) |
| `dist/assets/css/styles.css` | Generated, minified CSS |
| `sw.js` | Service worker (precache + fetch strategy) |
| `site.webmanifest` | PWA manifest |
| `icons/` | Favicons and PWA icons |

## Deployment (GitHub Pages)

This repo is set up as a **user/organization Pages site** (`*.github.io`). Push `main` with `index.html` at the repository root. Run `npm run build` before pushing when CSS changes, and commit updated `dist/assets/css/styles.css` if you want Pages to serve the new styles without a CI build step.

## License

See repository metadata or add a `LICENSE` file if you want an explicit license.
