var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
const Schema = mongoose.Schema;
var paymentMethodSchema = new Schema({
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "adminusers"
  },
  name: {
    type: String,
    trim: true,
  },
  status: {
      type: String,
      trim: true
  }
  //////////////////////end//////////////////

}, { timestamps: true });
paymentMethodSchema.plugin(mongoosePaginate);
let PaymentMethodModel = mongoose.model('paymentmethod', paymentMethodSchema);
// UsersModel.createIndexes();
module.exports = PaymentMethodModel;