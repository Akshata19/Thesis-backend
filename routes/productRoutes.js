const express = require('express');
const Product = require('../models/Product');   // Import Product model
const Category = require('../models/Category'); // Import Category model

const router = express.Router();

// Add a new product
router.post('/', async (req, res) => {
  try {
    const category = await Category.findById(req.body.category);
    if (!category) {
      return res.status(400).json({ success: false, message: 'Invalid category' });
    }

    const product = new Product(req.body);
    const savedProduct = await product.save();
    res.status(201).json({ success: true, product: savedProduct });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Get all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find().populate('category', 'name');
    res.status(200).json({ success: true, products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/category/:categoryId', async (req, res) => {
  console.log('Category ID:', req.params.categoryId);
  try {
    const { categoryId } = req.params;
    const products = await Product.find({ category: categoryId }); // Find products matching the category ID
    res.status(200).json({ success: true, products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});



module.exports = router;
