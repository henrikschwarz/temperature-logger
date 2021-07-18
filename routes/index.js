var express = require('express');
var router = express.Router();
var authMiddleware = require('../middleware/authenticated');

var Device = require("../models/device");
var Dataset = require("../models/dataset");


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Index' });
});

router.get("/login", function(req, res){
  res.render("login", {title: "Login"})
})

router.post("/login", function(req, res){
  admin_username = process.env.ADMIN_USERNAME;
  admin_password = process.env.ADMIN_PASSWORD;

  if (req.body['username'] === admin_username && req.body['password'] === admin_password){
    global.loggedIn = true;
    res.redirect('/');
  } else {
    res.redirect('back', {error: "Wrong credentials"});
  }
})

router.get('/logout', function(req, res) {
  global.loggedIn = false;
  res.redirect("/");
})

router.post('/device/add', authMiddleware, function(req, res){
  let name = req.body['name'];
  let device_id = req.body['device_id'];
  let unit = req.body['unit'];
  Device.create({
    name: name,
    device_id: device_id,
    unit: unit
  }, function(err, device){
    if (err){
      console.log(err);
      res.status(500).send(err);
      return;
    }
    res.status(201).send(`added device ${device.name}`);
  })
})

router.get('/device/add', authMiddleware, function(req, res){
  res.render('device_add', {title: "Adding device"})
})

router.get('/devices', async function(req, res){
    const all_devices = await Device.find({});
    res.render('devices', {title: 'Devices', devices: all_devices});
})

router.get('/device/:id', async function(req, res){
  const device = await Device.findOne({device_id: req.params.id});
  if (!device){
    res.status(404).send("Doesnt exist");
    console.log("Doesnt exist");
    return false;
  }
  try {
    res.render('show_device', {title: "Device", device: device});
  } catch(error){ 
    res.status(404).send("Error");
    return; 
  } 
})

router.get('/dataset/add', async function(req, res){
    let device_list = await Device.find({});
    if ( !device_list){
      res.send(404).send("err")
    }
    res.render('add_dataset', {title: "Add device", device_list: device_list});
})

router.post('/dataset/add', async function(req, res){
  let dataset_name = req.body['name'];
  let device = req.body['device'];
  let selected_device = await Device.findById(device);
  if (!selected_device){
    res.status(401).send('Couldnt find device.');
    return false;
  }
  try{
    Dataset.create({name: dataset_name, device: selected_device}).then((success) => {
      console.log("Success added " + success);
      res.redirect('/');
      return false;
    }).then((err) => {
      res.send(401).send(err);
      return false;
    })
  } catch (e) {
    console.log(e);
    next();
  }
})

router.post('/dataset/:api_key/add', async function(req, res){
  const selected_dataset = await Dataset.findOne({api_key: req.params.api_key});
  if (!selected_dataset){
    res.status(404).send("not found");
    console.log("Didnt find dataset");
    return false;
  }
  data = req.body['data'];
  selected_dataset.dataset.push({data: data});
  await selected_dataset.save();
  res.status(201).send('success');
});

router.get("/401", function(req, res){
  res.status(401).render('401');
})

module.exports = router;
