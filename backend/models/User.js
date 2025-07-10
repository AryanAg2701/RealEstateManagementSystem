const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const User = {
  register: async (email, password, role, callback) => {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const sql = 'INSERT INTO users (email, password_hash, role) VALUES (?, ?, ?)';
      db.query(sql, [email, hashedPassword, role], callback);
    } catch (err) {
      callback(err);
    }
  },

  login: (email, password, callback) => {
    const sql = 'SELECT * FROM users WHERE email = ?';
    db.query(sql, [email], async (err, results) => {
      if (err) return callback(err);

      if (results.length === 0) return callback(null, null, 'User not found');
      const user = results[0];

      const isMatch = await bcrypt.compare(password, user.password_hash);
      if (!isMatch) return callback(null, null, 'Incorrect password');

      const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
        expiresIn: '10d'
      });

      callback(null, token, null);
    });
  }
};

module.exports = User;
