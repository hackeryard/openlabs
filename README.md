# OpenLabs 🔬⚡

[![Status](https://img.shields.io/badge/status-active-brightgreen)](https://github.com/rahulra3621/openlabs)
[![Repo](https://img.shields.io/badge/repo-GitHub-181717?style=flat&logo=github)](https://github.com/rahulra3621/openlabs)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/next-%3E%3D14-000000?style=flat&logo=next.js)](https://nextjs.org/)

A modern, interactive collection of in-browser science labs and visualizations for **Chemistry**, **Physics**, and **Computer Science** built with **Next.js**, **React**, and **Tailwind CSS**. OpenLabs is designed for students, educators, and curious learners who want hands-on experiments without the need for physical lab equipment.

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
- **Biology Labs:**
  - Interactive 3D animal cell visualization with organelle details
  - Human anatomy visualization with anatomical information
- Chemistry visualizations: chemical bond types, 3D atomic models (Three.js)
- Chemical Reactions simulation: interactive visual reaction builder with 3D dynamics and post-processing effects
- Physics simulations: Free Fall, Projectile Motion, Hooke's Law, Ohm's Law, Energy Conservation, RC Circuits, Simple Pendulum, Speed of Light, Wave Optics, and more
- **Computer Science Labs:**
  - HTML/CSS/JS Code Editor with live preview and console
  - Project management with save/load functionality
  - User-specific project storage with type-based filtering
- Reusable component library for building experiments quickly
- **Full Authentication System:**
  - ✓ User signup with email verification via OTP
  - ✓ Login with JWT token-based authentication
  - ✓ Email verification before account activation
  - ✓ Forgot password with OTP reset flow
  - ✓ Password reset functionality
  - ✓ Automatic login after email verification
  - ✓ Persistent authentication with httpOnly cookies
  - ✓ Real-time navbar login/logout state updates
- Responsive UI using Tailwind CSS; accessible-first layout practices
- Cloud database (MongoDB Atlas) for secure data storage

---

## Tech Stack 🔧

- Next.js 14.2.35 (App Router)
- React 18.2.0
- TypeScript
- Tailwind CSS
- three.js 0.182.0 + @react-three/fiber 8.17.0 + @react-three/drei 9.108.0 for 3D models and visualizations
- @react-three/postprocessing 2.19.1 for post-processing effects
- postprocessing 6.30.1 for advanced rendering
- p5.js 2.1.1 for visual simulations
- **Authentication & Database:**
  - MongoDB Atlas (Cloud Database)
  - Mongoose 9.1.4 (ODM)
  - JWT (jsonwebtoken 9.0.3) for authentication
  - bcryptjs 3.0.3 for password hashing
  - Nodemailer 7.0.12 for email delivery
- @monaco-editor/react 4.7.0 for code editing in computer science labs
- Lucide React 0.562.0 for icons
- Framer Motion 12.29.0 for animations
- Axios 1.13.2 for HTTP requests

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
  - `app/computer-science/` — computer science lab pages
  - `app/computer-science/code-lab/html-css-js/` — HTML/CSS/JS code editor lab
  - `app/components/` — shared components and experiment-specific UI
  - **Authentication Pages:**
    - `app/signup/page.tsx` — user registration
    - `app/login/page.tsx` — user login
    - `app/verify-email/page.tsx` — email OTP verification
    - `app/forgotpassword/page.tsx` — password reset request
    - `app/reset-password/page.tsx` — password reset form
  - **API Routes:**
    - `app/api/auth/` — authentication endpoints (signup, login, logout, verify-otp, etc.)
    - `app/api/projects/` — project management endpoints (create, read, update, delete projects)
  - **Models:**
    - `app/models/User.js` — user schema with email verification flag
    - `app/models/OTP.js` — OTP storage with auto-expiry
    - `app/models/Project.ts` — project schema with type-based filtering
  - **Utilities:**
    - `app/lib/auth.js` — JWT token generation and verification
    - `app/lib/mongodb.js` — MongoDB connection management
    - `app/lib/email.js` — email sending via SMTP
    - `app/hooks/useProjects.ts` — custom hook for project management
- `app/components/` — reusable UI / labs (TSX/JSX)
- `app/components/chemistry/reactions/` — reaction simulation components and data
- `app/components/computer-science/code-lab/` — code editor components (EditorPanel, PreviewPanel, ConsolePanel)
- `app/components/Navbar.tsx` — navigation with real-time auth state
- `app/src/data/elements.js` — element metadata
- `public/images/elements/` — element images and media
- `.env.local` — environment variables (JWT_SECRET, MONGO_URI, EMAIL credentials)

---

## Routes & How to Explore 🧭

A few key routes to try locally:

- `/` — home / landing page
- `/biology/cell/animal` — interactive 3D animal cell visualization (client-side rendered)
- `/chemistry/periodictable` — interactive periodic table
- `/chemistry/chemicalbonds` — bond visualizations
- `/chemistry/electronic-configuration/[atomicNumber]` — per-atom electronic configuration
- `/chemistry/reaction-simulation` — chemical reactions simulator (interactive with 3D visualizations)
- `/physics/freefall` — free fall experiment
- `/physics/projectilemotion` — projectile motion lab
- `/physics/hookelaw` — Hooke's Law experiment
- `/physics/ohmslaw` — Ohm's Law simulation
- `/physics/energyconservation` — energy conservation lab
- `/physics/rclab` — RC circuit simulator
- `/physics/simplependulum` — simple pendulum simulation
- `/physics/speedoflight` — speed of light experiment
- `/physics/uniformmotionlab` — uniform motion visualization
- `/physics/waveoptics` — wave optics lab
- **Computer Science Labs:**
  - `/computer-science/code-lab/html-css-js` — interactive HTML/CSS/JS code editor with live preview
- **Authentication Routes:**
  - `/signup` — user registration with email verification
  - `/login` — user login
  - `/verify-email` — email OTP verification
  - `/forgotpassword` — password reset request
  - `/reset-password` — password reset form with OTP

Open the `app/components/` folder to find corresponding pages and UI components to extend.

---

## Authentication System 🔐

OpenLabs now includes a **complete, production-ready authentication system** with the following features:

### Features
- ✅ **Email Verification OTP** - 6-digit codes sent via Gmail SMTP (10-minute expiry)
- ✅ **Secure Password Storage** - bcryptjs hashing with salt rounds
- ✅ **JWT Tokens** - Stateless authentication with token-based sessions (24-hour expiry)
- ✅ **Password Reset** - Forgot password flow with OTP verification (15-minute expiry)
- ✅ **Cloud Database** - All data stored securely in MongoDB Atlas

### Setup Instructions

1. **Environment Variables** (`.env.local`):
   ```env
   # JWT Configuration
   JWT_SECRET=your_secret_key_here

   # MongoDB Atlas
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/OpenLabs?retryWrites=true&w=majority

   # Email Configuration (Gmail)
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASSWORD=your_app_specific_password
   
   # Website
   WEBSITE_NAME=OpenLabs
   WEBSITE_URL=https://yourdomain.com
   ```

2. **Gmail Setup**:
   - Enable 2-Factor Authentication on your Google account
   - Generate an "App Password" at https://myaccount.google.com/apppasswords
   - Use the 16-character password in `EMAIL_PASSWORD`

3. **MongoDB Atlas**:
   - Create a free cluster at https://www.mongodb.com/cloud/atlas
   - Copy your connection string and update `MONGO_URI`

### User Flow

**Signup:**
1. User creates account with name, email, password
2. OTP sent to email (10-minute validity)
3. User enters OTP on verification page
4. Email marked as verified
5. User automatically logged in and redirected to home

**Login:**
1. User enters email and password
2. Credentials verified against database
3. JWT token issued as httpOnly cookie
4. User redirected to home page

**Forgot Password:**
1. User enters email on forgot password page
2. System checks if email exists and is verified
3. OTP sent to email (15-minute validity)
4. User enters OTP and new password on reset page
5. Password updated in database
6. User redirected to login

### API Endpoints

- `POST /api/auth/signup` - Create new user account
- `POST /api/auth/login` - Authenticate user and issue token
- `POST /api/auth/logout` - Clear authentication cookie
- `POST /api/auth/verify-otp` - Verify email OTP and auto-login
- `POST /api/auth/send-otp` - Send OTP email
- `POST /api/auth/forgot-password` - Send password reset OTP
- `POST /api/auth/reset-password` - Reset password with OTP
- `GET /api/auth/check` - Check if user is authenticated
- `GET /api/projects` — Fetch user projects (filtered by type)
- `POST /api/projects` — Create or update a project
- `DELETE /api/projects` — Delete a project
### Security Features

- ✓ **Password Hashing** - bcryptjs with 10 salt rounds
- ✓ **JWT Tokens** - Signed with secret key, 24-hour expiration
- ✓ **HttpOnly Cookies** - Token stored securely, not accessible via JavaScript
- ✓ **OTP Expiration** - Auto-delete after 10-15 minutes
- ✓ **Email Verification** - Prevents dummy accounts
- ✓ **Verified User Check** - Must verify email before password reset

---

## How to Add a New Lab 🧩

1. Create a route under `app/` (e.g., `app/physics/newlab/page.tsx`).
2. Add the interactive UI as a component in `app/components/physics/`.
3. **For 3D Labs using Three.js/React Three Fiber:**
   - Use `dynamic` import with `ssr: false` in your page component to prevent server-side rendering errors
   - Example: `const MyComponent = dynamic(() => import("@/app/components/..."), { ssr: false })`
4. Add any static assets to `public/` and data to `app/src/data/` if needed.
5. Export small, testable components and document props via JSDoc or TypeScript interfaces.
6. Add an entry to the navigation (`app/layout.tsx` or `app/components/Navbar.tsx`) so users can find it.

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
- OAuth2 integration (Google, GitHub login)
- User profile dashboard
- Progress tracking and certificates
- Discussion forums for students

---

## License

This project is released under the **Proprietary License** — see the `LICENSE` file for details.

---

## Trademark & Brand Notice

OpenLabs™ is a name, concept, and brand owned by Rahul Rajput.

The OpenLabs name, logo, and branding may not be used in any derivative
projects, products, or services without prior written permission.

---

## Maintainers & Contact 📬

- Maintainer: [@rahulra3621](https://github.com/rahulra3621)

If you need help or want to contribute, open an issue or submit a PR — we welcome collaborators!

---

Thank you for checking out **OpenLabs** — built for curious minds! 🎉
