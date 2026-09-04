import { useEffect, useState } from "react";
import api from "../services/api";
import "./Transactions.css";

function Transactions() {
    const [transactions, setTransactions] = useState([]);
    const [categories, setCategories] = useState([]);

    const [amount, setAmount] = useState("");
    const [type, setType] = useState("expense");
    const [categoryId, setCategoryId] = useState("");
    const [description, setDescription] = useState("");
    const [date, setDate] = useState("");

    const [editingId, setEditingId] = useState(null);

    const [editAmount, setEditAmount] = useState("");
    const [editType, setEditType] = useState("expense");
    const [editCategoryId, setEditCategoryId] = useState("");
    const [editDescription, setEditDescription] = useState("");
    const [editDate, setEditDate] = useState("");

    const [filter, setFilter] = useState("all");

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const loadData = async () => {
        try {
            const [
                transactionsResponse,
                categoriesResponse
            ] = await Promise.all([
                api.get("/transactions"),
                api.get("/categories")
            ]);

            setTransactions(
                transactionsResponse.data.transactions || []
            );

            setCategories(
                categoriesResponse.data.categories || []
            );

        } catch (error) {
            console.error("LOAD TRANSACTIONS ERROR:", error);

            if (error.response) {
                setError(
                    error.response.data.message ||
                    "Failed to load transactions"
                );
            } else {
                setError("Unable to connect to the server");
            }
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");
        setLoading(true);

        try {
            await api.post("/transactions", {
                amount: Number(amount),
                type,
                categoryId: Number(categoryId),
                description,
                date
            });

            setAmount("");
            setCategoryId("");
            setDescription("");
            setDate("");

            await loadData();

        } catch (error) {
            console.error("CREATE TRANSACTION ERROR:", error);

            if (error.response) {
                setError(
                    error.response.data.message ||
                    "Failed to create transaction"
                );
            } else {
                setError("Unable to connect to the server");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this transaction?"
        );

        if (!confirmed) {
            return;
        }

        try {
            await api.delete(`/transactions/${id}`);

            setTransactions((currentTransactions) =>
                currentTransactions.filter(
                    (transaction) => transaction.id !== id
                )
            );

        } catch (error) {
            console.error("DELETE TRANSACTION ERROR:", error);

            if (error.response) {
                setError(
                    error.response.data.message ||
                    "Failed to delete transaction"
                );
            } else {
                setError("Unable to connect to the server");
            }
        }
    };

    const handleEdit = (transaction) => {
        setEditingId(transaction.id);

        setEditAmount(transaction.amount);
        setEditType(transaction.type);
        setEditCategoryId(transaction.category_id);
        setEditDescription(transaction.description || "");

        setEditDate(
            new Date(transaction.date)
                .toISOString()
                .split("T")[0]
        );

        setError("");
    };

    const handleUpdate = async (event) => {
        event.preventDefault();

        setError("");

        try {
            await api.patch(`/transactions/${editingId}`, {
                amount: Number(editAmount),
                type: editType,
                categoryId: Number(editCategoryId),
                description: editDescription,
                date: editDate
            });

            setEditingId(null);

            await loadData();

        } catch (error) {
            console.error("UPDATE TRANSACTION ERROR:", error);

            if (error.response) {
                setError(
                    error.response.data.message ||
                    "Failed to update transaction"
                );
            } else {
                setError("Unable to connect to the server");
            }
        }
    };

    const filteredTransactions =
        filter === "all"
            ? transactions
            : transactions.filter(
                  (transaction) => transaction.type === filter
              );

    const getCategoryName = (transaction) => {
        if (transaction.category) {
            return transaction.category;
        }

        const category = categories.find(
            (item) => item.id === transaction.category_id
        );

        return category ? category.name : "Uncategorized";
    };

    return (
        <div className="transactions-page">

            <div className="transactions-heading">
                <div>
                    <p className="eyebrow">MANAGE YOUR MONEY</p>

                    <h1>Transactions</h1>

                    <p className="transactions-subtitle">
                        Add, edit and manage your income and expenses.
                    </p>
                </div>
            </div>

            {error && (
                <div className="transaction-error">
                    <span>!</span>
                    {error}
                </div>
            )}

            {/* Add transaction */}
            <div className="transaction-form-card">

                <div className="form-card-heading">
                    <div>
                        <p className="card-eyebrow">
                            NEW TRANSACTION
                        </p>

                        <h2>Add Transaction</h2>
                    </div>
                </div>

                <form
                    className="transaction-form"
                    onSubmit={handleSubmit}
                >

                    <div className="form-field">
                        <label>Amount</label>

                        <div className="input-with-prefix">
                            <span>€</span>

                            <input
                                type="number"
                                step="0.01"
                                min="0"
                                value={amount}
                                onChange={(event) =>
                                    setAmount(event.target.value)
                                }
                                placeholder="0.00"
                                required
                            />
                        </div>
                    </div>

                    <div className="form-field">
                        <label>Type</label>

                        <select
                            value={type}
                            onChange={(event) => {
                                setType(event.target.value);
                                setCategoryId("");
                            }}
                        >
                            <option value="expense">
                                Expense
                            </option>

                            <option value="income">
                                Income
                            </option>
                        </select>
                    </div>

                    <div className="form-field">
                        <label>Category</label>

                        <select
                            value={categoryId}
                            onChange={(event) =>
                                setCategoryId(event.target.value)
                            }
                            required
                        >
                            <option value="">
                                Select category
                            </option>

                            {categories
                                .filter(
                                    (category) =>
                                        category.type === type
                                )
                                .map((category) => (
                                    <option
                                        key={category.id}
                                        value={category.id}
                                    >
                                        {category.name}
                                    </option>
                                ))}
                        </select>
                    </div>

                    <div className="form-field">
                        <label>Description</label>

                        <input
                            type="text"
                            value={description}
                            onChange={(event) =>
                                setDescription(event.target.value)
                            }
                            placeholder="e.g. Lunch"
                        />
                    </div>

                    <div className="form-field">
                        <label>Date</label>

                        <input
                            type="date"
                            value={date}
                            onChange={(event) =>
                                setDate(event.target.value)
                            }
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="add-transaction-button"
                        disabled={loading}
                    >
                        {loading ? (
                            "Adding..."
                        ) : (
                            <>
                                <span>+</span>
                                Add Transaction
                            </>
                        )}
                    </button>

                </form>
            </div>

            {/* Edit transaction */}
            {editingId !== null && (
                <div className="transaction-form-card edit-card">

                    <div className="form-card-heading">
                        <div>
                            <p className="card-eyebrow">
                                EDIT TRANSACTION
                            </p>

                            <h2>Edit Transaction</h2>
                        </div>

                        <button
                            type="button"
                            className="close-edit-button"
                            onClick={() => setEditingId(null)}
                        >
                            ×
                        </button>
                    </div>

                    <form
                        className="transaction-form"
                        onSubmit={handleUpdate}
                    >

                        <div className="form-field">
                            <label>Amount</label>

                            <div className="input-with-prefix">
                                <span>€</span>

                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={editAmount}
                                    onChange={(event) =>
                                        setEditAmount(
                                            event.target.value
                                        )
                                    }
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-field">
                            <label>Type</label>

                            <select
                                value={editType}
                                onChange={(event) => {
                                    setEditType(event.target.value);
                                    setEditCategoryId("");
                                }}
                            >
                                <option value="expense">
                                    Expense
                                </option>

                                <option value="income">
                                    Income
                                </option>
                            </select>
                        </div>

                        <div className="form-field">
                            <label>Category</label>

                            <select
                                value={editCategoryId}
                                onChange={(event) =>
                                    setEditCategoryId(
                                        event.target.value
                                    )
                                }
                                required
                            >
                                <option value="">
                                    Select category
                                </option>

                                {categories
                                    .filter(
                                        (category) =>
                                            category.type ===
                                            editType
                                    )
                                    .map((category) => (
                                        <option
                                            key={category.id}
                                            value={category.id}
                                        >
                                            {category.name}
                                        </option>
                                    ))}
                            </select>
                        </div>

                        <div className="form-field">
                            <label>Description</label>

                            <input
                                type="text"
                                value={editDescription}
                                onChange={(event) =>
                                    setEditDescription(
                                        event.target.value
                                    )
                                }
                            />
                        </div>

                        <div className="form-field">
                            <label>Date</label>

                            <input
                                type="date"
                                value={editDate}
                                onChange={(event) =>
                                    setEditDate(
                                        event.target.value
                                    )
                                }
                                required
                            />
                        </div>

                        <div className="edit-actions">
                            <button
                                type="button"
                                className="cancel-button"
                                onClick={() =>
                                    setEditingId(null)
                                }
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                className="save-button"
                            >
                                Save Changes
                            </button>
                        </div>

                    </form>
                </div>
            )}

            {/* Transactions table */}
            <div className="transactions-table-card">

                <div className="table-card-heading">

                    <div>
                        <p className="card-eyebrow">
                            HISTORY
                        </p>

                        <h2>All Transactions</h2>
                    </div>

                    <div className="transaction-filters">

                        <button
                            className={
                                filter === "all"
                                    ? "filter-button active"
                                    : "filter-button"
                            }
                            onClick={() => setFilter("all")}
                        >
                            All
                        </button>

                        <button
                            className={
                                filter === "income"
                                    ? "filter-button active"
                                    : "filter-button"
                            }
                            onClick={() => setFilter("income")}
                        >
                            Income
                        </button>

                        <button
                            className={
                                filter === "expense"
                                    ? "filter-button active"
                                    : "filter-button"
                            }
                            onClick={() => setFilter("expense")}
                        >
                            Expenses
                        </button>

                    </div>

                </div>

                {filteredTransactions.length === 0 ? (
                    <div className="empty-transactions">
                        <div className="empty-icon">◎</div>

                        <h3>No transactions found</h3>

                        <p>
                            There are no transactions matching
                            this filter.
                        </p>
                    </div>
                ) : (
                    <div className="table-wrapper">

                        <table className="transactions-table">

                            <thead>
                                <tr>
                                    <th>TRANSACTION</th>
                                    <th>CATEGORY</th>
                                    <th>DATE</th>
                                    <th>TYPE</th>
                                    <th>AMOUNT</th>
                                    <th></th>
                                </tr>
                            </thead>

                            <tbody>

                                {filteredTransactions.map(
                                    (transaction) => (
                                        <tr
                                            key={transaction.id}
                                        >

                                            <td>
                                                <div className="table-transaction">

                                                    <div
                                                        className={`table-type-icon ${
                                                            transaction.type ===
                                                            "income"
                                                                ? "income"
                                                                : "expense"
                                                        }`}
                                                    >
                                                        {transaction.type ===
                                                        "income"
                                                            ? "↗"
                                                            : "↘"}
                                                    </div>

                                                    <div>
                                                        <strong>
                                                            {transaction.description ||
                                                                "Transaction"}
                                                        </strong>

                                                        <span>
                                                            #{transaction.id}
                                                        </span>
                                                    </div>

                                                </div>
                                            </td>

                                            <td>
                                                <span className="category-badge">
                                                    {getCategoryName(
                                                        transaction
                                                    )}
                                                </span>
                                            </td>

                                            <td>
                                                <span className="date-text">
                                                    {new Date(
                                                        transaction.date
                                                    ).toLocaleDateString()}
                                                </span>
                                            </td>

                                            <td>
                                                <span
                                                    className={`type-badge ${
                                                        transaction.type ===
                                                        "income"
                                                            ? "income-badge"
                                                            : "expense-badge"
                                                    }`}
                                                >
                                                    {transaction.type}
                                                </span>
                                            </td>

                                            <td>
                                                <strong
                                                    className={
                                                        transaction.type ===
                                                        "income"
                                                            ? "table-income"
                                                            : "table-expense"
                                                    }
                                                >
                                                    {transaction.type ===
                                                    "income"
                                                        ? "+"
                                                        : "-"}
                                                    €{Number(
                                                        transaction.amount
                                                    ).toFixed(2)}
                                                </strong>
                                            </td>

                                            <td>
                                                <div className="row-actions">

                                                    <button
                                                        className="edit-button"
                                                        onClick={() =>
                                                            handleEdit(
                                                                transaction
                                                            )
                                                        }
                                                    >
                                                        Edit
                                                    </button>

                                                    <button
                                                        className="delete-button"
                                                        onClick={() =>
                                                            handleDelete(
                                                                transaction.id
                                                            )
                                                        }
                                                    >
                                                        Delete
                                                    </button>

                                                </div>
                                            </td>

                                        </tr>
                                    )
                                )}

                            </tbody>

                        </table>

                    </div>
                )}

            </div>

        </div>
    );
}

export default Transactions;