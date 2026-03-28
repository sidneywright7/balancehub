// Question routes for BalanceHub
// Handles fetching and creating questions
// All routes are protected and require a valid JWT token

const express = require('express');
const router = express.Router();
const Question = require('../models/Question');
const auth = require('../middleware/auth');

// @route   GET /api/questions
// @desc    Get all questions, optionally filtered by category and/or search term
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = {};

    // Filter by category if provided
    if (category) {
      query.category = category;
    }

    // Search by title or body if search term is provided
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { body: { $regex: search, $options: 'i' } }
      ];
    }

    // Fetch questions and populate author username and category name
    // Sort by newest first
    const questions = await Question.find(query)
      .populate('author', 'username')
      .populate('category', 'name')
      .sort({ createdAt: -1 });

    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/questions
// @desc    Create a new question in a category
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { title, body, category } = req.body;

    // Create a new question with the logged in user as the author
    const question = new Question({
      title,
      body,
      category,
      author: req.user.id
    });

    await question.save();

    // Populate author username before returning
    const populated = await question.populate('author', 'username');
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;