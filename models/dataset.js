var mongoose = require('mongoose');
var Device = require('./device');
var chance = require('chance').Chance();

let dataSchema = new mongoose.Schema({
    date: {
        type: Date,
        default: new Date()
    },
    data: {
        type: Number,
        required: true,
    }
}) 

let datasetSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    data: {
        type: [dataSchema]
    },
    api_key: {
        type: String,
    },
    device: {
        type: Device.schema,
        required: true
    }
})

datasetSchema.pre('save', function(next) {
    this.api_key = chance.string({ length: 128, casing: 'upper', alpha: true, numeric: true });
    next();
})

module.exports = mongoose.model('Dataset', datasetSchema);