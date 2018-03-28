var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var assetSchema = new Schema({
    username: String,
    category: {
        text: String,
        value: String
    },
    package: String,
    unit: String,
    quantity:String,
    year: Number,
    serial_number: {
        type: String,
        unique: true
    },
    brand: String,
    country: String,
    manager: {
        text: String,
        value: String
    },
    use: {
        text: String,
        value: String
    },
    location: {
        text: String,
        value: String
    },
    status: String,
    note: String,
    history:[{
        name: String,
        date: String,
        code: {
            type: Number,
            default: 0
        },
        user: String
    }]
});

module.exports = mongoose.model('Asset', assetSchema);