

const commenFunction = require('../../middlewares/common')
const UsersAdminModel = require('../../models/admin/users');
const UsersModel = require('../../models/users')
const moment = require("moment");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const TransactionModal = require('../../models/transactions')
const DocumentsModel = require('../../models/userDocument')
const CustomerModel = require('../../models/admin/customers')
class adminAuth {
    constructor() {
        return {
            loginAdmin: this.loginAdmin.bind(this),
            signup: this.signup.bind(this),
            createCustomer: this.createCustomer.bind(this),
            getCustomer: this.getCustomer.bind(this),
            uploadeFile: this.uploadeFile.bind(this),
            getCustomerList: this.getCustomerList.bind(this),
            getCustomerDetails: this.getCustomerDetails.bind(this),
            updateUser: this.updateUser.bind(this)
            // createCustomer: this.createCustomer.bind(this),
            // getCustomer: this.getCustomer.bind(this),
            // uploadeFile: this.uploadeFile.bind(this),
            // getCustomerList: this.getCustomerList.bind(this),
            // getCustomerDetails: this.getCustomerDetails.bind(this),
            // updateUser: this.updateUser.bind(this)


        }
    }

    async loginAdmin(req, res) {
        try {
            let { email, password } = req.body
            let getUser = await UsersAdminModel.findOne({ $and: [{ email: email }, { login_type: 'manual' }, { user_type: 'subadmin' }] },
            ).lean()
            console.log("getUser", getUser)
            if (getUser) {
                let verifypass = await bcrypt.compareSync(password, getUser.password);
                if (verifypass) {
                    let stoken = {
                        _id: getUser._id,
                        email: getUser.email
                    }
                    getUser.token = await jwt.sign(stoken, process.env.SUPERSECRET, { expiresIn: '1d' });
                    res.json({ code: 200, success: true, message: 'login successfully', data: getUser })
                } else {
                    res.json({ code: 404, success: false, message: 'invalid password', })
                }
            } else {
                res.json({ code: 404, success: false, message: 'Email is not register', })
            }
        } catch (error) {
            console.log("Error in catch", error)
            res.status(500).json({ success: false, message: "Internal server error", })
        }
    }

    async signup(req, res) {
        try {
            let { name, organization, password, email, location } = req.body
            let getUser = await UsersAdminModel.findOne({ $and: [{ email: email }, { login_type: 'manual' }, { user_type: 'subadmin' }] }).lean()
            if (getUser) {
                res.json({ code: 404, success: false, message: 'Email is already register', })
            } else {
                const salt = bcrypt.genSaltSync(10);
                const hash = bcrypt.hashSync(password, salt);

                let savedata = new UsersAdminModel({
                    name: name,
                    password: hash,
                    email: email,
                    organization: organization,
                    location: location,
                    user_type: 'subadmin',
                    created_by: "",
                    login_type: 'manual'
                })
                let data = await savedata.save();
                let stoken = {
                    _id: data._id,
                    email: data.email,
                }
                data.token = await jwt.sign(stoken, process.env.SUPERSECRET, { expiresIn: '1d' });
                res.json({ code: 200, success: true, message: 'Sign up successfully', data: data })
            }

        } catch (error) {
            console.log("Error in catch", error)
            res.status(500).json({ success: false, message: "Somthing went wrong", })
        }
    }
    async createCustomer(req, res) {
        try {
            let { name, title, first_name, middle_name, last_name, display_name, website, suffix, email,
                company, password, number, profile_pic, gst_registration_type, gstin, is_sub_customer, bill_with_type,
                billing_address, shipping_address, notes, tax_info, payment_and_billing, attachments, other, mobile_no, fax, created_by
                , customer_meta } = req.body
            let getuser = await CustomerModel.findOne({ email: email })
            if (getuser) {
                res.json({ code: 200, success: true, message: 'email is already exist', data: getuser })
            } else {
                let savedata = new CustomerModel({
                    title: title,
                    name: name,
                    first_name: first_name,
                    middle_name: middle_name,
                    last_name: last_name,
                    display_name: display_name,
                    website: website,
                    suffix: suffix,
                    email: email,
                    other: other,
                    mobile_no: mobile_no,
                    fax: fax,
                    company: company,
                    // password: password,
                    number: number,
                    // profile_pic: profile_pic,
                    gst_registration_type: gst_registration_type,
                    gstin: gstin,
                    is_sub_customer: is_sub_customer,
                    bill_with_type: bill_with_type,
                    billing_address: billing_address,
                    shipping_address: shipping_address,
                    notes: notes,
                    tax_info: tax_info,
                    payment_and_billing: payment_and_billing,
                    attachments: attachments,
                    created_by: created_by,
                    customer_meta: customer_meta
                })
                let data = await savedata.save();
                res.json({ code: 200, success: true, message: 'Create customer successfully', data: data })
            }

        } catch (error) {
            console.log("Error in catch", error)
            res.status(500).json({ success: false, message: "Somthing went wrong", })
        }
    }
    async updateUser(req, res) {
        try {
            let { _id, name, title, first_name, middle_name, last_name, display_name, website, suffix, email,
                company, password, number, profile_pic, gst_registration_type, gstin, is_sub_customer, bill_with_type,
                billing_address, shipping_address, notes, tax_info, payment_and_billing, attachments, other, mobile_no, fax, created_by
                , customer_meta } = req.body
            let getuser = await CustomerModel.findOne({ _id: _id }).lean()
            if (getuser) {
                if (name) {
                    getuser.name = name
                }
                if (title) {
                    getuser.title = title
                }
                if (first_name) {
                    getuser.first_name = first_name
                }
                if (middle_name) {
                    getuser.middle_name = middle_name
                }
                if (last_name) {
                    getuser.last_name = last_name
                }
                if (display_name) {
                    getuser.display_name = display_name
                }
                if (website) {
                    getuser.website = website
                }
                if (suffix) {
                    getuser.suffix = suffix
                }
                
                if (email) {
                    getuser.email = email
                }
                if (other) {
                    getuser.other = other
                }
                if (mobile_no) {
                    getuser.mobile_no = mobile_no
                }
                if (fax) {
                    getuser.fax = fax
                }
                if (company) {
                    getuser.company = company
                }
                if (number) {
                    getuser.number = number
                }
                if (gst_registration_type) {
                    getuser.gst_registration_type = gst_registration_type
                }
                if (gstin) {
                    getuser.gstin = gstin
                }
                //////
                if (is_sub_customer) {
                    getuser.is_sub_customer = is_sub_customer
                }
                if (bill_with_type) {
                    getuser.bill_with_type = bill_with_type
                }
                if (billing_address) {
                    getuser.billing_address = billing_address
                }
                if (shipping_address) {
                    getuser.shipping_address = shipping_address
                }
                
                if (notes) {
                    getuser.notes = notes
                }
                if (tax_info) {
                    getuser.tax_info = tax_info
                }
                if (payment_and_billing) {
                    getuser.payment_and_billing = payment_and_billing
                }
                if (attachments) {
                    getuser.attachments = attachments
                }
                if (customer_meta) {
                    getuser.customer_meta = customer_meta
                }
                 let update = await CustomerModel.findOneAndUpdate({ _id: _id },getuser)
                res.json({ code: 200, success: true, message: 'update customer successfully', data: update })
            } else {
                res.json({ code: 404, success: true, message: 'user id is not exist' })
            }

        } catch (error) {
            console.log("Error in catch", error)
            res.status(500).json({ success: false, message: "Somthing went wrong", })
        }
    }
    async getCustomer(req, res) {
        try {
            console.log("req.query._id,", req.query._id)
            let getUser = await CustomerModel.find({ created_by: req.query._id }, { name: 1, first_name: 1, last_name: 1, display_name: 1 })
            res.json({ code: 200, success: true, message: "Get list successfully ", data: getUser })
        } catch (error) {
            console.log("Error in catch", error)
            res.status(500).json({ success: false, message: "Internal server error", })
        }
    }
    async getCustomerList(req, res) {
        try {
            let options = {
                page: Number(req.body.page) || 1,
                limit: Number(req.body.limit) || 10,
                // sort: {  "subcategory_meta.name":1,"name": 1, },
                lean: true,
            }
            let query = {}
            console.log(req.body)
            if (req.body.searchData) {
                query = {
                    $or: [{ email: { $regex: req.body.searchData, $options: "i" } },
                    { name: { $regex: req.body.searchData, $options: "i" } },
                    { first_name: { $regex: req.body.searchData, $options: "i" } },
                    { display_name: { $regex: req.body.searchData, $options: "i" } },
                    { middle_name: { $regex: req.body.searchData, $options: "i" } }]
                }
            }
            if (req.body._id) {
                query.created_by = req.body._id
            }
            console.log("request", query)
            let data = await CustomerModel.paginate(query, options)
            //    console.log("req.query._id,",data)
            // let getUser = await CustomerModel.find({created_by: req.query._id},{name:1,first_name:1,last_name:1,display_name:1})
            res.json({ code: 200, success: true, message: "Get list successfully ", data: data })
        } catch (error) {
            console.log("Error in catch", error)
            res.status(500).json({ success: false, message: "Internal server error", })
        }
    }
    async getCustomerDetails(req, res) {
        try {
            console.log("req.query._id,", req.params._id)
            let getUser = await CustomerModel.findOne({ _id: req.params._id })
            res.json({ code: 200, success: true, message: "Get data successfully ", data: getUser })
        } catch (error) {
            console.log("Error in catch", error)
            res.status(500).json({ success: false, message: "Internal server error", })
        }
    }
    async uploadeFile(req, res) {
        try {
            if (req.file.path) {
                var path2 = req.file.path.replace(/\\/g, "/");
                res.json({ code: 200, success: true, message: 'uploade successfully', data: path2 })
            } else {
                res.json({ code: 400, success: false, message: "order_image is require", })
            }

        } catch (error) {
            res.json({ code: 400, success: false, message: "Internal server error", })
        }
    }










    ////////////////////////////////////////////////////////////end ba apis admin..///////////////
    async getUser(req, res) {
        try {
            let options = {
                page: req.body.page || 1,
                limit: req.body.limit || 10,
                sort: { createdAt: -1 },
                lean: true,
                // select: 'name user_type minner_Activity createdAt',
            }
            let query = { user_type: 'user' }
            if (req.body.searchData) {
                query = {
                    user_type: 'user',
                    $or: [{ email: { $regex: req.body.searchData, $options: "i" } },
                    { name: { $regex: req.body.searchData, $options: "i" } },
                    { username: { $regex: req.body.searchData, $options: "i" } }]
                }
            }
            let getUser = await UsersModel.paginate(query, options)
            res.json({ code: 200, success: true, message: "Get list successfully ", data: getUser })
        } catch (error) {
            console.log("Error in catch", error)
            res.status(500).json({ success: false, message: "Internal server error", })
        }
    }
    async adminAddUser(req, res) {
        try {
            let saveData
            let data
            let stoken
            let error
            let { name, email, username, password } = req.body
            // if (login_type == 'manual') {
            let getUser = await UsersModel.findOne({ $and: [{ email: email }, { login_type: 'manual' }, { user_type: 'user' }] })
            console.log("getUser", getUser)
            if (getUser) {
                console.log("getUser", getUser)
                error = true
            } else {
                const salt = bcrypt.genSaltSync(10);
                const hash = bcrypt.hashSync(password, salt);
                saveData = new UsersModel({
                    name: name,
                    username: username,
                    email: email,
                    password: hash,
                    login_type: 'manual',
                    Referral_id: ""
                })
                data = await saveData.save();
            }
            // }
            //  else if (social_media_key && social_media_key != "") {
            //     getUser = await UsersModel.findOne({ $and: [{ email: email }, { login_type: login_type }, { user_type: 'user' }] })
            //     if (getUser) {
            //         data = await UsersModel.findOneAndUpdate(
            //             {
            //                 $and: [{ email: req.body.email }, { login_type: login_type }]
            //             },
            //             {
            //                 $set: { social_media_key: social_media_key }
            //             }, { new: true }).lean()

            //             data.social_status = "old"
            //     } else {
            //         let obj =  {
            //             name: name? name: "",
            //             email: email,
            //             username: "",
            //             login_type: login_type,
            //             Referral_id: await this._generateRefID(),
            //             social_media_key: social_media_key

            //         }
            //             // if(username){
            //             //     obj.usename = username
            //             // }else{
            //             //     obj.usename = ""  
            //             // }

            //         saveData = new UsersModel(obj)
            //        let data1= await saveData.save();
            //          data= await UsersModel.findOne({_id:data1._id }).lean()
            //         data.social_status = "new"
            //         await commenFunction._createWallet(data._id, 'user')
            //     }

            // }
            if (data) {
                // stoken = {
                //     _id: data._id,
                //     email: data.email
                // }
                // data.token = await jwt.sign(stoken, process.env.SUPERSECRET, { expiresIn: '7d' });
                return res.json({ code: 200, success: true, message: 'Data save successfully', data: data })
            } else if (error) {
                res.json({ code: 404, success: false, message: 'Email already exist', data: getUser.email })
            } else {
                res.json({ success: false, message: "Somthing went wrong", })
            }

        } catch (error) {
            console.log("Error in catch", error)
            res.json({ success: false, message: "Somthing went wrong", })
        }

    }
    //////////////////////////////////////////////////////////end///////////////////////////////////////
    async getUserKyc(req, res) {
        try {
            let options = {
                page: req.body.page || 1,
                limit: req.body.limit || 10,
                sort: { createdAt: -1 },
                lean: true,
                // select: 'name user_type minner_Activity createdAt',
            }
            let query = { user_type: 'user', is_complete_kyc: { $ne: '0' }, }
            if (req.body.searchData) {
                query = {
                    user_type: 'user',
                    is_complete_kyc: { $ne: '0' },
                    $or: [{ email: { $regex: req.body.searchData, $options: "i" } },
                    { name: { $regex: req.body.searchData, $options: "i" } },
                    { username: { $regex: req.body.searchData, $options: "i" } }]
                }
            }
            let getUser = await UsersModel.paginate(query, options)
            res.json({ code: 200, success: true, message: "Get list successfully ", data: getUser })
        } catch (error) {
            console.log("Error in catch", error)
            res.status(500).json({ success: false, message: "Internal server error", })
        }
    }
    async AdminUpdateUser(req, res) {
        try {
            let { _id, name, email, country_code, username, number, profile_pic, login_type, country, reddit_username, minner_Activity, is_number_verify, is_complete_kyc, block_user } = req.body
            // console.log("getUser",_id, block_user)
            // let array = [{ _id: _id }, { login_type: login_type }]
            let query = { _id: _id }
            // if (email) {
            //     array.push({
            //         email: email
            //     })
            // }
            let getUser = await UsersModel.findOne(query).lean()
            // console.log("getUser", getUser)
            if (getUser) {
                let updateData = {}
                if (name && name != "") {
                    updateData.name = name
                }
                if (username && username != "") {
                    updateData.username = username
                }
                if (number && number != "") {
                    updateData.number = number
                    // updateData.is_number_verify = "2"
                }
                if (country && country != "") {
                    updateData.country = country
                }
                if (profile_pic && profile_pic != "") {
                    updateData.profile_pic = profile_pic
                }
                if (minner_Activity && minner_Activity != "") {
                    updateData.minner_Activity = minner_Activity
                }

                if (reddit_username && reddit_username != "") {
                    updateData.reddit_username = reddit_username
                }
                if (is_number_verify && is_number_verify != "") {
                    updateData.is_number_verify = is_number_verify
                }
                if (is_complete_kyc && is_complete_kyc != "") {
                    updateData.is_complete_kyc = is_complete_kyc
                }
                if (country_code && country_code != "") {
                    updateData.country_code = country_code
                }
                if (block_user && block_user != "") {
                    updateData.block_user = block_user
                }


                let updateUser = await UsersModel.findOneAndUpdate(query, { $set: updateData }, { new: true })
                res.json({ code: 200, success: true, message: 'profile update successfully', data: updateUser })
            } else {
                res.json({ code: 404, success: false, message: 'Email is not register', })
            }
        } catch (error) {
            console.log("Error in catch", error)
            if (error.codeName == 'DuplicateKey') {
                res.json({ code: 400, success: false, message: `${Object.keys(error.keyValue)} is already exist`, })
            } else {
                res.json({ code: 500, success: false, message: "Somthing went wrong", })
            }
        }
    }
    async getTotal(transaction_type) {
        let getUser
        try {
            getUser = await TransactionModal.aggregate([
                {
                    $group: {
                        _id: '$transaction_type',
                        totalAmount: {
                            $sum: "$amount"
                        },
                    }
                }
            ])
            // console.log("getUsertotal amount",getUser )
        } catch (error) {
            console.log("error in catch 88", error)
        }
        return getUser
    }
    async getTransaction(req, res) {
        try {
            let options = {
                page: req.body.page || 1,
                limit: req.body.limit || 10,
                sort: { createdAt: -1 },
                lean: true,
                // select: 'name user_type minner_Activity createdAt',
            }
            let query = {}
            let total_amount

            if (req.body.type && req.body.type != "") {
                query.type = req.body.type
            }
            if (req.body.transaction_type && req.body.transaction_type != "") {
                query.transaction_type = req.body.transaction_type
                // console.log("req.body.transaction_typereq.body.transaction_type", req.body.transaction_type)
                total_amount = await this.getTotal()

            }
            if (req.body.toId && req.body.toId != "") {
                // { title: { $regex: searchData, $options: "i" }
                query.to_id = { $regex: req.body.toId, $options: "i" }
            }
            if (req.body.todayDate && req.body.todayDate != "") {
                query.createdAt = { "$gte": new Date(req.body.todayDate).toISOString() }// + "T00:00:00Z" 
                query.createdAt["$lte"] = new Date(req.body.todayDate).toISOString()// + "T12:00:00Z"
            }
            if (req.body.toDate && req.body.toDate != "") {
                query.createdAt = { "$lte": req.body.toDate + "T12:00:00Z" }
            }
            if (req.body.fromDate && req.body.fromDate != "") {
                query.createdAt["$gte"] = new Date(req.body.fromDate)// + "T00:00:00Z"
            }
            if (req.body.sort && req.body.sort != "") {
                options.sort = req.body.sort
            }
            let getUser = await TransactionModal.paginate(query, options)
            getUser.total_amount = total_amount
            res.json({ code: 200, success: true, message: "Get list successfully ", data: getUser })
        } catch (error) {
            console.log("Error in catch", error)
            res.status(500).json({ success: false, message: "Internal server error", })
        }
    }

    async getKycDoc(req, res) {
        try {
            let id = req.query.id
            let getUser = await DocumentsModel.findOne({ owner: id })
            if (getUser) {
                res.json({ code: 200, success: true, message: "Get data successfully", data: getUser })
            } else {
                res.json({ code: 404, success: false, message: "Not found", data: getUser })
            }
            // console.log("getUsertotal amount",getUser )
        } catch (error) {
            console.log("error in catch 88", error)
            res.json({ code: 404, success: false, message: "Not found" })
        }
    }
    async getTotalCount(req, res) {
        try {
            let query1 = { "$match": { $and: [{ block_user: '0' }] } }
            let getUser = await UsersModel.aggregate([{
                $group: {
                    _id: {
                        minner_Activity: "$minner_Activity",
                        block_user: "$block_user"
                    },
                    COUNT: {
                        $sum: 1
                    }
                }
            },])
            res.json({ code: 200, success: true, message: "Get data successfully", data: getUser })
            // console.log("getUsertotal amount",getUser )
        } catch (error) {
            console.log("error in catch 88", error)
            res.json({ code: 404, success: false, message: "Not found" })
        }
    }
}



module.exports = new adminAuth();