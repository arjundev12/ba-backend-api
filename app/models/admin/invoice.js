var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
const Schema = mongoose.Schema;
var invoiceSchema = new Schema({
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "adminusers"
  },
  
  customer_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "customers"
  },
  invoice_number: {
    type: Number,
    trim : true
  },
  invoice_type: {
    type: String,
    trim : true
  },
  invoice_date: {
    type: String,
    trim: true,
  },
  due_date: {
    type: String,
    trim: true
  },
  // service_date: {
  //   type: String,
  //   trim: true
  // },
  // description: {
  //   type: String,
  //   trim: true,
  // },
  // qty: {
  //   type: String,
  //   trim: true,
  // },
  // rate: {
  //   type: Number,
  //   trim: true,
  // },
  // amount: {
  //   type: Number,
  //   trim: true,
  // },
  // tax: {
  //   type: Number,
  //   trim: true,
  // },
  total: {
    type: Number,
    trim: true,
  },
  subtotal: {
    type: Number,
    trim: true,
  },
  balance_due: {
    type: Number,
    trim: true,
  },
  invoice_message: {
    type: String,
    trim: true
  },
  statement_message: {
    type: String,
    trim: true
  },
  attachments: {
    type: String,
    trim: true, 
  },
  products_meta: {
    type: { any: [Schema.Types.Mixed] }  
  },
  recurring_interval: {
    type: { any: [Schema.Types.Mixed] }  
  },
  //////////////////////end//////////////////

}, { timestamps: true });
invoiceSchema.plugin(mongoosePaginate);
let InvoiceModel = mongoose.model('invoice', invoiceSchema);
// UsersModel.createIndexes();
module.exports = InvoiceModel;