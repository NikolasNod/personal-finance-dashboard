const express = require("express");
const authMiddleware = require("../middleware/auth.middleware");
const categoryController = require("../controllers/category.controller");
const router = express.Router();

router.post("/", authMiddleware, categoryController.createCategory(req, res));
router.get("/", authMiddleware, categoryController.getCategories(req, res));
router.patch("/:id", authMiddleware, categoryController.updateCategory(req, res));
router.delete("/:id", authMiddleware, categoryController.deleteCategory(req, res));

module.exports = router;
