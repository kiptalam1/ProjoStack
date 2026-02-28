export type MemberTypes = {
  id: string;
  userId: string;
  workspaceId: string;
  memberRole: "ADMIN" | "OWNER" | "MEMBER";
  status: "ACTIVE" | "INVITED" | "SUSPENDED" | "REMOVED";
  invitedById: string;
  joinedAt: string;
};

export type WorkspacesTypes = {
  id: string;
  name: string;
  creatorId: string;
  createdAt: string;
  members: MemberTypes[];
};
