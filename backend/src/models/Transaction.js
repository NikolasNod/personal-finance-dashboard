const pool = require("../db");

const Transaction = {
  async create({ userId, categoryId, amount, type, date, description = null }) {
    const result = await pool.query(
      `
        INSERT INTO transactions (user_id, category_id, amount, type, description, date)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id, user_id, category_id, amount, type, description, date, created_at;
        `,
      [userId, categoryId, amount, type, description, date],
    );

    return result;
  },
  async findByTransactionId({ transactionId, userId }) {
    const result = await pool.query(
      `
        SELECT
            id,
            category_id,
            amount,
            type,
            description,
            date,
            created_at
        FROM transactions
        WHERE id = $1 AND user_id = $2;
        `,
      [transactionId, userId],
    );

    return result.rows[0] || null;
  },
  async findByUserId({ userId }) {
    const result = await pool.query(
      `
        SELECT
            t.id,
            t.category_id,
            c.name AS category,
            t.amount,
            t.type,
            t.description,
            t.date,
            t.created_at
        FROM transactions t
        JOIN categories c
            ON c.id = t.category_id
        WHERE t.user_id = $1
        ORDER BY t.date DESC, t.created_at DESC
        `,
      [userId],
    );
  },
  async update({ setParts, values }) {
    const result = await pool.query(
      `
        UPDATE transactions
        SET ${setParts.join(", ")}
        WHERE id = $${values.length - 1}
            AND user_id = $${values.length}
        RETURNING id, user_id, category_id, amount, type, description, date, created_at
        `,
      values,
    );

    return result.rows[0] || null;
  },
  async delete({ transactionId, userId }) {
    const result = await pool.query(
      `
        DELETE FROM transactions
        WHERE id = $1 AND user_id = $2
        RETURNING id
        `,
      [transactionId, userId],
    );

    return result.rows[0] || null;
  },
};

module.exports = Transaction;
