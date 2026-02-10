import { useState, type SubmitEvent } from "react"
import { useNavigate } from "react-router"

const New = () => {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const token = localStorage.getItem("token")

  const createEvent = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!token) {
      setError("You must be logged in to create an event.")
      navigate("/login")
      return
    }

    const formData = new FormData(e.currentTarget)

    // Helper to normalize empty strings to undefined
    const getStringOrUndefined = (key: string): string | undefined => {
      const value = formData.get(key) as string
      return value?.trim() ? value : undefined
    }

    const eventData = {
      title: formData.get("title") as string,
      description: getStringOrUndefined("description"),
      date: formData.get("date") as string,
      time: getStringOrUndefined("time"),
      location: getStringOrUndefined("location"),
      fixed_location: getStringOrUndefined("fixed_location"),
      fixed_event_type: getStringOrUndefined("fixed_event_type"),
      category: getStringOrUndefined("category"),
      organizer: getStringOrUndefined("organizer"),
      organizer_url: getStringOrUndefined("organizer_url"),
      responsible: getStringOrUndefined("responsible"),
      show_responsible: formData.get("show_responsible") === "on",
      paid: formData.get("paid") === "on",
      price: getStringOrUndefined("price"),
      map: getStringOrUndefined("map"),
      alcohol_meter: formData.get("alcohol_meter")
        ? parseInt(formData.get("alcohol_meter") as string)
        : 0,
      can_participate: formData.get("can_participate") === "on",
      membership_required: formData.get("membership_required") === "on",
      avec: formData.get("avec") === "on",
      max_participants: formData.get("max_participants")
        ? parseInt(formData.get("max_participants") as string)
        : undefined,
      registration_starts: getStringOrUndefined("registration_starts"),
      registration_ends: getStringOrUndefined("registration_ends"),
      cancellation_starts: getStringOrUndefined("cancellation_starts"),
      cancellation_ends: getStringOrUndefined("cancellation_ends"),
      template: formData.get("template") === "on",
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/events`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(eventData),
        },
      )

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Session expired. Please login again.")
        }
        throw new Error("Failed to create event")
      }
      navigate("/")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create event")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main>
      <h1>Create New Event</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={createEvent}>
        <h2>Basic Information</h2>
        <div>
          <label htmlFor="title">Title *</label>
          <input type="text" id="title" name="title" required />
        </div>

        <div>
          <label htmlFor="description">Description</label>
          <textarea id="description" name="description" rows={4}></textarea>
        </div>

        <div>
          <label htmlFor="date">Date *</label>
          <input type="date" id="date" name="date" required />
        </div>

        <div>
          <label htmlFor="time">Time</label>
          <input type="time" id="time" name="time" />
        </div>

        <h2>Location</h2>
        <div>
          <label htmlFor="location">Location</label>
          <input type="text" id="location" name="location" />
        </div>

        <div>
          <label htmlFor="fixed_location">Fixed Location</label>
          <input type="text" id="fixed_location" name="fixed_location" />
        </div>

        <div>
          <label htmlFor="map">Map URL</label>
          <input
            type="url"
            id="map"
            name="map"
            placeholder="https://maps.google.com/..."
          />
        </div>

        <h2>Event Type & Category</h2>
        <div>
          <label htmlFor="fixed_event_type">Event Type</label>
          <input
            type="text"
            id="fixed_event_type"
            name="fixed_event_type"
            placeholder="e.g., Peli-ilta, Kokous"
          />
        </div>

        <div>
          <label htmlFor="category">Category</label>
          <input type="text" id="category" name="category" />
        </div>

        <h2>Organizer Information</h2>
        <div>
          <label htmlFor="organizer">Organizer</label>
          <input type="text" id="organizer" name="organizer" />
        </div>

        <div>
          <label htmlFor="organizer_url">Organizer URL</label>
          <input type="url" id="organizer_url" name="organizer_url" />
        </div>

        <div>
          <label htmlFor="responsible">Responsible Person</label>
          <input type="text" id="responsible" name="responsible" />
        </div>

        <div>
          <label htmlFor="show_responsible">
            <input
              type="checkbox"
              id="show_responsible"
              name="show_responsible"
            />
            Show Responsible Person
          </label>
        </div>

        <h2>Payment</h2>
        <div>
          <label htmlFor="paid">
            <input type="checkbox" id="paid" name="paid" />
            Paid Event
          </label>
        </div>

        <div>
          <label htmlFor="price">Price</label>
          <input
            type="text"
            id="price"
            name="price"
            placeholder="e.g., 15€, 0€"
          />
        </div>

        <h2>Event Details</h2>
        <div>
          <label htmlFor="alcohol_meter">Alcohol Meter (0-5)</label>
          <input
            type="number"
            id="alcohol_meter"
            name="alcohol_meter"
            min="0"
            max="5"
            defaultValue="0"
          />
        </div>

        <h2>Participation</h2>
        <div>
          <label htmlFor="can_participate">
            <input
              type="checkbox"
              id="can_participate"
              name="can_participate"
              defaultChecked
            />
            Can Participate
          </label>
        </div>

        <div>
          <label htmlFor="membership_required">
            <input
              type="checkbox"
              id="membership_required"
              name="membership_required"
            />
            Membership Required
          </label>
        </div>

        <div>
          <label htmlFor="avec">
            <input type="checkbox" id="avec" name="avec" />
            Allow Avec (Bring Guest)
          </label>
        </div>

        <div>
          <label htmlFor="max_participants">Maximum Participants</label>
          <input
            type="number"
            id="max_participants"
            name="max_participants"
            min="1"
          />
        </div>

        <h2>Registration & Cancellation</h2>
        <div>
          <label htmlFor="registration_starts">Registration Starts</label>
          <input
            type="datetime-local"
            id="registration_starts"
            name="registration_starts"
          />
        </div>

        <div>
          <label htmlFor="registration_ends">Registration Ends</label>
          <input
            type="datetime-local"
            id="registration_ends"
            name="registration_ends"
          />
        </div>

        <div>
          <label htmlFor="cancellation_starts">Cancellation Starts</label>
          <input
            type="datetime-local"
            id="cancellation_starts"
            name="cancellation_starts"
          />
        </div>

        <div>
          <label htmlFor="cancellation_ends">Cancellation Ends</label>
          <input
            type="datetime-local"
            id="cancellation_ends"
            name="cancellation_ends"
          />
        </div>

        <h2>Other</h2>
        <div>
          <label htmlFor="template">
            <input type="checkbox" id="template" name="template" />
            Save as Template
          </label>
        </div>

        <button type="submit" disabled={isLoading}>
          {isLoading ? "Creating..." : "Create Event"}
        </button>
      </form>
    </main>
  )
}

export default New
