const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());
app.use('/auth', require('./routes/auth'));

app.get('/', (req, res) => {
  res.send('API Running...');
});

app.use('/accounts', require('./routes/accounts'));
app.use('/transactions', require('./routes/transactions'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});