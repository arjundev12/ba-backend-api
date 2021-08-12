

const commenFunction = require('../../middlewares/common')
const UsersAdminModel = require('../../models/admin/users');
const UsersModel = require('../../models/users')
const moment = require("moment");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const TransactionModal = require('../../models/transactions')
const DocumentsModel = require('../../models/userDocument')
const CustomerModel = require('../../models/admin/customers')
const ProducrServiceModel = require('../../models/admin/product_service')
const InvoiceModel = require('../../models/admin/invoice');
const OrderModel = require('../../models/admin/orders');
const FoldersModel = require('../../models/admin/folders')
var AWS = require('aws-sdk');
const S3 = new AWS.S3({
    bucketName: `${process.env.BUCKET_NAME}`,
    // dirName: 'hawilti-images', /* optional */
    // region: 'eu-west-1',
    accessKeyId:  `${process.env.ACCESS_KEY_ID}`,
    secretAccessKey: `${process.env.SRCRET_ACCESS_KEY}`,
})
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
            updateUser: this.updateUser.bind(this),
            getInvoiceNumber: this.getInvoiceNumber.bind(this),
            createProductService: this.createProductService.bind(this),
            getProductService: this.getProductService.bind(this),
            createInvoice: this.createInvoice.bind(this),
            checkInvoiceNumber: this.checkInvoiceNumber.bind(this),
            getInvoiceList: this.getInvoiceList.bind(this),
            getOrderNumber: this.getOrderNumber.bind(this),
            createOrder: this.createOrder.bind(this),
            getOrderbyCustomerId: this.getOrderbyCustomerId.bind(this),
            ////////////////////////////////////aws/////////////////////////
            uploadImageAWS: this.uploadImageAWS.bind(this),
            getS3Bucket: this.getS3Bucket.bind(this),
            createFolderOnBucket: this.createFolderOnBucket.bind(this),
            deletes3Object: this.deletes3Object.bind(this),
            ///////////////////////////////////end//////////////////////////////
            createFolderAndFile: this.createFolderAndFile.bind(this),
            getFolderslist: this.getFolderslist.bind(this),
            getDataFolderById: this.getDataFolderById.bind(this),
            getDatafileById: this.getDatafileById.bind(this),
            getfilelist: this.getfilelist.bind(this)
        }
    }

    async loginAdmin(req, res) {
        try {
            let { email, password } = req.body
            let getUser = await UsersAdminModel.findOne({ $and: [{ email: email }, { login_type: 'manual' }, { user_type: 'subadmin' }] },
            ).lean()
            // console.log("getUser", getUser)
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
            let { name, organization, password, email, location, state } = req.body
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
                    state: state,
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
                let update = await CustomerModel.findOneAndUpdate({ _id: _id }, getuser)
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
            // console.log("req.query._id,", req.query._id)
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
            // console.log("req.query._id,", req.params._id)
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

    async getInvoiceNumber(req, res) {
        try {
            let flage = false
            let  fourDigitsRandom = 1000
            do {
               
                console.log("fourDigitsRandom",req.query._id, fourDigitsRandom)
                let getData = await InvoiceModel.find({customer_id: req.query._id, invoice_number: fourDigitsRandom })
                if (getData.length > 0) {
                    flage = true
                    fourDigitsRandom++
                } else {
                    flage = false
                }
            }
            while (flage);
            console.log("fourDigitsRandom", fourDigitsRandom)
            res.json({ code: 200, success: true, message: "get Successfull", data: fourDigitsRandom })
            // return  fourDigitsRandom
        } catch (error) {
            res.json({ code: 400, success: false, message: "Internal server error", })
        }
    }
    async checkInvoiceNumber(req, res) {
        try {
            // console.log("req.body.invoice_number",req.body.invoice_number)
            let getData = await InvoiceModel.findOne({ invoice_number: req.body.invoice_number })
            if (getData) {
                res.json({ code: 400, success: true, message: "this number is already exist", })
            } else {
                res.json({ code: 200, success: true, message: "this number is availble" })
            }
        } catch (error) {
            res.json({ code: 400, success: false, message: "Internal server error", })
        }
    }
    async createProductService(req, res) {
        try {
            const { name, hsn_sac, discription, price, tax, created_by, tax_type } = req.body
            // add-product-service
            let getdata = await ProducrServiceModel.findOne({ name: name, created_by: created_by })
            if (getdata) {
                res.json({ code: 200, success: true, message: 'name is already exist', data: getdata })
            } else {
                let savedata = new ProducrServiceModel({
                    name: name,
                    hsn_sac: hsn_sac,
                    discription: discription,
                    price: price,
                    tax: tax,
                    tax_type: tax_type,
                    created_by: created_by,
                })
                let data = await savedata.save();
                res.json({ code: 200, success: true, message: 'Create customer successfully', data: data })
            }
        } catch (error) {
            console.log("Error in catch", error)
            res.status(500).json({ success: false, message: "Somthing went wrong", })
        }
    }
    async getProductService(req, res) {
        try {
            // console.log("req.query._id,", req.query._id)
            let getData = await ProducrServiceModel.find({ created_by: req.query._id })
            res.json({ code: 200, success: true, message: "Get list successfully ", data: getData })
        } catch (error) {
            console.log("Error in catch", error)
            res.status(500).json({ success: false, message: "Internal server error", })
        }
    }

    async createInvoice(req, res) {
        try {
            const { created_by, customer_id, invoice_number, invoice_type, invoice_date, due_date, total, subtotal, balance_due, invoice_message, statement_message,
                attachments, products_meta, recurring_interval } = req.body
            // add-product-service
            let getdata = await InvoiceModel.findOne({ invoice_number: invoice_number, created_by: created_by })
            if (getdata) {
                res.json({ code: 200, success: true, message: 'invoice_number is already exist', data: getdata })
            } else {
                let savedata = new InvoiceModel({
                    created_by: created_by,
                    customer_id: customer_id,
                    invoice_number: invoice_number,
                    invoice_type: invoice_type,
                    invoice_date: invoice_date,
                    created_by: created_by,
                    due_date: due_date,
                    total: total,
                    subtotal: subtotal,
                    balance_due: balance_due,
                    invoice_message: invoice_message,
                    statement_message: statement_message,
                    attachments: attachments,
                    products_meta: products_meta,
                    recurring_interval: recurring_interval,
                    type1: recurring_interval.interval_time == "" ? 'invoice' : ""

                })
                let data = await savedata.save();
                res.json({ code: 200, success: true, message: 'Create invoice successfully', data: data })
            }
        } catch (error) {
            console.log("Error in catch", error)
            res.status(500).json({ success: false, message: "Somthing went wrong", })
        }
    }
    async getInvoiceList(req, res) {
        try {
            let options = {
                page: Number(req.body.page) || 1,
                limit: Number(req.body.limit) || 10,
                // sort: {  "subcategory_meta.name":1,"name": 1, },
                lean: true,
            }
            let query = { type1: "invoice" }
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
                query.customer_id = req.body._id
            }
            console.log("request", query)
            let data = await InvoiceModel.paginate(query, options)
            res.json({ code: 200, success: true, message: "Get list successfully ", data: data })
        } catch (error) {
            console.log("Error in catch", error)
            res.status(500).json({ success: false, message: "Internal server error", })
        }
    }

    async getOrderNumber(req, res) {
        try {
            let flage = false
            let fourDigitsRandom
            do {
                fourDigitsRandom = await Math.floor(10000 + Math.random() * 90000);
                let getData = await OrderModel.find({ invoice_number: fourDigitsRandom })
                if (getData.length > 0) {
                    flage = true
                } else {
                    flage = false
                }
            }
            while (flage);
            res.json({ code: 200, success: true, message: "get Successfull", data: fourDigitsRandom })
            // return  fourDigitsRandom
        } catch (error) {
            res.json({ code: 400, success: false, message: "Internal server error", })
        }
    }
    async createOrder(req, res) {
        try {
            const {customer_id, created_by, order_no, client_po_no, discription, t_order_value, order_startdate, order_enddate, payment_term } = req.body
            // add-product-service
            let getdata = await OrderModel.findOne({ order_no: order_no, created_by: created_by })
            if (getdata) {
                res.json({ code: 200, success: true, message: 'order_no is already exist', data: getdata })
            } else {
                let savedata = new OrderModel({
                    created_by: created_by,
                    
                    customer: customer_id,
                    order_no: order_no,
                    client_po_no: client_po_no,
                    discription: discription,
                    t_order_value: t_order_value,
                    order_startdate: order_startdate,
                    order_enddate: order_enddate,
                    payment_term: payment_term,
                    status: 'active'

                })
                let data = await savedata.save();
                res.json({ code: 200, success: true, message: 'Create order successfully', data: data })
            }
        } catch (error) {
            console.log("Error in catch", error)
            res.status(500).json({ success: false, message: "Somthing went wrong", })
        }
    }

    async getOrderbyCustomerId(req, res) {
        try {
            const {_id } = req.query
            // add-product-service
            // console.log("customer_id",_id)
            let getdata = await OrderModel.find({customer: _id })
            if (getdata) {
                res.json({ code: 200, success: true, message: 'Get order list successfully', data: getdata })
            } else {
                res.json({ code: 404, success: false, message: 'Order list not found', data: getdata })
            }
        } catch (error) {
            console.log("Error in catch", error)
            res.status(500).json({ success: false, message: "Somthing went wrong", })
        }
    }

    async createFolderAndFile(req, res) {
        try {
            const { created_by, customer_id, name, file_path, parent_folder_id, child_folder_id, is_file } = req.body
            // add-product-service
            console.log("type of is file", customer_id, name, is_file, typeof is_file)
            // let getdata = await FoldersModel.findOne({ name: name, customer: customer_id, is_file :is_file })
            // console.log("getdata",getdata)
            // if (getdata) {
            //     res.json({ code: 200, success: true, message: 'this is already exist', data: getdata })
            // } else {

            let newData = {}

            if (is_file) {
                newData.is_file = is_file
                newData.file_path = file_path
            }
            if (is_file == false) {
                newData.is_file = is_file
            }
            if (name) {
                
                newData.name = name
            }
            if (parent_folder_id) {
                newData.parent = parent_folder_id
            }
            if (child_folder_id) {
                newData.children = child_folder_id
            }
            if (customer_id) {
                newData.customer = customer_id
            }
            if (created_by) {
                newData.created_by = created_by
            }
            newData.status = 'active'
            console.log("newDatanewData", newData)
            let getdata = await FoldersModel.findOne(newData).lean()
            // console.log("getdata",getdata)
            if (getdata) {
                res.json({ code: 200, success: true, message: 'this is already exist', data: getdata })
            } else {
                let savedata = new FoldersModel(newData)
                let data = await savedata.save();
                res.json({ code: 200, success: true, message: 'Create order successfully', data: data })
            }

            // }
        } catch (error) {
            console.log("Error in catch", error)
            res.status(500).json({ success: false, message: "Somthing went wrong", })
        }
    }
    async getFolderslist(req, res) {
        try {
            const { customer_id } = req.query
            console.log("type of is file", customer_id)
            let getData = await FoldersModel.find({ customer: customer_id , is_file:false }).lean()
            if (getData.length == 0) {
                res.json({ code: 404, success: false, message: 'Data not found', data: getData })
            } else {
                res.json({ code: 200, success: true, message: 'get list', data: getData })
            }
            // }
        } catch (error) {
            console.log("Error in catch", error)
            res.status(500).json({ success: false, message: "Somthing went wrong", })
        }
    }
    async getfilelist(req, res) {
        try {
            const { customer_id } = req.query
            console.log("type of is file", customer_id)
            let getData = await FoldersModel.find({ customer: customer_id, is_file:true}).lean()
            if (getData.length == 0) {
                res.json({ code: 404, success: false, message: 'Data not found', data: getData })
            } else {
                res.json({ code: 200, success: true, message: 'get list', data: getData })
            }
            // }
        } catch (error) {
            console.log("Error in catch", error)
            res.status(500).json({ success: false, message: "Somthing went wrong", })
        }
    }
    async getDataFolderById(req, res) {
        try {
            const { customer_id, folder_id } = req.query
            console.log("type of is file", customer_id)
            let getData = await FoldersModel.find({  customer: customer_id,parent: folder_id , is_file: false}).lean()
            if (getData.length == 0) {
                res.json({ code: 404, success: false, message: 'Data not found', data: getData })
            } else {
                res.json({ code: 200, success: true, message: 'get list', data: getData })
            }
            // }
        } catch (error) {
            console.log("Error in catch", error)
            res.status(500).json({ success: false, message: "Somthing went wrong", })
        }
    }
    async getDatafileById(req, res) {
        try {
            const { customer_id, folder_id } = req.query
            console.log("type of is file", customer_id)
            let getData = await FoldersModel.find({  customer: customer_id,parent: folder_id , is_file: true}).lean()
            if (getData.length == 0) {
                res.json({ code: 404, success: false, message: 'Data not found', data: getData })
            } else {
                res.json({ code: 200, success: true, message: 'get list', data: getData })
            }
            // }
        } catch (error) {
            console.log("Error in catch", error)
            res.status(500).json({ success: false, message: "Somthing went wrong", })
        }
    }
    /////////////////////////////////////////////////////////////////////////////start///aws s3 apis/////////////////////////////
    async uploadImageAWS(req, res) {
        try {

            if (req.file) {
                res.json({ code: 200, success: true, message: "data listed sucessfully", result: req.file.location })
            } else {
                res.json({ code: 500, success: false, message: "data not listed ", result: '' });
            }
        } catch (error) {
            res.json({ code: 500, success: false, message: "Data somethig went wrong", e })
        }

    }
    async getS3Bucket(req, res) {
        try {
            S3.listBuckets(function (err, data) {
                if (err) {
                    console.log("Error", err);
                } else {
                    res.json({ code: 200, success: true, message: "data listed sucessfully", result: data.Buckets })
                }
            });
        } catch (error) {
            console.log("Successget buckets", error);
            res.json({ code: 500, success: false, message: "Data somethig went wrong111", error })
        }

    }
    async createFolderOnBucket(req, res) {
        try {
            var params = { Bucket: `${process.env.BUCKET_NAME}`, Key: 'user1/', ACL: 'public-read', Body: 'body does not matter' };

            S3.upload(params, function (err, data) {
                if (err) {
                    console.log("Error creating the folder: ", err);
                } else {
                    res.json({ code: 200, success: true, message: "Successfully created a folder on S3", data })
                }
            });

        } catch (error) {
            console.log("Successget buckets", error);
            res.json({ code: 500, success: false, message: "Data somethig went wrong111", error })
        }

    }
    async getS3Folders(req, res) {
        try {
            var params = {
                Bucket: `${process.env.BUCKET_NAME}`, /* required */
                // Prefix: 'logo.png-1627463517104.png'  // Can be your folder name
            };
            S3.listObjectsV2(params, function (err, data) {
                if (err) console.log(err, err.stack); // an error occurred
                else {
                    // console.log("successful response",data); 
                    res.json({ code: 200, success: true, message: "data listed sucessfully", result: data })
                }              // successful response
            });

        } catch (error) {
            res.json({ code: 500, success: false, message: "Data somethig went wrong", error })
        }
    }
    async deletes3Object(req, res) {
        try {
            S3.deleteObject({
                Bucket: `${process.env.BUCKET_NAME}`,
                Key: 'logo.png-1627466629900.png'
            }, function (err, data) {
                res.json({ code: 200, success: true, message: "data listed sucessfully", result: data })

            })

        } catch (error) {
            res.json({ code: 500, success: false, message: "Data somethig went wrong", error })
        }
    }
    /////////////////////////////////////////////////////aws s3 apis end/////////////////////////////
    ////////////////////////////////////////////////////////////end ba apis admin..///////////////
  
}



module.exports = new adminAuth();