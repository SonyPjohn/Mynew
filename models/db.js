const mongoose = require("mongoose");

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true }, (err) =>{
    if(!err) { 
        console.log('Mongodb connection suceeded')}

    else {
        console.log('Error in mongodb connection: ' + JSON.stringify( err, undefined,2))
    }

});

require('./user.model');
require('./product.model');



