const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middleware/auth.middleware");
const authController = require("../controllers/auth.controller");

const router = express.Router();

router.post("/login", authController.login(req, res));
router.post("/register", authController.register(req, res));
router.get("/me", authMiddleware, authController.isAuthenticated(req, res));

module.exports = router;
