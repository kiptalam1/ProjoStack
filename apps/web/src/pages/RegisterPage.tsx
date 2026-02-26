import { Link, useNavigate } from "react-router";
import { Eye, EyeOff } from "lucide-react";
import { useState, type SyntheticEvent } from "react";
import { useAuth } from "../auth/useAuth";
import { toast } from "sonner";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ username: "", email: "", password: "", confirmPassword: "" });
  const { register } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();


  const handleSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords did not match!");
      return;
    }
    setIsSubmitting(true);
    try {
      const success = await register(formData);
      if (success) navigate("/auth/login");

    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="w-full mx-auto max-w-7xl flex flex-col items-center justify-center gap-5 py-5">
      <h1 className="text-center text-3xl font-bold">Sign up for free</h1>
      <p className="text-center text-xs">Or {" "}
        <Link to={"/auth/login"} className="text-base font-medium underline hover:no-underline underline-offset-2 hover:text-primary">sign in to your existing account
        </Link>
      </p>
      <form onSubmit={handleSubmit} className="w-full bg-card mt-4 p-6 rounded-lg  max-w-md flex flex-col gap-5 shadow-sm shadow-black/5">

        <div className="flex flex-col gap-4">
          <div>
            <label className="text-sm" htmlFor="username">Username</label>
            <input className="border border-border rounded-lg transition-all ease-in duration-100 outline-none focus:ring ring-primary p-2 w-full mt-1"
              id="username" name="username" type="text"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            />
          </div>


          <div>
            <label className="text-sm" htmlFor="email">Email address</label>
            <input className="border border-border rounded-lg transition-all ease-in duration-100 outline-none focus:ring ring-primary p-2 w-full mt-1"
              id="email" name="email" type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div>
            <label className="text-sm" htmlFor="password">Password</label>
            <div className="relative mt-1">
              <input className=" border border-border rounded-lg transition-all ease-in duration-100 outline-none focus:ring ring-primary p-2 w-full"
                id="password" name="password" type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-2 top-1/2 -translate-y-1/2 text-muted focus:outline-none hover:text-primary">{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button>
            </div>
          </div>


          <div>
            <label className="text-sm" htmlFor="confirm-password">Password confirmation</label>
            <div className="relative mt-1">
              <input className=" border border-border rounded-lg transition-all ease-in duration-100 outline-none focus:ring ring-primary p-2 w-full"
                id="confirm-password" name="confirm-password" type={showPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })} />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-2 top-1/2 -translate-y-1/2 text-muted focus:outline-none hover:text-primary">{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button>
            </div>
          </div>


          <p className="text-center text-sm text-muted mt-2">By signing up, you agree to our terms of use.</p>


          <button type="submit"
            disabled={isSubmitting}
            className="bg-primary hover:bg-primary-hover text-white rounded-lg p-2 transition-all duration-100 cursor-pointer mt-3 mb-4 disabled:cursor-not-allowed disabled:opacity-60">
            {isSubmitting ? "Signing up..." : "Sign up"}
          </button>
        </div>
      </form>

    </section>
  )
}
