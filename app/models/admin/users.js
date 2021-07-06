var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
const Schema = mongoose.Schema;
var UsersSchema = new Schema({
  name: {
    type: String,
    trim: true
  },
  username: {
    type: String,
    trim: true,
  },
  email: {
    type: String,
    trim: true,
    require: true
  },
  password: {
    type: String,
    trim: true,
  },
  number: {
    type: String,
    trim: true,
  },
  profile_pic: {
    type: String,
    trim: true,
    default:""
  },
  user_type: {
    type: String,
    enum: ['subadmin', 'admin', 'customer'],
    default: 'customer'
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
  is_complete_kyc: {
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
  location: {
    type: { any: [Schema.Types.Mixed] }
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
    type: String,
    trim: true,
  },
  organization: {
    type: { any: [Schema.Types.Mixed] }
  },
  belong_organization: {
    type: { any: [Schema.Types.Mixed] }
  },
  profile_details: {
    type: { any: [Schema.Types.Mixed] }
  }
}, { timestamps: true });
UsersSchema.plugin(mongoosePaginate);
let UsersAdminModel = mongoose.model('adminusers', UsersSchema);
// UsersModel.createIndexes();
module.exports = UsersAdminModel;