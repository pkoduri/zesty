# README.md
# Zenflow 2030 Vision - Interactive Story with Authentication

A compelling web-based interactive story showcasing Zenflow's vision for 2030, now with secure login functionality.

## 🔐 Authentication Features

- **Secure Login System**: Session-based authentication with bcrypt password hashing
- **Multiple Access Levels**: Team, Leadership, and Demo accounts
- **Protected Content**: Story accessible only after authentication
- **Logout Functionality**: Secure session termination
- **Professional UI**: Beautiful login page matching the story design

## 🚀 Login Credentials

### Available Access Levels:
- **Team Access**: `zenflow-team` / `zenflow2030`
- **Leadership**: `zenflow-leadership` / `leadership2030`  
- **Demo**: `demo` / `demo123`

## 📱 What's Included

### Authentication System:
- **Login Page**: Professional access portal with multiple credential options
- **Session Management**: Secure server-side sessions with configurable expiration
- **User Info Display**: Shows logged-in user and role in navigation
- **Logout Button**: Easy session termination from any page
- **Route Protection**: All story routes require authentication

### Story Features:
- **Interactive Timeline Navigation** (2025-2030)
- **Compelling Visual Storytelling** with animated storyboard frames
- **Professional Design** with Zenflow branding and smooth animations
- **Mobile-Responsive** layout that works on all devices
- **User Context**: Shows current user info in navigation bar

## 🛠 Tech Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend**: Node.js with Express
- **Authentication**: express-session + bcryptjs
- **Deployment**: Render (optimized for free tier)
- **Security**: Session-based auth with CSRF protection

## 🚀 Quick Deploy to Render

1. **Fork/Clone this repository**
2. **Connect to Render**:
   - Go to [render.com](https://render.com)
   - Connect your GitHub account
   - Select this repository
3. **Configure Service**:
   - Service Type: Web Service
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Environment: Node.js
   - **Important**: Render will auto-generate SESSION_SECRET
4. **Deploy**: Click "Create Web Service"

Your app will be live at: `https://your-service-name.onrender.com`

## 💻 Local Development

```bash
# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Start development server
npm run dev

# Or start production server
npm start
```

Visit `http://localhost:3000` - you'll be redirected to login page.

## 📂 Project Structure

```
zenflow-2030-vision/
├── package.json          # Dependencies (now includes auth packages)
├── server.js             # Express server with authentication
├── render.yaml           # Render deployment config
├── public/               # Static assets
│   ├── index.html        # Main story (protected)
│   ├── login.html        # Login page
│   ├── styles.css        # All styling
│   └── script.js         # Interactive functionality
└── README.md            # This file
```

## 🔐 Security Features

### Password Security:
- **Bcrypt Hashing**: All passwords securely hashed with salt
- **Session Management**: Secure server-side session storage
- **Auto-Logout**: Configurable session expiration (24 hours default)
- **HTTPS Ready**: Works with Render's automatic SSL certificates

### Access Control:
- **Route Protection**: All story routes require valid session
- **Role-Based UI**: Different styling based on user role
- **Session Validation**: Server-side session verification on each request
- **Secure Logout**: Proper session destruction

## 🎨 Customization

### Adding New Users:
Edit the `users` array in `server.js`:
```javascript
const users = [
  {
    id: 4,
    username: 'new-user',
    password: await bcrypt.hash('new-password', 10),
    role: 'custom'
  }
];
```

### Changing Passwords:
Generate new hashed passwords:
```bash
node -e "console.log(require('bcryptjs').hashSync('new-password', 10))"
```

### Custom Roles:
Add role-based styling in `styles.css`:
```css
.role-custom {
    background: linear-gradient(135deg, #your-colors);
    border-color: #your-border;
}
```

## 📊 Login Page Features

- **Professional Design**: Matches story branding and aesthetics
- **Quick Access**: Click any credential to auto-fill login form
- **Responsive**: Works perfectly on mobile and desktop
- **Loading States**: Smooth animations during authentication
- **Error Handling**: Clear feedback for invalid credentials
- **Keyboard Shortcuts**: Enter to submit, Escape to clear

## 🔧 Advanced Configuration

### Environment Variables:
```env
NODE_ENV=production
SESSION_SECRET=your-secret-key
PORT=3000
```

### Session Configuration:
Modify session settings in `server.js`:
```javascript
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: true, // Enable for HTTPS
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));
```

## 🚀 Deployment Checklist

- [ ] Update user credentials as needed
- [ ] Configure SESSION_SECRET in Render environment
- [ ] Test login functionality locally
- [ ] Verify responsive design on multiple devices
- [ ] Test logout functionality
- [ ] Check session persistence across page refreshes
- [ ] Validate all protected routes require authentication
- [ ] Test with different user roles

## 📞 Authentication Troubleshooting

### Common Issues:
1. **Session not persisting**: Check SESSION_SECRET is set in environment
2. **Login redirects**: Verify all routes are properly protected
3. **Password issues**: Ensure bcrypt hashing is working correctly
4. **Mobile login**: Test responsive design on actual devices

### Debug Mode:
Add to server.js for debugging:
```javascript
console.log('Session:', req.session);
console.log('User authenticated:', !!req.session.userId);
```

## 🔄 Updates

To update the live site:
1. Push changes to your repository
2. Render will automatically rebuild and deploy
3. Check deployment status in Render dashboard
4. Test login functionality after deployment

---

**🔐 Now featuring secure authentication to protect your Zenflow vision story**

## Quick Start Commands

```bash
# Create project directory
mkdir zenflow-2030-vision
cd zenflow-2030-vision

# Initialize git
git init

# Create files (copy from artifacts)
# - package.json (with auth dependencies)
# - server.js (with authentication)
# - public/index.html (with logout button)
# - public/login.html (new login page)
# - public/styles.css (updated with auth UI)
# - public/script.js (updated with logout)

# Install dependencies
npm install

# Start development
npm start

# Visit http://localhost:3000 (redirects to login)
```

## Git Commands for Deployment

```bash
# Add all files
git add .

# Commit with authentication features
git commit -m "Add secure authentication system

- Session-based login with bcrypt password hashing
- Multiple user roles (team, leadership, demo)
- Protected story routes with authentication middleware
- Professional login page with quick credential access
- Logout functionality with secure session destruction
- Responsive design for mobile and desktop
- Ready for Render deployment with auto-generated secrets"

# Add GitHub remote (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/zenflow-2030-vision.git

# Push to GitHub
git branch -M main
git push -u origin main

# Deploy to Render (auto-deploys from GitHub)
```

Your secure Zenflow vision story will be live with professional authentication! 🚀🔐