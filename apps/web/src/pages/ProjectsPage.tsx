import useGetAllProjects from "../features/projects/hooks/useGetAllProjects"
import LoadingSpinner from "../components/ui/LoadingSpinner";
import { useNavigate } from "react-router";

export default function ProjectsPage() {
  const { data, error, isError, isPending } = useGetAllProjects();
  const navigate = useNavigate();


  if (isError) {
    return <p className="text-center text-gray-700 text-sm">{error.message ?? "Failed to load!"}</p>
  }



  return (
    <main className="w-full h-full space-y-4">
      <div className="space-y-5">
        <h1 className="text-2xl font-bold">Projects</h1>
      </div>
      {
        isPending && <LoadingSpinner />
      }
      {
        !isPending && data?.length === 0 && (
          <p className="text-text text-sm italic">No projects yet.</p>
        )
      }
      {
        !isPending && data && data.length > 0 && (
          <div className="bg-card border border-border rounded-xl p-4">
            <table className="w-full table-auto border-collapse overflow-hidden">
              <thead className="text-sm border-b border-muted">
                <tr>
                  <th className="text-start p-2 font-medium">Name</th>
                  <th className="text-start p-2 font-medium">Workspace</th>
                  <th className="text-start p-2 font-medium hidden sm:table-cell">Role</th>
                  <th className="text-start p-2 font-medium">Created By</th>
                  <th className="text-start p-2 font-medium hidden sm:table-cell">Created At</th>
                </tr>
              </thead>

              <tbody>
                {data.map((p) => (
                  <tr key={p.id}
                    onClick={() => navigate(`/workspaces/${p.workspaceId}/projects/${p.id}/tasks`)}
                    className="border-b border-border hover:bg-muted/20">
                    <td className="p-2">{p.name}</td>
                    <td className="p-2">{p.workspace.name}</td>
                    <td className="p-2 hidden sm:table-cell">{p.createdBy.role.toLowerCase()}</td>
                    <td className="p-2">{p.createdBy.username}</td>
                    <td className="p-2 hidden sm:table-cell">
                      {new Date(p.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      }
    </main>
  )
}
