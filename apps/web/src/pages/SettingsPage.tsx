import { useAuth } from "../auth/useAuth"

export default function SettingsPage() {

  const { user } = useAuth();
  return (
    <div className="bg-card rounded-lg py-4 sm:py-6 md:py-8 lg:py-10 px-4 sm:px-20 md:px-36 lg:px-52">
      <h2 className="text-xl font-bold">Settings</h2>
      <div className="mt-4 flex flex-col gap-2">
        <h3 className="font-semibold underline">Account</h3>
        <p className="text-sm">Username: <span className="text-base">{user?.username}</span></p>
        <p className="text-sm">Email: <span className="text-base">{user?.email}</span></p>
        <p className="text-sm">Role: <span className="text-base font-light">{user?.role}</span></p>
        <p className="text-sm">Joined on: <span className="text-base">{new Date(user!.createdAt).toLocaleString()}</span></p>
      </div>
    </div>
  )
}
