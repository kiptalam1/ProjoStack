export type TaskTypes = {
  id: string;
  title: string;
  status: "PENDING" | "COMPLETE" | "STARTED";
  projectId: string;
  workspaceId: string;
  createdById: string;
  createdBy: {
    username: string;
  };
  createdAt: string;
};
