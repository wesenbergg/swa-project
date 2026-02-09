import { useState, useEffect } from "react"
import { Link } from "react-router"
import { Calendar, Clock, MapPin, Zap } from "lucide-react"

interface Event {
  id: number
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

const API_BASE_URL = "http://localhost:8000"

function Home() {
  const [isLoading, setIsLoading] = useState(false)
  const [events, setEvents] = useState<Event[]>([])

  const fetchEvents = async () => {
    setIsLoading(true)

    try {
      const response = await fetch(`${API_BASE_URL}/api/events`)

      if (!response.ok) {
        throw new Error("Failed to fetch events")
      }

      const data = await response.json()

      setEvents(data as Event[])
    } catch (err) {
      setEvents([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchEvents()
  }, [])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const month = date.toLocaleDateString("en-US", { month: "short" })
    const day = date.getDate()
    return { month, day }
  }

  const formatTime = (timeString?: string) => {
    if (!timeString) return null
    return timeString
  }

  return (
    <div className="text-black antialiased pb-24">
      {/* Main Content */}
      <main className="max-w-md mx-auto p-4 pt-8 space-y-10">
        {isLoading && (
          <div className="text-center py-8">
            <p className="font-black text-lg uppercase">Loading...</p>
          </div>
        )}

        {!isLoading && events.length === 0 && (
          <div className="text-center py-8">
            <p className="font-black text-lg uppercase">No events found</p>
          </div>
        )}

        {events.map(event => {
          const { month, day } = formatDate(event.date)

          return (
            <article
              key={event.id}
              className="bg-white neo-border neo-shadow-lg overflow-hidden flex flex-col"
            >
              {/* Event Image */}
              <div className="relative h-48 border-b-4 border-black bg-gray-200">
                <div className="absolute inset-0 bg-linear-to-br from-gray-300 to-gray-400 flex items-center justify-center">
                  <Calendar
                    className="w-16 h-16 text-gray-500"
                    strokeWidth={2.5}
                  />
                </div>
                <div className="absolute top-4 left-4 bg-[#FFDE00] neo-border p-2 min-w-12.5 text-center neo-shadow">
                  <div className="text-[10px] font-black uppercase leading-none">
                    {month}
                  </div>
                  <div className="text-xl font-black leading-none">{day}</div>
                </div>
              </div>

              {/* Event Details */}
              <div className="p-5 space-y-4">
                <div className="flex justify-between items-start gap-4">
                  <h2 className="text-2xl font-black uppercase leading-none tracking-tight">
                    {event.title}
                  </h2>
                  {event.paid && event.price ? (
                    <span className="bg-[#FFDE00] neo-border px-2 py-1 font-black text-lg">
                      {event.price}
                    </span>
                  ) : (
                    <span className="bg-white neo-border px-2 py-1 font-black text-lg italic">
                      FREE
                    </span>
                  )}
                </div>

                <div className="space-y-2">
                  {event.time && (
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5" strokeWidth={3} />
                      <span className="font-bold text-sm">
                        {formatTime(event.time)}
                      </span>
                    </div>
                  )}
                  {event.location && (
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5" strokeWidth={3} />
                      <span className="font-bold text-sm uppercase">
                        {event.location}
                      </span>
                    </div>
                  )}
                </div>

                <Link to={`/events/${event.id}`} className="block">
                  <button className="w-full bg-[#FFDE00] py-4 neo-border neo-shadow neo-button-active font-black text-lg uppercase flex items-center justify-center gap-2 group">
                    Join Event
                    <Zap
                      className="w-5 h-5"
                      strokeWidth={3}
                      fill="currentColor"
                    />
                  </button>
                </Link>
              </div>
            </article>
          )
        })}
      </main>
    </div>
  )
}

export default Home
