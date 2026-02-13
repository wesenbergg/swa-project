import jwt from "jsonwebtoken";
import crypto from "crypto";

const JWT_SECRET =
  process.env.JWT_SECRET || "my-secret-key-change-in-production";

/**
 * Generate an access token for a user
 * This token is validated by Kong Gateway
 * @param userId - User's UUID
 * @param username - User's username
 * @param role - User's role
 * @returns JWT access token
 */
export function generateAccessToken(
  userId: string,
  username: string,
  role: string,
): string {
  return jwt.sign(
    {
      iss: "default-key", // Required by Kong - must match consumer key
      sub: userId,
      username: username,
      role: role,
      exp: Math.floor(Date.now() / 1000) + 15 * 60, // 15 minutes
    },
    JWT_SECRET,
    { algorithm: "HS256" },
  );
}

/**
 * Generate a refresh token for a user
 * This token is used to obtain new access tokens
 * @param userId - User's UUID
 * @returns JWT refresh token
 */
export function generateRefreshToken(userId: string): string {
  return jwt.sign(
    {
      sub: userId,
      type: "refresh",
      exp: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60, // 7 days
    },
    JWT_SECRET,
    { algorithm: "HS256" },
  );
}

/**
 * Verify and decode a refresh token
 * @param token - Refresh token to verify
 * @returns Decoded payload or null if invalid
 */
export function verifyRefreshToken(
  token: string,
): { sub: string; type: string; exp: number } | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET, {
      algorithms: ["HS256"],
    }) as any;

    // Ensure it's a refresh token
    if (decoded.type !== "refresh") {
      return null;
    }

    return decoded;
  } catch (error) {
    return null;
  }
}

/**
 * Hash a token for storage in database
 * We never store plain tokens - only hashes
 * @param token - Token to hash
 * @returns SHA-256 hash of the token
 */
export function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

/**
 * Calculate expiry date for refresh tokens
 * @returns Date object 7 days in the future
 */
export function getRefreshTokenExpiry(): Date {
  const date = new Date();
  date.setDate(date.getDate() + 7);
  return date;
}
