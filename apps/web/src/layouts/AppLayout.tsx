import { useState } from "react";
import Sidebar from "../components/navigation/sidebar"
import WorkspacesPage from "../pages/WorkspacesPage";
import { Menu, } from "lucide-react";
import { Outlet } from "react-router";

export default function AppLayout() {
  const [showSidebar, setShowSidebar] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <div
        className={`
        relative w-full min-h-screen mx-auto md:grid md:transition-[grid-template-columns] md:ease-in-out md:duration-300 ${showSidebar ? "md:grid-cols-[240px_1fr]" : "md:grid-cols-[72px_1fr]"}`}>

        {/* desktop */}
        <div className="hidden md:block">
          <Sidebar
            showSidebar={showSidebar}
            setShowSidebar={setShowSidebar}
            variant="desktop"
          />
        </div>

        {mobileOpen && (
          <>
            <button
              className="fixed inset-0 bg-black/50 md:hidden"
              aria-label="close sidebar"
              onClick={() => setMobileOpen(false)}
            />
            <div className="fixed  w-72 top-0 left-0 h-screen z-50 md:hidden" >
              <Sidebar
                showSidebar={true}
                setShowSidebar={setShowSidebar}
                variant="mobile"
                onNavigate={() => setMobileOpen(false)}
                onClose={() => setMobileOpen(false)}
              />
            </div>
          </>
        )}

        <main className="min-w-0 overflow-y-auto p-4 sm:p-6">

          <button
            className="md:hidden mb-4 inline-flex items-center rounded-md border border-muted p-2 "
            onClick={() => setMobileOpen(true)}
          >
            <Menu size={22} />
          </button>
          <WorkspacesPage />
          <Outlet />
        </main>
      </div>
    </>
  )
}
