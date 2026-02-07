import { useState, useEffect } from "react";

interface Event {
  id: number;
  title: string;
  description: string;
  event_date: string;
  location: string;
}

const API_BASE_URL = "http://localhost:8000";
const AUTH_URL = "http://localhost:8000";

function App() {
  const [events, setEvents] = useState<Event[]>([]);
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token"),
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // Fetch events on component mount and when token changes
  useEffect(() => {
    if (token) {
      fetchEvents();
    }
  }, [token]);

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch(`${AUTH_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error("Login failed");
      }

      const data = await response.json();
      setToken(data.token);
      localStorage.setItem("token", data.token);
      setPassword("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem("token");
    setEvents([]);
  };

  const fetchEvents = async () => {
    if (!token) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/events`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          logout();
          throw new Error("Session expired. Please login again.");
        }
        throw new Error("Failed to fetch events");
      }

      const data = await response.json();
      setEvents(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch events");
    } finally {
      setIsLoading(false);
    }
  };

  const createEvent = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!token) return;

    const formData = new FormData(e.currentTarget);
    const eventData = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      event_date: formData.get("date") as string,
      location: formData.get("location") as string,
    };

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/events`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(eventData),
      });

      if (!response.ok) {
        if (response.status === 401) {
          logout();
          throw new Error("Session expired. Please login again.");
        }
        throw new Error("Failed to create event");
      }

      e.currentTarget.reset();
      await fetchEvents();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create event");
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <main>
        <h1>Login</h1>
        <form onSubmit={login}>
          <div>
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p style={{ color: "red" }}>{error}</p>}
          <button type="submit" disabled={isLoading}>
            {isLoading ? "Logging in..." : "Login"}
          </button>
          <p style={{ fontSize: "0.9em", color: "#666" }}>
            Use password: admin123
          </p>
        </form>
      </main>
    );
  }

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

      {error && <p style={{ color: "red" }}>{error}</p>}

      <h2>Create Event</h2>
      <form onSubmit={createEvent}>
        <div>
          <label htmlFor="title">Title</label>
          <input type="text" id="title" name="title" required />
        </div>

        <div>
          <label htmlFor="description">Description</label>
          <input type="text" id="description" name="description" />
        </div>

        <div>
          <label htmlFor="date">Date</label>
          <input type="date" id="date" name="date" required />
        </div>

        <div>
          <label htmlFor="location">Location</label>
          <input type="text" id="location" name="location" />
        </div>

        <button type="submit" disabled={isLoading}>
          {isLoading ? "Creating..." : "Create Event"}
        </button>
      </form>

      <h2>Events</h2>
      {isLoading && <p>Loading...</p>}
      {events.length === 0 && !isLoading && <p>No events found</p>}
      <ul>
        {events.map((event) => (
          <li key={event.id}>
            <h3>{event.title}</h3>
            <p>{event.description}</p>
            <p>Date: {new Date(event.event_date).toLocaleDateString()}</p>
            <p>Location: {event.location}</p>
          </li>
        ))}
      </ul>
    </main>
  );
}

export default App;
