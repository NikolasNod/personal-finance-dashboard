const { transactionSchema } = require("../validators/transaction.validator");
const Category = require("../models/Category");
const Transaction = require("../models/Transaction");

const transactionController = {
  async createTransaction(req, res) {
    // 1. Validate request
    const result = transactionSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        message: "Validation failed",
        errors: result.error.issues,
      });
    }

    const { categoryId, amount, type, description, date } = result.data;

    const userId = req.user.id;

    try {
      // 2. Check that category belongs to the user
      const categoryResult = await Category.findByUserId(userId);
      let categoryFound = false;

      for (let i = 0; i < categoryResult.length; i++) {
        if (categoryResult[i].id === categoryId) {
          categoryFound = true;
          break;
        }
      }

      if (!categoryFound) {
        return res.status(404).json({
          message: "Category not found",
        });
      }

      // 3. Create transaction
      const transactionResult = await Transaction.create({
        userId,
        categoryId,
        amount,
        type,
        date,
        description,
      });

      // 4. Return created transaction
      return res.status(201).json({
        message: "Transaction created successfully",
        transaction: transactionResult,
      });
    } catch (error) {
      console.error("TRANSACTION ERROR:", error);

      return res.status(500).json({
        message: "Internal server error",
      });
    }
  },
  async getTransactions(req, res) {
    const userId = req.user.id;

    try {
      const result = await Transaction.findByUserId(userId);

      return res.status(200).json({
        transactions: result,
      });
    } catch (error) {
      console.error("GET TRANSACTIONS ERROR:", error);

      return res.status(500).json({
        message: "Internal server error",
      });
    }
  },
  async getTransaction(req, res) {
    const userId = req.user.id;
    const transactionId = Number(req.params.id);

    if (!Number.isInteger(transactionId) || transactionId <= 0) {
      return res.status(400).json({
        message: "Invalid transaction ID",
      });
    }

    try {
      const result = await Transaction.findByTransactionId({
        transactionId,
        userId,
      });

      if (!result) {
        return res.status(404).json({
          message: "Transaction not found",
        });
      }

      return res.status(200).json({
        transaction: result,
      });
    } catch (error) {
      console.error("GET TRANSACTION ERROR:", error);

      return res.status(500).json({
        message: "Internal server error",
      });
    }
  },
  async updateTransaction(req, res) {
    const userId = req.user.id;
    const transactionId = Number(req.params.id);

    if (!Number.isInteger(transactionId) || transactionId <= 0) {
      return res.status(400).json({
        message: "Invalid transaction ID",
      });
    }

    const allowedFields = [
      "categoryId",
      "amount",
      "type",
      "description",
      "date",
    ];

    const updates = {};

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        message: "No fields to update",
      });
    }

    try {
      // Check that the transaction belongs to the user
      const transactionResult = await Transaction.findByTransactionId({
        transactionId,
        userId,
      });

      if (!transactionResult) {
        return res.status(404).json({
          message: "Transaction not found",
        });
      }

      // If category is being changed, check ownership
      if (updates.categoryId !== undefined) {
        const categoryResult = await Category.findByUserId(userId);
        let categoryFound = false;

        for (let i = 0; i < categoryResult.length; i++) {
          if (categoryResult[i].id === updates.categoryId) {
            categoryFound = true;
            break;
          }
        }

        if (!categoryFound) {
          return res.status(404).json({
            message: "Category not found",
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

      const result = await Transaction.update({ setParts, values });

      return res.status(200).json({
        message: "Transaction updated successfully",
        transaction: result,
      });
    } catch (error) {
      console.error("UPDATE TRANSACTION ERROR:", error);

      return res.status(500).json({
        message: "Internal server error",
      });
    }
  },
  async deleteTransaction(req, res) {
    const userId = req.user.id;
    const transactionId = Number(req.params.id);

    if (!Number.isInteger(transactionId) || transactionId <= 0) {
      return res.status(400).json({
        message: "Invalid transaction ID",
      });
    }

    try {
      const result = await Transaction.delete({ transactionId, userId });

      if (!result) {
        return res.status(404).json({
          message: "Transaction not found",
        });
      }

      return res.status(200).json({
        message: "Transaction deleted successfully",
      });
    } catch (error) {
      console.error("DELETE TRANSACTION ERROR:", error);

      return res.status(500).json({
        message: "Internal server error",
      });
    }
  },
};

module.exports = transactionController;
