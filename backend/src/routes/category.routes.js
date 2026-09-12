const express = require("express");
const authMiddleware = require("../middleware/auth.middleware");
const categoryController = require("../controllers/category.controller");
const router = express.Router();

router.post("/", authMiddleware, categoryController.createCategory);
router.get("/", authMiddleware, categoryController.getCategories);
router.patch("/:id", authMiddleware, categoryController.updateCategory);
router.delete("/:id", authMiddleware, categoryController.deleteCategory);

module.exports = router;
