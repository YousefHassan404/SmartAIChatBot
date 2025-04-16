// Importing required modules
// const express = require("express");
import express from "express";
// const bodyParser = require("body-parser");
import bodyParser from "body-parser";
const app = express();



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.set("port", process.env.PORT || 8000);

app.get("/",function(req,res){
    res.send("Hello World")
})

app.listen(app.get("port"), () => {
    console.log("server Is Running on port", app.get("port"));  
})