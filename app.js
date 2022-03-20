//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");

const mongoose = require("mongoose");
const Router = require("./routes");

// const app = express();
// const toDoItem = require("./models");
// const https = require("https");


const app = express();
app.use(express.json());
app.use(express.static("public"));
app.use(bodyParser.urlencoded({
  extended: true
}));

app.set('view engine', 'ejs');




app.use(Router);

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
