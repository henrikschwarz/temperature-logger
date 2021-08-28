var express = require("express");
var router = express.Router();

var Device = require("../models/device");

router.get("/database/new", async function(req, res){
    var devices = await Device.find({}).then((response) => {
        
    }).then((err) => {
        res.status(404).send("Couldnt query");
    });
    res.render("create_database", {title: "Create a new dataase", devices: devices});
})