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

let awsUpload=uploadFile.awsFileUpload()


// upload.single('profile_image')
router.post('/add-customer', admin_controller.createCustomer)
router.put('/update-customer', admin_controller.updateUser)
router.post('/customer-list',admin_controller.getCustomerList)
router.get('/customer-details/:_id',admin_controller.getCustomerDetails)
router.get('/get-customer',admin_controller.getCustomer)
router.post('/uploade-doc',upload.single('file'),admin_controller.uploadeFile)
router.post('/add-product-service',validationData.createProductService,admin_controller.createProductService )
router.get('/get-product-service',admin_controller.getProductService)

router.get('/get-invoice-no',admin_controller.getInvoiceNumber )
router.post('/check-invoice-no',validationData.checkInvoiceNumber,admin_controller.checkInvoiceNumber )
router.post('/create-invoice',admin_controller.createInvoice )
router.post('/get-invoice-list',admin_controller.getInvoiceList )

router.get('/get-order-no',admin_controller.getOrderNumber )
router.post('/create-order',admin_controller.createOrder )
router.get('/get-order-list',admin_controller.getOrderbyCustomerId )


router.get('/aws/get/bucket', admin_controller.getS3Bucket)
router.post('/aws/create/folder', admin_controller.createFolderOnBucket)
router.post('/aws/delete/object', admin_controller.deletes3Object)



router.post('/aws/upload/image', awsUpload.single('file'), admin_controller.uploadImageAWS)


router.post('/add-folder-file', admin_controller.createFolderAndFile)
router.get('/get-folder', admin_controller.getFolderslist)
router.get('/get-file', admin_controller.getfilelist)

router.get('/get-folder-byid', admin_controller.getDataFolderById)
router.get('/get-file-byid', admin_controller.getDatafileById)

router.post('/payment-method-create', admin_controller.createPaymentMethod)
router.get('/get-payment-method', admin_controller.getPaymentMethodCreatedBy)





module.exports = router;

