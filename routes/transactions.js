const router = require('express').Router();
const db = require('../db');

// Create transaction
router.post('/', async (req, res) => {
  const { date, description, lines } = req.body;

  try {
    const entry = await db.query(
      'INSERT INTO journal_entries (date, description) VALUES ($1, $2) RETURNING *',
      [date, description]
    );

    const entryId = entry.rows[0].id;

    for (let line of lines) {
      await db.query(
        `INSERT INTO journal_lines (entry_id, account_id, debit, credit)
         VALUES ($1, $2, $3, $4)`,
        [entryId, line.account_id, line.debit, line.credit]
      );
    }

    res.json({ message: 'Transaction added' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Profit & Loss
router.get('/pnl', async (req, res) => {
  const result = await db.query(`
    SELECT 
      SUM(CASE WHEN a.type='Income' THEN jl.credit - jl.debit ELSE 0 END) AS income,
      SUM(CASE WHEN a.type='Expense' THEN jl.debit - jl.credit ELSE 0 END) AS expense
    FROM journal_lines jl
    JOIN accounts a ON jl.account_id = a.id
  `);

  res.json(result.rows[0]);
});

module.exports = router;