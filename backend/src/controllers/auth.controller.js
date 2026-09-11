const { registerSchema, loginSchema } = require("../validators/auth.validator");
const User = require("../models/User");

const authController = {
  async login(req, res) {
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
      const user = await User.findByEmail(email);

      if (!user) {
        return res.status(401).json({
          message: "Invalid email or password",
        });
      }

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
  },

  async register(req, res) {
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
      const existingUser = await User.findByEmail(email);

      if (existingUser) {
        return res.status(409).json({
          message: "Email is already registered",
        });
      }

      // 3. Hash password
      const passwordHash = await bcrypt.hash(password, 10);

      // 4. Create user
      const newUser = await User.create({ email, passwordHash });

      // 5. Response
      return res.status(201).json({
        message: "User created succesfully",
        user: newUser,
      });
    } catch (error) {
      console.error("REGISTER ERROR:", error);

      return res.status(500).json({
        message: "Internal server error",
      });
    }
  },

  async isAuthenticated(req, res) {
    res.json({
      message: "You are authenticated",
      userId: req.user.id,
    });
  },
};

module.exports = authController;
