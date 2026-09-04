import { useEffect, useState } from "react";
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid
} from "recharts";

import api from "../services/api";
import "./Dashboard.css";

function Dashboard() {
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

                const summaryData = summaryResponse.data;

                setSummary({
                    ...summaryData,
                    balance: Number(summaryData.balance),
                    totalIncome: Number(summaryData.totalIncome),
                    totalExpenses: Number(summaryData.totalExpenses)
                });

                setRecentTransactions(
                    transactionsResponse.data.transactions || []
                );

                setCategoryData(
                    (categoryResponse.data.categories || []).map((item) => ({
                        ...item,
                        total: Number(item.total)
                    }))
                );

                setMonthlyData(
                    (monthlyResponse.data.monthly || []).map((item) => ({
                        ...item,
                        income: Number(item.income),
                        expenses: Number(item.expenses)
                    }))
                );

            } catch (error) {
                console.error("DASHBOARD ERROR:", error);

                if (error.response) {
                    setError(
                        error.response.data.message ||
                        "Failed to load dashboard"
                    );
                } else {
                    setError("Unable to connect to the server");
                }
            }
        };

        loadDashboard();
    }, []);

    if (error) {
        return (
            <div className="dashboard-error">
                <div className="error-icon">!</div>
                <h2>Something went wrong</h2>
                <p>{error}</p>
            </div>
        );
    }

    if (!summary) {
        return (
            <div className="dashboard-loading">
                <div className="loading-spinner"></div>
                <p>Loading your finances...</p>
            </div>
        );
    }

    return (
        <div className="dashboard-page">

            <div className="dashboard-heading">
                <div>
                    <p className="eyebrow">OVERVIEW</p>
                    <h1>Dashboard</h1>
                    <p className="dashboard-subtitle">
                        Here's what's happening with your finances.
                    </p>
                </div>
            </div>

            {/* Summary cards */}
            <div className="summary-grid">

                <div className="summary-card balance-card">
                    <div className="summary-card-top">
                        <div>
                            <span className="summary-label">
                                Total Balance
                            </span>

                            <h2>
                                €{summary.balance.toFixed(2)}
                            </h2>
                        </div>

                        <div className="summary-icon balance-icon">
                            €
                        </div>
                    </div>

                    <div className="summary-footer">
                        <span className="status-dot"></span>
                        Current balance
                    </div>
                </div>

                <div className="summary-card">
                    <div className="summary-card-top">
                        <div>
                            <span className="summary-label">
                                Total Income
                            </span>

                            <h2>
                                €{summary.totalIncome.toFixed(2)}
                            </h2>
                        </div>

                        <div className="summary-icon income-icon">
                            ↗
                        </div>
                    </div>

                    <div className="summary-footer income-text">
                        Money coming in
                    </div>
                </div>

                <div className="summary-card">
                    <div className="summary-card-top">
                        <div>
                            <span className="summary-label">
                                Total Expenses
                            </span>

                            <h2>
                                €{summary.totalExpenses.toFixed(2)}
                            </h2>
                        </div>

                        <div className="summary-icon expense-icon">
                            ↘
                        </div>
                    </div>

                    <div className="summary-footer expense-text">
                        Money going out
                    </div>
                </div>

            </div>

            {/* Charts */}
            <div className="charts-grid">

                <div className="dashboard-card category-card">
                    <div className="card-header">
                        <div>
                            <p className="card-eyebrow">
                                BREAKDOWN
                            </p>
                            <h2>Expenses by Category</h2>
                        </div>
                    </div>

                    {categoryData.length === 0 ? (
                        <div className="empty-chart">
                            <div className="empty-icon">◌</div>
                            <p>No expense data yet</p>
                            <span>
                                Add some expenses to see your breakdown.
                            </span>
                        </div>
                    ) : (
                        <div className="chart-container pie-container">
                            <ResponsiveContainer width="100%" height={320}>
                                <PieChart>
                                    <Pie
                                        data={categoryData}
                                        dataKey="total"
                                        nameKey="category"
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={70}
                                        outerRadius={105}
                                        paddingAngle={3}
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

                                    <Tooltip
                                        formatter={(value) =>
                                            `€${Number(value).toFixed(2)}`
                                        }
                                    />

                                    <Legend
                                        verticalAlign="bottom"
                                        height={36}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    )}
                </div>

                <div className="dashboard-card monthly-card">
                    <div className="card-header">
                        <div>
                            <p className="card-eyebrow">
                                TRENDS
                            </p>
                            <h2>Monthly Overview</h2>
                        </div>
                    </div>

                    {monthlyData.length === 0 ? (
                        <div className="empty-chart">
                            <div className="empty-icon">◌</div>
                            <p>No monthly data yet</p>
                            <span>
                                Your monthly activity will appear here.
                            </span>
                        </div>
                    ) : (
                        <div className="chart-container">
                            <ResponsiveContainer width="100%" height={320}>
                                <BarChart
                                    data={monthlyData}
                                    margin={{
                                        top: 10,
                                        right: 10,
                                        left: 0,
                                        bottom: 5
                                    }}
                                >
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        vertical={false}
                                    />

                                    <XAxis
                                        dataKey="month"
                                        tickLine={false}
                                        axisLine={false}
                                    />

                                    <YAxis
                                        tickLine={false}
                                        axisLine={false}
                                    />

                                    <Tooltip
                                        formatter={(value) =>
                                            `€${Number(value).toFixed(2)}`
                                        }
                                    />

                                    <Legend />

                                    <Bar
                                        dataKey="income"
                                        name="Income"
                                        radius={[6, 6, 0, 0]}
                                    />

                                    <Bar
                                        dataKey="expenses"
                                        name="Expenses"
                                        radius={[6, 6, 0, 0]}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    )}
                </div>

            </div>

            {/* Recent transactions */}
            <div className="dashboard-card transactions-card">

                <div className="card-header">
                    <div>
                        <p className="card-eyebrow">
                            ACTIVITY
                        </p>
                        <h2>Recent Transactions</h2>
                    </div>

                    <a
                        href="/transactions"
                        className="view-all-link"
                    >
                        View all →
                    </a>
                </div>

                {recentTransactions.length === 0 ? (
                    <div className="empty-transactions">
                        <div className="empty-icon">◎</div>
                        <h3>No transactions yet</h3>
                        <p>
                            Add your first transaction to start
                            tracking your finances.
                        </p>

                        <a
                            href="/transactions"
                            className="primary-button"
                        >
                            Add transaction
                        </a>
                    </div>
                ) : (
                    <div className="transaction-list">

                        {recentTransactions.map((transaction) => (
                            <div
                                className="transaction-row"
                                key={transaction.id}
                            >

                                <div className="transaction-left">

                                    <div
                                        className={`transaction-type-icon ${
                                            transaction.type === "income"
                                                ? "transaction-income"
                                                : "transaction-expense"
                                        }`}
                                    >
                                        {transaction.type === "income"
                                            ? "↗"
                                            : "↘"}
                                    </div>

                                    <div>
                                        <h3>
                                            {transaction.description ||
                                                transaction.category ||
                                                "Transaction"}
                                        </h3>

                                        <p>
                                            {transaction.category ||
                                                "Uncategorized"}
                                            {" • "}
                                            {new Date(
                                                transaction.date
                                            ).toLocaleDateString()}
                                        </p>
                                    </div>

                                </div>

                                <div
                                    className={`transaction-amount ${
                                        transaction.type === "income"
                                            ? "amount-income"
                                            : "amount-expense"
                                    }`}
                                >
                                    {transaction.type === "income"
                                        ? "+"
                                        : "-"}
                                    €{Number(transaction.amount).toFixed(2)}
                                </div>

                            </div>
                        ))}

                    </div>
                )}

            </div>

        </div>
    );
}

export default Dashboard;