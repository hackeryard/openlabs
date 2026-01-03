# OpenLabs 🔬⚡

[![Status](https://img.shields.io/badge/status-active-brightgreen)](https://github.com/rahulra3621/openlabs)
[![Repo](https://img.shields.io/badge/repo-GitHub-181717?style=flat&logo=github)](https://github.com/rahulra3621/openlabs)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/next-%3E%3D14-000000?style=flat&logo=next.js)](https://nextjs.org/)

A modern, interactive collection of in-browser science labs and visualizations for **Chemistry** and **Physics** built with **Next.js**, **React**, and **Tailwind CSS**. OpenLabs is designed for students, educators, and curious learners who want hands-on experiments without the need for physical lab equipment.

---

## Table of Contents

- 🎯 [Quick Start](#quick-start)
- ✨ [Highlights & Features](#highlights--features)
- 🛠️ [Tech Stack](#tech-stack)
- ⚙️ [Scripts & Local Development](#scripts--local-development)
- 🗂️ [Project Structure](#project-structure)
- 🧭 [Routes & How to Explore](#routes--how-to-explore)
- 🧩 [How to Add a New Lab](#how-to-add-a-new-lab)
- 🔐 [Authentication (Demo)](#authentication-demo)
- 🤝 [Contributing](#contributing)
- 🚀 [Deployment](#deployment)
- 🖼️ [Screenshots & Media](#screenshots--media)
- 📄 [License](#license)
- 📬 [Contact & Maintainers](#contact--maintainers)

---

## Quick Start 🚀

Prerequisites:

- Node.js 18+ (recommended)
- yarn (v1) or npm

Clone and run locally:

```bash
# clone
git clone https://github.com/rahulra3621/openlabs.git
cd OpenLabs

# install (yarn preferred for this repo)
yarn install

# dev server
yarn dev
# opens: http://localhost:3000
```

If you prefer npm:

```bash
npm install
npm run dev
```

Build for production:

```bash
yarn build && yarn start
# or with npm
npm run build && npm run start
```

---

## Highlights & Features ✨

- Interactive Periodic Table with element pages and visual assets
- Electronic configuration visualizer and per-atom pages
- Chemistry visualizations: chemical bond types, 3D atomic models (Three.js)
- Chemical Reactions simulation: interactive visual reaction builder and dynamics
- Physics simulations: Free Fall, Projectile Motion, Hooke's Law, Ohm's Law, and more
- Reusable component library for building experiments quickly
- Demo signup/login flows (client-side stubbed) for testing interactions
- Responsive UI using Tailwind CSS; accessible-first layout practices

---

## Tech Stack 🔧

- Next.js 14 (App Router)
- React 18
- TypeScript
- Tailwind CSS
- three.js + @react-three/fiber for 3D models
- p5.js for visual simulations

---

## Scripts & Local Development ⚙️

Key npm/yarn scripts (see `package.json`):

- `dev` — starts the Next.js dev server (hot reload)
- `build` — production build
- `start` — start the built app
- `lint` — run Next.js linting
- `preview` — start preview server

Example:

```bash
# dev
yarn dev
# build
yarn build
# run production
yarn start
```

Tips:

- Use TypeScript for new components and keep files under `app/components/`.
- Follow Tailwind utility-first conventions for styling.

---

## Project Structure 🗂️

A quick overview of the important folders:

- `app/` — Next.js App Router routes & pages
  - `app/chemistry/` — periodic table, element pages, electronic-configuration, reaction-simulation
  - `app/chemistry/reaction-simulation/` — chemical reactions simulator route (client component)
  - `app/physics/` — physics experiment pages
  - `app/components/` — shared components and experiment-specific UI
  - `app/signup/` & `app/login/` — demo authentication pages
- `app/components/` — reusable UI / labs (TSX/JSX)
- `app/components/chemistry/reactions/` — reaction simulation components and data (`reactionData.js`, `reactionDetails.js`, `ReactionSimulation.jsx`)
- `app/src/data/elements.js` — element metadata used across chemistry features
- `public/images/elements/` — element images and media

> Note: Dynamic routes such as `app/chemistry/electronic-configuration/[atomicNumber]/page.tsx` map directly to URL paths like `/chemistry/electronic-configuration/8`.

---

## Routes & How to Explore 🧭

A few key routes to try locally:

- `/` — home / landing page
- `/chemistry/periodictable` — interactive periodic table
- `/chemistry/chemicalbonds` — bond visualizations
- `/chemistry/electronic-configuration/[atomicNumber]` — per-atom electronic configuration
- `/chemistry/reaction-simulation` — chemical reactions simulator (interactive)
- `/physics/freefall` — free fall experiment
- `/physics/projectilemotion` — projectile motion lab
- `/login` — demo login page (client-side stubbed)
- `/signup` — demo signup page (client-side stubbed)

Open the `app/components/` folder to find corresponding pages and UI components to extend.

---

## Authentication (Demo) 🔐

The project contains simple, client-side demo authentication for testing UI flows. These pages are not connected to a real backend — they simulate signups and logins.

- Demo credentials for quick testing: **`demo@site.com` / `password`** (use on `/login`)
- Files: `app/login/page.tsx`, `app/signup/page.tsx` — behavior is stubbed in the client for demo purposes.

---

## How to Add a New Lab 🧩

1. Create a route under `app/` (e.g., `app/physics/newlab/page.tsx`).
2. Add the interactive UI as a component in `app/components/physics/`.
3. Add any static assets to `public/` and data to `app/src/data/` if needed.
4. Export small, testable components and document props via JSDoc or TypeScript interfaces.
5. Add an entry to the navigation (`app/layout.tsx` or `app/components/Navbar.tsx`) so users can find it.

---

## Contributing 🤝

We welcome improvements, bug fixes, and new labs!

1. Fork the repository
2. Create a branch: `git checkout -b feat/your-feature`
3. Make changes, commit, and push
4. Submit a Pull Request with a clear description and screenshots/videos

Guidelines:

- Keep changes focused and small
- Add or update tests where relevant (future improvement)
- Follow consistent formatting and lint rules

---

## Deployment 🚀

The app deploys easily to Vercel (recommended):

1. Push your repository to GitHub
2. Import the project on Vercel and set the build command to `yarn build` and the output directory to `.`
3. Add any environment variables in the Vercel dashboard if needed

Other hosts (Netlify, Fly) should also work with a compatible Node 18+ environment.

---

## Screenshots & Media 🖼️

Add screenshots under `public/images/` and reference them here to make the README visually rich.

Example:

```markdown
![Periodic Table](/images/elements/placeholder.jpg)
```

---

## Roadmap & Ideas 💡

- Unit & integration tests (Jest / React Testing Library)
- Accessibility audit and improvements (a11y)
- More advanced labs (optics, thermodynamics, circuits)
- Internationalization (i18n)

---

## License

This project is released under the **MIT License** — see the `LICENSE` file for details.

---

## Maintainers & Contact 📬

- Maintainer: [@rahulra3621](https://github.com/rahulra3621)

If you need help or want to contribute, open an issue or submit a PR — we welcome collaborators!

---

Thank you for checking out **OpenLabs** — built for curious minds! 🎉
