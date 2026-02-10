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
    const {
      title,
      description,
      date,
      time,
      location,
      fixed_location,
      fixed_event_type,
      category,
      organizer,
      organizer_url,
      responsible,
      show_responsible = false,
      paid = false,
      price,
      map,
      alcohol_meter = 0,
      can_participate = true,
      membership_required = false,
      avec = false,
      max_participants,
      registration_starts,
      registration_ends,
      cancellation_starts,
      cancellation_ends,
      template = false,
    } = req.body;

    if (!title || !date) {
      res.status(400).json({ error: "Title and date are required" });
      return;
    }

    try {
      const id = randomUUID();
      const now = new Date().toISOString();

      const result = await pool.query(
        `INSERT INTO events (
          id, title, description, date, time, location, fixed_location,
          fixed_event_type, category, organizer, organizer_url, responsible,
          show_responsible, paid, price, map, alcohol_meter, can_participate,
          membership_required, avec, max_participants, registration_starts,
          registration_ends, cancellation_starts, cancellation_ends, template,
          created_at, updated_at
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15,
          $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28
        ) RETURNING *`,
        [
          id,
          title,
          description,
          date,
          time,
          location,
          fixed_location,
          fixed_event_type,
          category,
          organizer,
          organizer_url,
          responsible,
          show_responsible,
          paid,
          price,
          map,
          alcohol_meter,
          can_participate,
          membership_required,
          avec,
          max_participants,
          registration_starts,
          registration_ends,
          cancellation_starts,
          cancellation_ends,
          template,
          now,
          now,
        ],
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
    const {
      title,
      description,
      date,
      time,
      location,
      fixed_location,
      fixed_event_type,
      category,
      organizer,
      organizer_url,
      responsible,
      show_responsible,
      paid,
      price,
      map,
      alcohol_meter,
      can_participate,
      membership_required,
      avec,
      max_participants,
      registration_starts,
      registration_ends,
      cancellation_starts,
      cancellation_ends,
      template,
    } = req.body;

    try {
      const result = await pool.query(
        `UPDATE events 
       SET title = COALESCE($1, title),
           description = COALESCE($2, description),
           date = COALESCE($3, date),
           time = COALESCE($4, time),
           location = COALESCE($5, location),
           fixed_location = COALESCE($6, fixed_location),
           fixed_event_type = COALESCE($7, fixed_event_type),
           category = COALESCE($8, category),
           organizer = COALESCE($9, organizer),
           organizer_url = COALESCE($10, organizer_url),
           responsible = COALESCE($11, responsible),
           show_responsible = COALESCE($12, show_responsible),
           paid = COALESCE($13, paid),
           price = COALESCE($14, price),
           map = COALESCE($15, map),
           alcohol_meter = COALESCE($16, alcohol_meter),
           can_participate = COALESCE($17, can_participate),
           membership_required = COALESCE($18, membership_required),
           avec = COALESCE($19, avec),
           max_participants = COALESCE($20, max_participants),
           registration_starts = COALESCE($21, registration_starts),
           registration_ends = COALESCE($22, registration_ends),
           cancellation_starts = COALESCE($23, cancellation_starts),
           cancellation_ends = COALESCE($24, cancellation_ends),
           template = COALESCE($25, template),
           updated_at = $26
       WHERE id = $27
       RETURNING *`,
        [
          title,
          description,
          date,
          time,
          location,
          fixed_location,
          fixed_event_type,
          category,
          organizer,
          organizer_url,
          responsible,
          show_responsible,
          paid,
          price,
          map,
          alcohol_meter,
          can_participate,
          membership_required,
          avec,
          max_participants,
          registration_starts,
          registration_ends,
          cancellation_starts,
          cancellation_ends,
          template,
          new Date().toISOString(),
          id,
        ],
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
