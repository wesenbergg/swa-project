import express from "express";
import jwt from "jsonwebtoken";

const app = express();
const PORT = process.env.PORT || 3003;
const JWT_SECRET = process.env.JWT_SECRET || "secret-key";

app.use(express.json());

// Health check
app.get("/ping", (req, res) => {
  res.json({ message: "Auth service is running" });
});

// Simple login endpoint - returns JWT token
app.post("/auth/login", (req, res) => {
  const { username, password } = req.body;

  // Simple validation (in production, verify against a database)
  if (!username || !password) {
    return res.status(400).json({ error: "Username and password required" });
  }

  // For demo purposes, accept any credentials
  // In production, verify credentials against database
  if (password === "admin123") {
    const token = jwt.sign(
      {
        iss: "default-key",
        sub: username,
        username: username,
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24, // 24 hours
      },
      JWT_SECRET,
      { algorithm: "HS256" },
    );

    return res.json({
      token,
      expiresIn: 86400,
      user: { username },
    });
  }

  return res.status(401).json({ error: "Invalid credentials" });
});

app.listen(PORT, () => {
  console.log(`Auth service running on port ${PORT}`);
});
