var express = require('express');
var router = express.Router();
var chance = require('chance').Chance();

var Device = require("../models/device");

var axios = require('axios').default;

const instance = axios.create({
    proxy: {
        host: '127.0.0.1',
        port: 3000,
      },    
})

router.get("/device/new", async function(req,res) {
    await instance.post('/api/device/', {
        name: "Device 1",
    })
    .then((response) => {
        res.send(response)
    })
    .then((err) => {
        res.send(err)
    }).then(() => {
        res.send("Something went wrong.")
    });
})

router.get("/dataset/new", async function(req, res, next){
    let device = await Device.find({});
    if (device.length == 0){
        res.send("Add a device first.");
        return;
    }
    console.log(device[0].device_id);
    await instance.post("/api/dataset/", {
        name: "Temperature",
        device_id: device[0].device_id,
    }).then((response) => {
        res.send(response);
    }).then((err) => {
        res.send(err);
    }).then(() => {
        res.send("Something went wrong");
    }).catch((err) => next(err));
})

module.exports = router;