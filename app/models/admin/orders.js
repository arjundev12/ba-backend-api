var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
const Schema = mongoose.Schema;
var ordersSchema = new Schema({
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "adminusers"
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "customers"
  },
  order_no: {
    type: Number,
    trim : true
  },
  client_po_no: {
    type: Number,
    trim : true
  },
  description: {
    type: String,
    trim: true,
    default: ""
  },
  t_order_value: {
    type: Number,
    trim: true,
  },
  order_startdate: {
    type: String,
    trim: true,
    default:""
  },
  order_enddate: {
    type: String,
    trim: true,
    default:""
  },
  payment_term: {
    type: { any: [Schema.Types.Mixed] }  
  },
  status: {
      type: String,
      trim: true
  }
  //////////////////////end//////////////////

}, { timestamps: true });
ordersSchema.plugin(mongoosePaginate);
let OrderModel = mongoose.model('orders', ordersSchema);
// UsersModel.createIndexes();
module.exports = OrderModel;