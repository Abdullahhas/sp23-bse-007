const mongoose = require('mongoose');


const productSchema = new mongoose.Schema({
  
  description: String,
  price: Number,
  picture: String,
  // category:String
});


let Product = mongoose.model('alkproduct', productSchema);

module.exports = Product
