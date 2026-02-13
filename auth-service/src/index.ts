import express from "express";
import authRouter from "./routes/auth.ts";
import { pool } from "./db.ts";

const app = express();
const PORT = process.env.PORT || 3003;

app.use(express.json());

// Health check with database connection test
app.get("/ping", async (req, res) => {
  try {
    // Test database connection
    await pool.query("SELECT 1");
    res.json({
      message: "Auth service is running",
      database: "connected",
    });
  } catch (error) {
    res.status(503).json({
      message: "Auth service is running",
      database: "disconnected",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Mount auth routes
app.use("/auth", authRouter);

app.listen(PORT, () => {
  console.log(`Auth service running on port ${PORT}`);
});
