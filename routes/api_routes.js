var express = require('express');
var router = express.Router();

var chance = require('chance').Chance();
var Device = require('../models/device');
var Dataset = require('../models/dataset');

router.get('/devices/', async function(req, res){
    let devices = await Device.find({});

    if (!devices){
        console.log("not Found");
        console.log(devices);
        res.stat(404).send("Error couldnt find device.");
        return;
    }
    
    res.status(200).json(devices);
    console.log("Found");
})

router.post('/device/', async function(req, res) {
    let name = req.body["name"]
    Device.create({name: name}).then((succ) => {
        res.status(201).json(succ);
        return;
    }).then((err) => {
        res.status(400).json(err);
        return;
    });
})

router.get('/device/:device_id', async function(req, res){
    let device = await Device.findOne({device_id: req.params['device_id']});
    if (!device) {
        res.status(404).send("Error couldnt find device.");
        return;
    } else {
        res.status(200).json(device);
        return;
    }
})

router.get('/datasets/', async function(req, res){
    let datasets = await Dataset.find({});

    if (!datasets){
        res.status(404).send("Couldn't get resources.");
        return ;
    }

    return res.json(datasets);
})

router.post('/dataset/', async function(req, res) {
    let name = req.body["name"];
    let device_id = req.body['device_id'];
    
    let device = await Device.findOne({device_id: device_id});
    if (!device){
        res.status(404).send("Couldn't find device.")
    }
    console.log("device is : ");
    console.log(device);
    Dataset.create({name: name, device: device}).then((succ) => {
        res.status(201).json(succ);
        return;
    }).then((err) => {
        res.status(400).json(err);
        return;
    });
})

router.get("/dataset/:id", async function(req, res){
    let id = req.params['id'];
    let dataset = await Dataset.findById(id);
    if (!dataset) {
        res.status(404).send("Error couldnt find dataset.");
        return;
    }
    res.status(200).json(dataset);
})

router.post('/dataset/:id', async function(req, res){
    let data = req.body["data"];
    let id = req.params['id'];
    if (!data){
        console.log('No api key');
        res.status(404).send("Couldnt find dataset");
        return;
    }

    let dataset = await Dataset.findById(id);
    if (!dataset){
        res.status(404).send("Couldnt find dataset");
        console.log('No Couldnt key');
        return;
    }
    dataset.data.push(
        {data: parseInt(data) }
        );
    let saved_dataset = await dataset.save();
    if (saved_dataset){
        res.status(200).send("Added data to the dataset.");
        return;
    } else {
        res.status(401).send("Failed to add data.");
    }
})

router.post("/dataset/:id/:n_doucments", function(req,res) {
    let n_doucments = req.params['n_doucments'];
    let id = req.params['id']

    let dataset = Dataset.findById(id);

    if (!dataset) {
        res.status(404).send("Couldn't find resource.");
    }

    for (let i = 0; i < n_doucments; i++){
        let random_number = chance.integer({min: 10, max: 35});
        dataset.data.push(random_number);
    }

    dataset.save().then(()=>{
        res.status(200).send("Created resource.");
    }).then((err) => {
        res.status(400).send("Couldnt created resource.");
    })
})

module.exports = router;