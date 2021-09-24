var express = require('express');
var router = express.Router();
var authMiddleware = require('../middleware/isAuthenticated');

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
    req.session.loggedIn = true;
    res.redirect('/');
  } else {
    res.redirect('back', 401, {error: "Wrong credentials"});
  }
  console.log(req.sessionID);
})

router.get('/logout', function(req, res) {
  global.loggedIn = false;
  res.redirect("/");
})

router.post('/devices/add', authMiddleware, function(req, res){
  let name = req.body['name'];
  Device.create({
    name: name
  }, function(err, device){
    if (err){
      res.status(500).send(err);
      return;
    }
    res.status(201).send(`added device ${device.name}`);
  });
});

router.get('/devices/add', authMiddleware, function(req, res){
  res.render('device/device_add', {title: "Adding device"})
});

router.get('/devices', async function(req, res){
    const all_devices = await Device.find({});
    res.render('device/devices', {title: 'Devices', devices: all_devices});
});

router.get('/devices/:id', async function(req, res){
  const device = await Device.findById(req.params.id);
  const datasets = await Dataset.find({device: device});
  if (!device || !datasets){
    res.status(404).send("Doesnt exist");
    console.log("Doesnt exist");
    return false;
  }
  try {
    res.render('device/show_device', {title: "Device", device: device, datasets: datasets});
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
    res.render('dataset/add_dataset', {title: "Add device", device_list: device_list});
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
    res.status(401).send("Something went wrong");
  }
})

router.post('/dataset/:api_key/add', async function(req, res){
  const selected_dataset = await Dataset.findOne({api_key: req.params.api_key});
  if (!selected_dataset){
    res.status(404).send("Could't find dataset");
    console.log("Didnt find dataset");
    return false;
  }
  console.log('Content type is ' + req.get('content-type'));
  data = req.body['data'];
  console.log(`Data is ${data}`);
  selected_dataset.dataset.push({data: data});
  await selected_dataset.save();
  res.status(201).send('success');
});

router.get("/401", function(req, res){
  res.status(401).render('401');
})

router.get('/datasets/', async function(req, res){
  let datasets = await Dataset.find({});
  if (!datasets){
    return res.status(404).send("Couldn't find the datasets");
  }
  res.render('dataset/show_datasets', {datasets: datasets});
})

router.get('/datasets/:device_id', async function(req, res){
  let dataset = await Dataset.findById(req.params.
    device_id);
  if (!dataset){
    res.status(404).send("Couldn't find the dataset");
    return;
  }
  res.render("dataset/dataset", {dataset: dataset})
})

module.exports = router;
