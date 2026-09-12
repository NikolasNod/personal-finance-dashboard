const express = require("express");
const authMiddleware = require("../middleware/auth.middleware");
const authController = require("../controllers/auth.controller");

const router = express.Router();

router.post("/login", authController.login);
router.post("/register", authController.register);
router.get("/me", authMiddleware, authController.isAuthenticated);

module.exports = router;
