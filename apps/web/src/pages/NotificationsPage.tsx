import LoadingSpinner from "../components/ui/LoadingSpinner";
import useGetWsInvites from "../features/invites/hooks/useGetWsInvites";

export default function NotificationsPage() {
	const {
		data: invites,
		isPending: isFetching,
		isError,
		error,
	} = useGetWsInvites();

	const statusStyles = {
		PENDING: "text-yellow-500",
		ACCEPTED: "text-green-500",
		DECLINED: "text-red-500",
	};

	if (isError) {
		return (
			<p className="text-center text-gray-700 text-sm">
				{error.message ?? "Failed to load!"}
			</p>
		);
	}

	if (isFetching) {
		return (
			<div className="w-full h-full flex items-center">
				<LoadingSpinner />;
			</div>
		);
	}
	return (
		<div className="w-full h-full">
			<h2 className="text-2xl font-bold">Invites</h2>
			{!isFetching && invites?.length === 0 && (
				<p className="text-sm text-muted italic">No invites</p>
			)}
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mt-5">
				{invites &&
					invites.length > 0 &&
					invites.map((i) => (
						<div
							key={i.id}
							className="bg-card rounded-lg p-4 flex flex-col gap-2 shadow-md">
							<div className="flex items-baseline gap-2 justify-between">
								<p className="text-muted text-xs">Workspace:</p>
								<h3 className="text-sm font-semibold wrap-anywhere">
									{i.workspace.name}
								</h3>
							</div>
							<div className="flex items-baseline justify-between gap-2">
								<span className="text-muted text-xs">By:</span>
								<p className="text-xs wrap-anywhere break-all">
									{i.sentBy.username} - {i.sentBy.email}
								</p>
							</div>

							<div className="flex items-center justify-between gap-2">
								<span className="text-xs text-muted">On:</span>
								<p className="text-xs font-jetbrains break-after-all">
									{new Intl.DateTimeFormat("en-GB", {
										dateStyle: "medium",
										timeStyle: "short",
									}).format(new Date(i.createdAt))}
								</p>
							</div>
							<div className="flex items-center justify-between gap-2">
								<span className="text-xs text-muted">Status:</span>
								<p className={`text-xs font-light ${statusStyles[i.status]}`}>
									{i.status}
								</p>
							</div>
							<div className="ml-auto space-x-5 mt-4">
								<button
									type="button"
									className="bg-inherit border border-border rounded-lg px-2 py-1 text-sm font-light cursor-pointer hover:opacity-60 transition-opacity duration-150">
									Decline
								</button>
								<button
									type="button"
									className="bg-primary text-white px-2 py-1 rounded-lg text-sm font-semibold cursor-pointer hover:opacity-70 duration-150">
									Accept
								</button>
							</div>
						</div>
					))}
			</div>
		</div>
	);
}
