<div align="center">

# ⚡ Forge X — Frontend

**A project-first hiring ecosystem built for builders.**

*Build → Showcase → Improve → Apply → Get Hired*

[![Next.js](https://img.shields.io/badge/Next.js-16.2.9-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Firebase](https://img.shields.io/badge/Firebase-Auth%20%2B%20Firestore-orange?logo=firebase)](https://firebase.google.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-Private-red)](#)
[![Live Demo](https://img.shields.io/badge/Live%20Demo-forge--x.netlify.app-brightgreen?logo=netlify)](https://forge-x.netlify.app/)

**🌐 [https://forge-x.netlify.app/](https://forge-x.netlify.app/)**

</div>

---

## 🌐 Live Demo

> **Try it now:** [https://forge-x.netlify.app/](https://forge-x.netlify.app/)

The production frontend is deployed on **Netlify**. The AI backend is hosted on **Render.com** (free tier — may take ~50 seconds to wake up on first use).

---

## 📖 What Is Forge X?

Forge X is **not a traditional job board**. It is a hiring ecosystem that puts your **work front and center**.

Instead of asking "do you have the right keywords on your CV?", Forge X asks: **"What have you built?"**

- **Job seekers** build a living portfolio of projects, collect community recognition, and apply with proof of capability.
- **Recruiters** search candidates ranked by real project evidence, skill growth, and community contribution — not keyword stuffing.
- **AI agents** assist at every stage but require your explicit approval before taking any action on your behalf.

---

## ✨ Key Features

### 🧑‍💻 For Job Seekers

| Feature | Description |
|---|---|
| **Portfolio & Profile** | Rich profile with bio, skills, experience, education, and social links. Avatar stored on Cloudinary. |
| **Project Showcase** | Upload projects with title, description, tech stack, GitHub/demo links, screenshots, and status. |
| **Job Opportunities** | Browse company vacancies with required skills, deadlines, and application slot limits. |
| **Application Tracker** | Transparent, timestamped status pipeline: Applied → Viewed → Under Review → Shortlisted → Interview → Offer. |
| **Communities** | Join hubs for Students, Employees, and Recruiters. Post updates, attach projects, react, and comment in realtime. |
| **Messages** | Direct messaging with connections and recruiters. |
| **Connections** | Build your professional network within the platform. |
| **Portfolio Page** | A shareable, public-facing portfolio generated from your Forge X profile. |
| **AI Career Assistant** | A five-agent AI that analyzes your profile, detects skill gaps, and recommends projects — all with human approval. |

### 🏢 For Recruiters / Admins

| Feature | Description |
|---|---|
| **Candidate Search** | Search and rank candidates by project quality, skills, and community activity. |
| **Company Dashboard** | Manage job postings, applications, and applicant statuses. |
| **Role-Gated Access** | Recruiter and Admin features are locked behind Firestore role checks. |

---

## 🤖 The Five-Agent AI System

The AI assistant uses a sequential, human-approved agent pipeline:

```
1. Context Agent      → Gathers your profile, skills, projects, and preferences
2. Observation Agent  → Researches companies, communities, and market opportunities
3. Planning Agent     → Creates tailored application and improvement strategies
4. Reasoning Agent    → Evaluates skill gaps, match quality, potential, and risks
5. Execution Agent    → Prepares applications and generates documents
```

> **Important:** Every execution action requires your explicit approval. Forge X **never** auto-applies, auto-submits, or acts on your behalf without confirmation.

All AI calls are routed through the FastAPI backend. The frontend never calls Gemini directly.

---

## 🏗️ Architecture Overview

```
Browser
  ├── Public pages        /  and  /sign-in
  ├── Firebase Auth       Google · GitHub · Email/Password
  ├── AuthGuard           Protects all /workspace/* routes
  ├── Zustand State       authStore · sidebarStore · agentStore · uiStore
  ├── Workspace Shell     Sidebar + Topbar + Cold-Start Banner
  ├── Protected Pages     /workspace/*
  └── FastAPI Backend     Authenticated with Firebase Bearer token
        ├── Firestore     User data, projects, communities, applications
        ├── Cloudinary    Profile pictures and project media
        └── Gemini 2.5    AI agent reasoning (server-side only)
```

### Cold-Start Awareness

The backend runs on Render.com's free tier and may sleep after inactivity. When this happens, the UI shows a graceful banner:

> *"Waking up Forge AI… this may take up to 50 seconds."*

A linear progress bar fills over 50 seconds and auto-dismisses once the backend health check responds.

---

## 🗂️ Page Routes

| Route | Page |
|---|---|
| `/` | Landing page |
| `/sign-in` | Authentication (Google, GitHub, Email) |
| `/workspace/profile` | Your profile and editor |
| `/workspace/projects` | Project showcase and CRUD |
| `/workspace/jobs` | Browse job opportunities |
| `/workspace/applications` | Track your applications |
| `/workspace/communities` | Community hubs |
| `/workspace/messages` | Direct messages |
| `/workspace/connections` | Your network |
| `/workspace/portfolio` | Public shareable portfolio |
| `/workspace/ai-agents` | AI Career Assistant |
| `/workspace/settings` | Account settings |
| `/workspace/upgrade` | Upgrade plan |
| `/admin/*` | Admin dashboard (role-gated) |

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 16.2.9](https://nextjs.org/) (App Router) |
| Language | [TypeScript 5](https://www.typescriptlang.org/) |
| Styling | [Tailwind CSS 4](https://tailwindcss.com/) |
| State Management | [Zustand 5](https://zustand-demo.pmnd.rs/) |
| Authentication | [Firebase Auth](https://firebase.google.com/products/auth) |
| Database | [Cloud Firestore](https://firebase.google.com/products/firestore) |
| Media Storage | [Cloudinary](https://cloudinary.com/) |
| Animations | [Framer Motion](https://www.framer.com/motion/), [GSAP](https://gsap.com/), [Lenis](https://lenis.darkroom.engineering/) |
| Charts | [Recharts](https://recharts.org/) |
| Icons | [Lucide React](https://lucide.dev/), [React Icons](https://react-icons.github.io/react-icons/) |
| Backend | [FastAPI](https://fastapi.tiangolo.com/) on Render.com |
| AI Model | Gemini 2.5 Flash (server-side only) |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v20 or later
- **npm** v10 or later
- A **Firebase** project with Authentication and Firestore enabled
- A **Cloudinary** account (free tier is fine)
- The **Forge X backend** running locally or deployed ([see backend repo](../jobseeker_backend/))

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd jobseeker_frontend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Copy the example file and fill in your values:

```bash
cp .env.example .env
```

Open `.env` and set each variable:

```env
# Firebase — from your Firebase project settings
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef

# Backend API URL
NEXT_BACK_API_URL=http://localhost:8000

# Cloudinary — for profile picture and media uploads
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your-unsigned-upload-preset
```

> **Where to find these values:**
> - **Firebase**: Go to [Firebase Console](https://console.firebase.google.com/) → Your Project → Project Settings → General → Your Apps.
> - **Cloudinary**: Go to [Cloudinary Console](https://cloudinary.com/console) → Dashboard for cloud name; Settings → Upload for unsigned preset.

### 4. Set Up Firebase

In your Firebase project:

1. **Enable Authentication** → Sign-in Methods → Enable Google, GitHub, and Email/Password.
2. **Enable Firestore** → Create a database in production mode.
3. **Deploy Firestore Security Rules** (included in this repo):
   ```bash
   firebase deploy --only firestore:rules
   ```

### 5. Start the Development Server

```bash
npm run dev
```

The app will be available at **http://localhost:3000**.

> Make sure the backend is also running. See the [backend README](../jobseeker_backend/README.md) for instructions.

---

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx            # Landing page
│   ├── layout.tsx          # Root layout
│   ├── globals.css         # Global styles and Tailwind base
│   ├── sign-in/            # Authentication page
│   ├── workspace/          # Protected workspace shell and all workspace pages
│   │   ├── layout.tsx      # Workspace shell: sidebar, topbar, cold-start banner
│   │   ├── profile/
│   │   ├── projects/
│   │   ├── jobs/
│   │   ├── applications/
│   │   ├── communities/
│   │   ├── messages/
│   │   ├── connections/
│   │   ├── portfolio/
│   │   ├── ai-agents/
│   │   ├── settings/
│   │   └── upgrade/
│   └── admin/              # Admin dashboard (role-gated)
│
├── components/             # Reusable UI components
│   ├── auth/               # Sign-in card and auth guards
│   ├── landing/            # Landing page sections
│   ├── layout/             # Sidebar, topbar, navigation
│   ├── profile/            # Profile editor and display components
│   ├── projects/           # Project cards, modals, and forms
│   ├── communities/        # Community hub components
│   └── ui/                 # Shared primitive components (buttons, modals, etc.)
│
├── hooks/                  # Custom React hooks
├── lib/
│   └── firebase.ts         # Firebase client initialization
├── store/                  # Zustand state stores
│   ├── useProjectStore.ts
│   └── ...                 # authStore, sidebarStore, agentStore, uiStore
└── data/                   # Static data and constants
```

---

## 🔑 Environment & Security Rules

- Firebase ID tokens are **never stored in `localStorage`**. They are fetched fresh from `auth.currentUser.getIdToken()` for every request.
- All AI requests route through the FastAPI backend. The browser never calls Gemini directly.
- Firestore security rules (`firestore.rules`) enforce per-user read/write access and role-based gating.
- Backend errors surface only the human-readable `detail` field to the user. Stack traces are never shown.

---

## 📜 Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the development server (hot reload) |
| `npm run build` | Build the production bundle |
| `npm run start` | Serve the production build locally |
| `npm run lint` | Run ESLint across the project |

---

## 🗺️ Roadmap

- [x] **Phase 1** — Authentication, profiles, projects, communities, document generator
- [x] **Phase 2** — Company dashboard, job listings, application tracking with status pipeline
- [x] **Phase 3** — AI Career Assistant (skill gap analysis, project recommendations)
- [ ] **Phase 4** — Full five-agent pipeline with streaming responses and approval cards
- [ ] **Phase 5** — User-controlled AI memory (Markdown-based, inspectable and editable)
- [ ] **Phase 6** — Recruiter AI for candidate search and portfolio analysis

---

## 🤝 Contributing

This is a capstone / private project. If you have been granted access:

1. Read `AGENTS.md` before making any changes.
2. Read the relevant Next.js docs in `node_modules/next/dist/docs/` before writing code — this version has breaking changes from older releases.
3. Do not rewrite the visual design; extend existing components.
4. Keep changes scoped and PR-focused.
5. Run `npm run build` and lint before opening a PR.

---

## 📄 Related

- **Backend Repository**: `../jobseeker_backend/` — FastAPI backend with Firebase auth, Gemini AI agents, and Firestore integration.
- **Firestore Rules**: `firestore.rules` — Security rules deployed to Firebase.
- **Firebase Config**: `firebase.json` — Firebase project configuration.

---

<div align="center">
  <sub>Built with ❤️ for the Kaggle AI Agents Intensive Capstone · Forge X &copy; 2026</sub>
</div>
