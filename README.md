ProjoStack

Multi-tenant SaaS backend with strict workspace isolation, RBAC, and audit logging.

Live Demo | API Docs | Database Schema
What is this?

ProjoStack is a production-oriented project management platform where users can create isolated workspaces, invite team members with role-based permissions, and manage projects/tasks with full audit trails.

I built this to solve a real problem: most team tools either lack proper access control or make it an afterthought. Here, workspace isolation is enforced at the database level—you literally cannot see data from workspaces you don't belong to.

Live demo is up and running. Register an account, create a workspace, invite someone (or just test with multiple browser tabs), and see how roles actually restrict what users can do.
Tech Stack

Frontend
React 18, TypeScript, React Router, TanStack Query, Tailwind CSS, shadcn/ui, Axios, Zod

Backend
Node.js, Express, TypeScript, PostgreSQL, Prisma ORM, JWT (HTTP-only cookies), bcrypt, Zod

Infrastructure
Monorepo structure (apps/ + packages/contracts), Render (static site + web service), Neon (PostgreSQL)

Testing
Jest, Supertest — focused on auth boundaries and authorization logic
How It Works

The core constraint is simple but strict: every request carries a user ID and a workspace context. The server checks that the resource being accessed belongs to that workspace. If it doesn't, you get a 403. No exceptions.

Role hierarchy:

    Admin — can manage members, send invites, change roles

    Member — can create/edit projects and tasks

    Viewer — read-only access

Audit logging tracks sensitive actions: member removals, role changes, and deletions. Admins can view these logs.

Invites use expiring tokens (hashed in the database, never stored raw) and expire after 7 days.
Project Structure
text

ProjoStack/
├── apps/
│   ├── frontend/          # React + Vite
│   │   ├── src/
│   │   │   ├── components/
│   │   │   ├── pages/
│   │   │   ├── hooks/
│   │   │   ├── services/  # API client with react-query
│   │   │   └── types/
│   │   └── package.json
│   └── backend/           # Express + Prisma
│       ├── src/
│       │   ├── controllers/
│       │   ├── middlewares/  # auth, RBAC, workspace isolation
│       │   ├── routes/
│       │   ├── services/
│       │   └── utils/
│       ├── prisma/
│       │   └── schema.prisma
│       └── package.json
├── packages/
│   └── contracts/         # Shared TypeScript types (frontend + backend)
└── README.md

Why monorepo? Because sharing types between frontend and backend eliminates a whole class of bugs. The contract package exports Zod schemas and TypeScript types that both sides use.
Key Features
Feature	Implementation
Workspace isolation	Middleware + Prisma queries always scope by workspace_id
RBAC	Role checks on every mutation endpoint; frontend conditionally renders UI
Invite flow	Token hashing, expiry, used_at tracking — no stale invites
Audit logging	Database trigger + middleware logs member changes, deletions, role updates
Rate limiting	Applied to auth and invite endpoints to prevent abuse
Pagination/filtering	All list endpoints support ?page=1&limit=20&status=active
Getting Started
Prerequisites

    Node.js 18+

    PostgreSQL (local or Neon)

    (Optional) SMTP for email invites — falls back to console in dev

1. Clone and install
bash

git clone https://github.com/kiptalam1/ProjoStack.git
cd ProjoStack
npm install  # installs all dependencies for frontend, backend, and contracts

2. Set up environment variables

Backend — apps/backend/.env:
env

PORT=5000
DATABASE_URL="postgresql://user:pass@localhost:5432/projostack"
JWT_SECRET="your-secret"
JWT_EXPIRES_IN="7d"
CLIENT_URL="http://localhost:5173"
EMAIL_FROM="noreply@projostack.com"
# SMTP config optional — if not set, logs invite links to console

Frontend — apps/frontend/.env:
env

VITE_API_URL="http://localhost:5000/api"

3. Set up the database
bash

cd apps/backend
npx prisma generate
npx prisma migrate dev --name init

4. Run both apps

From the project root:
bash

npm run dev  # runs frontend (port 5173) + backend (port 5000) concurrently

Frontend: http://localhost:5173
Backend: http://localhost:5000
API Endpoints

All endpoints require authentication unless marked public.
Method	Endpoint	Description	Role Required
Auth			
POST	/api/auth/register	Register new user	Public
POST	/api/auth/login	Login	Public
POST	/api/auth/logout	Logout	Any
GET	/api/auth/me	Current user	Any
Workspaces			
GET	/api/workspaces	List user's workspaces	Any
POST	/api/workspaces	Create workspace	Any
GET	/api/workspaces/:id	Get workspace	Must be member
PUT	/api/workspaces/:id	Update	Admin
DELETE	/api/workspaces/:id	Delete	Admin
Members			
GET	/api/workspaces/:id/members	List members	Member
PUT	/api/workspaces/:id/members/:userId	Update role	Admin
DELETE	/api/workspaces/:id/members/:userId	Remove member	Admin
Invites			
POST	/api/workspaces/:id/invites	Send invite	Admin
GET	/api/invites	List pending invites	Any
POST	/api/invites/:token/accept	Accept invite	Public
Projects & Tasks			
GET	/api/workspaces/:id/projects	List projects	Member
POST	/api/workspaces/:id/projects	Create project	Member
GET	/api/projects/:id/tasks	List tasks	Member
POST	/api/projects/:id/tasks	Create task	Member
PUT	/api/tasks/:id	Update task	Member
DELETE	/api/tasks/:id	Delete task	Member
Audit			
GET	/api/workspaces/:id/audit-logs	View audit logs	Admin
Database Schema

The schema is designed around workspace isolation. Every resource (projects, tasks, memberships, invites, audit logs) belongs to a workspace.
text

users
  └── workspace_members (junction with roles)
        └── workspaces
              ├── projects
              │    └── tasks
              ├── invites
              └── audit_logs

Key constraints:

    workspace_members has a unique constraint on (workspace_id, user_id)

    invites stores token_hash instead of raw tokens

    audit_logs stores meta_json for flexible context

Full Prisma schema is in apps/backend/prisma/schema.prisma.
Testing
bash

cd apps/backend
npm run test

Tests cover:

    Auth boundaries (unauthenticated requests get 401)

    Workspace isolation (user A cannot access user B's workspace)

    RBAC (members can't perform admin actions)

    Invite flow (accept, reject, expiry)

Deployment
Backend (Render Web Service)

    Push to GitHub

    Create Web Service → connect repo

    Build command: cd apps/backend && npm install && npx prisma generate && npx prisma migrate deploy

    Start command: cd apps/backend && npm start

    Add env vars from .env

Frontend (Render Static Site)

    Create Static Site

    Build command: cd apps/frontend && npm install && npm run build

    Publish directory: apps/frontend/dist

    Add VITE_API_URL pointing to your backend URL

Database (Neon)

    Create a Neon project

    Copy connection string to DATABASE_URL in Render environment

Screenshots

(Add your screenshots here — I'll include them when you push)
Workspace Dashboard	Invite Modal
https://screenshots/dashboard.png	https://screenshots/invite.png
Task Management	Audit Logs (Admin view)
https://screenshots/tasks.png	https://screenshots/audit.png
What I'd Add Next

    File attachments — because tasks often need documents

    Real-time updates — WebSocket notifications for task assignments

    Soft deletes — currently hard deletes, but audit logs preserve history

Contact

Adams Kiptalam
LinkedIn · Email

Project: github.com/kiptalam1/ProjoStack
Live demo: projostack.onrender.com

Built as a demonstration of production-ready multi-tenancy. No license — use it, learn from it, break it.
