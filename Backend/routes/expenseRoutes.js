const express = require("express");
const {
    addExpense,
    getAllExpense,
    deleteExpense,
    downloadExpenseExcel
} = require("../controllers/expenseController");
const {protect} = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/add", protect, addExpense);
router.post("/get", protect, getAllExpense);
router.post("/downloadexcel", protect, downloadExpenseExcel);
router.post("/:id", protect, deleteExpense);

module.exports = router;