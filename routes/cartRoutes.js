const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Cart = require('../models/cart');
const mongoose = require('mongoose');

/**
 * @swagger
 * tags:
 *   name: Cart
 *   description: API for managing the shopping cart
 */

/**
 * @swagger
 * /cart/add:
 *   post:
 *     summary: Add a product to the user's cart
 *     tags: [Cart]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - productId
 *             properties:
 *               userId:
 *                 type: string
 *                 example: 6622f45f9e317e001f8611a2
 *               productId:
 *                 type: string
 *                 example: 6622f46b9e317e001f8611a3
 *     responses:
 *       200:
 *         description: Product added to cart
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Product added to cart
 */


/**
 * @swagger
 * /cart/{userId}:
 *   get:
 *     summary: Retrieve the user's cart by user ID
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user
 *     responses:
 *       200:
 *         description: Returns the user's cart
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 cart:
 *                   type: object
 *                   properties:
 *                     userId:
 *                       type: string
 *                     items:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           productId:
 *                             type: object
 *                             description: Populated product object
 *                           quantity:
 *                             type: integer
 */


/**
 * @swagger
 * /cart/remove:
 *   post:
 *     summary: Remove a product from the user's cart
 *     tags: [Cart]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - productId
 *             properties:
 *               userId:
 *                 type: string
 *                 example: 6622f45f9e317e001f8611a2
 *               productId:
 *                 type: string
 *                 example: 6622f46b9e317e001f8611a3
 *     responses:
 *       200:
 *         description: Product removed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Product removed from cart
 *       404:
 *         description: Cart not found
 *       500:
 *         description: Error removing item from cart
 */

// Add to cart: POST /api/cart/add
// POST /api/cart/add
router.post('/add', async (req, res) => {
  const { userId, productId } = req.body;

  let cart = await Cart.findOne({ userId });

  if (!cart) {
    cart = new Cart({ userId, items: [{ productId }] });
  } else {
    const existingItem = cart.items.find(item => item.productId.toString() === productId);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.items.push({ productId });
    }
  }

  await cart.save();
  res.json({ success: true, message: 'Product added to cart' });
});

// GET /api/cart/:userId
router.get('/:userId', async (req, res) => {
  const cart = await Cart.findOne({ userId: req.params.userId }).populate('items.productId');
  res.json({ success: true, cart });
});



// POST /api/cart/remove
router.post('/remove', async (req, res) => {
  const { userId, productId } = req.body;

  try {
    console.log("Removing product:", productId, "from user:", userId);

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      console.log("Cart not found");
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    const objectIdToRemove = new mongoose.Types.ObjectId(productId);

    cart.items = cart.items.filter(item => !item.productId.equals(objectIdToRemove));

    await cart.save();

    console.log("Product removed successfully");
    res.json({ success: true, message: 'Product removed from cart' });
  } catch (err) {
    console.error("Server error while removing item:", err);
    res.status(500).json({ success: false, message: 'Error removing item from cart' });
  }
});



module.exports = router;
