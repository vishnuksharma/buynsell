const mongoose = require('mongoose');

const Schema = mongoose.Schema;
// Schema defines how the user data will be stored in MongoDB
const UserSchema = new Schema({
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  mobile: String,
  address: String,
  fname: String,
  usertype: String,
  rating: {type: String, required: true, default: '0'},
  money: {type: String, required: true, default: '10'}
});

// Export the Model
module.exports = mongoose.model('Users', UserSchema);
