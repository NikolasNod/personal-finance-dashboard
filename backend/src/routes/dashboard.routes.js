const express = require("express");
const authMiddleware = require("../middleware/auth.middleware");
const dashboardController = require("../controllers/dashboard.controller");
const router = express.Router();

router.get("/summary", authMiddleware, dashboardController.getSummary);
router.get("/expenses-by-category", authMiddleware, dashboardController.getExpensesByCategory);
router.get("/monthly", authMiddleware, dashboardController.getMonthlySummary);
router.get("/recent-transactions", authMiddleware, dashboardController.getRecentTransactions);

module.exports = router;
