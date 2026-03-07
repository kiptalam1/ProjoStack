import { useState, type Dispatch, type SetStateAction, type SyntheticEvent } from "react";
import useCreateWorkspace from "../../features/workspaces/hooks/useCreateWorkspace";


type ModalProps = {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
};

type FormTypes = {
  name: string;
}

export default function CreateWorkspaceModal({
  isOpen,
  setIsOpen,
}: ModalProps) {

  const [formData, setFormData] = useState<FormTypes>({
    name: ""
  })
  const { mutate, isPending } = useCreateWorkspace()

  if (!isOpen) {
    return null;
  }

  function handleSubmit(event: SyntheticEvent) {
    event.preventDefault();
    mutate(formData.name, {
      onSuccess: () => {
        setIsOpen(false);
      }
    });
  }
  return (
    <div
      onClick={() => setIsOpen(false)}
      className="p-2 fixed bg-black/50 backdrop-blur-md inset-0 flex items-center justify-center">
      <form
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit}
        className=" max-w-md w-full sm:w-sm md:w-md bg-card shadow-md shadow-gray-200 rounded-xl p-4">
        <h2 className="font-semibold text-lg">Create a Workspace</h2>
        <div className="flex flex-col my-5 gap-2 ">
          <label htmlFor="name" className="text-sm">
            Enter workspace name:
          </label>
          <input
            id="name"
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
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
