// User entity from database
export interface User {
  id: string;
  username: string;
  password_hash: string;
  role: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

// DTO for user registration
export interface CreateUserDto {
  username: string;
  password: string;
}

// DTO for user login
export interface LoginDto {
  username: string;
  password: string;
}

// Response object for successful authentication
export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: {
    id: string;
    username: string;
    role: string;
  };
}

// DTO for token refresh
export interface RefreshTokenDto {
  refreshToken: string;
}

// Refresh token entity from database
export interface RefreshToken {
  id: string;
  user_id: string;
  token_hash: string;
  expires_at: Date;
  created_at: Date;
  revoked_at: Date | null;
}

// Public user info (without sensitive data)
export interface UserPublic {
  id: string;
  username: string;
  role: string;
  created_at: Date;
}
