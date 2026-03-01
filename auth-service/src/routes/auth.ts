import { Router } from 'express'
import type { Request, Response } from 'express'
import { pool } from '../db.ts'
import { hashPassword, verifyPassword } from '../utils/password.ts'
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  hashToken,
  getRefreshTokenExpiry,
} from '../utils/tokens.ts'
import {
  validateRegistration,
  validateLogin,
  validateRefreshToken,
} from '../middleware/validation.ts'
import type {
  User,
  CreateUserDto,
  LoginDto,
  TokenResponse,
  RefreshTokenDto,
} from '../types.ts'

const router = Router()

/**
 * POST /auth/register
 * Register a new user
 */
router.post(
  '/register',
  validateRegistration,
  async (req: Request, res: Response) => {
    try {
      const { username, password }: CreateUserDto = req.body

      // Check if username already exists
      const usernameCheck = await pool.query(
        'SELECT id FROM users WHERE username = $1',
        [username],
      )
      if (usernameCheck.rows.length > 0) {
        return res.status(409).json({ error: 'Username already exists' })
      }

      // Hash password
      const password_hash = await hashPassword(password)

      // Insert new user
      const result = await pool.query(
        `INSERT INTO users (username, password_hash, role, is_active, created_at, updated_at)
       VALUES ($1, $2, 'user', true, NOW(), NOW())
       RETURNING id, username, role, created_at`,
        [username, password_hash],
      )

      const user = result.rows[0]

      return res.status(201).json({
        id: user.id,
        username: user.username,
        role: user.role,
        created_at: user.created_at,
      })
    } catch (error) {
      console.error('Registration error:', error)
      return res.status(500).json({ error: 'Internal server error' })
    }
  },
)

/**
 * POST /auth/login
 * Authenticate user and return tokens
 */
router.post('/login', validateLogin, async (req: Request, res: Response) => {
  try {
    const { username, password }: LoginDto = req.body

    // Find user by username
    const result = await pool.query(
      'SELECT id, username, password_hash, role, is_active FROM users WHERE username = $1',
      [username],
    )

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    const user: User = result.rows[0]

    // Check if user is active
    if (!user.is_active) {
      return res.status(401).json({ error: 'Account is disabled' })
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, user.password_hash)
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    // Generate tokens
    const accessToken = generateAccessToken(user.id, user.username, user.role)
    const refreshToken = generateRefreshToken(user.id)

    // Store refresh token hash in database
    const tokenHash = hashToken(refreshToken)
    const expiresAt = getRefreshTokenExpiry()
    await pool.query(
      'INSERT INTO refresh_tokens (user_id, token_hash, expires_at, created_at) VALUES ($1, $2, $3, NOW())',
      [user.id, tokenHash, expiresAt],
    )

    const response: TokenResponse = {
      accessToken,
      refreshToken,
      expiresIn: 900, // 15 minutes in seconds
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
    }

    return res.json(response)
  } catch (error) {
    console.error('Login error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
})

export default router
