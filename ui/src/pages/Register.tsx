import { useState, type SubmitEvent } from "react"
import { ArrowRight } from "lucide-react"
import { Link, useNavigate } from "react-router"

const Register = () => {
  const navigate = useNavigate()
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const register = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/auth/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fullName, email, password }),
        },
      )

      if (!response.ok) {
        throw new Error("Registration failed")
      }

      const data = await response.json()
      localStorage.setItem("token", data.token)
      setPassword("")
      navigate("/")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gray-50">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <header className="text-center space-y-2">
          <h1 className="text-5xl font-black italic tracking-tighter uppercase leading-none">
            Join The Hub
          </h1>
          <p className="font-bold text-sm uppercase tracking-widest text-gray-600">
            Start your journey today
          </p>
        </header>

        {/* Registration Form */}
        <form className="space-y-6" onSubmit={register}>
          <div className="space-y-5">
            {/* Full Name Field */}
            <div className="space-y-2">
              <label
                htmlFor="fullName"
                className="block text-xs font-black uppercase tracking-wider ml-1"
              >
                Full Name
              </label>
              <input
                type="text"
                id="fullName"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                placeholder="Alex Student"
                className="w-full h-14 px-4 bg-white neo-border neo-shadow focus:ring-0 focus:outline-none font-bold text-lg placeholder:text-gray-300"
                required
              />
            </div>

            {/* Student Email Field */}
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-xs font-black uppercase tracking-wider ml-1"
              >
                Student Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="alex@university.edu"
                className="w-full h-14 px-4 bg-white neo-border neo-shadow focus:ring-0 focus:outline-none font-bold text-lg placeholder:text-gray-300"
                required
              />
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="block text-xs font-black uppercase tracking-wider ml-1"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full h-14 px-4 bg-white neo-border neo-shadow focus:ring-0 focus:outline-none font-bold text-lg placeholder:text-gray-300"
                required
              />
            </div>
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
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-yellow-400 h-16 neo-border neo-shadow-lg neo-button-active font-black text-xl uppercase tracking-tight flex items-center justify-center gap-3 mt-8 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Creating Account..." : "Create Account"}
            <ArrowRight className="w-6 h-6" strokeWidth={3} />
          </button>
        </form>

        {/* Social Login Divider */}
        <div className="relative flex items-center py-4">
          <div className="grow border-t-2 border-black"></div>
          <span className="shrink mx-4 text-xs font-black uppercase tracking-[0.2em]">
            or continue as
          </span>
          <div className="grow border-t-2 border-black"></div>
        </div>

        {/* Guest Login Button */}
        <div className="grid grid-cols-1 gap-4">
          <Link
            to="/"
            className="w-full bg-white h-14 neo-border neo-shadow neo-button-active font-black text-sm uppercase flex items-center justify-center gap-3"
          >
            Guest
          </Link>
        </div>

        {/* Login Link */}
        <p className="text-center font-bold text-sm">
          Already have an account?{" "}
          <Link
            to="/login"
            className="underline decoration-yellow-400 decoration-4 underline-offset-2"
          >
            Log In
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Register
