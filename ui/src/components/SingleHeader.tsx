import { useState } from "react"
import { useNavigate } from "react-router"
import { ArrowLeft, Bookmark } from "lucide-react"

const SingleHeader = () => {
  const navigate = useNavigate()
  const [isBookmarked, setIsBookmarked] = useState(false)

  return (
    <>
      {/* Header Navigation */}
      <header className="sticky top-0 z-50 flex items-center bg-white px-4 py-4 justify-between border-b-4 border-black">
        <button
          onClick={() => navigate("/")}
          className="flex size-10 items-center justify-center neo-border bg-white neo-shadow neo-button-active"
        >
          <ArrowLeft className="w-5 h-5" strokeWidth={3} />
        </button>
        <h2 className="font-black text-xl uppercase tracking-tight italic">
          Event Details
        </h2>
        <button
          onClick={() => setIsBookmarked(!isBookmarked)}
          className="flex size-10 items-center justify-center neo-border bg-white neo-shadow neo-button-active"
        >
          <Bookmark
            className="w-5 h-5"
            strokeWidth={3}
            fill={isBookmarked ? "currentColor" : "none"}
          />
        </button>
      </header>
    </>
  )
}

export default SingleHeader
