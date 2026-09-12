const { categorySchema } = require("../validators/category.validator");
const Category = require("../models/Category");

const categoryController = {
  async createCategory(req, res) {
    const result = categorySchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        message: "Validation failed",
        errors: result.error.issues,
      });
    }

    const { name, type } = result.data;
    const userId = req.user.id;

    try {
      const categoryResult = await Category.create({ userId, name, type });

      return res.status(201).json({
        message: "Category created successfully",
        category: categoryResult,
      });
    } catch (error) {
      console.error("CREATE CATEGORY ERROR:", error);

      return res.status(500).json({
        message: "Internal server error",
      });
    }
  },
  async getCategories(req, res) {
    const userId = req.user.id;

    try {
      const result = await Category.findByUserId(userId);

      return res.status(200).json({
        categories: result,
      });
    } catch (error) {
      console.error("GET CATEGORIES ERROR:", error);

      return res.status(500).json({
        message: "Internal server error",
      });
    }
  },
  async updateCategory(req, res) {
    const userId = req.user.id;
    const categoryId = Number(req.params.id);

    if (!Number.isInteger(categoryId) || categoryId <= 0) {
      return res.status(400).json({
        message: "Invalid category ID",
      });
    }

    const result = categorySchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        message: "Validation failed",
        errors: result.error.issues,
      });
    }

    const { name, type } = result.data;

    try {
      const categoryResult = await Category.update({
        userId,
        categoryId,
        name,
        type,
      });

      if (!categoryResult) {
        return res.status(404).json({
          message: "Category not found",
        });
      }

      return res.status(200).json({
        message: "Category updated successfully",
        category: categoryResult,
      });
    } catch (error) {
      console.error("UPDATE CATEGORY ERROR:", error);

      return res.status(500).json({
        message: "Internal server error",
      });
    }
  },
  async deleteCategory(req, res) {
    const userId = req.user.id;
    const categoryId = Number(req.params.id);

    if (!Number.isInteger(categoryId) || categoryId <= 0) {
      return res.status(400).json({
        message: "Invalid category ID",
      });
    }

    try {
      const result = Category.delete({ userId, categoryId });

      if (!result) {
        return res.status(404).json({
          message: "Category not found",
        });
      }

      return res.status(200).json({
        message: "Category deleted successfully",
      });
    } catch (error) {
      console.error("DELETE CATEGORY ERROR:", error);

      return res.status(500).json({
        message: "Internal server error",
      });
    }
  },
};

module.exports = categoryController;
