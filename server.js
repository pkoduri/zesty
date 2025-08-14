const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// Login rate limiting (stricter)
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 login requests per windowMs
  message: 'Too many login attempts, please try again later.',
  skipSuccessfulRequests: true
});

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'zenflow-cook-partnership-2025',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production', // HTTPS in production
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Serve static files
app.use(express.static('public'));

// Simple authentication (change these credentials!)
const VALID_CREDENTIALS = {
  'demo': 'demo123',
  'zenflow': 'zenflow2025',
  'cook': 'cook2025',
  'partnership': 'partnership123'
};

// You can add more users here as needed
// Example: 'investor': 'investor456'

// Authentication middleware
const requireAuth = (req, res, next) => {
  if (req.session.authenticated) {
    next();
  } else {
    res.redirect('/login');
  }
};

// Login page route
app.get('/login', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Zenflow & Cook Partnership - Access</title>
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            
            body {
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
                background: linear-gradient(135deg, #0a0a1a 0%, #1a1a2e 100%);
                color: white;
                height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .floating-element {
                position: absolute;
                background: linear-gradient(45deg, #4a90e2, #7b68ee);
                border-radius: 50%;
                animation: float 6s ease-in-out infinite;
                opacity: 0.1;
            }

            .floating-element:nth-child(1) {
                width: 60px;
                height: 60px;
                top: 20%;
                left: 10%;
                animation-delay: 0s;
            }

            .floating-element:nth-child(2) {
                width: 80px;
                height: 80px;
                top: 60%;
                right: 15%;
                animation-delay: 2s;
            }

            .floating-element:nth-child(3) {
                width: 40px;
                height: 40px;
                top: 80%;
                left: 70%;
                animation-delay: 4s;
            }

            @keyframes float {
                0%, 100% { transform: translateY(0px) rotate(0deg); }
                50% { transform: translateY(-20px) rotate(180deg); }
            }
            
            .login-container {
                background: rgba(255, 255, 255, 0.05);
                backdrop-filter: blur(10px);
                border-radius: 20px;
                padding: 3rem;
                border: 1px solid rgba(255, 255, 255, 0.1);
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
                text-align: center;
                max-width: 450px;
                width: 90%;
                position: relative;
                z-index: 10;
            }
            
            .logo {
                font-size: 2.5rem;
                font-weight: 800;
                margin-bottom: 0.5rem;
                background: linear-gradient(45deg, #4a90e2, #7b68ee, #50c878);
                background-size: 200% 200%;
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                animation: gradientShift 3s ease-in-out infinite;
            }

            @keyframes gradientShift {
                0%, 100% { background-position: 0% 50%; }
                50% { background-position: 100% 50%; }
            }
            
            .subtitle {
                color: #b0b8c4;
                margin-bottom: 2rem;
                font-size: 1rem;
                line-height: 1.5;
            }
            
            .form-group {
                margin-bottom: 1.5rem;
                text-align: left;
            }
            
            label {
                display: block;
                margin-bottom: 0.5rem;
                color: #b0b8c4;
                font-size: 0.9rem;
                font-weight: 500;
            }
            
            input[type="text"], input[type="password"] {
                width: 100%;
                padding: 1rem;
                border: 1px solid rgba(255, 255, 255, 0.2);
                border-radius: 12px;
                background: rgba(255, 255, 255, 0.05);
                color: white;
                font-size: 1rem;
                transition: all 0.3s ease;
                font-family: inherit;
            }
            
            input[type="text"]:focus, input[type="password"]:focus {
                outline: none;
                border-color: #4a90e2;
                background: rgba(255, 255, 255, 0.1);
                box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.1);
            }
            
            input::placeholder {
                color: rgba(176, 184, 196, 0.6);
            }
            
            .login-btn {
                width: 100%;
                background: linear-gradient(45deg, #4a90e2, #7b68ee);
                border: none;
                padding: 1rem;
                font-size: 1.1rem;
                color: white;
                border-radius: 12px;
                cursor: pointer;
                transition: all 0.3s ease;
                font-weight: 600;
                font-family: inherit;
                margin-top: 1rem;
            }
            
            .login-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 10px 30px rgba(74, 144, 226, 0.4);
            }

            .login-btn:active {
                transform: translateY(0);
            }
            
            .error {
                color: #ff6b6b;
                margin-top: 1rem;
                padding: 0.8rem;
                background: rgba(255, 107, 107, 0.1);
                border-radius: 8px;
                font-size: 0.9rem;
                border: 1px solid rgba(255, 107, 107, 0.2);
            }
            
            .credentials-hint {
                margin-top: 2rem;
                padding: 1.2rem;
                background: rgba(74, 144, 226, 0.1);
                border-radius: 12px;
                font-size: 0.85rem;
                color: #b0b8c4;
                border: 1px solid rgba(74, 144, 226, 0.2);
                line-height: 1.5;
            }

            .credentials-hint strong {
                color: #4a90e2;
            }

            @media (max-width: 480px) {
                .login-container {
                    padding: 2rem;
                    margin: 1rem;
                }
                
                .logo {
                    font-size: 2rem;
                }
            }
        </style>
    </head>
    <body>
        <div class="floating-element"></div>
        <div class="floating-element"></div>
        <div class="floating-element"></div>
        
        <div class="login-container">
            <div class="logo">Zenflow & Cook</div>
            <div class="subtitle">
                Partnership Vision Access<br>
                <small>Experience the future of BPH care</small>
            </div>
            
            <form method="POST" action="/login">
                <div class="form-group">
                    <label for="username">Username</label>
                    <input type="text" id="username" name="username" placeholder="Enter username" required autocomplete="username">
                </div>
                
                <div class="form-group">
                    <label for="password">Password</label>
                    <input type="password" id="password" name="password" placeholder="Enter password" required autocomplete="current-password">
                </div>
                
                <button type="submit" class="login-btn">Access Partnership Vision →</button>
                
                ${req.query.error ? '<div class="error">❌ Invalid credentials. Please check your username and password.</div>' : ''}
            </form>
            
            <div class="credentials-hint">
                <strong>Demo Access Available</strong><br>
                Contact your partnership representative for credentials<br>
                <em>Demo: demo / demo123</em>
            </div>
        </div>

        <script>
            // Add some interactivity to the login page
            document.querySelector('form').addEventListener('submit', function(e) {
                const btn = document.querySelector('.login-btn');
                btn.innerHTML = 'Accessing... ⏳';
                btn.disabled = true;
            });

            // Auto-focus username field
            document.getElementById('username').focus();
        </script>
    </body>
    </html>
  `);
});

// Handle login POST request
app.post('/login', loginLimiter, (req, res) => {
  const { username, password } = req.body;
  
  // Check credentials
  if (VALID_CREDENTIALS[username] && VALID_CREDENTIALS[username] === password) {
    req.session.authenticated = true;
    req.session.username = username;
    req.session.loginTime = new Date();
    console.log(`✅ Successful login: ${username} at ${new Date().toISOString()}`);
    res.redirect('/');
  } else {
    console.log(`❌ Failed login attempt: ${username} at ${new Date().toISOString()}`);
    res.redirect('/login?error=1');
  }
});

// Logout route
app.get('/logout', (req, res) => {
  const username = req.session.username;
  req.session.destroy((err) => {
    if (err) {
      console.log('Session destroy error:', err);
    } else {
      console.log(`👋 User logged out: ${username} at ${new Date().toISOString()}`);
    }
    res.redirect('/login');
  });
});

// Protected route for the main story
app.get('/', requireAuth, (req, res) => {
  console.log(`📖 Story accessed by: ${req.session.username} at ${new Date().toISOString()}`);
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Health check for Render
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Admin route to see active sessions (optional)
app.get('/admin/status', requireAuth, (req, res) => {
  if (req.session.username === 'admin' || req.session.username === 'zenflow') {
    res.json({
      currentUser: req.session.username,
      loginTime: req.session.loginTime,
      sessionActive: true,
      serverUptime: process.uptime()
    });
  } else {
    res.status(403).json({ error: 'Access denied' });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).send(`
    <html>
      <head>
        <title>Page Not Found</title>
        <style>
          body { 
            font-family: Arial, sans-serif; 
            text-align: center; 
            padding: 50px;
            background: linear-gradient(135deg, #0a0a1a 0%, #1a1a2e 100%);
            color: white;
            height: 100vh;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
          }
          h1 { color: #4a90e2; }
          a { color: #4a90e2; text-decoration: none; }
          a:hover { text-decoration: underline; }
        </style>
      </head>
      <body>
        <h1>404 - Page Not Found</h1>
        <p>The page you're looking for doesn't exist.</p>
        <p><a href="/login">← Back to Login</a></p>
      </body>
    </html>
  `);
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).send(`
    <html>
      <head>
        <title>Server Error</title>
        <style>
          body { 
            font-family: Arial, sans-serif; 
            text-align: center; 
            padding: 50px;
            background: linear-gradient(135deg, #0a0a1a 0%, #1a1a2e 100%);
            color: white;
          }
          h1 { color: #ff6b6b; }
          a { color: #4a90e2; text-decoration: none; }
        </style>
      </head>
      <body>
        <h1>500 - Server Error</h1>
        <p>Something went wrong on our end.</p>
        <p><a href="/login">← Back to Login</a></p>
      </body>
    </html>
  `);
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Zenflow-Cook Partnership Story Server`);
  console.log(`📍 Running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔐 Authentication: Enabled`);
  console.log(`📝 Available credentials:`);
  Object.keys(VALID_CREDENTIALS).forEach(username => {
    console.log(`   - ${username}`);
  });
  console.log(`🔗 Local access: http://localhost:${PORT}`);
  console.log(`✨ Ready to showcase the partnership vision!`);
});