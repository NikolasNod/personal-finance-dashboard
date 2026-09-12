const express = require("express");
const authMiddleware = require("../middleware/auth.middleware");
const dashboardController = require("../controllers/dashboard.controller");
const router = express.Router();

router.get("/summary", authMiddleware, dashboardController.getSummary(req, res));
router.get("/expenses-by-category", authMiddleware, dashboardController.getExpensesByCategory(req, res));
router.get("/monthly", authMiddleware, dashboardController.getMonthlySummary(req, res));
router.get("/recent-transactions", authMiddleware, dashboardController.getRecentTransactions(req, res));

module.exports = router;
