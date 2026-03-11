import { Link } from "react-router"
import useWorkspaces from "../features/workspaces/hooks/useWorkspaces"
import { useAuth } from "../auth/useAuth"
import { Edit, Loader2, Trash } from "lucide-react";
import CreateWorkspaceModal from "../components/modals/CreateWorkspaceModal";
import { Activity, useState, } from "react";
import useDeleteWorkspace from "../features/workspaces/hooks/useDeleteWorkspace";
import ConfirmModal from "../components/modals/ConfirmModal";
import UpdateWorkspaceModal from "../components/modals/UpdateWorkspaceModal";

export default function WorkspacesPage() {
  const [isOpen, setIsOpen] = useState(false)
  const { user, loading } = useAuth();
  const { isPending, data, isError, error } = useWorkspaces()
  const { isPending: isDeleting, mutate: deleteWs } = useDeleteWorkspace();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);

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

  function handleDelete(id: string) {
    setDeletingId(id);
    deleteWs(id, {
      onSettled: () => {
        setDeletingId(null);
      }
    });
  }


  return (
    <div className="w-full h-full space-y-4">
      <div className="space-y-5">
        <h1 className="text-2xl font-bold">Workspaces</h1>
        <button
          onClick={() => setIsOpen(true)}
          type="button"
          className="bg-primary rounded-xl px-3 py-1 cursor-pointer text-sm text-white hover:opacity-80 transition-all duration-150">
          Create workspace
        </button>

        <Activity mode={isOpen ? "visible" : "hidden"}>
          <CreateWorkspaceModal isOpen={isOpen} setIsOpen={setIsOpen} />
        </Activity>
        {
          data.length === 0 && (
            <p className="text-sm italic text-text">No workspaces yet.</p>
          )
        }

        {data.length > 0 && (
          <p className="text-xs">Select a workspace to continue</p>
        )}
      </div>
      <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
        {data?.map((w) => {
          const wsUser = w.members.find((m) => m.userId === user?.id);
          const joinedDate =
            wsUser?.joinedAt ?
              formatter.format(new Date(wsUser.joinedAt))
              : null;
          return (
            <div
              key={w.id}
              className="p-4 bg-card shadow-md shadow-gray-200 rounded-2xl border-2 border-transparent hover:border-2 hover:border-border transition-colors duration-150">
              <Link
                to={`${w.id}/projects`}
              >
                <div className="flex flex-col gap-3 items-start justify-between flex-wrap ">
                  <div className="w-full flex items-start justify-between gap-3">
                    <h3 className="text-base font-semibold  overflow-hidden whitespace-nowrap text-ellipsis">
                      {w.name}
                    </h3>
                    <p className="text-xs border border-border py-0.5 px-1 rounded-full">
                      {(wsUser?.memberRole ?? "MEMBER").toLocaleLowerCase()}
                    </p>
                  </div>
                  <p
                    className={`text-xs ${wsUser?.status === "ACTIVE" ? "text-success" : ""} ${wsUser?.status === "REMOVED" ? "text-danger" : ""} ${wsUser?.status === "SUSPENDED" ? "text-yellow-500" : ""} ${wsUser?.status === "INVITED" ? "text-blue-500" : ""}`}>
                    {wsUser?.status ?? "-"}
                  </p>
                  <p className="text-sm">
                    {w.members.length}{" "}
                    {w.members.length === 1 ? "member" : "members"}
                  </p>
                  <p className="text-xs font-jetbrains min-h-10">
                    <span className="text-xs font-inter">Joined: </span>
                    {joinedDate ?? "-"}
                  </p>
                </div>
              </Link>
              <ConfirmModal
                open={showConfirmModal}
                title="Delete Workspace!"
                description="This action will permanently delete workspace and related data."
                loading={isDeleting}
                onClose={() => setShowConfirmModal(false)}
                onConfirm={() => {
                  handleDelete(w.id);
                  setShowConfirmModal(false)
                }}
              />


              <Activity mode={openUpdateModal ? "visible" : "hidden"}>
                <UpdateWorkspaceModal
                  open={openUpdateModal}
                  setOpenUpdate={setOpenUpdateModal}
                  workspace={w}
                />
              </Activity>


              <div className="flex items-center justify-between gap-3 w-full">{
                w.creatorId === user?.id && (
                  <>  <button
                    type="button"
                    disabled={isDeleting && deletingId === w.id}
                    onClick={() => setShowConfirmModal(true)}
                    className="text-gray-400 hover:text-red-500 disabled:cursor-not-allowed transition-colors duration-150 cursor-pointer">
                    <Trash size={16} /></button>
                    <button
                      type="button"
                      onClick={() => setOpenUpdateModal(true)}
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
