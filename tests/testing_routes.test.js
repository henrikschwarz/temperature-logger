const app = require('../app.js');
const mongoose = require('mongoose');
const supertest = require('supertest');
const config = require('../config')[process.env.NODE_ENV]
const Device = require('../models/device');
const Dataset = require('../models/dataset');

beforeEach((done) => {
    mongoose.connect(config.DBConnect, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }, () => done());
});

afterEach((done) => {
    mongoose.connection.db.dropDatabase(() => {
        mongoose.connection.close(() => done());
    });
});

describe("Testing index view", () =>{
    it("Testing the index view", async ()=> {
        await supertest(app).post("/login").send({username: process.env.ADMIN_USERNAME, password: process.env.ADMIN_PASSWORD}); // log in so we can access the page.
        const res = await supertest(app).get("/");
        expect(res.statusCode).toEqual(200);
        expect(res.text.includes("Hello world"));
    })
})

describe("Testing the device routes", ()=>{
    it("Add device", async () =>{
        let name = "device 1";
        let device_id = "123456";
        let unit = "Celcius";
        const res = await supertest(app).post('/device/add').send({
            name: name,
            device_id: device_id,
            unit: unit
        });
        expect(res.statusCode).toEqual(201);
    });

    it('Get added device', async () => {
        const added_device = await Device.create({name: "device 1", device_id: "1234", unit: "Celcius"});
        const res = await supertest(app).get("/device/"+added_device.device_id);
        expect(res.statusCode).toEqual(200);
        expect(res.text.includes(added_device.name));
        expect(res.text.includes(added_device.unit));
    })
})

describe("Testing the dataset collection", ()=> {
    const sample_device_info = { name: 'Device 1', device_id: "123456", unit: "C"};
    it("Testing making a empty dataset", async ()=> {
        const device = await Device.create(sample_device_info);
        const new_set = await Dataset.create( { name: "Test set", dataset: [], device: device } );
        expect(new_set.name).toEqual('Test set');
        expect(new_set.device.name).toEqual('Device 1');
    });
    it('Finding created dataset', async () => {
        const device = await Device.create(sample_device_info);
        const new_set = await Dataset.create( { name: "Test set", dataset: [], device: device } );
        let found_set = await Dataset.findOne({_id: new_set._id});
        expect(found_set._id).toEqual(new_set._id);
    })
    it('Adding data to our dataset', async () => {
        let sample_data = {data: 27.1};
        const device = await Device.create(sample_device_info);
        const new_set = await Dataset.create( { name: "Test set", dataset: [], device: device } );
        let found_set = await Dataset.findOne({_id: new_set._id});
        found_set.dataset.push(sample_data);
        await found_set.save();
        const new_dataset = await Dataset.findOne({_id: new_set._id});
        expect(new_dataset.dataset.length).toEqual(1);
        expect(new_dataset.dataset[0].data).toEqual(27.1);
        expect(new_dataset.dataset[0].timestamp !== undefined);
    })
    it("Test api key for adding data", async ()=>{
        let sample_data = {data: 27.1};
        const device = await Device.create(sample_device_info);
        const new_set = await Dataset.create( { name: "Test set", dataset: [], device: device } );
        // console.log(new_set);
        const res = await supertest(app).post(`/dataset/${new_set.api_key}/add`).send(sample_data);
        expect(res.statusCode).toEqual(201);
        const test_new_set = await Dataset.findOne({api_key: new_set.api_key});
        // console.log(test_new_set);
    })
})