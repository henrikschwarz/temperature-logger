var mongoose = require("mongoose");
var chance = require('chance').Chance();

var deviceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    device_id: {
        type: String, 
        required: true,
        unique: true
    }
})

deviceSchema.pre('validate', function(next){
    this.device_id = chance.string({ length: 64, casing: 'upper', alpha: true, numeric: true });
    next();
})

const Device = mongoose.model('Device', deviceSchema);

module.exports = Device;