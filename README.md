# Md Abu Farhad | Portfolio

A futuristic, animated portfolio built with **React 19 + TypeScript + Vite + Tailwind CSS v4 + Motion + Three.js**.

## Run locally

```bash
npm install
npm run dev        # http://localhost:5173
```

## Production

```bash
npm run build      # type-check + bundle into dist/
npm run preview    # serve the built site locally
npm run lint
```

## Updating your content

Everything personal lives in **`src/data/profile.ts`**: name, links, email, experience, projects, skills, principles,
research and achievements. You don't need to edit any component.

| What | Where |
| --- | --- |
| Resume download | Replace `public/Md-Abu-Farhad-Resume.pdf` (or change `profile.resume`) |
| Live URL for SEO | `profile.siteUrl` **and** the site URLs in `index.html` (canonical, og:url, og:image, JSON-LD) |
| Social preview image | `public/og-image.png` (1200×630) |
| Favicon | `public/favicon.svg` |

> Live at https://abufarhad.github.io/my-portfolio/

## Deploy

Every push to `main` builds the site with GitHub Actions (`.github/workflows/deploy.yml`) and publishes `dist/` to the `gh-pages` branch, which GitHub Pages serves at https://abufarhad.github.io/my-portfolio/.

The production build uses `base: '/my-portfolio/'` (see `vite.config.ts`). If you move to a custom domain or a different repo name, change that value and the URLs in `index.html`.

## Architecture notes

- `src/components/background/universe.ts`: a raw Three.js scene with a GPU-displaced wireframe terrain, a cursor-reactive
  particle network, wireframe solids and star dust. It's lazy-loaded on browser idle, pauses when the tab is hidden, and
  caps DPR.
- `Background.tsx` layers a CSS aurora gradient underneath. This is the full fallback when the user prefers reduced motion,
  has Save-Data on, or the device has no WebGL. Phones and low-core devices get a lighter "low" quality scene.
- All animations respect `prefers-reduced-motion`. The custom cursor appears only on fine-pointer devices.
