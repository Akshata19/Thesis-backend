const mongoose = require('mongoose'); // Import mongoose
const Schema = mongoose.Schema;       // Assign mongoose Schema to a variable

// Creating CategorySchema
const CategorySchema = new Schema({
  name: { type: String, unique: true, lowercase: true }, // Unique and lowercase for consistency
  created: { type: Date, default: Date.now },
  CategoryImage: { type: String },
});

// Exporting the category schema to reuse
module.exports = mongoose.model('Category', CategorySchema);
