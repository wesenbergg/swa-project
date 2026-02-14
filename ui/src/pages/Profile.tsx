import { useNavigate } from "react-router"

const Profile = () => {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem("token")
    navigate("/login")
  }

  return (
    <>
      <div className="max-w-md md:max-w-4xl lg:max-w-7xl mx-auto px-2 py-6">
        <h1 className="text-3xl font-black italic tracking-tighter uppercase">
          Your Profile
        </h1>
        <p className="mt-4 font-bold text-gray-600 uppercase tracking-widest text-xs">
          View and edit your profile information
        </p>
        <button
          onClick={handleLogout}
          className="mt-6 px-4 py-2 bg-yellow-400 neo-border neo-shadow font-bold uppercase"
        >
          Log Out
        </button>
      </div>
    </>
  )
}

export default Profile
