const mongoose = require('mongoose');
const Device = require('./device');
var chance = require('chance').Chance();


const data_subschema = new mongoose.Schema({
    _id: false,
    data: Number,
    timestamp: {
        type: Date,
    }
})

const datasetSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    api_key: {
        type: String,
        length: 128,
        unique: true,
    },
    dataset: {
        type: [data_subschema]
    },
    device: {
        type: Device.schema,
        required: true
    }
});


data_subschema.pre('validate', function(next){
    this.timestamp = Date.now();
    next();
})


datasetSchema.pre('validate', function(next){
    this.api_key = chance.string({ length: 128, casing: 'upper', alpha: true, numeric: true });
    next();
})

const Dataset = mongoose.model('Dataset', datasetSchema);

module.exports = Dataset;