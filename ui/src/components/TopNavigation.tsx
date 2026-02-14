import { useState } from "react"
import { Search, User, LogIn } from "lucide-react"
import { Link, useNavigate } from "react-router"

const categories = ["All Events", "Sports"]

const TopNavigation = () => {
  const [selectedCategory, setSelectedCategory] = useState("All Events")
  const navigate = useNavigate()
  const isLoggedIn = !!localStorage.getItem("token")

  return (
    <>
      <header className="max-w-md md:max-w-4xl lg:max-w-7xl mx-auto px-2 py-6">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xs font-black uppercase tracking-widest text-gray-500 mb-1">
              Student Org
            </span>
            <h1 className="text-3xl font-black italic tracking-tighter uppercase">
              Upcoming Events
            </h1>
          </div>
          <div className="flex gap-2">
            <button className="w-10 h-10 flex items-center justify-center bg-white neo-border neo-shadow neo-button-active">
              <Search className="w-5 h-5" strokeWidth={3} />
            </button>

            {isLoggedIn ? (
              <Link
                to="/profile"
                className="w-10 h-10 flex items-center justify-center bg-white neo-border neo-shadow neo-button-active"
                title="Profile"
              >
                <User className="w-5 h-5" strokeWidth={3} />
              </Link>
            ) : (
              <button
                onClick={() => navigate("/login")}
                className="w-10 h-10 flex items-center justify-center bg-white neo-border neo-shadow neo-button-active"
                title="Log In"
              >
                <LogIn className="w-5 h-5" strokeWidth={3} />
              </button>
            )}
          </div>
        </div>
        <div className="mx-auto flex gap-3 mt-6 overflow-x-auto no-scrollbar pb-2">
          {categories.map(category => (
            <Link
              to="/"
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-1 neo-border neo-shadow text-xs font-black uppercase whitespace-nowrap ${
                selectedCategory === category ? "bg-yellow-400" : "bg-white"
              }`}
            >
              {category}
            </Link>
          ))}
        </div>
      </header>
    </>
  )
}
export default TopNavigation
