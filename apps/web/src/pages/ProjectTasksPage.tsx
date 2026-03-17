import { Link, useParams } from "react-router"
import { useAuth } from "../auth/useAuth"
import { Edit, Loader2, Trash } from "lucide-react";
import { useGetProjectTasks } from "../features/tasks/hooks/useTasks";
import { Activity, useState } from "react";
import CreateTaskModal from "../components/modals/CreateTaskModal";
import ConfirmModal from "../components/modals/ConfirmModal";
import useDeleteTask from "../features/tasks/hooks/useDeleteTask";
import UpdateTaskModal from "../components/modals/UpdateTaskModal";

export default function ProjectTasksPage() {
  const { loading, user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const { projectId } = useParams();
  const { isPending, data, isError, error } = useGetProjectTasks(projectId as string)
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const { isPending: isDeleting, mutate: deleteTask } = useDeleteTask();
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

  function handleDelete(projectId: string, taskId: string) {
    deleteTask({ projectId, taskId }, {
      onSuccess: () => {
        setShowConfirmModal(false);
      }
    })
  }


  return (
    <div className="w-full h-full space-y-4">
      <div className="space-y-5">
        <h1 className="text-2xl font-bold">Tasks</h1>
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="bg-primary rounded-xl px-3 py-1 cursor-pointer text-sm text-white hover:opacity-80 transition-all duration-150">
          Create Task
        </button>
        <Activity mode={isOpen ? "visible" : "hidden"}>
          <CreateTaskModal isOpen={isOpen} setIsOpen={setIsOpen} />
        </Activity>
        {
          data.length === 0 && (
            <p className="text-sm italic text-text">No tasks yet.</p>
          )
        }


        {data.length > 0 && (
          <p className="text-xs">Select a task to continue</p>
        )}
      </div>
      <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
        {data?.map((t) => {
          const createdDate =
            t.createdAt ? formatter.format(new Date(t.createdAt)) : null;
          return (
						<div
							key={t.id}
							className="p-4 bg-card shadow-md shadow-gray-200 rounded-2xl border-2 border-transparent hover:border-2 hover:border-border transition-colors duration-150">
							<Link to={`project/${t.id}/tasks`}>
								<div className="flex flex-col gap-3 items-start justify-between flex-wrap ">
									<div className="w-full flex items-start justify-between gap-3">
										<h3 className="text-base font-semibold  overflow-hidden whitespace-nowrap text-ellipsis">
											{t.title}
										</h3>
										<p
											className={`text-xs ${t.status === "COMPLETE" ? "text-success" : ""}  ${t.status === "PENDING" ? "text-yellow-500" : ""} ${t.status === "STARTED" ? "text-blue-500" : ""}`}>
											{t.status ?? "-"}
										</p>
									</div>

									<p className="text-xs overflow-hidden whitespace-nowrap text-ellipsis">
										Created by:{" "}
										<span className="text-base">{t.createdBy.username}</span>
									</p>
									<p className="text-xs font-jetbrains min-h-10">
										<span className="text-xs font-inter">Created: </span>
										{createdDate ?? "-"}
									</p>
								</div>
							</Link>
							<ConfirmModal
								open={showConfirmModal}
								title="Delete Task!"
								description="This action will permanently delete task and all related data."
								loading={isDeleting}
								onClose={() => setShowConfirmModal(false)}
								onConfirm={() => handleDelete(t.projectId, t.id)}
							/>

							<Activity mode={openUpdateModal ? "visible" : "hidden"}>
								<UpdateTaskModal
									open={openUpdateModal}
									setOpenUpdate={setOpenUpdateModal}
									task={t}
								/>
							</Activity>

							<div className="flex items-center justify-between gap-3 w-full">
								{t.createdById === user?.id && (
									<>
										{" "}
										<button
											aria-label="delete project"
											type="button"
											onClick={() => setShowConfirmModal(true)}
											className="text-gray-400 hover:text-red-500 transition-colors duration-150 cursor-pointer">
											<Trash size={16} />
										</button>
										<button
											type="button"
											aria-label="update modal"
											onClick={() => setOpenUpdateModal(true)}
											className="text-gray-400 hover:text-blue-500 transition-colors duration-150 cursor-pointer">
											<Edit size={16} />
										</button>
									</>
								)}
							</div>
						</div>
					);
        })}
      </div>
    </div>
  );
}
