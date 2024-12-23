const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: String,
  description : String,
  
});

let Category  = mongoose.model('Category', categorySchema);
module.exports = Category