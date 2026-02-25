import { Routes, Route } from "react-router";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

function App() {
  return (
    <>
      <div className="p-4 sm:p-6 max-w-7xl mx-auto">
        <Routes>

          <Route path="auth/login" element={<LoginPage />} />
          <Route path="auth/register" element={<RegisterPage />} />
        </Routes>
      </div>
    </>

  )
}

export default App
