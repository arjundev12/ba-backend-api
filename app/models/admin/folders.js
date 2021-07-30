var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
const Schema = mongoose.Schema;
var folderSchema = new Schema({
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "adminusers"
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "customers"
  },
  status: {
    type: String,
    trim: true
  },
  name: {
    type: String,
    trim: true
  },
  file_type: {
    type: String,
    trim: true
  },
  file_path: {
    type: String,
    trim: true
  },
  is_file: {
    type: Boolean,
  },
  is_delete: {
    type: Boolean,
    default:false
  },
  parent: {
    type: Schema.Types.ObjectId,
    ref: 'folders'
  },
  children: [{
    type: Schema.Types.ObjectId,
    ref: 'folders'
  }],
  //////////////////////end//////////////////

}, { timestamps: true });
folderSchema.plugin(mongoosePaginate);
let FolderModel = mongoose.model('folders', folderSchema);
// UsersModel.createIndexes();
module.exports = FolderModel;