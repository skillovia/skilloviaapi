const pool = require("../config/db");
const bcrypt = require("bcrypt");

class User {
  static async create(data) {
    const { phone, email, firstname, lastname, gender, password } = data;

    const result = await pool.query(
      "INSERT INTO public.users (phone, email, firstname, lastname, gender, password) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *",
      [phone, email, firstname, lastname, gender, password]
    );
    return result.rows[0];
  }

  static async update(userId, updates) {
    const { email, firstname, lastname, gender, password } = updates;
    const hashedPassword = password ? await bcrypt.hash(password, 10) : null;

    const result = await pool.query(
      `UPDATE users 
       SET email = COALESCE($1, email),
           firstname = COALESCE($2, firstname),
           lastname = COALESCE($3, lastname),
           gender = COALESCE($4, gender),
           password = COALESCE($5, password)
       WHERE id = $6 RETURNING *`,
      [email, firstname, lastname, gender, hashedPassword, userId]
    );
    return result.rows[0];
  }

  static async findByPhone(phone) {
    const result = await pool.query("SELECT * FROM users WHERE phone = $1", [
      phone,
    ]);
    return result.rows[0];
  }

  static async findByEmail(email) {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    return result.rows[0];
  }

  static async storeRefreshToken(token) {
    const result = await pool.query(
      "INSERT INTO refreshtoken (token) VALUES ($1) RETURNING token",
      [token]
    );
    return result.rows[0];
  }

  static async getRefreshToken(token) {
    const result = await pool.query(
      "SELECT * FROM refreshtoken WHERE token = $1",
      [token]
    );
    return result.rows[0];
  }

  static async resetPassword(userId, password) {
    const result = await pool.query(
      `UPDATE users 
       SET password = COALESCE($1, password)
       WHERE id = $2 RETURNING *`,
      [password, userId]
    );
    return result.rows[0];
  }

  static async changeNotificationType(userId, type) {
    const result = await pool.query(
      `UPDATE users 
       SET notification_type = COALESCE($1, type)
       WHERE id = $2 RETURNING *`,
      [type, userId]
    );
    return result.rows[0];
  }

  static async changeAppearanceMode(userId, mode) {
    const result = await pool.query(
      `UPDATE users 
       SET appearance_mode = COALESCE($1, mode)
       WHERE id = $2 RETURNING *`,
      [mode, userId]
    );
    return result.rows[0];
  }
}

module.exports = User;
