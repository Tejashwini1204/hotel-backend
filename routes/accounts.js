const express = require('express');
const router = express.Router();
const db = require('../db');

// Create account
router.post('/', async (req, res) => {
  try {
    const { name, type } = req.body;

    if (!name || !type) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const result = await db.query(
      'INSERT INTO accounts (name, type) VALUES ($1, $2) RETURNING *',
      [name, type]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Get accounts
router.get('/', async (req, res) => {
  const result = await db.query('SELECT * FROM accounts');
  res.json(result.rows);
});

module.exports = router;