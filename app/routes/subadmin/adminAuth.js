const express = require('express');
const router = express.Router();

// const uploadFile = require('../../middlewares/fileUploadHelper');
// const upload=uploadFile.uploadFileMethod('QuestionsImage');
// create login routes
const admin_controller = require('../../controllers/admin/admin');
const user_controller = require('../../controllers/users/userAuth');
const wallet = require('../../controllers/admin/wallet')
const validationData= require('../../middlewares/FrontendValidator');
const Auth = require("../../middlewares/loginToken")


// upload.single('profile_image')
router.post('/login', admin_controller.loginAdmin)
router.post('/subadmin-signup',admin_controller.signup)



module.exports = router;

