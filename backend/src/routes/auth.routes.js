const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { registerSchema, loginSchema } = require("../validators/auth.validator");
const pool = require("../db");

const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");

router.post("/login", async (req, res) => {
  const result = loginSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      message: "Validation failed",
      errors: result.error.issues,
    });
  }

  const { email, password } = result.data;

  try {
    // Find user
    const userResult = await pool.query(
      "SELECT id, email, password_hash FROM users WHERE email = $1",
      [email],
    );

    if (userResult.rows.length === 0) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const user = userResult.rows[0];

    // Compare password with hash
    const passwordMatch = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // Create JWT
    const token = jwt.sign(
      {
        userId: user.id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      },
    );

    return res.status(200).json({
      message: "Login successful",
      token,
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
});

router.post("/register", async (req, res) => {
  // 1. Validate request
  const result = registerSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      message: "Validation failed",
      errors: result.error.issues,
    });
  }

  const { email, password } = result.data;

  try {
    // 2. Check if email already exists
    const existingUser = await pool.query(
      "SELECT id FROM users WHERE email = $1",
      [email],
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({
        message: "Email is already registered",
      });
    }

    // 3. Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // 4. Create user
    const newUser = await pool.query(
      `INSERT INTO users (email, password_hash)
            VALUES ($1, $2)
            RETURNING id, email, created_at`,
      [email, passwordHash],
    );

    // 5. Response
    return res.status(201).json({
      message: "User created succesfully",
      user: newUser.rows[0],
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
});

router.get("/me", authMiddleware, (req, res) => {
  res.json({
    message: "You are authenticated",
    userId: req.user.id,
  });
});

module.exports = router;
