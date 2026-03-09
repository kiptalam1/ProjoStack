import { Link, useParams } from "react-router"
import { useAuth } from "../auth/useAuth"
import { Edit, Loader2, Trash } from "lucide-react";
import { useGetProjects } from "../features/projects/hooks/useProjects";
import { Activity, useState } from "react";
import CreateProjectModal from "../components/modals/CreateProjectModal";

export default function WorkspaceProjectsPage() {
  const { loading, user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const { workspaceId } = useParams();
  const { isPending, data, isError, error } = useGetProjects(workspaceId as string)

  const formatter = new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  })


  if (isError) {
    return <p className="text-center text-gray-700 text-sm">{error.message ?? "Failed to load!"}</p>
  }

  if (loading || isPending) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Loader2
          size={16}
          className="animate-spin" />
      </div>
    )
  }



  return (
    <div className="w-full h-full space-y-4">
      <div className="space-y-5">
        <h1 className="text-2xl font-bold">Projects</h1>
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="bg-primary rounded-xl px-3 py-1 cursor-pointer text-sm text-white hover:opacity-80 transition-all duration-150">
          Create Project
        </button>

        <Activity mode={isOpen ? "visible" : "hidden"}>
          <CreateProjectModal isOpen={isOpen} setIsOpen={setIsOpen} />
        </Activity>

        {data.length > 0 && (
          <p className="text-xs">Select a project to continue</p>
        )}
      </div>
      <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
        {data?.map((p) => {
          const joinedDate =
            p.createdAt ? formatter.format(new Date(p.createdAt)) : null;
          return (
            <div
              key={p.id}
              className="p-4 bg-card shadow-md shadow-gray-200 rounded-2xl border-2 border-transparent hover:border-2 hover:border-border transition-colors duration-150">
              <Link
                to={`/workspaces/${p.workspaceId}/projects/${p.id}/tasks`}
              >
                <div className="flex flex-col gap-3 items-start justify-between flex-wrap ">
                  <div className="w-full flex items-start justify-between gap-3">
                    <h3 className="text-base font-semibold  overflow-hidden whitespace-nowrap text-ellipsis">
                      {p.name}
                    </h3>
                  </div>
                  <p className="text-xs overflow-hidden whitespace-nowrap text-ellipsis">
                    Created by:{" "}
                    <span className="text-base">{p.createdBy.username}</span>
                  </p>
                  <p className="text-xs font-jetbrains min-h-10">
                    <span className="text-xs font-inter">Created: </span>
                    {joinedDate ?? "-"}
                  </p>
                </div>
              </Link>

              <div className="flex items-center justify-between gap-3 w-full">{
                p.createdById === user?.id && (
                  <>  <button
                    type="button"
                    className="text-gray-400 hover:text-red-500 transition-colors duration-150 cursor-pointer"><Trash size={16} /></button>
                    <button
                      type="button"
                      className="text-gray-400 hover:text-blue-500 transition-colors duration-150 cursor-pointer"><Edit size={16} /></button>
                  </>
                )
              }
              </div>
            </div>

          );
        })}
      </div>
    </div>
  );
}
