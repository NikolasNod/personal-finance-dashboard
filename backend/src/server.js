const express = require("express");
const cors = require("cors");
require("dotenv").config();

const pool = require("./db")

// Initialize server

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "API is running" });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Database test

app.get("/test-db", async (req, res) => {
    try {
        const result = await pool.query("SELECT NOW()");

        res.json({
            message: "Database connected!",
            time: result.rows[0].now,
        });
    } catch (error) {
        console.error(error)

        res.status(500).json({
            message: "Database connection failed",
        });
    }
});