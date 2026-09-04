import { useEffect, useState } from "react";
import api from "../services/api";
import "./Categories.css";

function Categories() {
    const [categories, setCategories] = useState([]);

    const [name, setName] = useState("");
    const [type, setType] = useState("expense");

    const [editingId, setEditingId] = useState(null);
    const [editName, setEditName] = useState("");
    const [editType, setEditType] = useState("expense");

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const loadCategories = async () => {
        try {
            const response = await api.get("/categories");

            setCategories(
                response.data.categories || []
            );
        } catch (error) {
            console.error("LOAD CATEGORIES ERROR:", error);

            if (error.response) {
                setError(
                    error.response.data.message ||
                    "Failed to load categories"
                );
            } else {
                setError("Unable to connect to the server");
            }
        }
    };

    useEffect(() => {
        loadCategories();
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");
        setLoading(true);

        try {
            await api.post("/categories", {
                name: name.trim(),
                type
            });

            setName("");
            setType("expense");

            await loadCategories();

        } catch (error) {
            console.error("CREATE CATEGORY ERROR:", error);

            if (error.response) {
                setError(
                    error.response.data.message ||
                    "Failed to create category"
                );
            } else {
                setError("Unable to connect to the server");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (category) => {
        setEditingId(category.id);
        setEditName(category.name);
        setEditType(category.type);
        setError("");
    };

    const handleUpdate = async (event) => {
        event.preventDefault();

        setError("");

        try {
            await api.patch(`/categories/${editingId}`, {
                name: editName.trim(),
                type: editType
            });

            setEditingId(null);

            await loadCategories();

        } catch (error) {
            console.error("UPDATE CATEGORY ERROR:", error);

            if (error.response) {
                setError(
                    error.response.data.message ||
                    "Failed to update category"
                );
            } else {
                setError("Unable to connect to the server");
            }
        }
    };

    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this category?"
        );

        if (!confirmed) {
            return;
        }

        setError("");

        try {
            await api.delete(`/categories/${id}`);

            setCategories((currentCategories) =>
                currentCategories.filter(
                    (category) => category.id !== id
                )
            );

        } catch (error) {
            console.error("DELETE CATEGORY ERROR:", error);

            if (error.response) {
                setError(
                    error.response.data.message ||
                    "Failed to delete category"
                );
            } else {
                setError("Unable to connect to the server");
            }
        }
    };

    const incomeCategories = categories.filter(
        (category) => category.type === "income"
    );

    const expenseCategories = categories.filter(
        (category) => category.type === "expense"
    );

    return (
        <div className="categories-page">

            <div className="categories-heading">
                <div>
                    <p className="eyebrow">
                        ORGANIZE YOUR MONEY
                    </p>

                    <h1>Categories</h1>

                    <p className="categories-subtitle">
                        Create and manage categories for your
                        income and expenses.
                    </p>
                </div>
            </div>

            {error && (
                <div className="category-error">
                    <span>!</span>
                    {error}
                </div>
            )}

            <div className="category-form-card">

                <div className="form-card-heading">
                    <div>
                        <p className="card-eyebrow">
                            NEW CATEGORY
                        </p>

                        <h2>Add Category</h2>
                    </div>
                </div>

                <form
                    className="category-form"
                    onSubmit={handleSubmit}
                >

                    <div className="form-field">
                        <label htmlFor="category-name">
                            Name
                        </label>

                        <input
                            id="category-name"
                            type="text"
                            value={name}
                            onChange={(event) =>
                                setName(event.target.value)
                            }
                            placeholder="e.g. Transport"
                            maxLength={100}
                            required
                        />
                    </div>

                    <div className="form-field">
                        <label htmlFor="category-type">
                            Type
                        </label>

                        <select
                            id="category-type"
                            value={type}
                            onChange={(event) =>
                                setType(event.target.value)
                            }
                        >
                            <option value="expense">
                                Expense
                            </option>

                            <option value="income">
                                Income
                            </option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        className="add-category-button"
                        disabled={loading}
                    >
                        {loading ? (
                            "Adding..."
                        ) : (
                            <>
                                <span>+</span>
                                Add Category
                            </>
                        )}
                    </button>

                </form>
            </div>

            {editingId !== null && (
                <div className="category-form-card edit-category-card">

                    <div className="form-card-heading">
                        <div>
                            <p className="card-eyebrow">
                                EDIT CATEGORY
                            </p>

                            <h2>Edit Category</h2>
                        </div>

                        <button
                            type="button"
                            className="close-category-button"
                            onClick={() =>
                                setEditingId(null)
                            }
                        >
                            ×
                        </button>
                    </div>

                    <form
                        className="category-form"
                        onSubmit={handleUpdate}
                    >

                        <div className="form-field">
                            <label htmlFor="edit-category-name">
                                Name
                            </label>

                            <input
                                id="edit-category-name"
                                type="text"
                                value={editName}
                                onChange={(event) =>
                                    setEditName(
                                        event.target.value
                                    )
                                }
                                maxLength={100}
                                required
                            />
                        </div>

                        <div className="form-field">
                            <label htmlFor="edit-category-type">
                                Type
                            </label>

                            <select
                                id="edit-category-type"
                                value={editType}
                                onChange={(event) =>
                                    setEditType(
                                        event.target.value
                                    )
                                }
                            >
                                <option value="expense">
                                    Expense
                                </option>

                                <option value="income">
                                    Income
                                </option>
                            </select>
                        </div>

                        <div className="edit-category-actions">

                            <button
                                type="button"
                                className="cancel-category-button"
                                onClick={() =>
                                    setEditingId(null)
                                }
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                className="save-category-button"
                            >
                                Save Changes
                            </button>

                        </div>

                    </form>
                </div>
            )}

            <div className="categories-grid">

                <div className="categories-card">

                    <div className="categories-card-heading">
                        <div>
                            <p className="card-eyebrow">
                                INCOME
                            </p>

                            <h2>Income Categories</h2>
                        </div>

                        <span className="category-count income-count">
                            {incomeCategories.length}
                        </span>
                    </div>

                    {incomeCategories.length === 0 ? (
                        <div className="empty-categories">
                            No income categories yet.
                        </div>
                    ) : (
                        <div className="category-list">

                            {incomeCategories.map(
                                (category) => (
                                    <div
                                        className="category-row"
                                        key={category.id}
                                    >
                                        <div className="category-info">

                                            <div className="category-icon income-icon">
                                                ↗
                                            </div>

                                            <div>
                                                <strong>
                                                    {category.name}
                                                </strong>

                                                <span>
                                                    Income
                                                </span>
                                            </div>

                                        </div>

                                        <div className="category-actions">

                                            <button
                                                className="category-edit-button"
                                                onClick={() =>
                                                    handleEdit(
                                                        category
                                                    )
                                                }
                                            >
                                                Edit
                                            </button>

                                            <button
                                                className="category-delete-button"
                                                onClick={() =>
                                                    handleDelete(
                                                        category.id
                                                    )
                                                }
                                            >
                                                Delete
                                            </button>

                                        </div>
                                    </div>
                                )
                            )}

                        </div>
                    )}

                </div>

                <div className="categories-card">

                    <div className="categories-card-heading">
                        <div>
                            <p className="card-eyebrow">
                                EXPENSES
                            </p>

                            <h2>Expense Categories</h2>
                        </div>

                        <span className="category-count expense-count">
                            {expenseCategories.length}
                        </span>
                    </div>

                    {expenseCategories.length === 0 ? (
                        <div className="empty-categories">
                            No expense categories yet.
                        </div>
                    ) : (
                        <div className="category-list">

                            {expenseCategories.map(
                                (category) => (
                                    <div
                                        className="category-row"
                                        key={category.id}
                                    >
                                        <div className="category-info">

                                            <div className="category-icon expense-icon">
                                                ↘
                                            </div>

                                            <div>
                                                <strong>
                                                    {category.name}
                                                </strong>

                                                <span>
                                                    Expense
                                                </span>
                                            </div>

                                        </div>

                                        <div className="category-actions">

                                            <button
                                                className="category-edit-button"
                                                onClick={() =>
                                                    handleEdit(
                                                        category
                                                    )
                                                }
                                            >
                                                Edit
                                            </button>

                                            <button
                                                className="category-delete-button"
                                                onClick={() =>
                                                    handleDelete(
                                                        category.id
                                                    )
                                                }
                                            >
                                                Delete
                                            </button>

                                        </div>
                                    </div>
                                )
                            )}

                        </div>
                    )}

                </div>

            </div>

        </div>
    );
}

export default Categories;