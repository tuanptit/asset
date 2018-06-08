var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var assetSchema = new Schema({
    username: String,
    category: {type: Schema.Types.ObjectId, ref: 'Property'},
    package: String,
    unit: String,
    quantity:String,
    year: Number,
    serial_number: {
        type: String
    },
    brand: String,
    country: String,
    manager: {type: Schema.Types.ObjectId, ref: 'Property'},
    use: {type: Schema.Types.ObjectId, ref: 'Property'},
    location: {type: Schema.Types.ObjectId, ref: 'Property'},
    route: {type: Schema.Types.ObjectId, ref: 'Property'},
    system: {type: Schema.Types.ObjectId, ref: 'Property'},
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
}, {usePushEach: true});

module.exports = mongoose.model('Asset', assetSchema);