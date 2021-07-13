const express = require('express');
const router = express.Router();

const uploadFile = require('../../middlewares/fileUploadHelper');
const upload=uploadFile.uploadFileMethod('customerDoc');
// create login routes
const admin_controller = require('../../controllers/admin/admin');
const user_controller = require('../../controllers/users/userAuth');
const wallet = require('../../controllers/admin/wallet')
const validationData= require('../../middlewares/FrontendValidator');
const Auth = require("../../middlewares/loginToken")


// upload.single('profile_image')
router.post('/add-customer', admin_controller.createCustomer)
router.put('/update-customer', admin_controller.updateUser)
router.post('/customer-list',admin_controller.getCustomerList)
router.get('/customer-details/:_id',admin_controller.getCustomerDetails)
router.get('/get-customer',admin_controller.getCustomer)
router.post('/uploade-doc',upload.single('file'),admin_controller.uploadeFile)


module.exports = router;

