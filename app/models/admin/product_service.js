var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
const Schema = mongoose.Schema;
var productServiceSchema = new Schema({
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "adminusers"
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "customers"
  },
  name: {
    type: String,
    trim: true,
    default: ""
  },
  hsn_sac: {
    type: String,
    trim: true,
    default: ""
  },
  discription: {
    type: String,
    trim: true,
    default: ""
  },
  price: {
    type: Number,
    trim: true,
    default: ""
  },
  tax: {
    type: String,
    trim: true,
    default: ""
  },
  //////////////////////end//////////////////

}, { timestamps: true });
productServiceSchema.plugin(mongoosePaginate);
let ProducrServiceModel = mongoose.model('productservice', productServiceSchema);
// UsersModel.createIndexes();
module.exports = ProducrServiceModel;