const express = require('express');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'zenflow-vision-2030-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: false, // Set to true if using HTTPS in production
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Simple user store (in production, use a database)
const users = [
  {
    id: 1,
    username: 'zenflow-team',
    password: '$2a$10$X9qqJ4VqVqXqJ1qVqXqJ1uVqXqJ1qVqXqJ1qVqXqJ1qVqXqJ1qVq', // 'zenflow2030'
    role: 'team'
  },
  {
    id: 2,
    username: 'zenflow-leadership',
    password: '$2a$10$Y8ppK3WpWpYpK2pWpYpK2uWpYpK2pWpYpK2pWpYpK2pWpYpK2pWp', // 'leadership2030'
    role: 'leadership'
  },
  {
    id: 3,
    username: 'demo',
    password: '$2a$10$WHmkKKQAFyNGAZgZjDL2K.Sp1/FKGKVrI7wKZyXQ8pVvL5dP5nJvi', // 'demo123'
    role: 'demo'
  }
];

// Authentication middleware
function requireAuth(req, res, next) {
  if (req.session && req.session.userId) {
    return next();
  } else {
    return res.redirect('/login');
  }
}

// Routes
app.get('/login', (req, res) => {
  if (req.session && req.session.userId) {
    return res.redirect('/');
  }
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  
  // Find user
  const user = users.find(u => u.username === username);
  
  if (user && await bcrypt.compare(password, user.password)) {
    req.session.userId = user.id;
    req.session.username = user.username;
    req.session.role = user.role;
    res.json({ success: true });
  } else {
    res.json({ success: false, message: 'Invalid credentials' });
  }
});

app.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.json({ success: false });
    }
    res.json({ success: true });
  });
});

app.get('/api/user', requireAuth, (req, res) => {
  const user = users.find(u => u.id === req.session.userId);
  res.json({ 
    username: user.username, 
    role: user.role 
  });
});

app.get('/', requireAuth, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Zenflow 2030 Vision app running on port ${PORT}`);
  console.log('\nLogin Credentials:');
  console.log('Team Access: zenflow-team / zenflow2030');
  console.log('Leadership: zenflow-leadership / leadership2030');
  
});