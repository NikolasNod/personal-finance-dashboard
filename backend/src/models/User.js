const pool = require("../db");

const User = {
  async create({ email, passwordHash }) {
    const result = await pool.query(
      `
        INSERT INTO users (email, password_hash)
        VALUES ($1, $2)
        RETURNING id, email, created_at;
        `,
      [email, passwordHash],
    );

    return result;
  },

  async findById(userId) {
    const result = await pool.query(
      `
        SELECT id, email, password_hash, created_at
        FROM users
        WHERE id = $1
        `,
      [userId],
    );

    return result.rows[0] || null;
  },

  async findByEmail(email) {
    const result = await pool.query(
      `
        SELECT id, email, password_hash, created_at
        FROM users
        WHERE LOWER(email) = LOWER($1)
        `,
      [email],
    );

    return result.rows[0] || null;
  },

  async delete(id) {
    const result = await pool.query(
      `
        DELETE FROM users
        WHERE id = $1
        RETURNING id
        `,
      [id],
    );

    return result.rows[0] || null;
  },
};

module.exports = User;
