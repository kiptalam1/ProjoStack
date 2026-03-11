import { type Dispatch, type SetStateAction, useState, type SyntheticEvent } from "react"
import type { TaskTypes } from "../../features/tasks/api/tasks.types";


type UpdateProps = {
  open: boolean;
  setOpenUpdate: Dispatch<SetStateAction<boolean>>
  task: TaskTypes
}
type InputProps = {
  title: string;
  status: "PENDING" | "STARTED" | "COMPLETE"
}
export default function UpdateTaskModal({ open, setOpenUpdate, task }: UpdateProps) {
  const [formData, setFormData] = useState<InputProps>({
    title: task.title,
    status: task.status
  })
  // const { mutate: updateTask, isPending: isUpdating } = useUpdateTask();
  //
  const isUpdating = true;
  // function handleUpdate(event: SyntheticEvent<HTMLFormElement>) {
  //   event.preventDefault();
  //     updateTask({ projectId: task.projectId, title: formData.title, status: formData.status }, {
  //       onSuccess: () => {
  //         setOpenUpdate(false);
  //       }
  //     })
  //   }
  //
  if (!open) {
    return null;
  }


  return (
    <div
      onClick={() => setOpenUpdate(false)}
      className="inset-0 bg-black/50 fixed backdrop-blur-md p-2 flex items-center justify-center z-50">
      <form
        onClick={(e) => e.stopPropagation()}
        // onSubmit={handleUpdate}
        className="bg-card w-full sm:w-sm md:w-md max-w-lg rounded-lg p-4 flex flex-col gap-3 ">
        <h2 className="text-lg font-semibold">Update Task</h2>
        <div className="flex flex-col justify-center gap-1" >
          <label htmlFor="title" className="text-sm font-semibold">Title:</label>
          <input
            id="title"
            name="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="border border-border rounded-lg outline-none focus:ring focus:ring-primary py-0.5 px-2 text-base"
          />
        </div>

        <div className="flex flex-col gap-1">
          <p className="text-sm font-semibold">Status:</p>
          <div className="flex items-center gap-3">
            <input
              id="pending"
              type="radio"
              name="status"
              value="PENDING"
              onChange={(e) => setFormData({ ...formData, status: e.target.value as InputProps["status"] })}
              checked={formData.status === "PENDING"}
              className="cursor-pointer"
            />
            <label htmlFor="pending" className="text-sm cursor-pointer">Pending</label>
          </div>


          <div className="flex items-center gap-3">
            <input
              id="complete"
              type="radio"
              name="status"
              value="COMPLETE"
              onChange={(e) => setFormData({ ...formData, status: e.target.value as InputProps["status"] })}
              checked={formData.status === "COMPLETE"}
              className="cursor-pointer"
            />
            <label htmlFor="complete" className="text-sm cursor-pointer">Complete</label>
          </div>


          <div className="flex items-center gap-3">
            <input
              id="started"
              type="radio"
              name="status"
              value="STARTED"
              onChange={(e) => setFormData({ ...formData, status: e.target.value as InputProps["status"] })}
              checked={formData.status === "STARTED"}
              className="cursor-pointer"
            />
            <label htmlFor="started" className="text-sm cursor-pointer">Started</label>
          </div>
        </div>

        <div className="mt-5 self-end flex items-center gap-5">
          <button
            type="button"
            onClick={() => setOpenUpdate(false)}
            className="bg-inherit border border-border rounded-md px-2 py-1 text-text hover:opacity-60 transition-opacity duration-150 text-sm font-semibold cursor-pointer">Cancel</button>

          <button
            type="submit"
            disabled={isUpdating}
            className="bg-primary rounded-md px-2 py-1 text-white hover:opacity-70 transition-opacity duration-150 text-sm font-semibold cursor-pointer disabled:cursor-progress">{isUpdating ? "Updating..." : "Update"}</button>

        </div>
      </form>
    </div>
  )
} 
