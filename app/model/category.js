var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var categorySchema = new Schema({
    name: String,
    uni_name: String,
    properties: [{type: Schema.Types.ObjectId, ref: 'Property'}]
});

module.exports = mongoose.model('Category', categorySchema);