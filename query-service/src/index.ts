import express from 'express'
import type { Request, Response } from 'express'

import eventsRouter from './routes/events.ts'

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(express.json())

app.use('/events', eventsRouter)

// Ping endpoint
app.get('/ping', (req: Request, res: Response) => {
  res.json({ message: 'pong' })
})

// Start server
app.listen(PORT, () => {
  console.log(`Query service listening on port ${PORT}`)
})
