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
const upload = multer({ storage: storage }).single('imageupld');

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
    try {
        let id = req.body.userid;
        let pass = req.body.password;
        console.log(pass);

        let user = await UserModel.findOne({ userID: id });
        console.log(user);
        if (user && pass === user.password) {
            console.log("Login Success");
            res.redirect("/admin/hatchback");
        } else {
            res.redirect("login_error");
        }
    } catch (err) {
        console.error('Error during admin login:', err);
        res.redirect("login_error");
    }
});

// GET - Home Page
router.get('/home', function (req, res) {
    res.sendFile(__dirname + "/admin_home.html");
});

// GET Admin logout
router.get('/logout', function (req, res) {
    res.redirect('/admin');
});

// GET Service Page
router.get('/service', async function (req, res) {
    try {
        let servicecars = await ServiceModel.find();
        console.log(servicecars);
        res.render("admin/service.hbs", { servicecars: servicecars, layout: false });
    } catch (err) {
        console.error('Error getting services:', err);
        res.status(500).send('Error getting services.');
    }
});

// GET send email
router.get('/service/email/:mailid', async function (req, res) {
    try {
        var client_email = req.params.mailid;
        var mail_status = await sendEmail(client_email);
        console.log("Email Status - " + mail_status);
        res.redirect('/admin/service');
    } catch (err) {
        console.error('Error sending email:', err);
        res.redirect('/admin/service');
    }
});

//GET Admin Index
router.get('/admin_index', async function (req, res) {
    try {
        res.render("admin/admin_index", { layout: false });
    } catch (err) {
        console.error('Error rendering admin index:', err);
        res.status(500).send('Error rendering admin index.');
    }
});

// GET Hatchback Cars
router.get('/hatchback', async function (req, res) {
    try {
        let hatchback_models = await HatchbackModel.find();
        res.render("admin/hatchback_list", { list: hatchback_models, layout: 'layout_list' });
    } catch (err) {
        console.error('Error getting hatchbacks:', err);
        res.status(500).send('Error getting hatchbacks.');
    }
});

// Add Hatchback Car Form
router.get('/addhatchback', (req, res) => {
    res.render("admin/hatchback_form", { layout: false });
});

// Add Hatchback Car
router.post('/addhatchback', upload, async function (req, res) {
    try {
        let hatchback = new HatchbackModel({
            title: req.body.title,
            brand: req.body.brand,
            year: req.body.year,
            price: req.body.price,
            fuelType: req.body.fuelType,
            description: req.body.description,
            imagePath: req.file ? 'images/' + req.file.originalname : ''
        });
        await hatchback.save();
        res.redirect('/admin/hatchback');
    } catch (err) {
        console.error('Error adding hatchback:', err);
        res.status(500).send('Failed to add hatchback.');
    }
});

// Delete Hatchback
router.get('/deletehatchback/:id', async function (req, res) {
    try {
        await HatchbackModel.findByIdAndRemove(req.params.id);
        res.redirect('/admin/hatchback');
    } catch (err) {
        console.error('Error deleting hatchback:', err);
        res.status(500).send('Failed to delete hatchback.');
    }
});

// GET SUV Cars
router.get('/suv', async function (req, res) {
    try {
        let suv_models = await SUVModel.find();
        res.render("admin/suv_list", { list: suv_models, layout: 'layout_list' });
    } catch (err) {
        console.error('Error getting SUVs:', err);
        res.status(500).send('Error getting SUVs.');
    }
});

router.get('/addsuv', (req, res) => {
    res.render("admin/suv_form", { layout: false });
});

// Add SUV Car
router.post('/addsuv', upload, async function (req, res) {
    try {
        let suv = new SUVModel({
            title: req.body.title,
            brand: req.body.brand,
            year: req.body.year,
            price: req.body.price,
            fuelType: req.body.fuelType,
            description: req.body.description,
            imagePath: req.file ? 'images/' + req.file.originalname : ''
        });
        await suv.save();
        res.redirect('/admin/suv');
    } catch (err) {
        console.error('Error adding SUV:', err);
        res.status(500).send('Failed to add SUV.');
    }
});

// Delete SUV
router.get('/deletesuv/:id', async function (req, res) {
    try {
        await SUVModel.findByIdAndRemove(req.params.id);
        res.redirect('/admin/suv');
    } catch (err) {
        console.error('Error deleting SUV:', err);
        res.status(500).send('Failed to delete SUV.');
    }
});

// GET Saloon Cars
router.get('/saloon', async function (req, res) {
    try {
        let saloon_models = await SaloonModel.find();
        res.render("admin/saloon_list", { list: saloon_models, layout: 'layout_list' });
    } catch (err) {
        console.error('Error getting saloons:', err);
        res.status(500).send('Error getting saloons.');
    }
});

router.get('/addsaloon', (req, res) => {
    res.render("admin/saloon_form", { layout: false });
});

// Add Saloon Car
router.post('/addsaloon', upload, async function (req, res) {
    try {
        let saloon = new SaloonModel({
            title: req.body.title,
            brand: req.body.brand,
            year: req.body.year,
            price: req.body.price,
            fuelType: req.body.fuelType,
            description: req.body.description,
            imagePath: req.file ? 'images/' + req.file.originalname : ''
        });
        await saloon.save();
        res.redirect('/admin/saloon');
    } catch (err) {
        console.error('Error adding saloon:', err);
        res.status(500).send('Failed to add saloon.');
    }
});

// Delete Saloon
router.get('/deletesaloon/:id', async function (req, res) {
    try {
        await SaloonModel.findByIdAndRemove(req.params.id);
        res.redirect('/admin/saloon');
    } catch (err) {
        console.error('Error deleting saloon:', err);
        res.status(500).send('Failed to delete saloon.');
    }
});

// GET Customers
router.get('/customers', async function (req, res) {
    try {
        let customers = await CustomerModel.find();
        res.render("admin/customers_list", { list: customers, layout: false });
    } catch (err) {
        console.error('Error getting customers:', err);
        res.status(500).send('Error getting customers.');
    }
});

// Delete User
router.get('/deletecustomer/:id', async function (req, res) {
    try {
        await CustomerModel.findByIdAndRemove(req.params.id);
        res.redirect('/admin/customers');
    } catch (err) {
        console.error('Error deleting customer:', err);
        res.status(500).send('Failed to delete customer.');
    }
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
            const img = { err: err };
            console.log(img);
            res.render('admin/images_upload', { img: img, layout: false });
        } else {
            if (req.file === undefined) {
                const img = { err: "No File Uploaded" }
                res.render('admin/images_upload', { img: img, layout: false });
            } else {
                console.log(req.file);
                res.redirect("/admin");
            }
        }
    });
});

module.exports = router;
