var mongoose = require('mongoose')
var Schema = mongoose.Schema;
var accountSchema = new Schema({
    username: String,
    password: String,
    role: Number,
    name: String,
    address: String,
    phone: String,
    email: String,
    access_token: String
});

module.exports = mongoose.model('Employee', accountSchema);