<<<<<<< HEAD
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
=======
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
>>>>>>> c4e9519c5f32ff2bafc25d6e3fdd1b54d42221a2
    name: {
        type: String,
        required: true
    },
<<<<<<< HEAD
    api_key: {
        type: String,
        length: 128,
        unique: true,
    },
    dataset: {
        type: [data_subschema]
=======
    data: {
        type: [dataSchema]
    },
    api_key: {
        type: String,
        default: function(){
            return chance.string({ length: 128, casing: 'upper', alpha: true, numeric: true });
        }
>>>>>>> c4e9519c5f32ff2bafc25d6e3fdd1b54d42221a2
    },
    device: {
        type: Device.schema,
        required: true
    }
<<<<<<< HEAD
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
=======
})


module.exports = mongoose.model('Dataset', datasetSchema);
>>>>>>> c4e9519c5f32ff2bafc25d6e3fdd1b54d42221a2
