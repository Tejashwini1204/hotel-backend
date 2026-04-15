const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'hotel_accounts',
  password: 'TejuY@6878',
  port: 5432,
});

module.exports = pool;