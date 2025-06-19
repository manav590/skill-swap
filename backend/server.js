const express = require('express');
const cors = require('cors');
const db = require('./db'); // DB connection file
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

// Signup route
app.post('/api/signup', (req, res) => {
  const { name, email, password, skills } = req.body;

  const sql = 'INSERT INTO users (name, email, password, skills) VALUES (?, ?, ?, ?)';
  db.query(sql, [name, email, password, skills], (err, result) => {
    if (err) {
      console.error('❌ MySQL Insert Error:', err.message);
      res.status(500).json({ message: 'Error saving user' });
    } else {
      res.status(200).json({ message: 'User registered successfully!' });
    }
  });
});

// Login route
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  const sql = 'SELECT * FROM users WHERE email = ? AND password = ?';
  db.query(sql, [email, password], (err, results) => {
    if (err) {
      console.error('❌ MySQL Error:', err.message);
      return res.status(500).json({ message: 'Server error' });
    }

    if (results.length > 0) {
      res.status(200).json({ message: 'Login successful', user: results[0] });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
