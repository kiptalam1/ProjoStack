# ProjoStack

Multi-tenant web app with strict workspace isolation, role-based access control (RBAC), and audit logging.

**Links**  
- Live Demo: https://projostack.onrender.com  

---

Screenshots

| Dashboard | Settings | Tasks |
|----------|-------------|-----|
| ![](./apps/web/src/assets/dashboard.png) | ![](./apps/web/src/assets/settings.png) | ![](./apps/web/src/assets/tasks.png)

| Workspaces | Projects | All Tasks |
|----------|-------------|----------|
| ![](./apps/web/src/assets/workspaces.png) | ![](./apps/web/src/assets/projects.png) | ![](./apps/web/src/assets/alltasks.png)


| Invites |
|---------|
| ![](./apps/web/src/assets/invites.png) |

---

## Overview

ProjoStack is a production-oriented project management platform that enables users to:

- Create isolated workspaces
- Invite team members with role-based permissions
- Manage projects and tasks
- Track sensitive actions via audit logs

The system enforces **workspace isolation at the database level**, ensuring users cannot access data outside their authorized scope.

---

## Core Principles

- **Strict Isolation**: Every resource is scoped to a workspace
- **Server-Enforced RBAC**: Authorization is not delegated to the frontend
- **Auditability**: Sensitive operations are logged and traceable
- **Shared Contracts**: Frontend and backend share types to eliminate drift

---

## Tech Stack

### Frontend
```
- React 18
- TypeScript
- React Router
- TanStack Query
- Tailwind CSS
- shadcn/ui
- Axios
- Zod
```

### Backend
```
- Node.js
- Express
- TypeScript
- PostgreSQL
- Prisma ORM
- JWT (HTTP-only cookies)
- bcrypt
- Zod
```
### Infrastructure
```
- Monorepo (apps/ + packages/contracts)
- Render (deployment)
- Neon (PostgreSQL)
```

### Testing
```
- Jest
- Supertest
```

---

## Architecture

All requests operate under two constraints:
1. **Authenticated user context**
2. **Workspace scope**

If a resource does not belong to the workspace context, the server returns `403 Forbidden`.

---

## Role Model

| Role   | Permissions |
|--------|------------|
| Admin  | Manage members, invites, roles |
| Member | Create and manage projects/tasks |
| Viewer | Read-only access |

---

## Key Features

| Feature | Implementation |
|--------|----------------|
| Workspace Isolation | Middleware + Prisma queries scoped by `workspace_id` |
| RBAC | Enforced on all mutation endpoints |
| Invite Flow | Token hashing, expiry, `used_at` tracking |
| Audit Logging | Middleware + DB logging of sensitive actions |
| Rate Limiting | Applied to auth and invite endpoints |
| Pagination | `?page=1&limit=20&status=active` supported |

---

## Project Structure

```
ProjoStack/
├── apps/
│ ├── frontend/
│ │ └── src/
│ │ | ├── components/
| | | ├──api/
| | | ├──assets/
| | | ├──auth/
| | | ├──components/
| | | ├──features/
| | | ├──layouts/
| | | ├──lib/
| | | ├──App.tsx
| | | ├──index.css
| | | ├──main.tsx
│ │ | ├── pages/
│ │ | ├── hooks/
│ │ | ├── services/
│ │ | |── types/
│ └── server/
| |── tests/
| |── prisma/
│ ├── src/
│ │ ├── controllers/
│ │ ├── middlewares/
│ │ ├── routes/
│ │ └── utils/
| | ├── configs/
| | ├── lib
| | ├── app.ts
| | ├── index.ts
| | ├── 
│ └── prisma/
│ └── schema.prisma
├── packages/
│ └── contracts/
└── README.md
```

### Monorepo Rationale

Shared contracts (Zod schemas + TypeScript types) are used across frontend and backend to eliminate inconsistencies and reduce runtime errors.

---

## Getting Started

### Prerequisites
```
- Node.js 18+
- PostgreSQL (local or Neon)
```
---

### 1. Clone Repository

```bash
git clone https://github.com/kiptalam1/ProjoStack.git
cd ProjoStack
npm install
```
2. Environment Variables
```
Backend (apps/backend/.env)
PORT=5000
DATABASE_URL=postgresql://user:pass@localhost:5432/projostack
ACCESS_SECRET=your-secret
REFRESH_SECRET=your-secret
```
Frontend (apps/frontend/.env)
```
VITE_API_URL=http://localhost:5000/api
```

3. Database Setup
```
cd apps/backend
npx prisma generate
npx prisma migrate dev --name init
```

4. Run Application
```
npm run dev
Frontend: http://localhost:5173
Backend: http://localhost:5000
```

API Overview

All endpoints require authentication unless marked public.

#### Auth:
| Method | Endpoint |	Description |	Access |
|--------|----------|-------------|--------|
| POST |	/api/auth/register |	Register |	Public|
| POST |	/api/auth/login |	Login |	Public |
| POST |	/api/auth/logout |	Logout	 | Any |
| GET  |	/api/auth/me	 |Current user | Any |

---

#### Workspaces:
| Method |	Endpoint |	Description |	Access |
|--------|-----------|--------------|--------|
| GET  |	/api/workspaces	|List|	Any|
| POST |	/api/workspaces |	Create |	Any |
| GET  |	/api/workspaces/:id |	Get |	Member |
| PUT  | /api/workspaces/:id |	Update |	Admin |
| DELETE |	/api/workspaces/:id |	Delete |	Admin |

---

#### Members:
| Method |	Endpoint |	Description |	Access |
|--------|-----------|--------------|--------|
| GET |	/api/workspaces/:id/members |	List	| Member |
| PUT |	/api/workspaces/:id/members/:userId	| Update | role |	Admin |
| DELETE |	/api/workspaces/:id/members/:userId |	Remove |	Admin |

---

#### Invites:
| Method |	Endpoint |	Description |	Access |
|--------|-----------|--------------|--------|
| POST	 |/api/workspaces/:id/invites |	Send invite |	Admin |
| GET |	/api/invites |	List |	Any |
| POST |	/api/invites/:token/accept |	Accept |	Public |

---

#### Projects & Tasks:

| Method | Endpoint | Description | Access |
|--------|----------|------------|--------|
| GET | /api/workspaces/:id/projects | List projects | Member |
| POST | /api/workspaces/:id/projects | Create project | Member |
| GET | /api/projects/:id/tasks | List tasks | Member |
| POST | /api/projects/:id/tasks | Create task | Member |
| PUT | /api/tasks/:id | Update task | Member |
| DELETE | /api/tasks/:id | Delete task | Member |

---

#### Audit Logs:

| Method | Endpoint | Description | Access |
|--------|----------|------------|--------|
| GET | /api/workspaces/:id/audit-logs | View logs | Admin |


All entities are scoped to a workspace.

#### Key Constraints
Unique (workspace_id, user_id) in workspace_members
Invite tokens stored as token_hash
audit_logs.meta_json for flexible metadata

Full schema: apps/server/prisma/schema.prisma

#### Testing
```
cd apps/backend
npm run test
```

#### Coverage
Authentication boundaries (401 enforcement)
Workspace isolation (cross-tenant access blocked)
RBAC enforcement
Invite lifecycle (accept, expiry, invalid cases)

Deployment
` Backend (Render) `

Build:
```
cd apps/backend && npm install && npx prisma generate && npx prisma migrate deploy
```

Start:
```
cd apps/backend && npm start
Frontend (Render)
```
Build:
```
cd apps/frontend && npm install && npm run build
```

Publish directory:
```
apps/frontend/dist
Database (Neon)
Create project
Set DATABASE_URL in environment variables
```


## Contact

Adams Kiptalam

- Email: [adamskiptalam0@gmail.com](mailto:adamskiptalam0@gmail.com)
- LinkedIn: [linkedin.com/in/your-profile](https://www.linkedin.com/in/adams-kiptalam)

---

Project: https://github.com/kiptalam1/ProjoStack

Live: https://projostack.onrender.com

License
```No license. Intended for learning and experimentation.```
