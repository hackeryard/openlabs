# OpenLabs 🔬⚡

[![Status](https://img.shields.io/badge/status-active-brightgreen)](https://github.com/hackeryard/openlabs)
[![Repo](https://img.shields.io/badge/repo-GitHub-181717?style=flat&logo=github)](https://github.com/hackeryard/openlabs)
[![License: Proprietary](https://img.shields.io/badge/license-Proprietary-blue.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/next-14.2.35-000000?style=flat&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/react-18.2.0-61dafb?style=flat&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/typescript-5.4.0-3178c6?style=flat&logo=typescript)](https://www.typescriptlang.org/)

**OpenLabs** is a comprehensive, interactive platform providing in-browser science labs and visualizations across **Chemistry**, **Physics**, **Biology**, and **Computer Science**. Built with modern web technologies, it enables students, educators, and enthusiasts to conduct hands-on experiments and explore scientific concepts without requiring physical lab equipment.

---

## Table of Contents

- 🚀 [Quick Start](#quick-start-)
- ✨ [Features](#features-)
- 🔧 [Technology Stack](#technology-stack-)
- ⚙️ [Development Scripts](#development-scripts-)
- 🗂️ [Project Structure](#project-structure-)
- 🧭 [Routes & Navigation](#routes--navigation-)
- 🔐 [Authentication System](#authentication-system-)
- 🚨 [Error Handling & Custom Error Pages](#error-handling--custom-error-pages-)
- 🧩 [Creating New Labs](#creating-new-labs-)
- 🤝 [Contributing](#contributing-)
- 🚀 [Deployment](#deployment-)
- 🖼️ [Screenshots & Media](#screenshots--media-)
- 💡 [Future Roadmap](#future-roadmap-)
- 📄 [License & Legal](#license--legal-)
- 📬 [Contact & Support](#contact--support-)

---

## Quick Start 🚀

### Prerequisites

- **Node.js** 18.0.0 or higher
- **Yarn** 1.22.22 (recommended) or npm

### Installation & Development

```bash
# Clone repository
git clone https://github.com/hackeryard/openlabs.git
cd OpenLabs

# Install dependencies (yarn is optimal for this project)
yarn install

# Start development server with hot-reload
yarn dev
# Opens at: http://localhost:3000
```

### Alternative with npm

```bash
npm install
npm run dev
```

### Production Build

```bash
# Build for production
yarn build

# Start production server
yarn start
```

---

## Features ✨

### Chemistry Labs
- **Interactive Periodic Table** — Comprehensive element explorer with visual assets and detailed atomic information
- **Electronic Configuration Visualizer** — Atomic structure visualization with per-element interactive pages
- **Chemical Bond Types** — Visual demonstrations of ionic, covalent, and metallic bonding
- **3D Atomic Models** — Three.js-based molecular visualization with interactive controls
- **Chemical Reaction Simulator** — Real-time reaction builder with 3D dynamics and post-processing effects

### Physics Labs
- **Mechanics** — Free Fall, Projectile Motion, Uniform Motion simulations
- **Waves & Optics** — Wave Optics, Speed of Light, Optical Lenses experiments
- **Oscillations** — Simple Pendulum with adjustable parameters and real-time visualization
- **Energy & Forces** — Hooke's Law, Energy Conservation experiments
- **Electronics** — RC Circuit simulator with interactive component controls and analysis

### Biology Labs
- **3D Cell Visualization** — Interactive animal and plant cell models with organelle details
- **Human Anatomy** — Anatomical structure explorer with biological information

### Computer Science Labs
- **HTML/CSS/JS Code Editor** — Live code editor with real-time preview and console output
- **Java Code Editor** — Java code compilation and execution environment
- **JavaScript Visual Debugger** — Step-through debugger with memory, stack, and async queue visualization
- **Data Structures & Algorithms (DSA)** — Interactive DSA visualizations and algorithm implementations
- **Data Analyzer** — Data visualization and analysis tools with D3 integration
- **Data Science** — Data science experiments and machine learning demonstrations
- **AI Problem Solver** — AI-powered problem solving and code suggestion tool
- **Blockchain Explorer** — Blockchain technology visualization and concepts
- **Networking Lab** — Network protocols and communication simulations
- **Logic Gates** — Boolean logic and digital circuit simulations
- **Git Simulator** — Interactive Git version control simulator
- **Project Management** — Save, load, and manage projects with type-based filtering and persistent storage

### Authentication & Security
- ✅ **Email verification** with 6-digit OTP (10-minute expiry)
- ✅ **Secure password storage** using bcryptjs (10 salt rounds)
- ✅ **JWT-based authentication** with 24-hour token expiry
- ✅ **Password reset flow** with OTP verification (15-minute expiry)
- ✅ **Persistent sessions** via httpOnly cookies
- ✅ **Database-backed user management** with MongoDB Atlas
- ✅ **Redirect-after-login** — Users redirected to their intended page after authentication
- ✅ **Protected API routes** — Automatic authentication checks with session redirect
- ✅ **User Profile Setup** — Custom onboarding banner prompting profile setup completion

### Gamification & Progress Tracking 🏆
- 🏆 **Daily Challenges Overhaul** — Premium, dark-mode glassmorphic cards (`bg-slate-900/80`, `backdrop-blur-xl`, custom border tints) featuring pulsing difficulty badges (Easy: Emerald, Medium: Blue, Hard: Rose), dynamic submission state loaders, and custom expandable hint menus.
- 🏆 **Interactive Achievements** — Video-game styled completion screen featuring a bouncing sparkles icon, and pill-shaped reward chips showing XP gains (`Flame` icon), Levels (`TrendingUp` icon), and unlockable Badges (`Award` icon).
- 🏆 **Database Seeding Consistency** — Updated backend generation routes (`/api/challenges/generate`) to purge previous challenge history dynamically before generating new challenges, ensuring an isolated, clean database state.
- 🏆 **Unified Challenge Architecture** — Centralized challenge rendering logic under a single `<DailyChallengeCard>` component, removing duplicate alert markups across labs (such as Free Fall) to align with standard styling guidelines.
- 🏆 **XP Engine** — Earn dynamic experience points (XP) for performing tasks, finishing labs, and completing daily challenges.
- 🏆 **Level Progression** — Advance through levels with visual progress meters and level up logic.
- 🏆 **Subject Mastery** — Tailored expertise tracking (e.g. Physics, Chemistry, Biology, CS) visualizing progress as students explore labs.
- 🏆 **Achievements & Badges** — Reward system offering unlockable badges stamped with award dates, viewable on profiles.
- 🏆 **Recent Activity Tracker** — Automatic tracking of user engagement and recent experiment history in the profile dashboard.

### Full-Stack Blog & Media Engine 📝
- 📝 **Editorial Grid** — Public articles display with rich details: reading times, snippets, visual cover photo frames, and modern hovers
- 📝 **Cover Image Uploads** — Drag-and-drop file inputs on create and edit panel pages, feeding directly into Cloudinary CDN
- 📝 **Cloudinary Integration** — Secure, stream-based uploads automatically optimized into lightweight WebP formatting (5MB limit)
- 📝 **Admin Dashboard (CRUD)** — Robust administrative control panel (`/admin/blogs`) supporting secure creating, editing, and deleting of articles
- 📝 **x-admin-secret Protection** — Rest API uploads and mutations strictly restricted using secure header auth validation
- 📝 **Dynamic FAQ Schema** — SEO-optimal automated injection of structured JSON-LD rich results from customized blog FAQs

### AI & Chat Features
- ✅ **OpenLabsAI Chat Assistant** — Context-aware AI assistant integrated across all labs
- ✅ **Speech Recognition** — Voice input support for chat interactions
- ✅ **OpenAI Integration** — Powered by advanced language models
- ✅ **Chat Context Management** — Remembers experiment state and provides relevant responses
- ✅ **Real-time Markdown Support** — Response formatting with GitHub-flavored Markdown

### UI/UX Features
- **Responsive Profile Interface** — Mobile-first adaptive details panel with centralized Edit forms and wrapped grid columns
- **Sleek Navbar Polish** — Minimalistic, emoji-free navigational items across categories and drawers for clean readability
- **Responsive Design** — Mobile-friendly layouts with Tailwind CSS
- **Accessibility-First** — WCAG-compliant accessible components
- **Smooth Animations** — Framer Motion transitions and interactions
- **Modern Icon Library** — Lucide React icons throughout the interface
- **Professional Layout** — Clean, organized navigation and visual hierarchy
- **Enhanced Navigation** — Navbar includes all subject categories (Chemistry, Physics, Biology, Computer Science)
- **Mobile-Optimized Dropdown** — Z-index fixed mobile menu stays above content
- **Lab Discovery Hub** — Homepage "Explore All Labs" section with 16+ labs organized by category
- **Branded Error Pages** — Custom 404, 500, and error boundaries with helpful navigation

---

## Technology Stack 🔧

### Core Framework
- **Next.js** 14.2.35 (App Router, server & client components)
- **React** 18.2.0 (frontend library)
- **TypeScript** 5.4.0 (type safety)
- **Tailwind CSS** 3.4.17 (utility-first styling)
- **Babel** 7.29.x (@babel/parser, @babel/generator, @babel/traverse) — JavaScript parsing and code transformation

### 3D Graphics & Visualization
- **Three.js** 0.170.0 (3D graphics engine)
- **@react-three/fiber** 8.17.0 (React renderer for Three.js)
- **@react-three/drei** 9.108.0 (useful Three.js helpers)
- **@react-three/postprocessing** 2.16.0 (post-processing effects)
- **postprocessing** 6.30.1 (advanced rendering techniques)
- **p5.js** 2.1.1 (creative coding visualizations)
- **D3.js** 7.9.0 (data visualization library)
- **react-graph-vis** 1.0.7 (network and graph visualization)

### Code Editing & Interactive Labs
- **@monaco-editor/react** 4.7.0 (vs-code powered editor)

### Authentication, AI & Database
- **MongoDB Atlas** (cloud database)
- **Mongoose** 9.1.4 (MongoDB object modeling)
- **jsonwebtoken** 9.0.3 (JWT token generation & verification)
- **bcryptjs** 3.0.3 (password hashing)
- **Nodemailer** 7.0.12 (email delivery)
- **OpenAI** 6.22.0 (AI language model integration)
- **@hackeryard/mandatory-guard** 1.0.3 (build-time validation)

### Media Processing & Uploads
- **Cloudinary SDK** — Stream-based remote uploads and media asset optimization
- **Multer** — Node.js middleware for handling multipart/form-data upload buffers

### UI & Animation
- **Framer Motion** 12.29.0 (declarative animations)
- **Lucide React** 0.562.0 (icon library)
- **Axios** 1.13.2 (HTTP client)
- **react-markdown** 10.1.0 (Markdown rendering)
- **remark-gfm** 4.0.1 (GitHub-flavored Markdown support)
- **@headlessui/react** 2.2.9 (accessible UI components)

### Analytics & Performance
- **@vercel/speed-insights** 1.3.1 (performance monitoring)

### Development & Build
- **ESLint** 8.57.1 (code linting)
- **Autoprefixer** 10.4.23 (CSS vendor prefixes)
- **PostCSS** 8.5.6 (CSS transformations)
- **nanoid** 5.1.6 (unique ID generation)
- **dotenv** 17.2.4 (environment variable management)

---

## Development Scripts ⚙️

Available npm/yarn scripts in [package.json](package.json):

| Script | Purpose |
|--------|---------|
| `yarn dev` | Start Next.js development server (hot-reload on port 3000) |
| `yarn build` | Create optimized production build |
| `yarn start` | Start production server |
| `yarn lint` | Run ESLint to check code quality |
| `yarn preview` | Preview production build locally |

### Development Tips

- **TypeScript** — Type annotations are enforced; use TypeScript for new components
- **Code Splitting** — Dynamic imports with `ssr: false` for 3D WebGL components to prevent server-side rendering errors
- **Styling** — Follow Tailwind's utility-first approach for consistent, maintainable CSS
- **Reusable Components** — Store shared UI components in `app/components/` organized by subject
- **API Routes** — Use Next.js API routes under `app/api/` for backend logic

---

## Project Structure 🗂️

```
OpenLabs/
├── app/                              # Next.js App Router
│   ├── admin/                        # Blog Administration Panel
│   │   └── blogs/                    # Blog Editor & manager listings
│   │       ├── create/               # Create blog post form (with Cloudinary uploads)
│   │       └── [slug]/edit/          # Edit blog post page
│   │
│   ├── api/                          # Backend API routes
│   │   ├── admin/blogs/              # Admin blog management
│   │   │   └── upload/               # Cloudinary secure upload route
│   │   ├── blogs/                    # Blog retrieval endpoints
│   │   ├── challenges/               # Daily challenges API
│   │   ├── xp/                       # XP completions API
│   │   ├── auth/                     # Authentication endpoints
│   │   │   ├── signup/               # User registration
│   │   │   ├── login/                # User login
│   │   │   ├── verify-otp/           # Email OTP verification
│   │   │   ├── send-otp/             # Send OTP email
│   │   │   ├── forgot-password/      # Password reset request
│   │   │   ├── reset-password/       # Password reset form
│   │   │   ├── logout/               # User logout
│   │   │   └── check/                # Auth status check
│   │   └── projects/                 # Project management API
│   │   ├── chat/                     # AI chat response endpoint
│   │   └── agent/                    # AI agent service routing
│   │
│   ├── (maths)/                      # Math labs (algebra, etc.)
│   ├── biology/                      # Biology labs & visualizations
│   ├── chemistry/                    # Chemistry labs & periodic table
│   ├── physics/                      # Physics experiments & simulations
│   ├── computer-science/             # CS labs (DSA, Data Science, AI, etc.)
│   ├── profile/                      # User dashboard page & custom profile editor
│   ├── blog/                         # Public Blog listing & article page layouts
│   │
│   ├── components/                   # Reusable UI components
│   │   ├── biology/                  # Cell & anatomy components
│   │   ├── chemistry/                # Chemistry-specific components
│   │   ├── physics/                  # Physics lab components
│   │   ├── computer-science/         # Code editor & CS components
│   │   ├── blog/                     # Blog listing card layouts
│   │   ├── ChatContext.tsx           # Global chat context provider
│   │   ├── OpenLabsAI.tsx            # AI chat assistant component
│   │   ├── DailyChallengeCard.tsx    # Daily challenge dashboard item
│   │   ├── Footer.tsx                # Footer component
│   │   ├── Navbar.tsx                # Navigation bar
│   │   └── Hero.tsx                  # Hero section with labs exploration
│   │
│   ├── models/                       # MongoDB Mongoose schemas
│   │   ├── User.js                   # User model (auth & stats: levels, badges, streak)
│   │   ├── OTP.js                    # OTP storage with expiry
│   │   ├── Project.ts                # Project data model
│   │   ├── Blog.js                   # Blog posts schema (coverImage, faqs, metadata)
│   │   └── DailyChallenge.js         # Daily generated challenge schema
│   │
│   ├── lib/                          # Utility libraries
│   │   ├── auth.js                   # JWT utilities
│   │   ├── email.js                  # Email sending logic
│   │   ├── mongodb.ts                # Database connection
│   │   ├── getUserFromToken.ts       # Token parsing
│   │   ├── pageKnowledge.ts          # Experiment context data for AI
│   │   ├── cloudinary.ts             # Cloudinary configuration
│   │   ├── labs.ts                   # Lab IDs metadata library
│   │   └── xp.ts                     # XP definitions and progression rules
│   │
│   ├── hooks/                        # Custom React hooks
│   │   ├── useLocalStorage.ts        # Local storage management
│   │   ├── useProjects.ts            # Project management hook
│   │   ├── useDailyChallenge.ts      # Fetch and progress challenges
│   │   └── useXP.ts                  # Log experiment XP and check levels
│   │
│   ├── layout.tsx                    # Root layout (Navbar, Footer)
│   ├── page.tsx                      # Home/landing page
│   ├── not-found.tsx                 # Custom 404 error page
│   ├── error.tsx                     # Custom error boundary page
│   ├── global-error.tsx              # Global error boundary page
│   ├── globals.css                   # Global Tailwind styles
│   └── favicon.ico                   # Favicon
│
├── src/
│   └── data/
│       └── elements.js               # Periodic table element data
│
├── public/                           # Static assets
│   ├── images/                       # Images (logos, element visuals)
│   │   └── scientist.png             # Hero section illustration
│   └── models/                       # 3D model files
│
├── scripts/
│   └── guard.cjs                     # Pre-build/pre-dev guard
│
├── configuration files
│   ├── next.config.js                # Next.js configuration
│   ├── tsconfig.json                 # TypeScript configuration
│   ├── tailwind.config.js            # Tailwind CSS setup
│   ├── postcss.config.js             # PostCSS configuration
│   ├── eslint.config.js              # ESLint rules
│   ├── package.json                  # Dependencies & scripts
│   └── README.md                     # Project documentation
│
└── .env.local                        # Environment variables (not in git)
```

---

## Routes & Navigation 🧭

### Home & Authentication
Supports optional `?next=/path` query parameter to redirect users to their intended page after login.
| Route | Purpose |
|-------|---------|
| `/` | Landing page with navigation |
| `/signup` | User registration with email verification |
| `/login` | User login |
| `/verify-email` | Email OTP verification |
| `/forgotpassword` | Password reset request |
| `/reset-password` | Password reset with OTP |
| `/profile` | Fully mobile-responsive user stats, badges, streaks, and customization |

### Blog Platform (Public & Admin Panels)
| Route | Purpose |
|-------|---------|
| `/blog` | Visual listing grid of all public articles with reading time and cover photo hovers |
| `/blog/[slug]` | Dedicated editorial view with cover image and auto-injected dynamic FAQ Schema JSON-LD |
| `/admin/blogs` | Admin blog manager dashboard listing (published vs draft status) |
| `/admin/blogs/create` | Admin blog creator tool equipped with custom drag-and-drop Cloudinary file uploader |
| `/admin/blogs/[slug]/edit` | Admin blog editor updating cover image, markdown content, metadata, and FAQs |

### Chemistry Labs

| Route | Experiment |
|-------|-----------|
| `/chemistry/periodictable` | Interactive periodic table with element details |
| `/chemistry/chemicalbonds` | Chemical bond type visualizations |
| `/chemistry/electronic-configuration/[atomicNumber]` | Per-atom electronic configuration viewer |
| `/chemistry/reaction-simulation` | Interactive reaction simulator with 3D dynamics |

### Physics Labs

| Route | Experiment |
|-------|-----------|
| `/physics/freefall` | Free fall motion simulation |
| `/physics/projectilemotion` | Projectile motion analysis |
| `/physics/hookelaw` | Hooke's Law spring experiments |
| `/physics/ohmslaw` | Ohm's Law circuit simulations |
| `/physics/energyconservation` | Energy conservation demonstrations |
| `/physics/rclab` | RC circuit simulator |
| `/physics/simplependulum` | Simple pendulum oscillations |
| `/physics/speedoflight` | Speed of light experiments |
| `/physics/uniformmotionlab` | Uniform motion visualizations |
| `/physics/waveoptics` | Wave optics and diffraction |

### Biology Labs

| Route | Experiment |
|-------|-----------|
| `/biology/cell/animal` | 3D interactive animal cell visualization |
| `/biology/cell/plant` | 3D interactive plant cell visualization |
| `/biology/human` | Human anatomy explorer |

### Computer Science Labs

| Route | Tool |
|-------|------|
| `/computer-science/code-lab/html-css-js` | Live HTML/CSS/JS code editor with preview |
| `/computer-science/code-lab/js` | JavaScript Visual Debugger with runtime visualization |
| `/computer-science/dsa` | Data Structures & Algorithms visualizations |
| `/computer-science/data-analyzer` | Data analysis and D3 visualization tools |
| `/computer-science/data-science` | Data science experiments and ML demonstrations |
| `/computer-science/ai-problem` | AI-powered problem solver and assistant |
| `/computer-science/blockchain` | Blockchain technology explorer |
| `/computer-science/networking` | Network protocols and communication simulator |
| `/computer-science/logic-gates` | Boolean logic and digital circuits |
| `/computer-science/git-simulator` | Interactive Git version control simulator |

### API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/auth/signup` | Create new user account |
| POST | `/api/auth/login` | Authenticate user |
| POST | `/api/auth/verify-otp` | Verify email OTP and auto-login |
| POST | `/api/auth/send-otp` | Send OTP email |
| POST | `/api/auth/forgot-password` | Send password reset OTP |
| POST | `/api/auth/reset-password` | Reset password with OTP |
| POST | `/api/auth/logout` | Clear authentication cookie |
| GET | `/api/auth/check` | Check authentication status |
| GET | `/api/projects` | Fetch user projects (filtered by type) |
| POST | `/api/projects` | Create or update project |
| DELETE | `/api/projects` | Delete project |
| POST | `/api/chat` | Send message to AI assistant |
| POST | `/api/agent` | Route queries to external AI agent service |

---

## Authentication System 🔐

OpenLabs includes a **production-ready authentication system** with email verification, secure password management, and JWT-based sessions.

### Key Features

| Feature | Details |
|---------|---------|
| **Email Verification** | 6-digit OTP sent via Gmail SMTP, 10-minute expiry |
| **Password Security** | bcryptjs hashing with 10 salt rounds |
| **JWT Authentication** | Stateless tokens with 24-hour expiry |
| **Password Reset** | Forgot password flow with OTP verification (15-minute expiry) |
| **Session Management** | HttpOnly cookies for secure token storage |
| **Database Backend** | MongoDB Atlas for user and OTP storage |

### User Authentication Flow

**Registration Process:**
1. User creates account (name, email, password)
2. 6-digit OTP sent to email (10-minute validity)
3. User verifies OTP on verification page
4. Account activated and user auto-logged in

**Login Process:**
1. User enters credentials
2. Password verified against bcrypt hash
3. JWT token issued as httpOnly cookie
4. Session established with 24-hour expiry

**Password Recovery:**
1. User initiates password reset request
2. OTP sent to registered email (15-minute validity)
3. User enters OTP and new password
4. Password updated securely in database

### Environment Configuration

Create `.env.local` with the following variables:

```env
# JWT Configuration
JWT_SECRET=your_secure_random_secret

# MongoDB Atlas
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/OpenLabs?retryWrites=true&w=majority

# Email Service (Gmail SMTP)
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_specific_password

# Website Information
WEBSITE_NAME=OpenLabs
WEBSITE_URL=https://yourdomain.com
```

### Gmail Setup Instructions

1. Enable 2-Factor Authentication on your Google account
2. Generate "App Password" at https://myaccount.google.com/apppasswords
3. Use the 16-character password in `EMAIL_PASSWORD`

### MongoDB Atlas Setup

1. Create free cluster at https://www.mongodb.com/cloud/atlas
2. Copy connection string
3. Update `MONGO_URI` with your credentials

### Security Measures

- ✅ **Salted Password Hashing** — bcryptjs prevents rainbow table attacks
- ✅ **Signed JWT Tokens** — Cryptographically verified, signed with secret key
- ✅ **HttpOnly Cookies** — Tokens inaccessible to client-side JavaScript
- ✅ **OTP Expiration** — Automatic cleanup of expired verification codes
- ✅ **Email Verification** — Prevents dummy account creation
- ✅ **Verified User Requirement** — Email verification mandatory before password reset

---

## Troubleshooting 🔧

### Common Issues & Solutions

#### WebGL/3D Component Errors
**Problem:** "WebGL not supported" or blank 3D canvas

**Solutions:**
- Ensure you're using a modern browser (Chrome, Firefox, Safari, Edge)
- Check browser hardware acceleration is enabled
- Disable browser extensions that block WebGL
- Try a different browser
- Update GPU drivers

**Code Fix:** Components already use `dynamic()` with `ssr: false` to prevent SSR errors.

#### Authentication Issues
**Problem:** Token expiration or login not persisting

**Solution:**
- Check `.env.local` has correct `JWT_SECRET`
- Verify MongoDB connection string in `MONGO_URI`
- Check browser cookies are enabled
- Clear browser cache and cookies, then re-login
- Ensure email is verified before password reset

#### Email Not Sending
**Problem:** OTP emails not received

**Checklist:**
- ✅ Gmail 2FA is enabled on your account
- ✅ App password is correct (16 characters from Google Account)
- ✅ `EMAIL_USER` and `EMAIL_PASSWORD` are in `.env.local`
- ✅ Check email spam folder
- ✅ Verify MongoDB `OTP` collection entries
- ✅ Ensure `WEBSITE_URL` is correctly set

#### Slow Performance
**Problem:** Application feels sluggish

**Optimizations:**
- Use production build: `yarn build && yarn start`
- Enable browser DevTools and check Network tab for slow resources
- Reduce 3D model complexity or implement LOD (Level of Detail)
- Check MongoDB indexes are created
- Use CDN for static assets

#### Environment Variable Issues
**Problem:** "process.env.[VAR] is undefined"

**Solution:**
- Ensure `.env.local` exists in root directory (same level as package.json)
- Restart dev server after adding `.env.local`: `Ctrl+C` then `yarn dev`
- Variable names must be exact (case-sensitive)
- Never commit `.env.local` to git

---

## Error Handling & Custom Error Pages 🚨

OpenLabs includes professionally designed, branded error pages with subject-specific themes that provide excellent user experience during failures.

### Error Pages Overview

#### 1. **404 Not Found** (`app/not-found.tsx`)
Displayed when users navigate to non-existent routes.

**Features:**
- 🎨 Animated gradient 404 heading with rotation effect
- 💡 Helpful message explaining the missing page
- 🔗 Quick links to popular labs (Periodic Table, Free Fall, Animal Cell, Code Editor)
- 🎯 Two CTA buttons: "Back to Home" and "Explore Labs"
- ✨ Animated science emojis and smooth transitions

**When Used:**
```typescript
// Automatically triggered by Next.js for undefined routes
// e.g., /invalid-path or /nonexistent-lab
```

**Example Response:**
- Status Code: 404
- Custom Hero Animation
- Lab Suggestions
- Navigation Options

#### 2. **Error Boundary** (`app/error.tsx`)
Route-level error handler for caught exceptions and runtime errors.

**Features:**
- 🔴 Alert icon with pulse animation in error gradient
- 📋 Displays actual error message for debugging
- 🆔 Error ID (digest) for support reference
- 📝 **Recovery suggestions:**
  - Refresh the page
  - Clear browser cache
  - Navigate to home page
  - Report issue to GitHub
- 🔧 Three action buttons: "Try Again", "Go Home", "Report Issue"
- 💬 Help section with support links
- 🔗 Links to GitHub issues and maintainer profile

**When Used:**
```typescript
// Automatically triggered when route component throws error
// e.g., API failures, Component rendering errors, State errors
export default function ErrorBoundary() {
  return <Error />
}
```

**Example:**
```javascript
// If any lab component has an error
throw new Error("Failed to load 3D model");
// → Automatically caught and displayed with error.tsx
```

#### 3. **Global Error Boundary** (`app/global-error.tsx`)
Root-level error handler for critical system-wide failures.

#### 4. **Subject-Specific Error Boundaries**
Dedicated error pages with lab-themed branding for each science domain:

**Physics Lab Error** (`app/physics/error.tsx`)
- 🌀 Blue quantum-themed aesthetic with rotating atom icon
- "Physics_Wing // Entropy" branding
- Sync Coordinates recovery action
- Grid background with scanning line effect

**Chemistry Lab Error** (`app/chemistry/error.tsx`)
- 🧪 Emerald green chemistry-themed design with flask icon
- "Chem_Lab // Breach" branding
- Re-Stabilize Solution recovery action
- Animated reagent particles effect

**Biology Lab Error** (`app/biology/error.tsx`)
- 🧬 Rose/pink biological-themed interface with DNA icon
- "Bio_Sector // Mutation" branding  
- Regenerate Helix recovery action
- Heart pulse background animation

**Computer Science Lab Error** (`app/computer-science/error.tsx`)
- 💻 Amber/orange retro-tech aesthetic with CPU icon
- "CS_Lab // Kernel_Panic" branding
- Hard Reboot recovery action
- Binary code background Matrix-style effect

**Features:**
- 🌐 System-level error handling
- ⚠️ Critical error notification
- 🔄 Recovery attempt button
- 📊 Error logging and tracking capability
- 🏠 Root navigation option
- ⚙️ Spinning gear animation

**When Used:**
```typescript
// Catches errors that occur at root layout level
// e.g., Layout rendering errors, Global middleware errors
```

**Key Differences:**
| Page | Scope | Triggered By |
|------|-------|--------------|
| **404** | Single route | Non-existent path |
| **error.tsx** | Route segment | Root component errors |
| **global-error.tsx** | Entire app | Layout/global errors |
| **physics/error.tsx** | Physics routes | Errors in physics labs |
| **chemistry/error.tsx** | Chemistry routes | Errors in chemistry labs |
| **biology/error.tsx** | Biology routes | Errors in biology labs |
| **computer-science/error.tsx** | CS routes | Errors in CS labs |

### Error Recovery Options

Each error page provides multiple recovery paths:

1. **Immediate Recovery** — "Try Again" button attempts to recover state
2. **Home Navigation** — Quick return to safe landing page
3. **Lab Exploration** — Quick links to popular labs
4. **Issue Reporting** — GitHub issue creation link for support

### Error Logging

The error pages are designed to support error tracking services:

```typescript
// In error.tsx
useEffect(() => {
  // Log to external service
  console.error("Error occurred:", error);
  
  // Could integrate with:
  // - Sentry
  // - LogRocket
  // - Rollbar
  // - Custom error tracking API
}, [error]);
```

### Testing Error Pages

**Test 404 Page:**
```bash
# Navigate to any undefined route
http://localhost:3000/this-does-not-exist
```

**Test Error Boundary:**
```bash
# Trigger a component error by modifying a lab component
throw new Error("Test error");
```

**Test Global Error:**
```bash
# Errors in root layout will trigger global-error.tsx
```

### JavaScript Visual Debugger 🐛

The JavaScript debugger allows students to visualize code execution with runtime introspection:

**Features:**
- **Step-through execution** — Progress through code line by line
- **Memory inspection** — View all variables and their values at each step
- **Call stack viewer** — Examine function call hierarchy
- **DOM tracker** — Monitor DOM mutations
- **Async queue** — Visualize setTimeout, setInterval, and promises
- **Timeline scrubber** — Jump to any execution step instantly
- **Source mapping** — Synchronized code highlighting

**Located at:** `/computer-science/code-lab/js`

**Powered by:** Babel parser (`@babel/parser`, `@babel/generator`, `@babel/traverse`) for code instrumentation

---

### Step-by-Step Guide

#### 1. Create the Route Page
Create a new page file in the appropriate subject folder:

```bash
# Example: Adding a new physics lab
touch app/physics/newlab/page.tsx
```

#### 2. Build the Component
Create a corresponding component in the components folder:

```bash
mkdir -p app/components/physics/newlab
touch app/components/physics/newlab/LabComponent.tsx
```

#### 3. Export the Component
In your page file, import and export the component:

```typescript
// app/physics/newlab/page.tsx
'use client'

import dynamic from 'next/dynamic'
import NewLabComponent from '@/app/components/physics/newlab/LabComponent'

// Use dynamic import with ssr: false for 3D components
const LabWithoutSSR = dynamic(() => import('@/app/components/physics/newlab/LabComponent'), {
  ssr: false
})

export default function NewLabPage() {
  return <LabWithoutSSR />
}
```

#### 4. Add Navigation Link
Update [app/components/Navbar.tsx](app/components/Navbar.tsx) to include your new lab in the navigation menu.

#### 5. Add Static Assets
Store any images or data files in `public/`:

```bash
public/
├── images/
│   └── newlab/
│       └── experiment.png
└── data/
    └── newlab-data.json
```

### Best Practices

- **Use TypeScript** for type safety and better IDE support
- **Dynamic Imports** — Always use `dynamic()` with `ssr: false` for Three.js/WebGL components
- **Responsive Design** — Use Tailwind CSS for mobile compatibility
- **Component Props** — Document props with TypeScript interfaces
- **Error Handling** — Gracefully handle WebGL unavailability
- **Performance** — Optimize 3D rendering, use lazy loading for heavy assets
- **Accessibility** — Ensure keyboard navigation and screen reader support

---

## Contributing 🤝

We welcome contributions! Whether it's bug fixes, new features, or documentation improvements.

### How to Contribute

1. **Fork** the repository on GitHub
2. **Create** a feature branch: `git checkout -b feature/your-feature-name`
3. **Make changes** and commit with clear messages: `git commit -m "feat: add new lab feature"`
4. **Push** to your fork: `git push origin feature/your-feature-name`
5. **Submit** a Pull Request with:
   - Clear description of changes
   - Screenshots or videos for new features
   - Reference to any related issues

### Development Guidelines

- **Code Style** — Follow ESLint configuration; run `yarn lint` before submitting
- **Testing** — Test components locally in multiple browsers
- **TypeScript** — Use strict type checking for all new code
- **Commit Messages** — Use conventional commits (feat:, fix:, docs:, etc.)
- **Branch Naming** — Use descriptive names (feature/periodic-table, fix/auth-bug)
- **Documentation** — Update README for new features or significant changes

### Reporting Issues

When reporting bugs, please include:
- Clear description of the issue
- Steps to reproduce
- Expected vs. actual behavior
- Environment details (browser, OS)
- Screenshots if applicable

---

## Deployment 🚀

OpenLabs is optimized for modern hosting platforms with Node.js 18+ support.

### Deploy to Vercel (Recommended)

Vercel is the recommended platform (creators of Next.js):

1. **Push repository to GitHub** (if not already done)
2. **Go to** [https://vercel.com](https://vercel.com) and sign in
3. **Click** "New Project" and import your GitHub repository
4. **Configure:**
   - Framework: Next.js
   - Build Command: `yarn build`
   - Output Directory: `.`
5. **Add environment variables** in Vercel dashboard:
   ```
   JWT_SECRET
   MONGO_URI
   EMAIL_USER
   EMAIL_PASSWORD
   WEBSITE_URL
   WEBSITE_NAME
   ```
6. **Deploy** — Vercel automatically deploys on push to main branch

### Alternative Hosting

Other Node.js compatible platforms also work:

- **Netlify** — Preview deployments, custom rewrite rules
- **Railway** — Simple deployment with environment management
- **Fly.io** — Global deployment with edge computing
- **Self-hosted** — Docker-ready for custom servers

### Pre-Deployment Checklist

- ✅ Run `yarn build` locally and verify no errors
- ✅ Test all authentication flows
- ✅ Verify environment variables are set
- ✅ Check database connectivity to MongoDB Atlas
- ✅ Test email delivery (OTP, password reset)
- ✅ Review SEO metadata in layout.tsx
- ✅ Run `yarn lint` to catch code issues
- ✅ Test on multiple browsers and devices

---

## SEO & Search Optimization 🔍

OpenLabs is fully optimized for search engines with comprehensive SEO implementation across all pages, structured data, and metadata configuration.

### SEO Features ✨

**Comprehensive Metadata Coverage**
- ✅ Meta titles optimized to 50-65 characters with target keywords
- ✅ Meta descriptions (120-140 characters) for all 74+ pages
- ✅ Meta keywords arrays for improved discoverability
- ✅ OpenGraph tags for social media sharing (Facebook, LinkedIn)
- ✅ Twitter Card tags for X/Twitter preview optimization
- ✅ Canonical URLs for all pages to prevent duplicate content
- ✅ X-Robots-Tag HTTP header for crawler indexing directives

**Structured Data (JSON-LD)**
- ✅ `EducationalOrganization` schema with comprehensive metadata
- ✅ `Course` schema for all science domains (Physics, Chemistry, Biology, CS, Maths)
- ✅ `WebPage` schema with breadcrumb navigation
- ✅ Rich snippets for Google Search and Rich Results
- ✅ Schema validation compatible with Google's Rich Results Test

**Automated SEO Files**
- ✅ `robots.txt` generation with allow/disallow rules for crawlers
- ✅ XML sitemap with 50+ indexed pages and priority levels
- ✅ `llms.txt` configuration for AI/LLM indexing (ChatGPT, Gemini, Claude)
- ✅ Verification meta tags for Google, Bing, and Yandex Webmasters

**OpenGraph & Social Sharing**
- ✅ Open Graph images (1200x630px) for optimal social preview
- ✅ Twitter Card images (1200x600px) for X/Twitter sharing
- ✅ Branded image placeholders ready for production artwork
- ✅ Automatic image inheritance for nested pages

**Performance & Crawlability**
- ✅ Server-side metadata rendering (no client-side SEO issues)
- ✅ Fast initial page loads (Next.js static optimization)
- ✅ Mobile-responsive design for mobile-first indexing
- ✅ Core Web Vitals optimization (LCP, FID, CLS)

### SEO Implementation Files

| File | Purpose |
|------|---------|
| `app/layout.tsx` | Root metadata, structured data (JSON-LD), verification codes |
| `app/robots.ts` | Robots.txt generation for search crawler directives |
| `app/sitemap.ts` | XML sitemap with priority and changefreq for 50+ pages |
| `public/llms.txt` | AI/LLM indexing configuration and content guidelines |
| `next.config.js` | X-Robots-Tag HTTP header configuration |
| `public/images/og-image.svg` | Open Graph image template (1200x630px) |
| `public/images/twitter-image.svg` | Twitter Card image template (1200x600px) |
| **50+ layout.tsx files** | Per-page metadata for all category and subsection pages |

### Metadata Structure Example

Each page includes standardized metadata:

```typescript
// Example: Physics Lab Page Metadata
export const metadata: Metadata = {
  title: 'Physics Virtual Labs & Interactive Experiments',
  description: 'Explore interactive physics experiments and virtual labs including free fall, projectile motion, pendulum, optics, and more with OpenLabs.',
  keywords: ['physics labs', 'virtual labs', 'physics experiments', 'interactive physics', 'STEM education'],
  
  openGraph: {
    title: 'Physics Virtual Labs & Interactive Experiments | OpenLabs',
    description: 'Explore interactive physics experiments and virtual labs...',
    url: '/physics',
    type: 'website',
    images: [{ url: '/images/og-image.svg', width: 1200, height: 630 }],
  },
  
  twitter: {
    card: 'summary_large_image',
    images: ['/images/twitter-image.svg'],
    title: 'Physics Virtual Labs | OpenLabs',
    description: 'Explore interactive physics experiments...',
    images: ['/images/twitter-image.svg'],
  },
  
  alternates: {
    canonical: 'https://www.openlabs.org.in/physics',
  },
  
  robots: {
    index: true,
    follow: true,
  },
}
```

### Structured Data (JSON-LD)

The root `app/layout.tsx` includes comprehensive structured data:

```json
{
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  "name": "OpenLabs",
  "description": "Interactive virtual science labs for Chemistry, Physics, Biology, and Computer Science",
  "url": "https://www.openlabs.org.in",
  "logo": "https://www.openlabs.org.in/logo.png",
  "courses": [
    {
      "@type": "Course",
      "name": "Physics Labs",
      "description": "Interactive physics experiments and simulations"
    },
    {
      "@type": "Course", 
      "name": "Chemistry Labs",
      "description": "Interactive chemistry experiments and visualizations"
    }
    // ... additional courses
  ]
}
```

### Page Coverage 📑

**Complete Metadata Implementation:**
- ✅ **5 Category Pages** (Physics, Chemistry, Biology, Computer Science, Maths)
- ✅ **50+ Experiment Pages** (Individual labs with unique metadata)
- ✅ **20+ Subsection Pages** (Networking, DSA, Logic Gates, AI Problems, Sorting, etc.)
- ✅ **5 Authentication Pages** (Login, Signup, Password Reset, Email Verification, Forgot Password)
- ✅ **1 Root/Home Page** (Landing page with comprehensive metadata)

**Total Pages Optimized:** 74+ pages with complete SEO metadata

### Configuration & Setup

#### Step 1: Verify Domain Configuration

Ensure your domain is correctly set in all configuration files:

```typescript
// app/layout.tsx
const baseUrl = 'https://www.openlabs.org.in'
export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  // ...
}
```

**Current Domain:** `openlabs.org.in` ✅

#### Step 2: Add Verification Codes

Add your search engine verification codes to `app/layout.tsx`:

```typescript
// app/layout.tsx (approximately line 78)
export const metadata: Metadata = {
  verification: {
    google: 'YOUR_GOOGLE_VERIFICATION_CODE',
    yandex: 'YOUR_YANDEX_VERIFICATION_CODE',
    other: {
      bing: 'YOUR_BING_VERIFICATION_CODE',
    },
  },
  // ...
}
```

**How to Get Verification Codes:**

1. **Google Search Console:**
   - Visit [Google Search Console](https://search.google.com/search-console)
   - Add property for your domain
   - In "Getting started" → verify ownership via Meta tag
   - Copy the `content` value from `<meta name="google-site-verification" content="..." />`

2. **Bing Webmaster Tools:**
   - Visit [Bing Webmaster Tools](https://www.bing.com/webmasters/)
   - Add or verify site
   - Use Meta tag method
   - Copy `content` value from `<meta name="msvalidate.01" content="..." />`

3. **Yandex Webmaster:**
   - Visit [Yandex Webmaster](https://webmaster.yandex.com/)
   - Add site
   - Use "Meta tag" verification method
   - Copy the `content` value from `<meta name="yandex-verification" content="..." />`

#### Step 3: Create Production OG Images

Replace placeholder SVG images with high-quality JPG/PNG:

```bash
# Replace these files:
public/images/og-image.svg       → public/images/og-image.jpg (1200×630px)
public/images/twitter-image.svg  → public/images/twitter-image.jpg (1200×600px)
```

**Recommended Image Content:**
- OpenLabs logo/branding
- Subject icons (microscope, beaker, DNA, computer, math symbols)
- Clean, professional design
- Ensure text is legible at small sizes
- Use high-contrast colors for visibility

**Tools for Image Creation:**
- Canva (easiest, templates available)
- Figma (design-focused)
- Adobe Express
- Custom design or hire a designer

#### Step 4: Test & Validate

**Google Rich Results Test:**
1. Visit [Google Rich Results Test](https://search.google.com/test/rich-results)
2. Enter your domain: `https://www.openlabs.org.in`
3. Verify no errors in EducationalOrganization schema

**Facebook Share Debugger:**
1. Visit [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/sharing/)
2. Enter your URL
3. Verify Open Graph images display correctly

**Twitter Card Validator:**
1. Visit [Twitter Card Validator](https://cards-dev.twitter.com/validator)
2. Enter your URL
3. Preview Twitter Card formatting

**Bing Webmaster Tools:**
1. Visit [Bing Webmaster](https://www.bing.com/webmasters/)
2. Monitor indexing status
3. Check crawl errors

### Monitoring & Analytics

**Set Up Google Analytics:**
1. Create property in [Google Analytics 4](https://analytics.google.com/)
2. Copy Measurement ID
3. Add to `app/layout.tsx` (already integrated via `@vercel/speed-insights`)

**Search Console Monitoring:**
- Monitor impressions and click-through rates (CTR)
- Check coverage errors
- Review search queries driving traffic
- Monitor Core Web Vitals

**Track SEO Performance:**
- Monitor organic traffic growth
- Track keyword rankings
- Analyze user engagement metrics
- Monitor bounce rate and session duration

### Robots.txt & Crawling

**Current Configuration** (`app/robots.ts`):
```
Allow all paths except:
- /api/*            (API endpoints)
- /admin/*          (Admin routes)
- /private/*        (Private routes)
- /_next/*          (Next.js internals)
- /auth/*           (Auth pages from crawling)

Sitemap: /sitemap.xml
```

**Modification:**
Edit `app/robots.ts` to adjust crawling rules as needed.

### XML Sitemap

**Generated at:** `/sitemap.xml`

**Includes:**
- All major category pages
- Primary experiment pages
- Priority levels for search ranking hints
- Change frequency (daily for labs, weekly for categories)

**Manual Updates:**
Edit `app/sitemap.ts` to add/remove pages from sitemap.

### LLM/AI Indexing

**File:** `public/llms.txt`

Provides configuration for ChatGPT, Gemini, Claude, and other AI models to correctly index and understand your content.

**To Modify:**
Edit `public/llms.txt` to adjust AI indexing guidelines.

### SEO Best Practices Applied

- ✅ Keyword research in titles and descriptions
- ✅ Mobile-first responsive design
- ✅ Fast page load times (Core Web Vitals)
- ✅ Proper heading hierarchy (H1, H2, H3)
- ✅ Internal linking structure
- ✅ Alt text for images (to implement in components)
- ✅ Schema markup for rich snippets
- ✅ Unique content for each page
- ✅ Canonical URLs to prevent duplication
- ✅ XML sitemap and robots.txt

### Next Steps

1. ✅ **Add Verification Codes** (Follow Step 2 above)
2. ✅ **Create Production Images** (Follow Step 3 above)
3. ✅ **Deploy to Production** (See [Deployment](#deployment-) section)
4. ✅ **Submit Sitemap to Google** (Search Console → Sitemaps → Add)
5. ✅ **Monitor Performance** (Analytics & Search Console)
6. ✅ **Optimize for Rankings** (Monitor keywords, adjust content as needed)

---

## Screenshots & Media 🖼️

Add screenshots and media assets in `public/images/`:

```bash
public/
└── images/
    ├── elements/          # Periodic table element visuals
    ├── labs/              # Lab screenshots
    └── tutorials/         # Tutorial images
```

To reference in documentation:

```markdown
![Experiment Name](public/images/labs/experiment.jpg)
```

---

## OpenLabsAI Chat Assistant 🤖

OpenLabsAI is a context-aware AI assistant integrated across all platform labs, powered by OpenAI's language models.

### Features

**Smart Context Awareness:**
- Automatically tracks current lab and experiment state
- Provides relevant explanations for active labs
- Remembers experiment data in `experimentDataState`
- Resets context when navigating between pages

**Multi-Modal Input:**
- Text input for queries
- Speech recognition support (Web Speech API)
- Microphone control for hands-free interaction

**Rich Response Formatting:**
- GitHub-flavored Markdown rendering
- Code block syntax highlighting
- Tables and formatted lists
- Real-time typing animation

**User Experience:**
- Floating chat widget on all pages
- Smooth animations with Framer Motion
- Auto-scroll to latest messages
- Keyboard shortcut support (focus with Enter)

### Configuration

Create `.env.local` with:
```env
# OpenAI Configuration
OPENAI_API_KEY=sk-your-api-key-here
```

### API Endpoints Used
- `POST /api/chat` — Send message to AI assistant
- `POST /api/agent` — Route complex queries to external agent service

### Component Architecture

**ChatContext** (`app/components/ChatContext.tsx`):
- Global state management for chat
- Tracks experiment metadata (title, theory, context)
- Path-based context reset
- Provider wraps entire application

**OpenLabsAI** (`app/components/OpenLabsAI.tsx`):
- Main chat interface component
- 560-line interactive UI
- Speech recognition handling
- Message streaming and formatting

### Browser Compatibility
- Chrome 25+ (Speech Recognition)
- Firefox 25+ (Speech Recognition)
- Safari 14.1+ (Speech Recognition)
- Edge 79+ (Speech Recognition)
- Graceful degradation for unsupported browsers

---

## Future Roadmap 💡

### High Priority
- [ ] Automated testing suite (Jest + React Testing Library)
- [ ] Accessibility audit and WCAG 2.1 compliance improvements
- [ ] User progress tracking and learning statistics
- [ ] Student certificates and achievement system
- [ ] Voice synthesis for AI responses (text-to-speech)

### Medium Priority
- [ ] OAuth2 integration (Google, GitHub single sign-in)
- [ ] User profile dashboard with customization
- [ ] Advanced physics labs (thermodynamics, quantum mechanics)
- [ ] Interactive quiz and assessment system
- [ ] Code lab templates and starter code
- [ ] Streaming AI responses for real-time chat
- [ ] AI-powered code review and suggestions

### Long-term Vision
- [ ] Internationalization (i18n) — Multi-language support
- [ ] Real-time collaborative labs (WebSockets)
- [ ] Discussion forums for peer learning
- [ ] Instructor dashboard for class management
- [ ] Mobile native app (React Native)
- [ ] AI-powered personalized learning paths
- [ ] Laboratory video demonstrations
- [ ] Advanced 3D simulations with physics engines
- [ ] Fine-tuned AI models for domain-specific expertise
- [ ] AI-generated lab reports and documentation

---

## License & Legal 📄

### License

This project is released under a **Proprietary License** — see the [LICENSE](LICENSE) file for full terms and conditions.

### Trademark & Brand Protection

**OpenLabs™** is a registered name and brand concept owned by **Rahul Rajput**.

The OpenLabs name, logo, visual identity, and branding are **protected intellectual property**. 

**Usage Restrictions:**
- ❌ Cannot be used in derivative projects without written permission
- ❌ Cannot be used for commercial purposes without explicit authorization
- ❌ Cannot be used in product names or marketing materials without consent

For licensing inquiries, please contact the maintainer.

---

## Contact & Support 📬

- **Maintainer:** [@rahulra3621](https://github.com/rahulra3621)
- **Issues & Bugs:** Open an issue on [GitHub](https://github.com/hackeryard/openlabs/issues)
- **Feature Requests:** Submit a discussion on [GitHub Discussions](https://github.com/hackeryard/openlabs/discussions)
- **Contributions:** See the [Contributing](#contributing-) section above

For direct inquiries about licensing or partnerships:
- GitHub: [@rahulra3621](https://github.com/rahulra3621)

---

## Changelog

### Version History

Detailed changes per release are tracked in [CHANGELOG.md](CHANGELOG.md) (if available) or in [GitHub Releases](https://github.com/hackeryard/openlabs/releases).

### Latest Updates

**Latest Updates (May 2026 - v4.0):**
- ✅ **Gamification & Rewards Engine** — Comprehensive interactive Daily Challenges, user Streak counting, Level Ups, and custom unlockable Achievements & Badges displayed on profile dashboards
- ✅ **XP Progression Integration** — Native hooks integrated directly inside 35+ labs triggering XP logs on completion and synchronizing Subject Mastery levels
- ✅ **Full-Stack Editorial Blog** — Blog manager panel CRUD (`/admin/blogs`), listing grid (`/blog`), dynamic cover photos, and custom SEO FAQ schema generation
- ✅ **Cloudinary Media Pipeline** — Stream-based cover image upload API automatically parsing buffers into WebP formatting and securely restricting uploads under 5MB
- ✅ **Fully Responsive Profile Dashboard** — Mobile-first redesigned custom setup panel featuring interactive avatar selectors, wrapped dynamic layout grids, and seamless text reflows
- ✅ **Polished Emoji-free Navigation** — Removed excessive graphic icons from headers and mobile lists for clean, sophisticated, typography-centric layouts

**v3.0 Release Features (Previous):**
- ✅ **OpenLabsAI Chat Assistant** — Context-aware AI chatbot integrated across all labs using OpenAI
- ✅ **Speech Recognition Support** — Voice input capability for chat interactions (Web Speech API)
- ✅ **8 New Computer Science Labs** — Data Analyzer, Data Science, AI Problem, Blockchain, Networking, Logic Gates, Git Simulator, and Java code lab
- ✅ **D3 & Graph Visualization** — Data visualization libraries for advanced analytics
- ✅ **Markdown Support** — Rich text rendering with GitHub-flavored Markdown in chat responses
- ✅ **AI Agent Integration** — External AI agent service routing for enhanced problem-solving
- ✅ **ChatContext System** — Context-aware state management tracking experiment data across routes
- ✅ **Performance Monitoring** — Vercel Speed Insights integration for analytics
- ✅ **Enhanced Accessibility** — @headlessui/react components for better WCAG compliance

**v2.5 Release Features (Previous):**
- ✅ **Subject-Specific Error Pages** — Custom error boundaries for Physics, Chemistry, Biology, and Computer Science labs with lab-themed branding
- ✅ **JavaScript Visual Debugger** — Step-through runtime visualizer with memory, stack, and async queue inspection
- ✅ **Enhanced Authentication** — Redirect-after-login functionality with `?next` query parameter support
- ✅ **Protected API Routes** — Automatic session validation with authentication checks on all project endpoints
- ✅ **Babel Integration** — JavaScript parsing and code transformation for debugger instrumentation

**Previous Release Features (v2.0-v2.4):**
- ✅ Professional 404, 500, and error boundary pages with consistent branding
- ✅ Fixed mobile navbar z-index issue (dropdown now stays above content)
- ✅ Added Computer Science to main navbar navigation
- ✅ Enhanced homepage with "Explore All Labs" discovery section
- ✅ Lab showcase grid organized by category with color-coded headers
- ✅ Quick links to 16+ labs from homepage

**Core Existing Features:**
- ✅ Complete authentication system with OTP email verification
- ✅ JWT token-based session management
- ✅ Project management for code labs
- ✅ Comprehensive physics, chemistry, biology, and computer science labs
- ✅ Responsive mobile-first design with Framer Motion animations

---

## Acknowledgments 🙏

OpenLabs is built with ❤️ using:
- [Next.js](https://nextjs.org/) community and documentation
- [React](https://react.dev/) ecosystem
- [Three.js](https://threejs.org/) for 3D graphics
- [Tailwind CSS](https://tailwindcss.com/) community
- All open-source dependencies listed in [package.json](package.json)

---

**Built for curious minds, by educators, for learning. 🎓**

*Last Updated: May 24, 2026 (v4.0)*
