# Forge X Frontend Memory

This file is the working frontend memory for Forge X. It records the product vision, current repo reality, architecture rules, and implementation plan for turning the existing high-fidelity UI into a realtime working application without breaking the current interface.

## Product Vision

Forge X is a project-first hiring ecosystem.

Core loop:

```text
Build -> Showcase -> Improve -> Apply -> Get Hired
```

The platform prioritizes proof of work, projects, skill growth, transparent hiring, and explicit human approval over automated mass applications.

Forge X is not a traditional job board. Projects, portfolio evidence, community participation, and growth trajectory are the primary signals.

## Current Repo Reality

- Framework: Next.js `16.2.9` with App Router.
- Important rule: this is not the familiar Next.js version. Before writing code, read the relevant guide in `node_modules/next/dist/docs/`.
- Styling: Tailwind CSS with the existing dark Forge X visual system.
- State: Zustand is installed and currently used by `src/store/useProjectStore.ts`.
- Auth: Firebase client setup exists in `src/lib/firebase.ts`.
- Current auth page: `src/app/sign-in/page.tsx` renders `src/components/auth/AuthCard.tsx`.
- Current protected shell: `/workspace/*`, implemented by `src/app/workspace/layout.tsx`.
- Current workspace routes:
  - `/workspace/profile`
  - `/workspace/projects`
  - `/workspace/skills`
  - `/workspace/applications`
  - `/workspace/messages`
  - `/workspace/saved`
  - `/workspace/ai-agents`
  - `/workspace/jobs`
  - `/workspace/companies`
  - `/workspace/communities`
  - `/workspace/settings`
  - `/workspace/upgrade`
- Current admin routes live under `/admin/*`.
- The UI is already designed. Do not rewrite the UI. Wire real data and behavior into existing pages incrementally.

## Roadmap Memory

### Phase 1 - Foundation MVP

- Authentication: one user equals one profile.
- Profiles: projects, skills, experience, education, social links.
- Projects: upload projects, GitHub links, live demos, tech stacks, media.
- Communities: hubs for students, employees, recruiters.
- Generator: resumes, CVs, and portfolios with future Canva/Picsart support.

### Phase 2 - Hiring Ecosystem

- Company dashboard with vacancies, required skills, deadlines, and application limits.
- Application controls with limits, cooldowns, and transparent status tracking.
- Status flow: Applied -> Viewed -> Under Review -> Shortlisted -> Interview -> Offer.
- Project-based applications are the main proof of capability.

### Phase 3 - AI Career Assistant

- Analyze profile, skills, projects, and community activity.
- Detect skill gaps clearly.
- Evaluate potential and growth trajectory.
- Recommend projects and learning paths instead of flat rejection.

### Phase 4 - Five-Agent Architecture

1. Context Agent: collects user profile, skills, projects, preferences.
2. Observation Agent: researches companies, communities, market opportunities.
3. Planning Agent: creates application and improvement strategies.
4. Reasoning Agent: evaluates skill gaps, match quality, potential, and risks.
5. Execution Agent: prepares applications and generates documents.

Rule: every action requires human approval. The product must never autonomously mass-apply, spam, or submit on behalf of users without confirmation.

### Phase 5 - Memory and Privacy

- User-controlled memory is stored as Markdown text.
- Memory can include skills, goals, preferences, work history, and agent reasoning logs.
- Users must be able to inspect and control what is shared.

### Phase 6 - Company Intelligence

- Recruiter AI helps search candidates and analyze portfolios.
- Candidate ranking is based on projects, skills, and community contribution, not keyword stuffing.

## Target Free-Tier Stack

- Frontend: Next.js App Router, Tailwind CSS, Zustand.
- Hosting: Vercel or Netlify free tier.
- Auth: Firebase Authentication with Google, GitHub, and email/password.
- Database: Firebase Cloud Firestore.
- Image storage: Cloudinary free tier.
- Backend: FastAPI on Render.com free tier.
- AI model: Gemini 2.5 Flash.
- Agent orchestration: Google ADK, LangChain, or Pydantic-AI.

## Route Strategy

The master prompt mentions `/dashboard`, `/profile`, `/projects`, `/opportunities`, `/applications`, `/ai-assistant`, `/communities`, and `/recruiter`.

This repo already uses `/workspace/*`. Keep that route shell to avoid breaking the current UI.

Route mapping:

```text
Master prompt route        Current repo route
/dashboard                 /workspace/profile or future /workspace overview
/profile                   /workspace/profile
/projects                  /workspace/projects
/opportunities             /workspace/jobs
/applications              /workspace/applications
/ai-assistant              /workspace/ai-agents
/communities               /workspace/communities
/recruiter                 future /workspace/recruiter or /admin/recruiter
```

Only add aliases or redirects later if product polish requires them. Do not migrate routes before core realtime functionality works.

## Realtime Frontend Architecture

Browser flow:

```text
Browser
  -> Public pages: /, /sign-in
  -> Firebase Auth: Google, GitHub, email/password
  -> AuthGuard for /workspace/*
  -> Zustand global state
  -> Workspace shell: sidebar + topbar + cold-start banner
  -> Protected pages
  -> FastAPI backend with Firebase Bearer token
  -> Firestore, Cloudinary, Gemini 2.5 Flash
```

Required Zustand slices:

```ts
authStore: {
  user: FirebaseUser | null;
  token: string | null;
  isLoading: boolean;
}

sidebarStore: {
  isOpen: boolean;
  isCollapsed: boolean;
  activeRoute: string;
}

agentStore: {
  isRunning: boolean;
  activeAgent: "context" | "observation" | "planning" | "reasoning" | "execution" | null;
  pendingApproval: boolean;
  approvalPayload: unknown | null;
}

uiStore: {
  backendAwake: boolean;
  coldStartVisible: boolean;
}
```

Existing `useProjectStore` can stay during migration. Do not restructure it until all consumers are checked.

## API Rules

Environment variables:

```text
NEXT_PUBLIC_API_URL
NEXT_PUBLIC_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID
```

Every backend request must include the Firebase ID token:

```ts
const token = await auth.currentUser?.getIdToken();

const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/endpoint`, {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});
```

Never store the Firebase ID token in `localStorage`.

All AI requests go through FastAPI. The frontend must never call Gemini directly.

Backend error schema:

```json
{
  "status": "error",
  "code": 500,
  "detail": "Human readable error",
  "request_id": "uuid",
  "timestamp": "iso timestamp"
}
```

Frontend behavior:

- Show `detail` to the user.
- Log `request_id` and `timestamp` for debugging.
- Never show stack traces.
- Never show `request_id` as user-facing text.

## Cold Start UX

Render.com free tier can sleep after inactivity.

Frontend behavior:

- Poll `${NEXT_PUBLIC_API_URL}/api/health` on app mount or workspace mount.
- If there is no healthy response after 5 seconds, show a graceful loading state:

```text
Waking up Forge AI... this may take up to 50 seconds.
```

- Use a linear progress indicator that fills over 50 seconds.
- Auto-dismiss when health check returns 200.
- Do not block the entire UI unless the user is actively waiting for an AI/backend action.

## Page Implementation Plan

### Authentication

Goal: reliable Firebase auth without changing the visual design.

- Keep the existing sign-in UI.
- Support Google, GitHub, and email/password.
- Create new users with email/password from the login page or a future `/sign-up` alias.
- Redirect successful auth into `/workspace/profile` or `/workspace`.
- Protect `/workspace/*` with the existing `AuthGuard` pattern.
- Later, store role/profile metadata in Firestore under `users/{uid}`.

### Workspace Shell

Goal: keep the current sidebar/topbar UI while making it state-driven.

- Move sidebar open/collapse/active route into Zustand.
- Add auth-aware user display from Firebase.
- Add cold-start banner near the top of the workspace shell.
- Keep current visual classes unless a layout bug requires a small scoped fix.

### Profile

Goal: Firestore-backed profile editor.

- Read and write `users/{uid}`.
- Include name, avatar, bio, location, social links, skills, education, experience, and AI skill score.
- Use Cloudinary for avatar/project media uploads.
- Use optimistic updates only when rollback behavior is defined.

### Projects

Goal: real project CRUD without losing current project UI.

- Store projects in Firestore `projects`.
- Each project belongs to a user by `ownerUid`.
- Include title, tagline, description, tech stack, links, media URLs, status, featured flag, timestamps.
- Replace mock projects gradually with fetched data.
- Keep the current modal/card/drawer interaction model.

### Opportunities and Applications

Goal: transparent hiring workflow.

- Map `/workspace/jobs` to opportunities.
- Map `/workspace/applications` to user application tracking.
- Statuses must stay visible and timestamped.
- Users cannot secretly move recruiter-owned statuses.
- Applications attach relevant projects and generated documents.

### AI Assistant

Goal: human-approved five-agent flow.

- Use `/workspace/ai-agents` as the AI assistant route.
- Send authenticated requests to FastAPI.
- Show active agent state.
- Show streamed or incremental responses if backend supports it.
- Show approval cards before any execution action.
- Display editable Markdown memory files from backend/Firestore.
- No auto-apply, no auto-submit, no hidden execution.

### Communities

Goal: Firestore-backed hubs.

- Support Students, Employees, and Recruiters.
- Store membership, posts, comments, and reactions in Firestore.
- Allow project attachment to posts.
- Keep future moderation/admin hooks in mind.

### Recruiter and Admin

Goal: role-gated recruiter intelligence.

- Use Firestore `users/{uid}.role`.
- Gate recruiter/admin pages.
- Recruiter search ranks by projects, skill evidence, and community contribution.
- Do not rank candidates only by keyword matches.

## Firestore Shape

Collections:

```text
users
  {uid}
    achievements
    experience

projects
  {projectId}

opportunities
  {opportunityId}
    applications

applications
  {applicationId}

messages
  {messageId}

communities
  {communityId}
    members
    posts

ai_memory
  {memoryId}
```

Markdown memory can be stored as string fields for speed.

Cost rule: the backend orchestrator should fetch data once, run the agent loop in memory, and write once at the end.

## Backend Contract Memory

Backend rules that affect frontend integration:

- Backend uses Python 3.12.
- Run backend with `python3 -m uvicorn main:app`.
- Run backend tests with `python3 -m pytest`.
- Use Gemini `gemini-2.5-flash`.
- Never use `gemini-1.5-pro`.
- `load_dotenv()` must be at the absolute top of backend `main.py`.
- All backend errors use the standard error schema.
- Every log line includes `request_id`.
- Rate limiting uses `slowapi`.
- Rate limit key is Firebase UID, never IP address.
- Sanitize scraped HTML with `bleach.clean()` before Gemini prompts.
- Never expose stack traces to the frontend.

## Development Rules

- Read `AGENTS.md` before working.
- Read the relevant Next.js docs under `node_modules/next/dist/docs/` before writing code.
- Prefer extending existing components over replacing them.
- Keep changes scoped.
- Do not rewrite the visual design.
- Use Lucide icons where possible.
- Keep dark mode as the primary design.
- Do not call Gemini from the frontend.
- Do not hardcode API URLs.
- Do not store Firebase ID tokens in localStorage.
- Do not implement autonomous application submission.

## Verification Checklist

For every feature implementation:

```text
[ ] Existing UI remains visually intact.
[ ] Authenticated requests include Firebase Bearer token.
[ ] Loading and error states are visible.
[ ] Backend error detail is user-visible.
[ ] request_id and timestamp are logged only.
[ ] Protected pages redirect unauthenticated users.
[ ] Cold-start state works for backend calls.
[ ] No AI execution action happens without approval.
[ ] npm run build passes.
[ ] Focused lint passes for changed files.
```

## Implementation Priority

1. Finish Firebase auth and route protection.
2. Add shared API client with Bearer token.
3. Add global Zustand slices for auth, UI, sidebar, and agents.
4. Add backend health polling and cold-start banner.
5. Wire Firestore profile data.
6. Wire Firestore projects.
7. Wire opportunities and applications.
8. Connect AI assistant to FastAPI.
9. Add memory panel for Markdown files.
10. Add recruiter role gate and recruiter dashboard behavior.

