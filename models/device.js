<<<<<<< HEAD
var mongoose = require('mongoose');
=======
var mongoose = require("mongoose");
var chance = require('chance').Chance();
>>>>>>> c4e9519c5f32ff2bafc25d6e3fdd1b54d42221a2

var deviceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    device_id: {
<<<<<<< HEAD
        type: String,
        required: true,
        unique: true
    },
    unit: {
        type: String
    }
});
=======
        type: String, 
        required: true,
        unique: true
    }
})

deviceSchema.pre('validate', function(next){
    this.device_id = chance.string({ length: 64, casing: 'upper', alpha: true, numeric: true });
    next();
})
>>>>>>> c4e9519c5f32ff2bafc25d6e3fdd1b54d42221a2

const Device = mongoose.model('Device', deviceSchema);

module.exports = Device;