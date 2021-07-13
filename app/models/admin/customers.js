var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
const Schema = mongoose.Schema;
var CustomerSchema = new Schema({
  title: {
    type: String,
    trim: true
  },
  name: {
    type: String,
    trim: true,
  },
  first_name: {
    type: String,
    trim: true
  },
  middle_name: {
    type: String,
    trim: true
  },
  last_name: {
    type: String,
    trim: true,
  },
  display_name: {
    type: String,
    trim: true,
  },
  website: {
    type: String,
    trim: true,
  },
  suffix: {
    type: String,
    trim: true,
  },
  email: {
    type: String,
    trim: true,
    require: true
  },
  company: {
    type: { any: [Schema.Types.Mixed] }
  },
  password: {
    type: String,
    trim: true,
    default: ""
  },
  number: {
    type: String,
    trim: true,
  },
  mobile_no: {
    type: String,
    trim: true,
  },
  fax: {
    type: String,
    trim: true,
  },
  other: {
    type: String,
    trim: true,
  },
  profile_pic: {
    type: String,
    trim: true,
  },
  
  gst_registration_type: {
    type: { any: [Schema.Types.Mixed] }
  },
  gstin : {
    type: String,
    trim: true,
  },
  is_sub_customer : {
    type: { any: [Schema.Types.Mixed] }
  },
  bill_with_type : {            //bill with parant and bill with customer
    type: String,
    trim: true,
    default: ""
  },
  billing_address: {
    type: { any: [Schema.Types.Mixed] }
  },
  shipping_address: {
    type: { any: [Schema.Types.Mixed] }
  },
  notes : {  
    type: String,
    trim: true,
  },
  tax_info: {
    type: { any: [Schema.Types.Mixed] }
  },
  payment_and_billing: {
    type: { any: [Schema.Types.Mixed] }  
  },
  customer_meta: {
    type: { any: [Schema.Types.Mixed] }  
  },
  attachments: {
    type: String,
    trim: true, 
  },
  is_email_verify: {
    type: String,
    values: ['1', '0','2'],
    default: '0'
  },
  is_number_verify: {
    type: String,
    values: ['1', '0','2'],
    default: '0'
  },
  user_type: {
    type: String,
    enum: ['subadmin', 'admin', 'customer'],
    default: 'customer'
  },
  is_facebook: {
    type: String,
    values: ['1', '0','2'],
    default: '0'
  },
  is_apple: {
    type: String,
    values: ['1', '0','2'],
    default: '0'
  },
  // values: ['facebook', 'google', 'apple', 'manual']
  login_type: {
    type: String,
    enum: ['facebook', 'google', 'apple', 'manual']
  },
  social_media_key: {
    type: String,
  },
  is_super_admin: {
    type: String,
    values: ['0', '1'],
    default: '0'
  },
  forgot_otp: {
    type: String,
    trim: true,
  },
  forgot_otp_verify: {
    type: Boolean,
    default:false
  },
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "adminusers"
  },
  //////////////////////end//////////////////

}, { timestamps: true });
CustomerSchema.plugin(mongoosePaginate);
let CustomerModel = mongoose.model('customers', CustomerSchema);
// UsersModel.createIndexes();
module.exports = CustomerModel;