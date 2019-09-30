
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
var Schema = mongoose.Schema;

var userSchema = new mongoose.Schema({

    name: {  type: String},
    password: { type: String },
    email: { type: String},
    gender: { type: String},
    photo: { type: String},
    mobile: { type: Number}
 
});
mongoose.model('user', userSchema);