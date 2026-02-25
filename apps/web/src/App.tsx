import { Routes, Route } from "react-router";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import { Toaster } from "sonner";

function App() {
  return (
		<>
			<div className="p-4 sm:p-6 max-w-7xl mx-auto">
				<Routes>
					<Route path="auth/login" element={<LoginPage />} />
					<Route path="auth/register" element={<RegisterPage />} />
				</Routes>
				<Toaster richColors position="top-center" />
			</div>
		</>
	);
}

export default App
