const express = require('express');
const Product = require('../models/Product');   // Import Product model
const Category = require('../models/Category'); // Import Category model

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: API for managing products and categories
 */

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Add a new product
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *               - category
 *             properties:
 *               name:
 *                 type: string
 *                 example: Wireless Mouse
 *               description:
 *                 type: string
 *                 example: A high-precision wireless mouse
 *               price:
 *                 type: number
 *                 example: 29.99
 *               category:
 *                 type: string
 *                 example: 6622f378b6eaa8001fe5f18d
 *     responses:
 *       201:
 *         description: Product added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 product:
 *                   $ref: '#/components/schemas/Product'
 *       400:
 *         description: Invalid category or data error
 */


/**
 * @swagger
 * /products:
 *   get:
 *     summary: Retrieve all products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: A list of products
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 products:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *       500:
 *         description: Server error while fetching products
 */

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
