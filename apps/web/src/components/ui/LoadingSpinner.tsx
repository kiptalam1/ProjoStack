import { Loader } from "lucide-react"
export default function LoadingSpinner() {
  return (
		<div className="text-center flex items-center justify-center w-full">
			<Loader size={12} className="animate-spin mx-auto" />
		</div>
	);
}
