const mongoose = require('mongoose');


const productSchema = new mongoose.Schema({
  
  description: String,
  price: Number,
  picture: String,
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',  // Reference to Category model
    required: true
  }
});


const Product = mongoose.model('alkproduct', productSchema);

module.exports = Product
