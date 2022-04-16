'use stric'

var express = require('express');
var app = express();
var bodyparser = require('body-parser');
var mongoose = require('mongoose');
var port = process.env.PORT || 4201;

//Routes
var clientRoutes = require('./components/client/ClientRoute');

require('dotenv').config();

// Mongodb connection
mongoose.connect(process.env.MONGODB_URI, (err, res)=>{
    if(err){
        console.log(err)
    }else{
        app.listen(port, function(){
            console.log('Server runing on port ',port);

        });
    }
});

app.use(bodyparser.urlencoded({extended:true}));
app.use(bodyparser.json({limit:'50mb', extended:true}));

app.use((req,res,next) =>{
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API, Origin, X-Requested-With, Content-Type, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
    res.header('Allow','GET, PUT, POST, DELETE, OPTIONS');
    next();

});

app.use('/signup', clientRoutes);

module.exports = app;