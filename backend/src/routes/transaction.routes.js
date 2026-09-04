const express = require("express");

const authMiddleware = require("../middleware/auth.middleware");
const { transactionSchema } = require("../validators/transaction.validator");
const pool = require("../db");

const router = express.Router();

router.post("/", authMiddleware, async (req, res) => {
    // 1. Validate request
    const result = transactionSchema.safeParse(req.body);

    if (!result.success) {
        return res.status(400).json({
            message: "Validation failed",
            errors: result.error.issues
        });
    }

    const {
        categoryId,
        amount,
        type,
        description,
        date
    } = result.data;

    const userId = req.user.id

    try {
        // 2. Check that category belongs to the user
        const categoryResult = await pool.query(
            `SELECT id
            FROM categories
            WHERE id = $1 AND user_id = $2`,
            [categoryId, userId]
        );

        if (categoryResult.rows.length === 0) {
            return res.status(404).json({
                message: "Category not found"
            });
        }

        // 3. Create transaction
        const transactionResult = await pool.query(
            `INSERT INTO transactions
                (user_id, category_id, amount, type, description, date)
            VALUES
                ($1, $2, $3, $4, $5, $6)
            RETURNING id, user_id, category_id, amount, type, description, date, created_at`,
            [
                userId,
                categoryId,
                amount,
                type,
                description || null,
                date
            ]
        );

        // 4. Return created transaction
        return res.status(201).json({
            message: "Transaction created successfully",
            transaction: transactionResult.rows[0]
        });
    } catch (error) {
        console.error("TRANSACTION ERROR:", error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
});

router.get("/", authMiddleware, async (req, res) => {
    const userId = req.user.id;

    try {
        const result = await pool.query(
            `SELECT
                t.id,
                t.category_id,
                c.name AS category,
                t.amount,
                t.type,
                t.description,
                t.date,
                t.created_at
            FROM transactions t
            JOIN categories c
                ON c.id = t.category_id
            WHERE t.user_id = $1
            ORDER BY t.date DESC, t.created_at DESC`,
            [userId]
        );

        return res.status(200).json({
            transactions: result.rows
        });
    } catch (error) {
        console.error("GET TRANSACTIONS ERROR:", error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
});

router.get("/:id", authMiddleware, async (req, res) => {
    const userId = req.user.id;
    const transactionId = Number(req.params.id);

    if (!Number.isInteger(transactionId) || transactionId <= 0) {
        return res.status(400).json({
            message: "Invalid transaction ID"
        });
    }

    try {
        const result = await pool.query(
            `SELECT
                id,
                category_id,
                amount,
                type,
                description,
                date,
                created_at
            FROM transactions
            WHERE id = $1 AND user_id = $2`,
            [transactionId, userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Transaction not found"
            });
        }

        return res.status(200).json({
            transaction: result.rows[0]
        });
    } catch (error) {
        console.error("GET TRANSACTION ERROR:", error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
});

router.patch("/:id", authMiddleware, async (req, res) => {
    const userId = req.user.id;
    const transactionId = Number(req.params.id);

    if (!Number.isInteger(transactionId) || transactionId <= 0) {
        return res.status(400).json({
            message: "Invalid transaction ID"
        });
    }

    const allowedFields = [
        "categoryId",
        "amount",
        "type",
        "description",
        "date"
    ];

    const updates = {};

    for (const field of allowedFields) {
        if (req.body[field] !== undefined) {
            updates[field] = req.body[field];
        }
    }

    if (Object.keys(updates).length === 0) {
        return res.status(400).json({
            message: "No fields to update"
        });
    }

    try {
        // Check that the transaction belongs to the user
        const transactionResult = await pool.query(
            `SELECT id
            FROM transactions
            WHERE id = $1 AND user_id = $2`,
            [transactionId, userId]
        );

        if (transactionResult.rows.length === 0) {
            return res.status(404).json({
                message: "Transaction not found"
            });
        }

        // If category is being changed, check ownership
        if (updates.categoryId !== undefined) {
            const categoryResult = await pool.query(
                `SELECT id
                FROM categories
                WHERE id = $1 AND user_id = $2`,
                [updates.categoryId, userId]
            );

            if (categoryResult.rows.length === 0) {
                return res.status(404).json({
                    message: "Category not found"
                });
            }
        }

        const setParts = [];
        const values = [];

        if (updates.categoryId !== undefined) {
            values.push(updates.categoryId);
            setParts.push(`category_id = $${values.length}`);
        }

        if (updates.amount !== undefined) {
            values.push(updates.amount);
            setParts.push(`amount = $${values.length}`);
        }

        if (updates.type !== undefined) {
            values.push(updates.type);
            setParts.push(`type = $${values.length}`);
        }

        if (updates.description !== undefined) {
            values.push(updates.description);
            setParts.push(`description = $${values.length}`);
        }

        if (updates.date !== undefined) {
            values.push(updates.date);
            setParts.push(`date = $${values.length}`);
        }

        values.push(transactionId);
        values.push(userId);

        const result = await pool.query(
            `UPDATE transactions
            SET ${setParts.join(", ")}
            WHERE id = $${values.length - 1}
                AND user_id = $${values.length}
            RETURNING id, user_id, category_id, amount, type, description, date, created_at`,
            values
        );

        return res.status(200).json({
            message: "Transaction updated successfully",
            transaction: result.rows[0]
        });

    } catch (error) {
        console.error("UPDATE TRANSACTION ERROR:", error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
});

router.delete("/:id", authMiddleware, async (req, res) => {
    const userId = req.user.id;
    const transactionId = Number(req.params.id);

    if (!Number.isInteger(transactionId) || transactionId <= 0) {
        return res.status(400).json({
            message: "Invalid transaction ID"
        });
    }

    try {
        const result = await pool.query(
            `DELETE FROM transactions
             WHERE id = $1 AND user_id = $2
             RETURNING id`,
            [transactionId, userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Transaction not found"
            });
        }

        return res.status(200).json({
            message: "Transaction deleted successfully"
        });

    } catch (error) {
        console.error("DELETE TRANSACTION ERROR:", error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
});

module.exports = router;