import { Loader } from "lucide-react"
export default function LoadingSpinner() {
  return <div className="mx-auto text-center">{<Loader size={12} className="animate-spin mx-auto" />}</div>
}
