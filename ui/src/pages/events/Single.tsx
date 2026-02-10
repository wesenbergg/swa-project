import { useState, useEffect, useMemo } from "react"
import { useParams, useNavigate } from "react-router"
import { Bookmark, Utensils, Mic, Users } from "lucide-react"

interface Event {
  id: string
  title: string
  description?: string
  date: string
  time?: string
  location?: string
  fixed_location?: string
  fixed_event_type?: string
  category?: string
  organizer?: string
  organizer_url?: string
  responsible?: string
  show_responsible: boolean
  paid: boolean
  price?: string
  map?: string
  alcohol_meter: number
  can_participate: boolean
  membership_required: boolean
  avec: boolean
  max_participants?: number
  registration_starts?: string
  registration_ends?: string
  cancellation_starts?: string
  cancellation_ends?: string
  template: boolean
}

function Single() {
  const { event: id } = useParams<{ event: string }>()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [events, setEvents] = useState<Event[]>([])

  const event = useMemo(() => {
    return events.find(e => String(e.id) === id)
  }, [events, id])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const month = date.toLocaleDateString("en-US", { month: "short" })
    const day = date.getDate()
    return `${month} ${day}`
  }

  const formatTime = (timeString?: string) => {
    if (!timeString) return "TBD"
    return timeString
  }

  const fetchEvents = async () => {
    setIsLoading(true)

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/events`,
      )

      if (!response.ok) {
        throw new Error("Failed to fetch events")
      }

      const data = await response.json()

      setEvents(data as Event[])
    } catch (err) {
      setEvents([])
      setError(err instanceof Error ? err.message : "Failed to fetch event")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchEvents()
  }, [id])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="font-black text-lg uppercase">Loading...</p>
      </div>
    )
  }

  if (error || !event) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <p className="font-black text-lg uppercase mb-4 text-red-600">
          {error || "Event not found"}
        </p>
        <button
          onClick={() => navigate("/")}
          className="bg-yellow-400 px-6 py-3 neo-border neo-shadow neo-button-active font-black uppercase"
        >
          ← Back to Events
        </button>
      </div>
    )
  }

  return (
    <div className="relative flex min-h-screen flex-col overflow-x-hidden">
      <main className="flex-1 pb-40">
        {/* Event Image */}
        <div className="p-4">
          <div className="neo-border-thick bg-white neo-shadow-lg overflow-hidden relative">
            <div className="w-full aspect-4/3 bg-linear-to-br from-gray-300 to-gray-400 border-b-4 border-black flex items-center justify-center">
              <Bookmark className="w-24 h-24 text-gray-500" strokeWidth={2} />
            </div>
            <div className="absolute top-4 left-4">
              <span className="bg-yellow-400 neo-border px-3 py-1 font-black text-xs uppercase neo-shadow">
                Top Rated
              </span>
            </div>
          </div>
        </div>

        {/* Tags */}
        <div className="px-4 pt-2">
          <div className="flex flex-wrap gap-2 mb-4">
            {event.category && (
              <span className="bg-black text-white px-3 py-1 text-xs font-black uppercase tracking-widest">
                {event.category}
              </span>
            )}
            {event.alcohol_meter === 0 && (
              <span className="bg-white neo-border px-3 py-1 text-xs font-bold uppercase tracking-widest">
                Alcohol-free
              </span>
            )}
            <span className="bg-white neo-border px-3 py-1 text-xs font-bold uppercase tracking-widest">
              In-person
            </span>
          </div>

          {/* Title */}
          <h1 className="font-black text-5xl leading-[0.95] mb-6 tracking-tighter uppercase italic">
            {event.title}
          </h1>
        </div>

        {/* Date/Time/Location Grid */}
        <div className="grid grid-cols-3 mx-4 neo-border-thick bg-black overflow-hidden mb-8 neo-shadow-lg">
          <div className="flex flex-col items-center justify-center p-4 bg-white border-r-4 border-black">
            <span className="font-black text-2xl italic">
              {formatDate(event.date)}
            </span>
            <span className="text-[9px] font-black uppercase tracking-widest text-center">
              Date
            </span>
          </div>
          <div className="flex flex-col items-center justify-center p-4 bg-white border-r-4 border-black">
            <span className="font-black text-2xl italic">
              {formatTime(event.time)}
            </span>
            <span className="text-[9px] font-black uppercase tracking-widest text-center">
              Time
            </span>
          </div>
          <div className="flex flex-col items-center justify-center p-4 bg-white">
            <span className="font-black text-xl italic truncate w-full text-center">
              {event.location || event.fixed_location || "TBD"}
            </span>
            <span className="text-[9px] font-black uppercase tracking-widest text-center">
              Location
            </span>
          </div>
        </div>

        {/* Description */}
        <div className="px-4 mb-10">
          <p className="text-lg leading-tight font-bold mb-4 border-l-8 border-yellow-400 pl-4 py-1">
            {event.description || "No description provided for this event."}
          </p>

          {event.organizer && (
            <p className="text-sm font-medium text-black/70">
              Organized by {event.organizer}
              {event.membership_required && " • Membership required"}
              {event.avec && " • Plus-ones welcome"}
            </p>
          )}
        </div>

        {/* What to Expect */}
        <div className="px-4">
          <h3 className="font-black text-2xl uppercase italic mb-6 underline decoration-yellow-400 decoration-8 underline-offset-1">
            What to Expect
          </h3>
          <div className="space-y-4">
            <div className="neo-border-thick bg-white p-4 neo-shadow flex gap-4 items-center">
              <div className="bg-yellow-400 neo-border size-10 shrink-0 flex items-center justify-center shadow-[2px_2px_0px_0px_#000000]">
                <Utensils className="w-5 h-5" strokeWidth={3} />
              </div>
              <div>
                <p className="font-black text-base uppercase leading-tight">
                  Free Food & Drinks
                </p>
                <p className="text-[11px] font-bold uppercase opacity-60">
                  Catered appetizers & beverages
                </p>
              </div>
            </div>

            <div className="neo-border-thick bg-white p-4 neo-shadow flex gap-4 items-center">
              <div className="bg-yellow-400 neo-border size-10 shrink-0 flex items-center justify-center shadow-[2px_2px_0px_0px_#000000]">
                <Mic className="w-5 h-5" strokeWidth={3} />
              </div>
              <div>
                <p className="font-black text-base uppercase leading-tight">
                  Keynote Speech
                </p>
                <p className="text-[11px] font-bold uppercase opacity-60">
                  By industry leaders
                </p>
              </div>
            </div>

            <div className="neo-border-thick bg-white p-4 neo-shadow flex gap-4 items-center">
              <div className="bg-yellow-400 neo-border size-10 shrink-0 flex items-center justify-center shadow-[2px_2px_0px_0px_#000000]">
                <Users className="w-5 h-5" strokeWidth={3} />
              </div>
              <div>
                <p className="font-black text-base uppercase leading-tight">
                  Networking
                </p>
                <p className="text-[11px] font-bold uppercase opacity-60">
                  Meet fellow students & professionals
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Participation Info */}
        {event.max_participants && (
          <div className="mx-4 mt-12 p-4 neo-border-thick bg-yellow-400/10 flex items-center gap-4">
            <div className="flex -space-x-3">
              <div className="h-12 w-12 rounded-full neo-border-thick bg-gray-300 flex items-center justify-center">
                <Users className="w-6 h-6" strokeWidth={2} />
              </div>
            </div>
            <div>
              <p className="text-sm font-black uppercase leading-none">
                Joined by{" "}
                <span className="bg-yellow-400 px-1 border border-black">
                  {Math.floor(event.max_participants * 0.7)}+ students
                </span>
              </p>
              <p className="text-xs font-bold uppercase opacity-60 mt-1">
                Limited spots remaining
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default Single
