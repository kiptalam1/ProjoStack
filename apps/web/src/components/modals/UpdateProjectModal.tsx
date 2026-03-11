import { type Dispatch, type SetStateAction, useState, type SyntheticEvent } from "react"
import type { ProjectsTypes } from "../../features/projects/api/projects.types";
import useUpdateProject from "../../features/projects/hooks/useUpdateProject";


type UpdateProps = {
  open: boolean;
  setOpenUpdate: Dispatch<SetStateAction<boolean>>
  project: ProjectsTypes;
}
export default function UpdateProjectModal({ open, setOpenUpdate, project }: UpdateProps) {
  const [formData, setFormData] = useState({
    name: project.name
  })
  const { mutate: updateProject, isPending: isUpdating } = useUpdateProject();

  function handleUpdate(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    updateProject({ workspaceId: project.workspaceId, projectId: project.id, name: formData.name }, {
      onSuccess: () => {
        setOpenUpdate(false);
      }
    })
  }

  if (!open) {
    return null;
  }


  return (
    <div
      onClick={() => setOpenUpdate(false)}
      className="inset-0 bg-black/50 fixed backdrop-blur-md p-2 flex items-center justify-center z-50">
      <form
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleUpdate}
        className="bg-card w-full sm:w-sm md:w-md max-w-lg rounded-lg p-4 flex flex-col gap-3 ">
        <h2 className="text-lg font-semibold">Update Project</h2>
        <div className="flex flex-col justify-center gap-1" >
          <label htmlFor="name" className="text-sm">Name</label>
          <input
            id="name"
            name="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="border border-border rounded-lg outline-none focus:ring focus:ring-primary py-0.5 px-2 text-base"
          />
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
