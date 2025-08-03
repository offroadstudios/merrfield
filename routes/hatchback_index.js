var express = require('express');
const mongoose = require('mongoose');
var router = express.Router();
var HatchbackModel = require("../models/HatchbackModel");

router.use(express.static("public"));


// GET Hatchback Cars
router.get('/', async function (req, res) {

    let hatchback_models = await HatchbackModel.find();
    res.render("hatchback_index.hbs", { models: hatchback_models });
});


// GET Filtering Hatchback Cars
router.get('/filter', async function (req, res) {


    // Sorting
    let filtered_models;

    const sortBy = req.query.sortBy;
    console.log(sortBy);

    if (sortBy == 'latest') {
        filtered_models = await HatchbackModel.find().sort({ year: -1 });
    }
    else if (sortBy == 'highprice') {
        filtered_models = await HatchbackModel.find().sort({ price: -1 });
    }
    else if (sortBy == 'lowprice') {
        filtered_models = await HatchbackModel.find().sort({ price: 1 });
    }
    else if (sortBy == 'highrange') {
        filtered_models = await HatchbackModel.find().sort({ range: -1 });
    }
    else if (sortBy == 'lowrange') {
        filtered_models = await HatchbackModel.find().sort({ range: 1 });
    }
    else if (sortBy == 'highperf') {
        filtered_models = await HatchbackModel.find().sort({ time60: 1 });
    }
    else if (sortBy == 'lowperf') {
        filtered_models = await HatchbackModel.find().sort({ time60: -1 });
    }


    // Price Filtering
    const priceBy = req.query.priceBy;
    console.log(priceBy);
    if (priceBy != undefined) {
        const priceLt = priceBy.slice(5) + '000';
        console.log(priceLt);
        filtered_models = await HatchbackModel.find({ price: { $lte: priceLt } }).sort({ price: -1 });
    }


    // Year Filtering
    var year = req.query.year;
    if (year != undefined) {
        year = year.slice(4);
        console.log(year);
        filtered_models = await HatchbackModel.find({ year: year });
    }

    var yearLt = req.query.yearLt;
    if (yearLt != undefined) {
        yearLt = yearLt.slice(4);
        console.log(yearLt);
        filtered_models = await HatchbackModel.find({ year: { $lte: yearLt } });
    }

    var rangeLt = req.query.rangeLt;
    if (rangeLt != undefined) {
        console.log(rangeLt);
        filtered_models = await HatchbackModel.find({ range: { $lte: rangeLt } }).sort({ range: -1 });
    }


    //console.log(filtered_models);
    res.render("hatchback_index.hbs", { models: filtered_models });

});





// GET Booked Model
router.get('/booknow/:id', async function (req, res) {

    let modelid = req.params.id;
    console.log(modelid);

    let booked_model = await HatchbackModel.findById(modelid);
    //console.log(booked_model);
    res.render("hatchbackbooking.hbs", { model: booked_model });

});

router.get('/filter/booknow/:id', async (req, res) => {
    let modelid = req.params.id;
    res.redirect('/hatchback/booknow/' + modelid);
});



module.exports = router;
