import { useState, type SubmitEvent } from "react"
import { GraduationCap, ArrowRight } from "lucide-react"
import { Link, useNavigate } from "react-router"

const Login = () => {
  const navigate = useNavigate()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const login = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
        },
      )

      if (!response.ok) {
        throw new Error("Login failed")
      }

      const data = await response.json()
      localStorage.setItem("token", data.accessToken)
      setPassword("")
      navigate("/")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col justify-center px-6 py-12 relative overflow-hidden bg-gray-50/0">
      {/* Decorative elements */}
      <div className="fixed -bottom-12 -right-12 w-48 h-48 bg-yellow-400 rounded-full neo-border -z-10 opacity-50"></div>
      <div className="fixed top-20 -left-10 w-24 h-24 bg-white neo-border rotate-12 -z-10"></div>

      <main className="max-w-md mx-auto w-full">
        {/* Logo and Title */}
        <div className="mb-12">
          <div className="w-16 h-16 bg-yellow-400 neo-border neo-shadow flex items-center justify-center mb-8">
            <GraduationCap className="w-9 h-9" strokeWidth={2.5} />
          </div>
          <h1 className="text-6xl font-black italic tracking-tighter uppercase">
            Welcome
            <br />
            Back
          </h1>
          <p className="mt-4 font-bold text-gray-600 uppercase tracking-widest text-xs">
            Access your student portal
          </p>
        </div>

        {/* Login Form */}
        <form className="space-y-6" onSubmit={login}>
          {/* Username Field */}
          <div className="space-y-2">
            <label
              htmlFor="username"
              className="text-xs font-black uppercase tracking-widest"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="admin"
              className="w-full p-4 neo-border neo-shadow transition-all font-bold placeholder:text-gray-400 bg-white"
              required
            />
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <div className="flex justify-between items-end">
              <label
                htmlFor="password"
                className="text-xs font-black uppercase tracking-widest"
              >
                Password
              </label>
              <Link
                to="#"
                className="text-xs font-black uppercase underline decoration-2 underline-offset-2"
              >
                Forgot?
              </Link>
            </div>
            <input
              type="password"
              id="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="admin123"
              className="w-full p-4 neo-border neo-shadow transition-all font-bold placeholder:text-gray-400 bg-white"
              required
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-100 neo-border p-3">
              <p className="text-red-600 font-bold text-sm uppercase">
                {error}
              </p>
            </div>
          )}

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-yellow-400 py-5 neo-border neo-shadow neo-button-active font-black text-xl uppercase flex items-center justify-center gap-3 group transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Signing In..." : "Sign In"}
              <ArrowRight className="w-6 h-6" strokeWidth={3} />
            </button>
          </div>
        </form>

        {/* Sign Up Link */}
        <div className="mt-12 text-center">
          <p className="font-bold text-sm">
            Don't have an account?
            <Link
              to="/register"
              className="bg-yellow-400 px-2 py-1 neo-border font-black uppercase text-xs ml-2 hover:neo-shadow transition-all inline-block"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </main>
    </div>
  )
}

export default Login
