import express from 'express'
import type { Request, Response } from 'express'
import eventsRouter from './routes/events.ts'

const app = express()
const PORT = process.env.PORT || 3002

// Middleware
app.use(express.json())

// Ping endpoint
app.post('/ping', (req: Request, res: Response) => {
  res.json({ message: 'pong' })
})

// Routes
app.use('/events', eventsRouter)

// Start server
app.listen(PORT, () => {
  console.log(`Command service listening on port ${PORT}`)
})
