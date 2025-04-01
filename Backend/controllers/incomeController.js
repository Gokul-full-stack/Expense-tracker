const xlsx = require('xlsx');
const Expense = require("../models/Expense");

exports.addExpense = async (req, res) => {
    const userId = req.user.id;

    try {
        const {icon, category, amount, date} = req.body;

        if(!category || !amount || !date) {
            return res.status(400).json({message: "All fields are required"});
        }

        const newExpense = new Expense({
            userId,
            icon,
            category,
            amount,
            date: new Date(date)
        });
        await newExpense.save();
        res.status(200).json(newExpense);
    } catch(error) {
        res.status(500).json({message: "Server Error"});
    }
}

exports.getAllExpense = async (req, res) => {
    const userId = req.user.id;

    try {
        const expense = await Expense.find({userId}).sort({date: -1});
        res.json(expense);
    } catch {
        res.status(500).json({message: "Server Error"});
    }
}

exports.deleteExpense = async (req, res) => {
    try {
        await Expense.findByIdAndDelete(req.params.id);
        res.json({ message: "Expense deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
};


exports.downloadExpenseExcel = async (req, res) => {
    const userId = req.user.id;

    try {
        const expenses = await Expense.find({ userId }).sort({ date: -1 });

        if (expenses.length === 0) {
            return res.status(404).json({ message: "No expenses found" });
        }

        const data = expenses.map((item) => ({
            Category: item.category,
            Amount: item.amount,
            Date: item.date.toISOString().split("T")[0], // Formatting Date
        }));

        const wb = xlsx.utils.book_new();
        const ws = xlsx.utils.json_to_sheet(data);
        xlsx.utils.book_append_sheet(wb, ws, "Expense");

        const filePath = "expense_details.xlsx";
        xlsx.writeFile(wb, filePath);

        res.download(filePath, (err) => {
            if (err) {
                console.error("Error sending file:", err);
                res.status(500).json({ message: "Error downloading file" });
            }
        });

    } catch (error) {
        console.error("Error generating Excel:", error);
        res.status(500).json({ message: "Server Error" });
    }
};
