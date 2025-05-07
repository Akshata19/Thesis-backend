const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Cart = require('../models/cart');
const mongoose = require('mongoose');
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
