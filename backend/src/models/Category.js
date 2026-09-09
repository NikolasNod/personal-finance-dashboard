const pool = require("../db");

const Category = {
  async create({ userId, name, type }) {
    const result = await pool.query(
      `
        INSERT INTO categories (user_id, name, type)
        VALUES ($1, $2, $3)
        RETURNING (id, user_id, name, type);
        `,
      [userId, name, type],
    );

    return result;
  },

  async findByUserId(userId) {
    const result = await pool.query(
      `
        SELECT 
            id,
            name,
            type
        FROM categories
        WHERE user_id = $1
        ORDER BY name ASC
        `,
      [userId],
    );

    return result.rows;
  },

  async update({ userId, categoryId, name, type }) {
    const result = await pool.query(
      `
        UPDATE categories
        SET name = $1, type = $2
        WHERE id = $3 AND user_id = $4
        RETURNING id, user_id, name, type
        `,
      [name, type, categoryId, userId],
    );

    return result.rows[0] || null;
  },

  async delete({ userId, categoryId }) {
    const result = await pool.query(
      `
        DELETE FROM categories
        WHERE id = $1 AND user_id = $2
        RETURNING id
        `,
      [categoryId, userId],
    );

    return result.rows[0] || null;
  },
};

module.exports = Category;
