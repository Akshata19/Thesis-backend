const express = require('express');
const Category = require('../models/Category'); // Import Category model

const router = express.Router();

// Add a new category
router.post('/', async (req, res) => {
  try {
    const category = new Category(req.body);
    const savedCategory = await category.save();
    res.status(201).json({ success: true, category: savedCategory });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Get all categories
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json({ success: true, categories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
