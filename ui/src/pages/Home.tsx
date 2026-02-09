import { useState, useEffect } from "react"
import { Link } from "react-router"

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

  const logout = () => {
    localStorage.removeItem("token")
  }

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

  return (
    <main>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1>Events Manager</h1>
        <button onClick={logout}>Logout</button>
      </div>

      <h2>Events</h2>
      {isLoading && <p>Loading...</p>}
      {events?.length === 0 && !isLoading && <p>No events found</p>}
      <ul>
        {events?.map(event => (
          <li key={event.id}>
            <Link to={`/events/${event.id}`}>
              <h3>{event.title}</h3>
              <p>{event.description}</p>
              <p>Date: {new Date(event.date).toLocaleDateString()}</p>
              <p>Location: {event.location}</p>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  )
}

export default Home
