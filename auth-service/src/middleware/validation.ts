import type { Request, Response, NextFunction } from 'express'

/**
 * Validate registration input
 */
export function validateRegistration(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { username, password } = req.body

  // Validate username
  if (!username || typeof username !== 'string') {
    return res.status(400).json({ error: 'Username is required' })
  }
  if (username.length < 3 || username.length > 30) {
    return res
      .status(400)
      .json({ error: 'Username must be between 3 and 30 characters' })
  }
  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    return res.status(400).json({
      error: 'Username can only contain letters, numbers, and underscores',
    })
  }

  // Validate password
  if (!password || typeof password !== 'string') {
    return res.status(400).json({ error: 'Password is required' })
  }
  if (password.length < 8) {
    return res
      .status(400)
      .json({ error: 'Password must be at least 8 characters long' })
  }

  next()
}

/**
 * Validate login input
 */
export function validateLogin(req: Request, res: Response, next: NextFunction) {
  const { username, password } = req.body

  if (!username || typeof username !== 'string') {
    return res.status(400).json({ error: 'Username is required' })
  }

  if (!password || typeof password !== 'string') {
    return res.status(400).json({ error: 'Password is required' })
  }

  next()
}

/**
 * Validate refresh token input
 */
export function validateRefreshToken(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { refreshToken } = req.body

  if (!refreshToken || typeof refreshToken !== 'string') {
    return res.status(400).json({ error: 'Refresh token is required' })
  }

  next()
}
