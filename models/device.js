var mongoose = require('mongoose');

var deviceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    device_id: {
        type: String,
        required: true,
        unique: true
    },
    unit: {
        type: String
    }
});

const Device = mongoose.model('Device', deviceSchema);

module.exports = Device;