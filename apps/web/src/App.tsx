import { Routes, Route } from "react-router";
import LoginPage from "./pages/LoginPage";

function App() {
  return (
    <>
      <div className="bg-bg p-4 sm:p-6 max-w-7xl mx-auto">
        <h1>hello</h1>
        <Routes>

          <Route path="auth/login" element={<LoginPage />} />
          {/*<Route path="auth/register" element={<Register />} />*/}
        </Routes>
      </div>
    </>

  )
}

export default App
