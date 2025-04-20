const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const router = express.Router();

// Secret key for JWT
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

// Register a new user
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Check if the email or username already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists.' });
    }

    // Create a new user
    const user = new User({ username, email, password });
    await user.save();

    res.status(201).json({ message: 'User registered successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user.', error });
  }
});

// Login user
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password.' });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password.' });
    }

    // Generate JWT
    const token = jwt.sign({ id: user._id, username: user.username }, JWT_SECRET, {
      expiresIn: '1h',
    });
 return res.json({
        success: true,
        token,
        user: {
          _id: user._id,
          username: user.username,
          email: user.email,
        },
      });

  } catch (error) {
    res.status(500).json({ message: 'Error logging in.', error });
  }
});

// Verify JWT Token
router.get('/verify', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  console.log(token);
  if (!token) return res.status(401).json({ message: 'No token provided.' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    res.status(200).json({ message: 'Token is valid.', user: decoded });
  } catch (error) {
    res.status(401).json({ message: 'Invalid token.' });
  }
});

module.exports = router;
