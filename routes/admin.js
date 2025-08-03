const express = require('express');
const router = express.Router();
const multer = require('multer');
const HatchbackModel = require('../models/HatchbackModel');
const SUVModel = require('../models/SUVModel');
const SaloonModel = require('../models/SaloonModel');
const ServiceModel = require('../models/ServiceModel');
const CustomerModel = require('../models/CustomerModel');
const UserModel = require("../models/UserModel");
const sendEmail = require("../utils/mailer");

// Set Image Storage
const storage = multer.diskStorage({
    destination: './public/images/',
    filename: function (req, file, cb) {
        cb(null, file.originalname);


    }
});
// Init Upload
const upload = multer({
    storage: storage
}).single('imageupld');



router.use(express.static("public"));



// GET Root Route - Admin login
router.get('/', function (req, res) {
    res.sendFile(__dirname + "/login.html");
});

// GET Login Error
router.get('/login_error', function (req, res) {
    res.sendFile(__dirname + "/loginerror.html");
});

// POST Admin login
router.post("/login", async function (req, res) {

    let id = req.body.userid;
    let pass = req.body.password;
    console.log(pass);

    let user = await UserModel.findOne({ userID: "admin" });
    console.log(user);
    if (pass == user.password) {
        console.log("Login Success");
        res.redirect("home");
    } else {
        res.redirect("login_error");
    }

});




// GET - Home Page
router.get('/home', function (req, res) {
    res.sendFile(__dirname + "/admin_home.html");
});



// GET Service Page
router.get('/service', async function (req, res) {

    let servicecars = await ServiceModel.find();
    console.log(servicecars);
    res.render("admin/service.hbs", { servicecars: servicecars, layout: false });

});

// GET send email
router.get('/service/email/:mailid', async function (req, res) {

    var client_email = req.params.mailid;
    var mail_status = await sendEmail(client_email);
    console.log("Email Status - " + mail_status);
    res.redirect('/admin/service');
});



//GET Admin Index
router.get('/admin_index', async function (req, res) {
    res.render("admin/admin_index", { layout: false });
});










// GET Hatchback Cars
router.get('/hatchback', async function (req, res) {
    let hatchback_models = await HatchbackModel.find();
    res.render("admin/hatchback_list", { list: hatchback_models, layout: 'layout_list' });
});

// Add Hatchback Car Form
router.get('/addhatchback', (req, res) => {
    res.render("admin/hatchback_form", { layout: false });
});

router.post('/addhatchback', async function (req, res) {
    let hatchback = new HatchbackModel(req.body);
    result = await hatchback.save();
    res.redirect('/admin/hatchback');
});

router.get('/deletehatchback/:id', async function (req, res) {
    const result = await HatchbackModel.findByIdAndRemove(req.params.id);
    res.redirect('/admin/hatchback');
});

// GET SUV Cars
router.get('/suv', async function (req, res) {
    let suv_models = await SUVModel.find();
    res.render("admin/suv_list", { list: suv_models, layout: 'layout_list' });
});

router.get('/addsuv', (req, res) => {
    res.render("admin/suv_form", { layout: false });
});

router.post('/addsuv', async function (req, res) {
    let suv = new SUVModel(req.body);
    result = await suv.save();
    res.redirect('/admin/suv');
});

router.get('/deletesuv/:id', async function (req, res) {
    const result = await SUVModel.findByIdAndRemove(req.params.id);
    res.redirect('/admin/suv');
});

// GET Saloon Cars
router.get('/saloon', async function (req, res) {
    let saloon_models = await SaloonModel.find();
    res.render("admin/saloon_list", { list: saloon_models, layout: 'layout_list' });
});

router.get('/addsaloon', (req, res) => {
    res.render("admin/saloon_form", { layout: false });
});

router.post('/addsaloon', async function (req, res) {
    let saloon = new SaloonModel(req.body);
    result = await saloon.save();
    res.redirect('/admin/saloon');
});

router.get('/deletesaloon/:id', async function (req, res) {
    const result = await SaloonModel.findByIdAndRemove(req.params.id);
    res.redirect('/admin/saloon');
});

// GET Customers
router.get('/customers', async function (req, res) {

    let customers = await CustomerModel.find();
    res.render("admin/customers_list", { list: customers, layout: false });
});

// Delete User
router.get('/deletecustomer/:id', async function (req, res) {

    const result = await CustomerModel.findByIdAndRemove(req.params.id);
    console.log(result);

    res.redirect('/admin/customers');
});









// Image Handling

// Get Upload Image Form Page
router.get('/images', (req, res) => {
    res.render("admin/images_upload", { layout: false });
});


// POST Image File
router.post('/uploadimage', (req, res) => {
    upload(req, res, (err) => {

        if (err) {
            img = { err: err };
            console.log(img);
            res.render('admin/images_upload', { img: img, layout: false });
        }
        else {
            if (req.file == undefined) {
                img = { err: "No File Uploaded" }
                res.render('admin/images_upload', { img: img, layout: false });
            }
            else {
                console.log(req.file);
                res.redirect("/admin");
            }
        }

    });

});



module.exports = router;