const app = require('../app.js');
const mongoose = require('mongoose');
const supertest = require('supertest');
const config = require('../config')[process.env.NODE_ENV]

beforeEach((done) => {
    mongoose.connect(config.DBConnect, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }, () => done());
});

afterAll(done => {
    // Closing the DB connection allows Jest to exit successfully.
    mongoose.connection.close()
    done()
  })

describe("Testing index view", () => {
    it("Testing the index view", async ()=> {
        await supertest(app).post("/login").send({username: process.env.ADMIN_USERNAME, password: process.env.ADMIN_PASSWORD}); // log in so we can access the page.
        const res = await supertest(app).get("/");
        expect(res.statusCode).toEqual(200);
        expect(res.text.includes("Hello world"));
    })
})

describe('Testing the api for devices.', () => {
    it("Testing creating a device", async () => {
        let device_name = 'Device 1';
        let new_device = await create_device(device_name);

        read_device = JSON.parse(new_device.text) // Read the text from the response and convert it to json.
        expect(new_device.statusCode).toEqual(201);
        expect(read_device.name).toEqual(device_name);
    });
    
    it("Testing getting data for a device", async () => {
        let new_device_req = await create_device('Device 1'); // make the create request
        let new_device = JSON.parse(new_device_req.text); // convert the req response to json

        let found_device_req = await supertest(app).get(`/api/device/${new_device.device_id}`); // Make the get request for the device.
        let found_device = JSON.parse(found_device_req.text); // convert the response from the get request to json

        expect(found_device.name === new_device.name);
        expect(found_device.device_id === new_device.device_id);
        expect(found_device_req.statusCode).toEqual(200);
    })
})

describe("Testing the api for datasets", () => {
    it("Creating a dataset", async () => {
        let create_device_req = await create_device("Device 1");
        let device = JSON.parse(create_device_req.text); // get the device and convert it to json

        let create_dataset_req = await supertest(app).post("/api/dataset/").send({name: "Temperature", device_id: device.device_id}); // make the post call to create the device
        let dataset = JSON.parse(create_dataset_req.text); // convert the response to json

        expect(create_dataset_req.statusCode).toEqual(201);
        expect(dataset.name).toEqual("Temperature"); 
    })

    it ("Get dataset data", async () => {
        let create_device_req = await create_device("Device 1");
        let device = JSON.parse(create_device_req.text); // get the device and convert it to json

        let create_dataset_req = await supertest(app).post("/api/dataset/").send({name: "Temperature", device_id: device.device_id}); // make the post call to create the device
        let dataset = JSON.parse(create_dataset_req.text);
        let dataset_req = await supertest(app).get(`/api/dataset/${dataset._id}`);
        let loaded_dataset = JSON.parse(dataset_req.text);

        expect(dataset_req.statusCode).toEqual(200);
        expect(loaded_dataset.name).toEqual("Temperature");
        expect(loaded_dataset.device.name).toEqual("Device 1");
    })

    it("Add data to a dataset", async () => {
        let create_device_req = await create_device("Device 1");
        let device = JSON.parse(create_device_req.text); // get the device and convert it to json

        let create_dataset_req = await supertest(app).post("/api/dataset/").send({name: "Temperature", device_id: device.device_id}); // make the post call to create the device
        let dataset = JSON.parse(create_dataset_req.text);

        let add_data_req = await supertest(app).post(`/api/dataset/${dataset._id}`).send({data: 20});
        let updated_dataset = await supertest(app).get(`/api/dataset/${dataset._id}`);
        let parsed_updated_dataset = JSON.parse(updated_dataset.text);

        expect(parsed_updated_dataset.api_key).toEqual(dataset.api_key);
        expect(parsed_updated_dataset.data.length > 0);
        expect(updated_dataset.statusCode).toEqual(200);
    })
})




async function create_device(device_name){
    let device = await supertest(app).post("/api/device/").send({name: device_name});
    return device;
}