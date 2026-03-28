const express = require('express');
const router = express.Router();
const Question = require('../models/Question');
const auth = require('../middleware/auth');

// @route   GET /api/questions
router.get('/', auth, async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = {};

    if (category) {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { body: { $regex: search, $options: 'i' } }
      ];
    }

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
router.post('/', auth, async (req, res) => {
  try {
    const { title, body, category } = req.body;

    const question = new Question({
      title,
      body,
      category,
      author: req.user.id
    });

    await question.save();
    const populated = await question.populate('author', 'username');
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;