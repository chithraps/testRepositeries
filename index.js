const mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/user_management");
//----------------------------------------

const express = require("express");
const app = express();
const bodyParser=require('body-parser')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))
app.use((req, res, next) => {
    res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate');
    res.header('Expires', '0');
    res.header('Pragma', 'no-cache');
    next();
  });
const path = require('path');
//for user route

const userRout = require('./routes/userRoute')
//for admin route
const adminRout = require('./routes/adminRoute')

app.use('/admin',adminRout);
app.use('/',userRout);


app.use('/static',express.static(path.join(__dirname,'public')))
app.use('/assets',express.static(path.join(__dirname,'public/assets')))

app.listen(3001,()=>{
    console.log("server is running")
})