import { useAuth } from "../auth/useAuth";
import LoadingSpinner from "../components/ui/LoadingSpinner";

export default function DashboardPage() {
	const { user, isAuthLoading } = useAuth();
	if (isAuthLoading) {
		return <LoadingSpinner />;
	}

	function titleCase(str?: string) {
		if (!str) return;
		return str
			.trim()
			.toLowerCase()
			.split(" ")
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
			.join(" ");
	}

	return (
		<div className="w-full h-full space-y-4">
			<h1 className="text-2xl font-semibold">Dashboard</h1>
			<p className="text-lg font-light">
				Welcome{" "}
				<span className="text-2xl font-semibold ">
					{user ? titleCase(user?.username) : "User"}
				</span>
			</p>
		</div>
	);
}
