import { NavLink } from "react-router";

import { SidebarOpen, SidebarClose, Settings, LayoutGrid, FolderKanban, Handshake } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";


type SidebarPropType = {
  showSidebar: boolean;
  setShowSidebar: Dispatch<SetStateAction<boolean>>
}


export default function Sidebar({ showSidebar, setShowSidebar }: SidebarPropType) {
  const toggleSidebar = () => setShowSidebar((prev) => !prev);

  const base = `flex items-center gap-3 hover:bg-sidebar-active w-full border border-transparent  px-4 py-2 rounded-md transition-colors ${showSidebar ? "justify-start" : "justify-center"}`
  const active = "bg-sidebar-active border border-sidebar-active-border text-primary"
  const inactive = "hover:border-slate-700"

  return (
    <>
      <aside className="relative flex flex-col bg-sidebar text-sm text-sidebar-text h-screen overflow-y-auto p-4 md:p-6 border-r border-border">

        <button
          onClick={toggleSidebar}
          aria-label={showSidebar ? "Collapse sidebar" : "Expand sidebar"}
          className={`absolute right-2 top-2 px-3 py-2 text-sidebar-text hover:text-muted hover:bg-sidebar-active transition-all duration-100 cursor-pointer rounded-sm ${showSidebar ? "hover:cursor-w-resize" : "hover:cursor-e-resize"}`}>
          {showSidebar ? <SidebarClose size={22} /> : <SidebarOpen size={22} />}

        </button>


        {/* Brand / spacer */}
        <div className={`flex items-center gap-2 mt-12  pl-2 py-2 text-muted ${showSidebar ? "justify-start" : "justify-center"}`}>
          < Handshake size={30} className="shrink-0" />
          <span className={showSidebar ? "text-2xl font-bold text-muted" : "hidden"}>Dashboard</span>
        </div>

        <nav className="mt-4 flex flex-col gap-3">
          <NavLink to={"/workspaces"}
            className={({ isActive }) =>
              `group relative ${base} ${isActive ? active : inactive}`}
          >
            < LayoutGrid size={18} className="shrink-0 " />
            <span className={showSidebar ? "block" : "hidden"}> Workspaces</span>
          </NavLink>

          <NavLink to={"/projects"}
            className={({ isActive }) =>
              `${base} ${isActive ? active : inactive}`}
          ><FolderKanban size={18} className="shrink-0" />

            <span className={showSidebar ? "block" : "hidden"}> Projects</span>

          </NavLink>
        </nav>


        <div className="mt-auto pt-2">
          <NavLink to={"/settings"}
            className={({ isActive }) =>
              `${base} ${isActive ? active : inactive}`}
          ><Settings size={18} className="shrink-0" />
            <span className={showSidebar ? "block" : "hidden"}>Settings</span>
          </NavLink>
        </div>
      </aside >
    </>
  )
}
