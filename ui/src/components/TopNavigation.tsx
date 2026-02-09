import { useState } from "react"
import { Search, LogOut } from "lucide-react"

const categories = ["All Events", "Social", "Academic", "Workshops"]

const TopNavigation = () => {
  const [selectedCategory, setSelectedCategory] = useState("All Events")

  const logout = () => {
    localStorage.removeItem("token")
    window.location.href = "/login"
  }
  return (
    <>
      <header className="sticky top-0 z-50 bg-white border-b-4 border-black px-4 py-6">
        <div className="max-w-md mx-auto flex items-center justify-between">
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
            <button
              onClick={logout}
              className="w-10 h-10 flex items-center justify-center bg-white neo-border neo-shadow neo-button-active"
              title="Logout"
            >
              <LogOut className="w-5 h-5" strokeWidth={3} />
            </button>
          </div>
        </div>
        <div className="max-w-md mx-auto flex gap-3 mt-6 overflow-x-auto no-scrollbar pb-2">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-1 neo-border neo-shadow text-xs font-black uppercase whitespace-nowrap ${
                selectedCategory === category ? "bg-[#FFDE00]" : "bg-white"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </header>
    </>
  )
}
export default TopNavigation
