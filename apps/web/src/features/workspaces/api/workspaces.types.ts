export type MemberTypes = {
  id: string;
  userId: string;
  workspaceId: string;
  memberRole: "ADMIN" | "OWNER" | "MEMBER";
  status: "COMPLETE" | "STARTED" | "PENDING";
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
