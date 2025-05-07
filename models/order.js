const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      quantity: Number
    }
  ],
  trackingId: String,
  status: { type: String, default: 'Placed' },
  placedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);
