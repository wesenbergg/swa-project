import { Router } from "express";
import type { Request, Response } from "express";
import { pool } from "../db.ts";
import { hashPassword, verifyPassword } from "../utils/password.ts";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  hashToken,
  getRefreshTokenExpiry,
} from "../utils/tokens.ts";
import {
  validateRegistration,
  validateLogin,
  validateRefreshToken,
} from "../middleware/validation.ts";
import type {
  User,
  CreateUserDto,
  LoginDto,
  TokenResponse,
  RefreshTokenDto,
} from "../types.ts";

const router = Router();

/**
 * POST /auth/register
 * Register a new user
 */
router.post(
  "/register",
  validateRegistration,
  async (req: Request, res: Response) => {
    try {
      const { username, email, password }: CreateUserDto = req.body;

      // Check if username already exists
      const usernameCheck = await pool.query(
        "SELECT id FROM users WHERE username = $1",
        [username],
      );
      if (usernameCheck.rows.length > 0) {
        return res.status(409).json({ error: "Username already exists" });
      }

      // Check if email already exists
      const emailCheck = await pool.query(
        "SELECT id FROM users WHERE email = $1",
        [email],
      );
      if (emailCheck.rows.length > 0) {
        return res.status(409).json({ error: "Email already exists" });
      }

      // Hash password
      const password_hash = await hashPassword(password);

      // Insert new user
      const result = await pool.query(
        `INSERT INTO users (username, email, password_hash, role, is_active, created_at, updated_at)
       VALUES ($1, $2, $3, 'user', true, NOW(), NOW())
       RETURNING id, username, email, role, created_at`,
        [username, email, password_hash],
      );

      const user = result.rows[0];

      return res.status(201).json({
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        created_at: user.created_at,
      });
    } catch (error) {
      console.error("Registration error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  },
);

/**
 * POST /auth/login
 * Authenticate user and return tokens
 */
router.post("/login", validateLogin, async (req: Request, res: Response) => {
  try {
    const { username, password }: LoginDto = req.body;

    // Find user by username or email
    const result = await pool.query(
      "SELECT id, username, email, password_hash, role, is_active FROM users WHERE username = $1 OR email = $1",
      [username],
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const user: User = result.rows[0];

    // Check if user is active
    if (!user.is_active) {
      return res.status(401).json({ error: "Account is disabled" });
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate tokens
    const accessToken = generateAccessToken(user.id, user.username, user.role);
    const refreshToken = generateRefreshToken(user.id);

    // Store refresh token hash in database
    const tokenHash = hashToken(refreshToken);
    const expiresAt = getRefreshTokenExpiry();
    await pool.query(
      "INSERT INTO refresh_tokens (user_id, token_hash, expires_at, created_at) VALUES ($1, $2, $3, NOW())",
      [user.id, tokenHash, expiresAt],
    );

    const response: TokenResponse = {
      accessToken,
      refreshToken,
      expiresIn: 900, // 15 minutes in seconds
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    };

    return res.json(response);
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * POST /auth/refresh
 * Refresh access token using refresh token
 */
router.post(
  "/refresh",
  validateRefreshToken,
  async (req: Request, res: Response) => {
    try {
      const { refreshToken }: RefreshTokenDto = req.body;

      // Verify refresh token
      const decoded = verifyRefreshToken(refreshToken);
      if (!decoded) {
        return res
          .status(401)
          .json({ error: "Invalid or expired refresh token" });
      }

      // Check if token exists in database and is not revoked
      const tokenHash = hashToken(refreshToken);
      const tokenResult = await pool.query(
        "SELECT id, user_id, expires_at, revoked_at FROM refresh_tokens WHERE token_hash = $1",
        [tokenHash],
      );

      if (tokenResult.rows.length === 0) {
        return res.status(401).json({ error: "Invalid refresh token" });
      }

      const storedToken = tokenResult.rows[0];

      // Check if token is revoked
      if (storedToken.revoked_at) {
        return res
          .status(401)
          .json({ error: "Refresh token has been revoked" });
      }

      // Check if token is expired
      if (new Date(storedToken.expires_at) < new Date()) {
        return res.status(401).json({ error: "Refresh token has expired" });
      }

      // Get user info
      const userResult = await pool.query(
        "SELECT id, username, email, role, is_active FROM users WHERE id = $1",
        [storedToken.user_id],
      );

      if (userResult.rows.length === 0 || !userResult.rows[0].is_active) {
        return res.status(401).json({ error: "User not found or inactive" });
      }

      const user = userResult.rows[0];

      // Generate new access token
      const newAccessToken = generateAccessToken(
        user.id,
        user.username,
        user.role,
      );

      // Optionally rotate refresh token (generate new one and revoke old)
      const newRefreshToken = generateRefreshToken(user.id);
      const newTokenHash = hashToken(newRefreshToken);
      const newExpiresAt = getRefreshTokenExpiry();

      // Revoke old token
      await pool.query(
        "UPDATE refresh_tokens SET revoked_at = NOW() WHERE id = $1",
        [storedToken.id],
      );

      // Store new refresh token
      await pool.query(
        "INSERT INTO refresh_tokens (user_id, token_hash, expires_at, created_at) VALUES ($1, $2, $3, NOW())",
        [user.id, newTokenHash, newExpiresAt],
      );

      const response: TokenResponse = {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        expiresIn: 900, // 15 minutes in seconds
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
      };

      return res.json(response);
    } catch (error) {
      console.error("Token refresh error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  },
);

/**
 * POST /auth/logout
 * Revoke refresh token
 */
router.post(
  "/logout",
  validateRefreshToken,
  async (req: Request, res: Response) => {
    try {
      const { refreshToken }: RefreshTokenDto = req.body;

      // Hash the token
      const tokenHash = hashToken(refreshToken);

      // Revoke the token
      const result = await pool.query(
        "UPDATE refresh_tokens SET revoked_at = NOW() WHERE token_hash = $1 AND revoked_at IS NULL",
        [tokenHash],
      );

      if (result.rowCount === 0) {
        // Token doesn't exist or already revoked - still return success
        return res.status(204).send();
      }

      return res.status(204).send();
    } catch (error) {
      console.error("Logout error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  },
);

export default router;
