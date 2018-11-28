const mongoose = require('mongoose');

const Schema = mongoose.Schema;
// Schema defines how the user data will be stored in MongoDB
const ProductSchema = new Schema({
  title: { type: String, required: true },
  image: { type: String, required: true },
  price: String,
  status: String,
  desc: String,
  category: String,
  usedperiod: String,
  deliverymethod: String,
  userid: { type: String, required: true }
});

// Export the Model
module.exports = mongoose.model('Products', ProductSchema);
