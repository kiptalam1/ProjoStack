export type InviteTypes = {
	id: string;
	email: string;
	workspaceId: string;
	createdAt: string;
	expiresAt: string;
	token: string;
	sentById: string;
	status: "PENDING" | "ACCEPTED" | "PENDING";
	workspace: {
		id: string;
		name: string;
	};
	sentBy: {
		id: string;
		email: string;
		username: string;
	};
};
