require('./config/config');
require('./models/db');

const express = require("express");
var path = require('path');
const bodyParser = require("body-parser");
const cors = require('cors');
const apiPath = require('./routes/api');
var app = express();
// app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json({ limit: '500mb' }))
app.use(cors());

app.use('/api', apiPath);
console.log('reached');
app.use((err, req, res, next) => {
    if (err.username === 'validationError') {
        var valErrors = [];
        Object.keys(err.errors).forEach(key => valErrors.push(err.errors[key].message));
        res.status.send(valErrors)
    }
})

app.listen(process.env.PORT, () =>

    console.log(`server started at port : ${process.env.PORT}`));
