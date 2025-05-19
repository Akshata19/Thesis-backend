const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

const User = require('../models/User');
const Cart = require('../models/cart');
const Order = require('../models/order');


/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Endpoints for placing and retrieving orders
 */

/**
 * @swagger
 * /orders/place:
 *   post:
 *     summary: Place a new order for the logged-in user
 *     tags: [Orders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *             properties:
 *               userId:
 *                 type: string
 *                 example: 6622f45f9e317e001f8611a2
 *     responses:
 *       200:
 *         description: Order placed successfully
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
 *                   example: Order placed successfully
 *                 orderId:
 *                   type: string
 *                   example: 6622f8a19e317e001f8611a5
 *                 trackingId:
 *                   type: string
 *                   example: 22ad0f14-57a9-4ef3-b67c-9e2071a0c2b1
 *       400:
 *         description: Invalid request (missing address or empty cart)
 *       500:
 *         description: Server error while placing order
 */


/**
 * @swagger
 * /orders/by-user/{userId}:
 *   get:
 *     summary: Retrieve all orders placed by a specific user
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user whose orders are being retrieved
 *     responses:
 *       200:
 *         description: A list of user orders
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 orders:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       trackingId:
 *                         type: string
 *                         example: 22ad0f14-57a9-4ef3-b67c-9e2071a0c2b1
 *                       status:
 *                         type: string
 *                         example: Placed
 *       401:
 *         description: User not logged in
 *       500:
 *         description: Server error while fetching orders
 */

/**
 * @swagger
 * /orders/by-id/{orderId}:
 *   get:
 *     summary: Retrieve the details of a specific order by order ID
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the order to retrieve
 *     responses:
 *       200:
 *         description: Order details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 order:
 *                   type: object
 *                   properties:
 *                     trackingId:
 *                       type: string
 *                       example: 22ad0f14-57a9-4ef3-b67c-9e2071a0c2b1
 *                     status:
 *                       type: string
 *                       example: Placed
 *       404:
 *         description: Order not found
 *       500:
 *         description: Server error while fetching order
 */


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
