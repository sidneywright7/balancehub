const express = require('express');
const router = express.Router();
const Answer = require('../models/Answer');
const auth = require('../middleware/auth');

// @route   GET /api/answers/:questionId
router.get('/:questionId', auth, async (req, res) => {
  try {
    const answers = await Answer.find({ question: req.params.questionId })
      .populate('author', 'username')
      .sort({ createdAt: 1 });

    res.json(answers);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/answers
router.post('/', auth, async (req, res) => {
  try {
    const { body, question } = req.body;

    const answer = new Answer({
      body,
      question,
      author: req.user.id
    });

    await answer.save();
    const populated = await answer.populate('author', 'username');
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;