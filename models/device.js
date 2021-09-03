var mongoose = require('mongoose');

var deviceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
});

const Device = mongoose.model('Device', deviceSchema);

module.exports = Device;