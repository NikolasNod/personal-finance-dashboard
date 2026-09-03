const express = require("express");

const authMiddleware = require("../middleware/auth.middleware");
const { categorySchema } = require("../validators/category.validator");
const pool = require("../db");

const router = express.Router();

router.post("/", authMiddleware, async (req, res) => {
    const result = categorySchema.safeParse(req.body);

    if (!result.success) {
        return res.status(400).json({
            message: "Validation failed",
            errors: result.error.issues
        });
    }

    const { name, type } = result.data;
    const userId = req.user.id;

    try {
        const categoryResult = await pool.query(
            `INSERT INTO categories (user_id, name, type)
             VALUES ($1, $2, $3)
             RETURNING id, user_id, name, type`,
            [userId, name, type]
        );

        return res.status(201).json({
            message: "Category created successfully",
            category: categoryResult.rows[0]
        });

    } catch (error) {
        console.error("CREATE CATEGORY ERROR:", error);

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
                id,
                name,
                type
             FROM categories
             WHERE user_id = $1
             ORDER BY name ASC`,
            [userId]
        );

        return res.status(200).json({
            categories: result.rows
        });

    } catch (error) {
        console.error("GET CATEGORIES ERROR:", error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
});

router.patch("/:id", authMiddleware, async (req, res) => {
    const userId = req.user.id;
    const categoryId = Number(req.params.id);

    if (!Number.isInteger(categoryId) || categoryId <= 0) {
        return res.status(400).json({
            message: "Invalid category ID"
        });
    }

    const result = categorySchema.safeParse(req.body);

    if (!result.success) {
        return res.status(400).json({
            message: "Validation failed",
            errors: result.error.issues
        });
    }

    const { name, type } = result.data;

    try {
        const categoryResult = await pool.query(
            `UPDATE categories
             SET name = $1, type = $2
             WHERE id = $3 AND user_id = $4
             RETURNING id, user_id, name, type`,
            [name, type, categoryId, userId]
        );

        if (categoryResult.rows.length === 0) {
            return res.status(404).json({
                message: "Category not found"
            });
        }

        return res.status(200).json({
            message: "Category updated successfully",
            category: categoryResult.rows[0]
        });

    } catch (error) {
        console.error("UPDATE CATEGORY ERROR:", error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
});

router.delete("/:id", authMiddleware, async (req, res) => {
    const userId = req.user.id;
    const categoryId = Number(req.params.id);

    if (!Number.isInteger(categoryId) || categoryId <= 0) {
        return res.status(400).json({
            message: "Invalid category ID"
        });
    }

    try {
        const result = await pool.query(
            `DELETE FROM categories
             WHERE id = $1 AND user_id = $2
             RETURNING id`,
            [categoryId, userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Category not found"
            });
        }

        return res.status(200).json({
            message: "Category deleted successfully"
        });

    } catch (error) {
        console.error("DELETE CATEGORY ERROR:", error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
});

module.exports = router;