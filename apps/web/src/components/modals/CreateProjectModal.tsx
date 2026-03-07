import { useState, type Dispatch, type SetStateAction, type SyntheticEvent } from "react";
import { useCreateProject } from "../../features/projects/hooks/useCreateProject";
import { useParams } from "react-router";

type ModalProps = {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
};

type InputTypes = {
  name: string;
}

export default function CreateProjectModal({ isOpen, setIsOpen }: ModalProps) {
  const [formData, setFormData] = useState<InputTypes>({
    name: ""
  })
  const { workspaceId } = useParams();
  const { mutate, isPending } = useCreateProject()

  function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!workspaceId) {
      return;
    }

    mutate({ workspaceId, name: formData.name }, {
      onSuccess: () => {
        setIsOpen(false)
      }
    })
  }

  if (!isOpen) {
    return null;
  }

  return (
    <div
      onClick={() => setIsOpen(false)}
      className="p-2 fixed bg-black/50 backdrop-blur-md inset-0 flex items-center justify-center">
      <form
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit}
        className=" max-w-md w-full sm:w-sm md:w-md bg-card shadow-md shadow-gray-200 rounded-xl p-4">
        <h2 className="font-semibold text-lg">Create a Project</h2>
        <div className="flex flex-col my-5 gap-2 ">
          <label htmlFor="name" className="text-sm">
            Enter Project name:
          </label>
          <input
            id="name"
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="border border-border rounded-lg outline-none focus:ring focus:ring-primary py-0.5 px-2 text-base"
          />
        </div>
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="bg-inherit border border-muted text-text rounded-md px-1 py-0.5 text-sm hover:bg-red-400 hover:border-white transition-colors duration-150 cursor-pointer disabled:cursor-not-allowed">
            Cancel
          </button>
          <button
            type="submit"
            disabled={isPending}
            className="bg-primary rounded-md text-white px-5 py-0.5 text-sm font-semibold hover:opacity-60 transition-opacity duration-150 cursor-pointer disabled:cursor-not-allowed">
            {isPending ? "Loading..." : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
}
