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
        default: ()=> {return chance.string({ length: 128, casing: 'upper', alpha: true, numeric: true })}
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


const Dataset = mongoose.model('Dataset', datasetSchema);

module.exports = Dataset;
