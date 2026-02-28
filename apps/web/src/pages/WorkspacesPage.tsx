import { Link } from "react-router"
import useWorkspaces from "../features/workspaces/hooks/useWorkspaces"
import { useAuth } from "../auth/useAuth"
import { Loader2 } from "lucide-react";

export default function WorkspacesPage() {
  const { user, loading } = useAuth();
  const { isPending, data, isError, error } = useWorkspaces()

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
  return (
    <div className="w-full h-full space-y-4">
      <div className="space-y-5">
        <h1 className="text-2xl font-bold">Workspaces</h1>
        <button type="button" className="bg-primary rounded-xl px-3 py-1 cursor-pointer text-sm text-white hover:opacity-80 transition-all duration-150">Create workspace
        </button>
        <p className="text-xs">Select a workspace to continue</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
        {(loading || isPending) && (
          <div className="w-full text-center">
            <Loader2 size={16} className="animate-spin mx-auto" />
          </div>
        )}

        {
          data?.map((w) => {
            const wsUser = w.members.find(m => m.userId === user?.id);
            const joinedDate = wsUser?.joinedAt
              ? formatter.format(new Date(wsUser.joinedAt)) : null;
            return (
              <Link
                to={`/workspace/${w.id}`}
                key={w.id}
                className="p-4 bg-card shadow-md shadow-gray-200 rounded-2xl border-2 border-transparent hover:border-2 hover:border-border transition-colors duration-150">
                <div className="flex flex-col gap-3 items-start justify-between flex-wrap">
                  <div className="w-full flex items-start justify-between gap-3">
                    <h3 className="text-base font-semibold">{w.name}</h3>
                    <p className="text-xs border border-border py-0.5 px-1 rounded-full">{(wsUser?.memberRole ?? "MEMBER").toLocaleLowerCase()}</p>
                  </div>
                  <p className={`text-xs ${wsUser?.status === "ACTIVE" ? "text-success" : ""} ${wsUser?.status === "REMOVED" ? "text-danger" : ""} ${wsUser?.status === "SUSPENDED" ? "text-yellow-500" : ""} ${wsUser?.status === "INVITED" ? "text-blue-500" : ""}`}>{wsUser?.status ?? "-"}
                  </p>
                  <p className="text-sm">
                    {w.members.length} {w.members.length === 1 ? "member" : "members"}
                  </p>
                  <p className="text-xs font-jetbrains">
                    <span className="text-xs font-inter">Joined: </span>
                    {joinedDate ?? "-"}
                  </p>
                </div>

              </Link>
            );
          })
        }

      </div>
    </div>
  )
}
