var mongoose = require('mongoose');
var Device = require('./device');
var chance = require('chance').Chance();

let dataSchema = new mongoose.Schema({
    _id: false,
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
        default: function(){
            return chance.string({ length: 128, casing: 'upper', alpha: true, numeric: true });
        }
    },
    device: {
        type: Device.schema,
        required: true
    }
})


module.exports = mongoose.model('Dataset', datasetSchema);