const Dashboard = require("../models/Dashboard");

const dashboardController = {
  async getSummary(req, res) {
    const userId = req.user.id;

    try {
      const result = await Dashboard.getSummary(userId);
      return res.status(200).json(result);
    } catch (error) {
      console.error("DASHBOARD SUMMARY ERROR:", error);

      return res.status(500).json({
        message: "Internal server error",
      });
    }
  },
  async getExpensesByCategory(req, res) {
    const userId = req.user.id;

    try {
      const result = await Dashboard.getExpensesByCategory(userId);

      return res.status(200).json({
        categories: result,
      });
    } catch (error) {
      console.error("EXPENSES BY CATEGORY ERROR:", error);

      return res.status(500).json({
        message: "Internal server error",
      });
    }
  },
  async getMonthlySummary(req, res) {
    const userId = req.user.id;

    try {
      const result = await Dashboard.getMonthly(userId);

      return res.status(200).json({
        monthly: result,
      });
    } catch (error) {
      console.error("MONTHLY DASHBOARD ERROR:", error);

      return res.status(500).json({
        message: "Internal server error",
      });
    }
  },
  async getRecentTransactions(req, res) {
    const userId = req.user.id;

    try {
      const result = await Dashboard.getRecentTransactions(userId);

      return res.status(200).json({
        transactions: result,
      });
    } catch (error) {
      console.error("RECENT TRANSACTIONS ERROR:", error);

      return res.status(500).json({
        message: "Internal server error",
      });
    }
  },
};

module.exports = dashboardController;
