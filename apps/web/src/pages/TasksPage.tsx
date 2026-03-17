import LoadingSpinner from "../components/ui/LoadingSpinner";
import useGetAllTasks from "../features/tasks/hooks/useGetAllTasks";

export default function TasksPage() {
  const { data, error, isError, isPending } = useGetAllTasks();


  if (isError) {
    return <p className="text-center text-gray-700 text-sm">{error.message ?? "Failed to load!"}</p>
  }


  return (
		<main className="w-full h-full space-y-4">
			<div className="space-y-5">
				<h1 className="text-2xl font-bold">Tasks</h1>
			</div>
			{isPending && <LoadingSpinner />}
			{!isPending && data?.length === 0 && (
				<p className="text-text text-sm italic">No tasks yet.</p>
			)}
			{!isPending && data && data.length > 0 && (
				<div className="bg-card border border-border rounded-xl p-4">
					<table className="w-full table-auto border-collapse overflow-hidden">
						<thead className="text-sm border-b border-muted">
							<tr>
								<th className="text-start p-2 font-medium">Title</th>
								<th className="text-start p-2 font-medium">Project</th>
								<th className="text-start p-2 font-medium hidden sm:table-cell">
									Workspace
								</th>
								<th className="text-start p-2 font-medium">Status</th>
								<th className="text-start p-2 font-medium hidden sm:table-cell">
									Created By
								</th>
								<th className="text-start p-2 font-medium hidden sm:table-cell">
									Created At
								</th>
							</tr>
						</thead>

						<tbody>
							{data.map((t) => (
								<tr
									key={t.id}
									className="border-b border-border hover:bg-muted/20">
									<td className="p-2">{t.title}</td>
									<td className="p-2">{t.project.name}</td>
									<td className="p-2 hidden sm:table-cell">
										{t.workspace.name}
									</td>
									<td className="p-2 font-semibold text-sm">{t.status}</td>
									<td className="p-2 hidden sm:table-cell">
										{t.createdBy.username}
									</td>
									<td className="p-2 hidden sm:table-cell">
										{new Date(t.createdAt).toLocaleString()}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}
		</main>
	);
}
