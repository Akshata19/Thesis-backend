const mongoose = require('mongoose');
const Product = require('./models/Product');

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/ecommerce', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const seedProducts = async () => {
  await Product.deleteMany({});
  console.log('All products deleted.');

  await Product.insertMany([
    {
      name: 'Product 1',
      description: 'This is Product 1',
      price: 100,
      image: 'assets/product1.jpeg',
      category: 'Category A',
    },

  ]);

  console.log('Products seeded.');
  mongoose.connection.close();
};

seedProducts();
