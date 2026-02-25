import { Routes, Route } from "react-router";
import LoginPage from "./pages/LoginPage";

function App() {
  return (
    <>
      <h1>hello</h1>
      <Routes>

        <Route path="auth/login" element={<LoginPage />} />
        {/*<Route path="auth/register" element={<Register />} />*/}
      </Routes></>
  )
}

export default App
