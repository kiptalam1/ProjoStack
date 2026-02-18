# ProjoStack
 ProjoStack is a production-oriented multi-tenant SaaS backend that demonstrates strict workspace isolation, role-based access control (RBAC), secure authentication, and audit logging.

### Multi-Tenant SaaS with Role Isolation
Tenant isolation is enforced server-side.

RBAC is enforced server-side.

Auditability exists for sensitive actions.

Deployed, stable, documented.


#### MVP scope:

Auth (email/password)

Workspaces: create + switch current workspace

Membership: invite user by email (invite link/token), accept invite

Roles: Admin can change roles, remove member

One resource module: Projects + Tasks (basic CRUD)

Audit log (Admin-only): member changes + deletes + role changes

Out of scope (for now):

Payments, subscriptions

Complex permissions, multiple roles per resource

Real-time presence, chat

File uploads

#### Core features

Multi-tenancy (workspace isolation)

RBAC (Admin/Member/Viewer)

Invite flow with expiring token

Audit logging for sensitive actions

Pagination + filtering on list endpoints

Rate limiting on auth/invite endpoints

Testing around auth + authorization boundaries

#### Data flow

User authenticates → gets tokens

User selects workspace (current_workspace context)

Every request carries: token → user_id → workspace_id context

Server enforces: resource.workspace_id must match current workspace

Admin actions create audit log entries

#### Database schema (minimum)

users(id, email, password_hash, created_at)

workspaces(id, name, created_by, created_at)

workspace_members(id, workspace_id, user_id, role, created_at, unique(workspace_id,user_id))

invites(id, workspace_id, email, role, token_hash, expires_at, used_at, created_at)

projects(id, workspace_id, name, created_by, created_at)

tasks(id, workspace_id, project_id, title, status, created_by, created_at)

audit_logs(id, workspace_id, actor_user_id, action, target_type, target_id, meta_json, created_at)


6) Risks/unknowns to tackle first

Tenant isolation strategy: middleware + query scoping (must be correct everywhere)

Role enforcement: consistent RBAC checks

Token security: refresh rotation and logout behavior

Invite token storage: store hash, not raw token

Tackle these before UI polish.
