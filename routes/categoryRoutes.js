const express = require('express');
const Category = require('../models/Category'); // Import Category model

const router = express.Router();
/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: API for managing product categories
 */

/**
 * @swagger
 * /categories:
 *   post:
 *     summary: Add a new product category
 *     tags: [Categories]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: Electronics
 *               description:
 *                 type: string
 *                 example: Devices and gadgets
 *     responses:
 *       201:
 *         description: Category created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 category:
 *                   $ref: '#/components/schemas/Category'
 *       400:
 *         description: Error while creating category
 */

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Retrieve all product categories
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: A list of product categories
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 categories:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Category'
 *       500:
 *         description: Server error while retrieving categories
 */

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
