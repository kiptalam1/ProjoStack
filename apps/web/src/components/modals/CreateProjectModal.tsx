import type { Dispatch, SetStateAction } from "react";

type ModalProps = {
	isOpen: boolean;
	setIsOpen: Dispatch<SetStateAction<boolean>>;
};
export default function CreateProjectModal({ isOpen, setIsOpen }: ModalProps) {
	if (!isOpen) {
		return null;
	}

	return (
		<div
			onClick={() => setIsOpen(false)}
			className="p-2 fixed bg-black/50 backdrop-blur-md inset-0 flex items-center justify-center">
			<form
				onClick={(e) => e.stopPropagation()}
				className=" max-w-md w-full sm:w-sm md:w-md bg-card shadow-md shadow-gray-200 rounded-xl p-4">
				<h2 className="font-semibold text-lg">Create a Project</h2>
				<div className="flex flex-col my-5 gap-2 ">
					<label htmlFor="name" className="text-sm">
						Enter Project name:
					</label>
					<input
						id="name"
						type="text"
						className="border border-border rounded-lg outline-none focus:ring focus:ring-primary py-0.5 px-2 text-base"
					/>
				</div>
				<div className="flex items-center justify-between gap-3">
					<button
						type="button"
						onClick={() => setIsOpen(false)}
						className="bg-gray-500 rounded-md text-white px-1 py-0.5 text-sm font-semibold hover:bg-red-400 transition-colors duration-150 cursor-pointer disabled:cursor-not-allowed">
						Cancel
					</button>
					<button
						type="submit"
						className="bg-primary rounded-md text-white px-5 py-0.5 text-sm font-semibold hover:opacity-60 transition-opacity duration-150 cursor-pointer disabled:cursor-not-allowed">
						Save
					</button>
				</div>
			</form>
		</div>
	);
}
