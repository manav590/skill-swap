const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get('/', (req, res) => {
  res.send('Skill Swap API is running!');
});

// Signup route (dummy for now)
app.post('/api/signup', (req, res) => {
  const { name, email, password, skills } = req.body;
  console.log('Received:', req.body);

  // We'll connect to MySQL in the next step
  res.json({ message: 'Signup data received successfully!' });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
