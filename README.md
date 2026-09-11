# AlayaVista — Project Page

Static project page for **AlayaVista: Streaming World Modeling from Panoramic States to Perspective Video**, a camera-controllable autoregressive world model. Served via GitHub Pages.

[Project Page](https://alaya-lab.github.io/AlayaVista/) · [Paper](public/assets/AlayaVista.pdf) · [Code](https://github.com/AlayaLab/AlayaVista)

## Local preview

Requires Node.js >= 22.13 and pnpm.

```sh
pnpm install
pnpm dev
```

Open the local URL printed by the development server.

## GitHub Pages

```sh
pnpm build:pages
```

The static site is generated in `dist/pages/`. Updates to `main` are built and deployed automatically by [GitHub Actions](.github/workflows/pages.yml).
