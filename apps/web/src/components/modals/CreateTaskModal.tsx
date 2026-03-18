import { useState, type Dispatch, type SetStateAction, type SyntheticEvent } from "react";
import { useParams } from "react-router";
import useCreateTask from "../../features/tasks/hooks/useCreateTask";

type ModalProps = {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
};

type InputTypes = {
  title: string;
}

export default function CreateTaskModal({ isOpen, setIsOpen }: ModalProps) {
  const { projectId } = useParams();
  const [formData, setFormData] = useState<InputTypes>({
    title: ""
  });
  const { mutate, isPending } = useCreateTask();

  function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!projectId) {
      return;
    }
    mutate({ projectId, title: formData.title }, {
      onSuccess: () => {
        setFormData({ title: "" })
        setIsOpen(false);
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
				<h2 className="font-semibold text-lg">Create a Task</h2>
				<div className="flex flex-col my-5 gap-2 ">
					<label htmlFor="title" className="text-sm">
						Enter Task title:
					</label>
					<input
						id="title"
						type="text"
						name="title"
						value={formData.title}
						onChange={(e) =>
							setFormData({ ...formData, title: e.target.value })
						}
						className="border border-border rounded-lg outline-none focus:ring focus:ring-primary py-0.5 px-2 text-base"
					/>
				</div>
				<div className="flex items-center justify-between gap-3">
					<button
						type="button"
						disabled={isPending}
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
