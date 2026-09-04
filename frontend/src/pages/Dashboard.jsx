import { useEffect, useState } from "react";
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid
} from "recharts";
import api from "../services/api";
import "./Dashboard.css";
import { useNavigate } from "react-router-dom";

function Dashboard() {
    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    const [summary, setSummary] = useState(null);
    const [recentTransactions, setRecentTransactions] = useState([]);
    const [categoryData, setCategoryData] = useState([]);
    const [monthlyData, setMonthlyData] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadDashboard = async () => {
            try {
                const [
                    summaryResponse,
                    transactionsResponse,
                    categoryResponse,
                    monthlyResponse
                ] = await Promise.all([
                    api.get("/dashboard/summary"),
                    api.get("/dashboard/recent-transactions"),
                    api.get("/dashboard/expenses-by-category"),
                    api.get("/dashboard/monthly")
                ]);

                setSummary(summaryResponse.data);

                setRecentTransactions(
                    transactionsResponse.data.transactions
                );

                setCategoryData(
                    categoryResponse.data.categories.map((item) => ({
                        ...item,
                        total: Number(item.total)
                    }))
                );

                setMonthlyData(
                    monthlyResponse.data.monthly.map((item) => ({
                        ...item,
                        income: Number(item.income),
                        expenses: Number(item.expenses)
                    }))
                );

            } catch (error) {
                console.error("DASHBOARD ERROR:", error);

                if (error.response) {
                    setError(error.response.data.message);
                } else {
                    setError("Unable to connect to the server");
                }
            }
        };

        loadDashboard();
    }, []);

    if (error) {
        return <p>{error}</p>;
    }

    if (!summary) {
        return <p>Loading dashboard...</p>;
    }

    return (
        <div className="dashboard">

            <header className="dashboard-header">
                <h1>Personal Finance</h1>

                <button
                    className="logout-button"
                    onClick={handleLogout}
                >
                    Logout
                </button>
            </header>

            <div className="dashboard-layout">

                <aside className="sidebar">
                    <a href="/dashboard">Dashboard</a>
                    <a href="#">Transactions</a>
                    <a href="#">Categories</a>
                </aside>

                <main className="dashboard-content">

                    <div className="summary-grid">

                        <div className="summary-card">
                            <h2>Balance</h2>
                            <p>
                                €{summary.balance.toFixed(2)}
                            </p>
                        </div>

                        <div className="summary-card">
                            <h2>Income</h2>
                            <p>
                                €{summary.totalIncome.toFixed(2)}
                            </p>
                        </div>

                        <div className="summary-card">
                            <h2>Expenses</h2>
                            <p>
                                €{summary.totalExpenses.toFixed(2)}
                            </p>
                        </div>

                    </div>

                    <div className="charts-grid">

                        <div className="dashboard-card">
                            <h2>Expenses by Category</h2>

                            {categoryData.length === 0 ? (
                                <p>No expense data yet.</p>
                            ) : (
                                <PieChart width={450} height={300}>
                                    <Pie
                                        data={categoryData}
                                        dataKey="total"
                                        nameKey="category"
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={100}
                                        label
                                    >
                                        {categoryData.map(
                                            (entry, index) => (
                                                <Cell
                                                    key={`cell-${index}`}
                                                />
                                            )
                                        )}
                                    </Pie>

                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            )}
                        </div>

                        <div className="dashboard-card">
                            <h2>Monthly Overview</h2>

                            {monthlyData.length === 0 ? (
                                <p>No monthly data yet.</p>
                            ) : (
                                <BarChart
                                    width={600}
                                    height={300}
                                    data={monthlyData}
                                >
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                    />

                                    <XAxis dataKey="month" />

                                    <YAxis />

                                    <Tooltip />

                                    <Legend />

                                    <Bar
                                        dataKey="income"
                                        name="Income"
                                    />

                                    <Bar
                                        dataKey="expenses"
                                        name="Expenses"
                                    />
                                </BarChart>
                            )}
                        </div>

                    </div>

                    <div className="dashboard-card">

                        <h2>Recent Transactions</h2>

                        {recentTransactions.length === 0 ? (
                            <p>No transactions yet.</p>
                        ) : (
                            <ul className="transactions-list">

                                {recentTransactions.map(
                                    (transaction) => (
                                        <li
                                            className="transaction-item"
                                            key={transaction.id}
                                        >
                                            <div className="transaction-info">
                                                <strong>
                                                    {transaction.category}
                                                </strong>

                                                <span>
                                                    {transaction.description}
                                                </span>
                                            </div>

                                            <span className="transaction-amount">
                                                €{transaction.amount}
                                            </span>
                                        </li>
                                    )
                                )}

                            </ul>
                        )}

                    </div>

                </main>
            </div>
        </div>
    );
}

export default Dashboard;