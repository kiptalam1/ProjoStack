import Sidebar from "../components/navigation/sidebar"
import { SidebarOpen, SidebarClose } from "lucide-react";

export default function AppLayout() {


  return (
    <>
      <div className="relative w-full min-h-screen mx-auto grid grid-cols-[240px_1fr]">

        <div className="absolute p-2 left-45">
          <button className="p-2 text-sidebar-text hover:text-muted hover:bg-sidebar-active transition-all duration-100 cursor-pointer rounded-sm">
            <SidebarClose size={22} />
          </button>
        </div>

        <Sidebar />
      </div>
    </>
  )
}
