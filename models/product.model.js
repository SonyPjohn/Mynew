
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
var Schema = mongoose.Schema;

var productSchema = new mongoose.Schema({

    prd_name: {  type: String},
    prd_price: { type: Number },
    prd_image: String,
    prd_id: {  type: String}

 
});
mongoose.model('product', productSchema);