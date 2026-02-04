import { Router } from "express";
import type { Request, Response } from "express";
import type { CreateEventDto, UpdateEventDto } from "../types.ts";
import { randomUUID } from "crypto";
import { pool } from "../db.ts";

const router = Router();

// CREATE - Create a new event
router.post(
  "/",
  async (req: Request<{}, {}, CreateEventDto>, res: Response) => {
    const { title, description, date, location } = req.body;

    if (!title || !date) {
      res.status(400).json({ error: "Title and date are required" });
      return;
    }

    try {
      const id = randomUUID();
      const now = new Date().toISOString();

      const result = await pool.query(
        `INSERT INTO events (id, title, description, date, location, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
        [id, title, description, date, location, now, now],
      );

      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error("Error creating event:", error);
      res.status(500).json({ error: "Failed to create event" });
    }
  },
);

// READ - Get all events
router.get("/", async (req: Request, res: Response) => {
  try {
    const result = await pool.query("SELECT * FROM events ORDER BY date ASC");
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ error: "Failed to fetch events" });
  }
});

// READ - Get a single event by ID
router.get("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const result = await pool.query("SELECT * FROM events WHERE id = $1", [id]);

    if (result.rows.length === 0) {
      res.status(404).json({ error: "Event not found" });
      return;
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching event:", error);
    res.status(500).json({ error: "Failed to fetch event" });
  }
});

// UPDATE - Update an event
router.put(
  "/:id",
  async (req: Request<{ id: string }, {}, UpdateEventDto>, res: Response) => {
    const { id } = req.params;
    const { title, description, date, location } = req.body;

    try {
      const result = await pool.query(
        `UPDATE events 
       SET title = COALESCE($1, title),
           description = COALESCE($2, description),
           date = COALESCE($3, date),
           location = COALESCE($4, location),
           updated_at = $5
       WHERE id = $6
       RETURNING *`,
        [title, description, date, location, new Date().toISOString(), id],
      );

      if (result.rows.length === 0) {
        res.status(404).json({ error: "Event not found" });
        return;
      }

      res.json(result.rows[0]);
    } catch (error) {
      console.error("Error updating event:", error);
      res.status(500).json({ error: "Failed to update event" });
    }
  },
);

// DELETE - Delete an event
router.delete("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "DELETE FROM events WHERE id = $1 RETURNING id",
      [id],
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: "Event not found" });
      return;
    }

    res.status(204).send();
  } catch (error) {
    console.error("Error deleting event:", error);
    res.status(500).json({ error: "Failed to delete event" });
  }
});

export default router;
