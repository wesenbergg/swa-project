import { useState, type SubmitEvent } from "react"
import { redirect } from "react-router"

const API_BASE_URL = "http://localhost:8000"

const New = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const token = localStorage.getItem("token")

  const createEvent = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!token) return

    const formData = new FormData(e.currentTarget)
    const eventData = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      date: formData.get("date") as string,
      time: formData.get("time") as string,
      location: formData.get("location") as string,
      fixed_location: formData.get("fixed_location") as string,
      fixed_event_type: formData.get("fixed_event_type") as string,
      category: formData.get("category") as string,
      organizer: formData.get("organizer") as string,
      organizer_url: formData.get("organizer_url") as string,
      responsible: formData.get("responsible") as string,
      show_responsible: formData.get("show_responsible") === "on",
      paid: formData.get("paid") === "on",
      price: formData.get("price") as string,
      map: formData.get("map") as string,
      alcohol_meter: formData.get("alcohol_meter")
        ? parseInt(formData.get("alcohol_meter") as string)
        : 0,
      can_participate: formData.get("can_participate") === "on",
      membership_required: formData.get("membership_required") === "on",
      avec: formData.get("avec") === "on",
      max_participants: formData.get("max_participants")
        ? parseInt(formData.get("max_participants") as string)
        : undefined,
      registration_starts: formData.get("registration_starts") as string,
      registration_ends: formData.get("registration_ends") as string,
      cancellation_starts: formData.get("cancellation_starts") as string,
      cancellation_ends: formData.get("cancellation_ends") as string,
      template: formData.get("template") === "on",
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`${API_BASE_URL}/api/events`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(eventData),
      })

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Session expired. Please login again.")
        }
        throw new Error("Failed to create event")
      }
      redirect("/")
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
