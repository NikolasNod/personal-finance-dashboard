const express = require("express");
const authMiddleware = require("../middleware/auth.middleware");
const transactionController = require("../controllers/transaction.controller");
const router = express.Router();

router.post("/", authMiddleware, transactionController.createTransaction(req, res));
router.get("/", authMiddleware, transactionController.getTransactions(req, res));
router.get("/:id", authMiddleware, transactionController.getTransaction(req, res));
router.patch("/:id", authMiddleware, transactionController.updateTransaction(req, res));
router.delete("/:id", authMiddleware, transactionController.deleteTransaction(req, res));

module.exports = router;
