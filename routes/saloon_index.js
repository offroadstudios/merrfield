var express = require('express');
const mongoose = require('mongoose');
var router = express.Router();
var SaloonModel = require("../models/SaloonModel");

router.use(express.static("public"));


// GET Saloon Cars
router.get('/', async function (req, res) {

    let saloon_models = await SaloonModel.find();
    res.render("saloon_index.hbs", { models: saloon_models });

});



// GET Filtering Saloon Cars
router.get('/filter', async function (req, res) {


    // Sorting
    let filtered_models;

    const sortBy = req.query.sortBy;
    console.log(sortBy);

    if (sortBy == 'latest') {
        filtered_models = await SaloonModel.find().sort({ year: -1 });
    }
    else if (sortBy == 'highprice') {
        filtered_models = await SaloonModel.find().sort({ price: -1 });
    }
    else if (sortBy == 'lowprice') {
        filtered_models = await SaloonModel.find().sort({ price: 1 });
    }
    else if (sortBy == 'highrange') {
        filtered_models = await SaloonModel.find().sort({ mileage: -1 });
    }
    else if (sortBy == 'lowrange') {
        filtered_models = await SaloonModel.find().sort({ mileage: 1 });
    }
    else if (sortBy == 'highperf') {
        filtered_models = await SaloonModel.find().sort({ time60: 1 });
    }
    else if (sortBy == 'lowperf') {
        filtered_models = await SaloonModel.find().sort({ time60: -1 });
    }


    // Price Filtering
    const priceBy = req.query.priceBy;
    console.log(priceBy);
    if (priceBy != undefined) {
        const priceLt = priceBy.slice(5) + '000';
        console.log(priceLt);
        filtered_models = await SaloonModel.find({ price: { $lte: priceLt } }).sort({ price: -1 });
    }


    // Year Filtering
    var year = req.query.year;
    if (year != undefined) {
        year = year.slice(4);
        console.log(year);
        filtered_models = await SaloonModel.find({ year: year });
    }

    var yearLt = req.query.yearLt;
    if (yearLt != undefined) {
        yearLt = yearLt.slice(4);
        console.log(yearLt);
        filtered_models = await SaloonModel.find({ year: { $lte: yearLt } }).sort({ year: -1 });
    }

    // Mileage Filtering
    var mileageLt = req.query.mileageLt;
    if (mileageLt != undefined) {
        console.log(mileageLt);
        filtered_models = await SaloonModel.find({ mileage: { $lte: mileageLt } }).sort({ mileage: -1 });
    }


    // More Filtering
    var trans = req.query.trans;
    if (trans != undefined) {
        console.log(trans);
        filtered_models = await SaloonModel.find({ transmission: trans });
    }

    var drive = req.query.drive;
    if (drive != undefined) {
        console.log(drive);
        filtered_models = await SaloonModel.find({ drivetrain: drive });
    }

    var cyl = req.query.cyl;
    if (cyl != undefined) {
        console.log(cyl);
        filtered_models = await SaloonModel.find({ cyl: cyl });
    }


    //console.log(filtered_models);
    res.render("saloon_index.hbs", { models: filtered_models });

});





// GET Booked Model
router.get('/booknow/:id', async function (req, res) {

    let modelid = req.params.id;
    console.log(modelid);

    let booked_model = await SaloonModel.findById(modelid);
    //console.log(booked_model);
    res.render("saloonbooking.hbs", { model: booked_model });

});

router.get('/filter/booknow/:id', async (req, res) => {
    let modelid = req.params.id;
    res.redirect('/saloon/booknow/' + modelid);
});


module.exports = router;