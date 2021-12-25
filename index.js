// framework
const express = require("express");   
const app = express();

// dotenv file
const dotenv = require("dotenv");
dotenv.config();

// import the routers
const routers = require("./routers/user_router");

// connecting to db
const mongoose = require("mongoose");
mongoose.connect(process.env.URI,()=>{
    console.log("DB connected");
});

// body parser as a middleware
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());

app.use("/api",routers);

app.listen(8080,()=>{
    console.log("Server running on port 8080");
});