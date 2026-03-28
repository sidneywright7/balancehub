// Authentication routes for BalanceHub
// Handles user registration and login
// Returns a JWT token on success

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if username already exists in the database
    let user = await User.findOne({ username });
    if (user) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    // Validate password length and number requirement
    if (password.length < 8 || !/\d/.test(password)) {
      return res.status(400).json({ message: 'Password must be at least 8 characters and contain a number' });
    }

    // Hash the password before saving to the database
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create and save the new user
    user = new User({ username, password: hashedPassword });
    await user.save();

    // Generate a JWT token valid for 1 day
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.status(201).json({ token, username: user.username });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/auth/login
// @desc    Login an existing user
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if the user exists in the database
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: 'Invalid username or password' });
    }

    // Compare the provided password with the hashed password in the database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid username or password' });
    }

    // Generate a JWT token valid for 1 day
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.json({ token, username: user.username });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;