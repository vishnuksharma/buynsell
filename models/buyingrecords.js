const mongoose = require('mongoose');

const Schema = mongoose.Schema;
// Schema defines how the user data will be stored in MongoDB
const BuyingRecordsSchema = new Schema({
  productid: { type: String, required: true },
  userid: { type: String, required: true },
  prodname: {type: String, required: true},
  boughtby: {type: String, required: true},
  soldby: {type: String, required: true},
  prodprice: {type: Number, required: true},
  adminfees: {type: Number, required: true},
  feesper: {type: Number, required: true},
  prodownermoney: {type: Number, required: true},
  transdate: {type: Date, default: Date.now}
});

// Export the Model
module.exports = mongoose.model('BuyingRecords', BuyingRecordsSchema);