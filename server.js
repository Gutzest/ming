const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 5000;

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('.'));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'underneath-media-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // Set to true in production with HTTPS
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Database initialization
async function initDatabase() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        full_name VARCHAR(100),
        profile_image VARCHAR(255),
        is_admin BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS photos (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        filename VARCHAR(255) NOT NULL,
        original_name VARCHAR(255) NOT NULL,
        category VARCHAR(50) NOT NULL,
        title VARCHAR(255),
        description TEXT,
        file_path VARCHAR(500) NOT NULL,
        file_size INTEGER,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('Database tables initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}

// Authentication middleware
function requireAuth(req, res, next) {
  if (req.session.userId) {
    next();
  } else {
    res.status(401).json({ message: 'Authentication required' });
  }
}

function requireAdmin(req, res, next) {
  if (req.session.userId && req.session.isAdmin) {
    next();
  } else {
    res.status(403).json({ message: 'Admin access required' });
  }
}

// Routes

// User Registration
app.post('/api/register', async (req, res) => {
  try {
    const { username, email, password, fullName } = req.body;
    
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Username, email, and password are required' });
    }

    // Check if user already exists
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE username = $1 OR email = $2',
      [username, email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: 'Username or email already exists' });
    }

    // Hash password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create user
    const result = await pool.query(
      'INSERT INTO users (username, email, password_hash, full_name) VALUES ($1, $2, $3, $4) RETURNING id, username, email, full_name',
      [username, email, passwordHash, fullName]
    );

    const user = result.rows[0];
    req.session.userId = user.id;
    req.session.username = user.username;
    req.session.isAdmin = false;

    res.json({ 
      message: 'User created successfully',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.full_name
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// User Login
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    // Find user
    const result = await pool.query(
      'SELECT id, username, email, password_hash, full_name, profile_image, is_admin FROM users WHERE username = $1 OR email = $1',
      [username]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = result.rows[0];

    // Verify password
    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Set session
    req.session.userId = user.id;
    req.session.username = user.username;
    req.session.isAdmin = user.is_admin;

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.full_name,
        profileImage: user.profile_image,
        isAdmin: user.is_admin
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// User Logout
app.post('/api/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: 'Could not log out' });
    }
    res.json({ message: 'Logout successful' });
  });
});

// Get current user
app.get('/api/user', requireAuth, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, username, email, full_name, profile_image, is_admin FROM users WHERE id = $1',
      [req.session.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = result.rows[0];
    res.json({
      id: user.id,
      username: user.username,
      email: user.email,
      fullName: user.full_name,
      profileImage: user.profile_image,
      isAdmin: user.is_admin
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Upload photo
app.post('/api/photos/upload', requireAuth, upload.single('photo'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const { category, title, description, privacy } = req.body;
    
    if (!category) {
      return res.status(400).json({ message: 'Category is required' });
    }

    const isPrivate = privacy === 'private';
    
    const result = await pool.query(
      'INSERT INTO photos (user_id, filename, original_name, category, title, description, file_path, file_size, is_private) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
      [
        req.session.userId,
        req.file.filename,
        req.file.originalname,
        category,
        title || req.file.originalname,
        description || '',
        req.file.path,
        req.file.size,
        isPrivate
      ]
    );

    const photo = result.rows[0];
    res.json({
      message: 'Photo uploaded successfully',
      photo: {
        id: photo.id,
        filename: photo.filename,
        originalName: photo.original_name,
        category: photo.category,
        title: photo.title,
        description: photo.description,
        url: `/uploads/${photo.filename}`,
        createdAt: photo.created_at
      }
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get user's own photos
app.get('/api/photos/my', requireAuth, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT p.*, u.username 
      FROM photos p 
      JOIN users u ON p.user_id = u.id 
      WHERE p.user_id = $1
      ORDER BY p.created_at DESC
    `, [req.session.userId]);

    const photos = result.rows.map(photo => ({
      id: photo.id,
      title: photo.title,
      category: photo.category,
      description: photo.description,
      url: `/uploads/${photo.filename}`,
      filename: photo.filename,
      username: photo.username,
      isPrivate: photo.is_private,
      createdAt: photo.created_at
    }));

    res.json(photos);
  } catch (error) {
    console.error('Get user photos error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete photo
app.delete('/api/photos/:id', requireAuth, async (req, res) => {
  try {
    const photoId = req.params.id;
    
    // Get photo details first to check ownership and get filename
    const photoResult = await pool.query(
      'SELECT * FROM photos WHERE id = $1 AND user_id = $2',
      [photoId, req.session.userId]
    );

    if (photoResult.rows.length === 0) {
      return res.status(404).json({ message: 'Photo not found or unauthorized' });
    }

    const photo = photoResult.rows[0];
    
    // Delete from database
    await pool.query('DELETE FROM photos WHERE id = $1', [photoId]);
    
    // Delete file from filesystem
    const filePath = path.join(__dirname, 'uploads', photo.filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    res.json({ message: 'Photo deleted successfully' });
  } catch (error) {
    console.error('Delete photo error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get photos (only public photos for portfolio)
app.get('/api/photos', async (req, res) => {
  try {
    const { category } = req.query;
    let query = 'SELECT p.*, u.username FROM photos p JOIN users u ON p.user_id = u.id WHERE p.is_private = FALSE';
    const params = [];

    if (category) {
      query += ' AND p.category = $1';
      params.push(category);
    }

    query += ' ORDER BY p.created_at DESC';

    const result = await pool.query(query, params);
    
    const photos = result.rows.map(photo => ({
      id: photo.id,
      filename: photo.filename,
      originalName: photo.original_name,
      category: photo.category,
      title: photo.title,
      description: photo.description,
      url: `/uploads/${photo.filename}`,
      username: photo.username,
      userId: photo.user_id,
      createdAt: photo.created_at
    }));

    res.json(photos);
  } catch (error) {
    console.error('Get photos error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete photo
app.delete('/api/photos/:id', requireAuth, async (req, res) => {
  try {
    const photoId = req.params.id;
    
    // Check if user owns the photo or is admin
    const result = await pool.query(
      'SELECT * FROM photos WHERE id = $1',
      [photoId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Photo not found' });
    }

    const photo = result.rows[0];
    
    if (photo.user_id !== req.session.userId && !req.session.isAdmin) {
      return res.status(403).json({ message: 'Not authorized to delete this photo' });
    }

    // Delete file from filesystem
    const filePath = path.join(__dirname, 'uploads', photo.filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Delete from database
    await pool.query('DELETE FROM photos WHERE id = $1', [photoId]);

    res.json({ message: 'Photo deleted successfully' });
  } catch (error) {
    console.error('Delete photo error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Serve uploaded files
app.use('/uploads', express.static('uploads'));

// Catch all route - serve index.html for SPA
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Initialize database and start server
async function startServer() {
  await initDatabase();
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer().catch(console.error);