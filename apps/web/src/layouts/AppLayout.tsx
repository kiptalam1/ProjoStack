import { useState } from "react";
import Sidebar from "../components/navigation/sidebar"

export default function AppLayout() {
  const [showSidebar, setShowSidebar] = useState(false);

  return (
    <>
      <div className={`relative w-full min-h-screen mx-auto grid transition-[grid-template-columns] ease-in-out duration-300 ${showSidebar ? "grid-cols-[240px_1fr]" : "grid-cols-[72px_1fr]"}`}>


        <Sidebar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />
      </div>
    </>
  )
}
