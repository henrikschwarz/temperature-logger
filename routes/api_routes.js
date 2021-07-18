var express = require('express');
var router = express.Router();


var Device = require('../models/device');
var Dataset = require('../models/dataset');

router.post('/device/new', async function(req, res) {
    let name = req.body["name"]
    Device.create({name: name}).then((succ) => {
        res.status(201).json(succ);
        return;
    }).then((err) => {
        res.status(400).json(err);
        return;
    });
})

router.get('/device/get/:device_id', async function(req, res){
    let device = await Device.findOne({device_id: req.params['device_id']});
    if (!device) {
        res.status(404).send("Error couldnt find device.");
        return;
    } else {
        res.status(200).json(device);
        return;
    }
})

router.post('/dataset/new', async function(req, res) {
    let name = req.body["name"];
    let device_id = req.body['device_id'];
    
    let device = await Device.findOne({device_id: device_id});
    Dataset.create({name: name, device: device}).then((succ) => {
        res.status(201).json(succ);
        return;
    }).then((err) => {
        res.status(400).json(err);
        return;
    });
})

module.exports = router;