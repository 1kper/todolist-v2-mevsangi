const express = require("express");
// const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");

// const app = express();
// const {toDoItem,wtoDoItem} = require("./models");
const mongoose = require("mongoose");


// const url = 'mongodb://localhost:27017/testdb';
//
// MongoClient.connect(url, (err, client) =>
//
//     const db = client.db('testdb');
//
//     db.listCollections().toArray((err, collections) => {
//
//        console.log(collections);
//
//        client.close();
//     });
//
// });


let dbc = mongoose.connect('mongodb://localhost:27017/toDoItemDb', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});


// const { db } = mongoose.connection;
// const result =   db.collection('toDoItemDb').find().toArray();

const db1 = mongoose.connection;



db1.on("error", console.error.bind(console, "connection error: "));
db1.once("open", function() {
  console.log("Connected successfully");
});

// const db = mongoose.connection.db;

const ItemSchema = new mongoose.Schema({
  listItem: {
    type: String,
    required: true,
  }
});

const models = {};
const getModel = (collectionName) => {
  if (!(collectionName in models)) {
    models[collectionName] = connection.model(
      collectionName, ItemSchema, collectionName
    );
  }
  return models[collectionName];
};

let Dataset;

const {
  wtoDoItem,
  toDoItem
} = require("./dataModel");
const app = express();

const items = ["Buy Food", "Cook Food", "Eat Food"];
const workItems = [];

  const day = date.getDate();

app.get("/home/:listNameP", async (req, res) => {



  // console.log((db1.db.collections(name,function(err,collection{})));
  //
  let collectionExist = false
  let collectionName = req.params.listNameP;
  db1.db.listCollections({
      name: req.params.listNameP
    })
    .next(async function(err, collinfo) {
      if (collinfo) {

        collectionExist = true;
        console.log("collection exist");

        // The collection exists const result = getModel("YourCollectionName").findOne({})
      } else {}


    });

          if (collectionExist) {
            const toDoItemArray = await mongoose.model(collectionName, ItemSchema, collectionName).find({});


            res.render("list", {
              listTitle: day,
              newListItems: toDoItemArray,
              paramValue: collectionName
            });
            res.end()
          } else {
            Dataset = mongoose.model(collectionName, ItemSchema, collectionName);
            const toDoItemArray = await Dataset.find({});
            res.render("list", {
              listTitle: day,
              newListItems: toDoItemArray,
              paramValue: collectionName
            });
            res.end()
          }

  // const result = await  db.collection('toDoItemDb').find().toArray();
  // console.log(result);
  //
  // connection.once('open', function () {

  //     connection.db.collection("YourCollectionName", function(err, collection){
  //         collection.find({}).toArray(function(err, data){
  //             console.log(data); // it will print your collection data
  //         })
  //     });
  //
  // });



  //  const toDoItemArray = await toDoItem.find({});
  //
  //
  // res.render("list", {listTitle: day, newListItems: toDoItemArray});

});




app.post("/home/:listNameP", async (req, res) => {

  const listItems = req.body.newItem;
  let collectionName = req.params.listNameP;
  console.log("/" + collectionName);
  // const item = new [collectionName]( {
  //   listItem: listItems
  //
  // });
  //
  //
  Dataset = mongoose.model(collectionName, ItemSchema, collectionName);
  item = new  Dataset({
    listItem: listItems

  });
  await    item.save() ;


  try {



  } catch (error) {
    res.status(500).send(error);
    res.end()
  }
  Dataset = mongoose.model(collectionName, ItemSchema, collectionName);
  const toDoItemArray = await Dataset.find({});
  res.render("list", {
    listTitle: day,
    newListItems: toDoItemArray,
    paramValue: collectionName
  });
  // res.redirect("/"+collectionName);

});

app.post("/delete/:listNameP", async (req,res)=>{
  const listItems = req.body.item;
  let collectionName = req.params.listNameP;
  console.log(listItems);
  //
  Dataset = mongoose.model(collectionName, ItemSchema, collectionName);
  await Dataset.deleteOne({listItem:  listItems});
    // await toDoItem.remove({});
    res.redirect("/home/"+collectionName)


})

// app.get("/work", async (req,res)=>{
//
//    const  wtoDoItemArray = await wtoDoItem.find({});
//
//   res.render("list", {listTitle: "Work List", newListItems: wtoDoItemArray});
// });
//
// app.get("/about", function(req, res){
//   res.render("about");
// });


module.exports = app;
