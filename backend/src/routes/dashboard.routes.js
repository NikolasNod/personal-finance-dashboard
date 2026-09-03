const express = require("express");

const authMiddleware = require("../middleware/auth.middleware");
const pool = require("../db");

const router = express.Router();

router.get("/summary", authMiddleware, async (req, res) => {
    const userId = req.user.id;

    try {
        // Total income
        const incomeResult = await pool.query(
            `SELECT COALESCE(SUM(amount), 0) AS total
             FROM transactions
             WHERE user_id = $1
             AND type = 'income'`,
            [userId]
        );

        // Total expenses
        const expenseResult = await pool.query(
            `SELECT COALESCE(SUM(amount), 0) AS total
             FROM transactions
             WHERE user_id = $1
             AND type = 'expense'`,
            [userId]
        );

        const totalIncome = Number(incomeResult.rows[0].total);
        const totalExpenses = Number(expenseResult.rows[0].total);
        const balance = totalIncome - totalExpenses;

        return res.status(200).json({
            totalIncome,
            totalExpenses,
            balance
        });

    } catch (error) {
        console.error("DASHBOARD SUMMARY ERROR:", error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
});

router.get("/expenses-by-category", authMiddleware, async (req, res) => {
    const userId = req.user.id;

    try {
        const result = await pool.query(
            `SELECT
                c.id,
                c.name AS category,
                COALESCE(SUM(t.amount), 0) AS total
             FROM categories c
             LEFT JOIN transactions t
                ON t.category_id = c.id
                AND t.user_id = $1
                AND t.type = 'expense'
             WHERE c.user_id = $1
             GROUP BY c.id, c.name
             ORDER BY total DESC`,
            [userId]
        );

        return res.status(200).json({
            categories: result.rows
        });

    } catch (error) {
        console.error("EXPENSES BY CATEGORY ERROR:", error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
});

router.get("/monthly", authMiddleware, async (req, res) => {
    const userId = req.user.id;

    try {
        const result = await pool.query(
            `SELECT
                TO_CHAR(DATE_TRUNC('month', date), 'YYYY-MM') AS month,
                COALESCE(
                    SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END),
                    0
                ) AS income,
                COALESCE(
                    SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END),
                    0
                ) AS expenses
             FROM transactions
             WHERE user_id = $1
             GROUP BY DATE_TRUNC('month', date)
             ORDER BY DATE_TRUNC('month', date) ASC`,
            [userId]
        );

        return res.status(200).json({
            monthly: result.rows
        });

    } catch (error) {
        console.error("MONTHLY DASHBOARD ERROR:", error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
});

router.get("/recent-transactions", authMiddleware, async (req, res) => {
    const userId = req.user.id;

    try {
        const result = await pool.query(
            `SELECT
                t.id,
                t.amount,
                t.type,
                t.description,
                t.date,
                c.name AS category
             FROM transactions t
             JOIN categories c
                ON c.id = t.category_id
             WHERE t.user_id = $1
             ORDER BY t.date DESC, t.created_at DESC
             LIMIT 10`,
            [userId]
        );

        return res.status(200).json({
            transactions: result.rows
        });

    } catch (error) {
        console.error("RECENT TRANSACTIONS ERROR:", error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
});

module.exports = router;