import { Moon, Sun } from "lucide-react";
import { useAuth } from "../auth/useAuth";
import { useEffect, useState } from "react";

type Theme = "light" | "dark";

export default function SettingsPage() {
	const { user } = useAuth();
	const [theme, setTheme] = useState<Theme>(() => {
		const saved = localStorage.getItem("theme") as Theme | null;
		if (saved) return saved;
		const systemDark = window.matchMedia(
			"(prefers-color-scheme: dark)",
		).matches;
		return systemDark ? "dark" : "light";
	});

	useEffect(() => {
		localStorage.setItem("theme", theme);
		document.documentElement.classList.toggle("dark", theme === "dark");
	}, [theme]);

	function changeTheme() {
		setTheme((prev) => (prev === "light" ? "dark" : "light"));
	}
	return (
		<div className="bg-card rounded-lg py-4 sm:py-6 md:py-8 lg:py-10 px-4 sm:px-20 md:px-36 lg:px-52">
			<h2 className="text-xl font-bold">Settings</h2>
			<div className="mt-4 flex flex-col gap-2">
				<h3 className="font-semibold underline">Account</h3>
				<p className="text-sm">
					Username: <span className="text-base">{user?.username}</span>
				</p>
				<p className="text-sm">
					Email: <span className="text-base">{user?.email}</span>
				</p>
				<p className="text-sm">
					Role: <span className="text-base font-light">{user?.role}</span>
				</p>
				<p className="text-sm">
					Joined on:{" "}
					<span className="text-base">
						{new Date(user!.createdAt).toLocaleString()}
					</span>
				</p>
			</div>

			<div className="my-5 flex items-center gap-5">
				<h3 className="font-semibold text-lg">Mode</h3>
				<div className="flex items-center border-2 border-border rounded-full  w-fit p-2 gap-5">
					<button
						type="button"
						aria-label="toggle mode"
						onClick={changeTheme}
						className="cursor-pointer hover:opacity-60 transition-opacity duration-150">
						{theme === "dark" ?
							<Sun size={20} />
						:	<Moon size={20} />}
					</button>
				</div>
			</div>
		</div>
	);
}
