const express = require("express");
const authMiddleware = require("../middleware/auth.middleware");
const transactionController = require("../controllers/transaction.controller");
const router = express.Router();

router.post("/", authMiddleware, transactionController.createTransaction);
router.get("/", authMiddleware, transactionController.getTransactions);
router.get("/:id", authMiddleware, transactionController.getTransaction);
router.patch("/:id", authMiddleware, transactionController.updateTransaction);
router.delete("/:id", authMiddleware, transactionController.deleteTransaction);

module.exports = router;
