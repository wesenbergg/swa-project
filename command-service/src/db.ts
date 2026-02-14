import pg from 'pg'
const { Pool } = pg

// Command Service Database Connection
// Connects to main events_db for write operations (CREATE, UPDATE, DELETE)
export const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'events_db',
  user: process.env.DB_USER || 'admin',
  password: process.env.DB_PASSWORD || 'admin123',
})

pool.on('error', err => {
  console.error('Unexpected error on idle client', err)
  process.exit(-1)
})
