var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var propertySchema = new Schema({
    name: String
});

module.exports = mongoose.model('Property', propertySchema);