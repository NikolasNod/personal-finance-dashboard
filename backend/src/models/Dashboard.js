const pool = require("../db/index");

const Dashboard = {
  async getSummary(userId) {
    const result = await pool.query(
      `
        SELECT
          COALESCE(
            SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END),
            0
          ) AS "totalIncome",
          COALESCE(
            SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END),
            0
          ) AS "totalExpenses"
        FROM transactions
        WHERE user_id = $1
      `,
      [userId],
    );

    const { totalIncome, totalExpenses } = result.rows[0];

    return {
      totalIncome: Number(totalIncome),
      totalExpenses: Number(totalExpenses),
      balance: Number(totalIncome) - Number(totalExpenses),
    };
  },

  async getExpensesByCategory(userId) {
    const result = await pool.query(
      `
        SELECT
          c.id,
          c.name AS category,
          COALESCE(SUM(t.amount), 0) AS total
        FROM categories c
        LEFT JOIN transactions t
          ON t.category_id = c.id
          AND t.user_id = $1
          AND t.type = 'expense'
        WHERE c.user_id = $1
          AND c.type = 'expense'
        GROUP BY c.id, c.name
        ORDER BY total DESC
      `,
      [userId],
    );

    return result.rows.map((row) => ({
      id: row.id,
      category: row.category,
      total: Number(row.total),
    }));
  },

  async getMonthly(userId) {
    const result = await pool.query(
      `
        SELECT
          TO_CHAR(DATE_TRUNC('month', date), 'YYYY-MM') AS month,
          COALESCE(
            SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END),
            0
          ) AS income,
          COALESCE(
            SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END),
            0
          ) AS expenses
        FROM transactions
        WHERE user_id = $1
        GROUP BY DATE_TRUNC('month', date)
        ORDER BY DATE_TRUNC('month', date) ASC
      `,
      [userId],
    );

    return result.rows.map((row) => ({
      month: row.month,
      income: Number(row.income),
      expenses: Number(row.expenses),
    }));
  },

  async getRecentTransactions(userId) {
    const result = await pool.query(
      `
        SELECT
          t.id,
          t.amount,
          t.type,
          t.description,
          t.date,
          c.name AS category
        FROM transactions t
        JOIN categories c
          ON c.id = t.category_id
        WHERE t.user_id = $1
        ORDER BY t.date DESC, t.created_at DESC
        LIMIT 10
      `,
      [userId],
    );

    return result.rows.map((row) => ({
      id: row.id,
      amount: Number(row.amount),
      type: row.type,
      description: row.description,
      date: row.date,
      category: row.category,
    }));
  },
};

module.exports = Dashboard;
