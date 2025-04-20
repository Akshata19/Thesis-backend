const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String },
   category: { type: Schema.Types.ObjectId, ref: 'Category' }, // Reference to Category
    created: { type: Date, default: Date.now },

});

module.exports = mongoose.model('Product', ProductSchema);
