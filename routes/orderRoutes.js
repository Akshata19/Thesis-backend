const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

const User = require('../models/User');
const Cart = require('../models/cart');
const Order = require('../models/Order');

// POST /api/orders/place
router.post('/place', async (req, res) => {
  const { userId } = req.body;

  try {
    // Check if user exists and has an address
    const user = await User.findById(userId);
    if (!user || !user.address) {
      return res.status(400).json({ success: false, message: 'Please update your address before placing an order.' });
    }

    // Find the user's cart
    const cart = await Cart.findOne({ userId }).populate('items.productId');
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ success: false, message: 'Cart is empty' });
    }

    // Create new order
    const newOrder = new Order({
      userId,
      items: cart.items,
      trackingId: uuidv4(),
      status: 'Placed'
    });

    await newOrder.save();

    // Clear the cart after placing the order
    cart.items = [];
    await cart.save();

    res.json({
      success: true,
      message: 'Order placed successfully',
      orderId: newOrder._id,
      trackingId: newOrder.trackingId
    });
  } catch (err) {
    console.error('Error placing order:', err);
    res.status(500).json({ success: false, message: 'Error placing order' });
  }
});

// GET /api/orders/:userId
router.get('/by-user/:userId', async (req, res) => {
const { userId } = req.params;          // <‑‑  “guest” arrives here

  /* treat “guest” (or any non‑ObjectId) as ‘not logged in’ */
  if (!userId || userId === 'guest') {
    return res.status(401).json({ success: false, reason: 'LOGIN_REQUIRED' });
  }

  try {
    const orders = await Order.find({ userId: req.params.userId }).populate('items.productId');
    res.json({ success: true, orders });
  } catch (err) {
    console.error('Error fetching orders:', err);
    res.status(500).json({ success: false, message: 'Error fetching orders' });
  }
});
// GET /api/order/:orderId
router.get('/by-id/:orderId', async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId).populate('items.productId');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.json({ success: true, order });
  } catch (err) {
    console.error('Error fetching order details:', err);
    res.status(500).json({ success: false, message: 'Error fetching order details' });
  }
});



module.exports = router;
