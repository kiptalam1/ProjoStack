import { NavLink } from "react-router";

export default function Sidebar() {
  return (
    <>
      <aside className="flex flex-col bg-sidebar text-sm text-sidebar-text h-screen overflow-y-auto p-4 md:p-6  border-r border-border">


        <div className="mt-8 flex flex-col gap-3">
          <NavLink to={"/workspaces"}
            className={({ isActive }) =>
              ` 
 hover:bg-sidebar-active w-full border border-transparent hover:border-sidebar-active-border block px-2 py-1 rounded-md
            ${isActive ? "bg-sidebar-active border border-sidebar-active-border text-primary w-full" : ""}`}
          >Workspaces
          </NavLink>

          <NavLink to={"/projects"}
            className={({ isActive }) =>
              ` 
 hover:bg-sidebar-active w-full border border-transparent hover:border-sidebar-active-border block px-2 py-1 rounded-md
            ${isActive ? "bg-sidebar-active border border-sidebar-active-border text-primary w-full" : ""}`}
          >Projects
          </NavLink>
        </div>


        <NavLink to={"/settings"}
          className={({ isActive }) =>
            ` 
mt-auto hover:bg-sidebar-active w-full border border-transparent hover:border-sidebar-active-border block px-2 py-1 rounded-md
            ${isActive ? "bg-sidebar-active border border-sidebar-active-border text-primary w-full" : ""}`}
        >Settings
        </NavLink>

      </aside >
    </>
  )
}
