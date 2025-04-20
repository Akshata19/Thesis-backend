const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Cart = require('../models/cart');
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

module.exports = router;
