// Answer routes for BalanceHub
// Handles fetching and creating answers for a specific question
// All routes are protected and require a valid JWT token

const express = require('express');
const router = express.Router();
const Answer = require('../models/Answer');
const auth = require('../middleware/auth');

// @route   GET /api/answers/:questionId
// @desc    Get all answers for a specific question
// @access  Private
router.get('/:questionId', auth, async (req, res) => {
  try {
    // Find all answers that belong to the specified question
    // Populate author username and sort by oldest first (chronological order)
    const answers = await Answer.find({ question: req.params.questionId })
      .populate('author', 'username')
      .sort({ createdAt: 1 });

    res.json(answers);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/answers
// @desc    Post a new answer to a question
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { body, question } = req.body;

    // Create a new answer with the logged in user as the author
    const answer = new Answer({
      body,
      question,
      author: req.user.id
    });

    await answer.save();

    // Populate author username before returning
    const populated = await answer.populate('author', 'username');
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;