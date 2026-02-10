import { Link } from "react-router"
import { Home, Compass, Ticket, User } from "lucide-react"

const BottomNavigation = () => {
  return (
    <>
      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 w-full bg-white border-t-4 border-black px-6 py-4 pb-8 z-50">
        <div className="max-w-md mx-auto flex justify-between items-center">
          <Link to="/" className="flex flex-col items-center gap-1 group">
            <div className="w-12 h-10 bg-yellow-400 neo-border neo-shadow flex items-center justify-center">
              <Home className="w-5 h-5" strokeWidth={3} />
            </div>
            <span className="text-xs font-black uppercase">Home</span>
          </Link>
          <Link to="#" className="flex flex-col items-center gap-1 group">
            <div className="w-12 h-10 bg-white neo-border neo-shadow flex items-center justify-center">
              <Compass className="w-5 h-5" strokeWidth={3} />
            </div>
            <span className="text-xs font-black uppercase">Discover</span>
          </Link>
          <Link to="#" className="flex flex-col items-center gap-1 group">
            <div className="w-12 h-10 bg-white neo-border neo-shadow flex items-center justify-center">
              <Ticket className="w-5 h-5" strokeWidth={3} />
            </div>
            <span className="text-xs font-black uppercase">Tickets</span>
          </Link>
          <Link to="#" className="flex flex-col items-center gap-1 group">
            <div className="w-12 h-10 bg-white neo-border neo-shadow flex items-center justify-center">
              <User className="w-5 h-5" strokeWidth={3} />
            </div>
            <span className="text-xs font-black uppercase">Profile</span>
          </Link>
        </div>
      </nav>
    </>
  )
}

export default BottomNavigation
