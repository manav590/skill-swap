const express = require('express');
const cors = require('cors');
const db = require('./db'); // DB connection
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Root route
app.get('/', (req, res) => {
  res.send('Skill Swap API is running!');
});

// -----------------------------
// SIGNUP Route
// -----------------------------
app.post('/api/signup', (req, res) => {
  const { name, email, password, skills } = req.body;

  const sql = 'INSERT INTO users (name, email, password, skills) VALUES (?, ?, ?, ?)';
  db.query(sql, [name, email, password, skills], (err, result) => {
    if (err) {
      console.error('❌ Signup Error:', err.message);
      return res.status(500).json({ message: 'Error saving user' });
    }
    res.status(200).json({ message: 'User registered successfully!' });
  });
});

// -----------------------------
// LOGIN Route
// -----------------------------
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  const sql = 'SELECT * FROM users WHERE email = ? AND password = ?';
  db.query(sql, [email, password], (err, results) => {
    if (err) {
      console.error('❌ Login Error:', err.message);
      return res.status(500).json({ message: 'Server error' });
    }

    if (results.length > 0) {
      res.status(200).json({ message: 'Login successful', user: results[0] });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  });
});

// -----------------------------
// GET All Users (for Dashboard)
// -----------------------------
app.get('/api/users', (req, res) => {
  const sql = 'SELECT id, name, email, skills FROM users';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('❌ Fetch Users Error:', err.message);
      return res.status(500).json({ message: 'Error fetching users' });
    }
    res.status(200).json(results);
  });
});

// -----------------------------
// SKILL SWAP REQUEST Route
// -----------------------------
app.post('/api/request', (req, res) => {
  const { fromUserId, toUserId, skillRequested } = req.body;

  // Debug log
  console.log(`Request from ${fromUserId} to ${toUserId} for skill: ${skillRequested}`);

  // Validate input
  if (!fromUserId || !toUserId || !skillRequested) {
    return res.status(400).json({ message: 'Missing fields in request' });
  }

  const sql = 'INSERT INTO requests (from_user_id, to_user_id, skill_requested) VALUES (?, ?, ?)';
  db.query(sql, [fromUserId, toUserId, skillRequested], (err, result) => {
    if (err) {
      console.error('❌ Request Insert Error:', err.message);
      return res.status(500).json({ message: 'Failed to create request' });
    }

    res.status(200).json({ message: 'Skill request sent!' });
  });
});

// -----------------------------
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

// Get requests sent to a specific user
app.get('/api/requests/:toUserId', (req, res) => {
  const { toUserId } = req.params;

  const sql = `
    SELECT r.id, r.skill_requested, r.status, u.name AS from_user_name
    FROM requests r
    JOIN users u ON r.from_user_id = u.id
    WHERE r.to_user_id = ?
    ORDER BY r.created_at DESC
  `;

  db.query(sql, [toUserId], (err, results) => {
    if (err) {
      console.error('❌ Fetch Requests Error:', err.message);
      return res.status(500).json({ message: 'Error fetching requests' });
    }
    res.status(200).json(results);
  });
});

// Update request status
app.post('/api/requests/respond', (req, res) => {
  const { requestId, action } = req.body;

  if (!['accepted', 'rejected'].includes(action)) {
    return res.status(400).json({ message: 'Invalid action' });
  }

  const sql = 'UPDATE requests SET status = ? WHERE id = ?';
  db.query(sql, [action, requestId], (err, result) => {
    if (err) {
      console.error('❌ Request Update Error:', err.message);
      return res.status(500).json({ message: 'Failed to update request' });
    }
    res.status(200).json({ message: `Request ${action}` });
  });
});
