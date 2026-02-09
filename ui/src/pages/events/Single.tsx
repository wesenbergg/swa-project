import { useState, useEffect, useMemo } from "react"
import { useParams, Link } from "react-router"

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

function Single() {
  const { event: id } = useParams<{ event: string }>()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [events, setEvents] = useState<Event[]>([])

  const event = useMemo(() => {
    return events.find(e => String(e.id) === id)
  }, [events, id])
  console.log(
    events.map(e => e.id),
    id,
  )

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
      <main>
        <p>Loading...</p>
      </main>
    )
  }

  if (error || !event) {
    return (
      <main>
        <p style={{ color: "red" }}>{error || "Event not found"}</p>
        <Link to="/">← Back to Events</Link>
      </main>
    )
  }

  return (
    <main>
      <Link to="/">← Back to Events</Link>

      <h1>{event.title}</h1>

      {event.fixed_event_type && (
        <p>
          <strong>Event Type:</strong> {event.fixed_event_type}
        </p>
      )}

      {event.category && (
        <p>
          <strong>Category:</strong> {event.category}
        </p>
      )}

      <h2>Description</h2>
      <p>{event.description || "No description provided"}</p>

      <h2>Date & Time</h2>
      <p>
        <strong>Date:</strong> {new Date(event.date).toLocaleDateString()}
      </p>
      {event.time && (
        <p>
          <strong>Time:</strong> {event.time}
        </p>
      )}

      <h2>Location</h2>
      {event.location && (
        <p>
          <strong>Location:</strong> {event.location}
        </p>
      )}
      {event.fixed_location && (
        <p>
          <strong>Venue:</strong> {event.fixed_location}
        </p>
      )}
      {event.map && (
        <p>
          <a href={event.map} target="_blank" rel="noopener noreferrer">
            View on Map →
          </a>
        </p>
      )}

      {(event.organizer || event.organizer_url || event.responsible) && (
        <>
          <h2>Organizer Information</h2>
          {event.organizer && (
            <p>
              <strong>Organizer:</strong> {event.organizer}
            </p>
          )}
          {event.organizer_url && (
            <p>
              <a
                href={event.organizer_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                Organizer Website →
              </a>
            </p>
          )}
          {event.show_responsible && event.responsible && (
            <p>
              <strong>Responsible Person:</strong> {event.responsible}
            </p>
          )}
        </>
      )}

      <h2>Payment</h2>
      <p>
        <strong>Paid Event:</strong> {event.paid ? "Yes" : "No"}
      </p>
      {event.paid && event.price && (
        <p>
          <strong>Price:</strong> {event.price}
        </p>
      )}

      <h2>Event Details</h2>
      <p>
        <strong>Alcohol Level:</strong> {event.alcohol_meter}/5
      </p>

      <h2>Participation</h2>
      <p>
        <strong>Can Participate:</strong> {event.can_participate ? "Yes" : "No"}
      </p>
      <p>
        <strong>Membership Required:</strong>{" "}
        {event.membership_required ? "Yes" : "No"}
      </p>
      <p>
        <strong>Avec Allowed:</strong> {event.avec ? "Yes" : "No"}
      </p>
      {event.max_participants && (
        <p>
          <strong>Maximum Participants:</strong> {event.max_participants}
        </p>
      )}

      {(event.registration_starts ||
        event.registration_ends ||
        event.cancellation_starts ||
        event.cancellation_ends) && (
        <>
          <h2>Registration & Cancellation</h2>
          {event.registration_starts && (
            <p>
              <strong>Registration Opens:</strong>{" "}
              {new Date(event.registration_starts).toLocaleString()}
            </p>
          )}
          {event.registration_ends && (
            <p>
              <strong>Registration Closes:</strong>{" "}
              {new Date(event.registration_ends).toLocaleString()}
            </p>
          )}
          {event.cancellation_starts && (
            <p>
              <strong>Cancellation Opens:</strong>{" "}
              {new Date(event.cancellation_starts).toLocaleString()}
            </p>
          )}
          {event.cancellation_ends && (
            <p>
              <strong>Cancellation Closes:</strong>{" "}
              {new Date(event.cancellation_ends).toLocaleString()}
            </p>
          )}
        </>
      )}

      {event.template && (
        <p>
          <em>This event is saved as a template</em>
        </p>
      )}
    </main>
  )
}

export default Single
