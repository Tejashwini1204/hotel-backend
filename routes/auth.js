const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SECRET = "mysecretkey";

// Register
router.post('/register', async (req, res) => {
  const { email, password } = req.body;

  const hashed = await bcrypt.hash(password, 10);

  const result = await db.query(
    'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *',
    [email, hashed]
  );

  res.json(result.rows[0]);
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const user = await db.query('SELECT * FROM users WHERE email=$1', [email]);

  if (user.rows.length === 0) {
    return res.status(400).json({ error: "User not found" });
  }

  const valid = await bcrypt.compare(password, user.rows[0].password);

  if (!valid) {
    return res.status(400).json({ error: "Invalid password" });
  }

  const token = jwt.sign({ id: user.rows[0].id }, SECRET);

  res.json({ token });
});

module.exports = router;