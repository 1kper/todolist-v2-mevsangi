//jshint esversion:6
require('dotenv').config();
const _ =require("lodash");
const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");

const app = express();
const mongoose = require("mongoose")

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


///////////////////////////////////////////////////////creating database connection and schema///////////////////////////////
// mongoose.connect("mongodb://localhost:27017/todolistDba",{useNewUrlParser:true});

const username =process.env.USERNAMEI;
const password = process.env.PASSWORD;
const cluster = "cluster0.nhukp";
const dbname = process.env.DBNAME;


mongoose.connect(
  `mongodb+srv://${username}:${password}@${cluster}.mongodb.net/${dbname}?retryWrites=true&w=majority`,
  {
    useNewUrlParser: true,

    useUnifiedTopology: true
  }
);
const db1 = mongoose.connection;

db1.on("error", console.error.bind(console, "connection error: "));
db1.once("open", function() {
  console.log("Connected successfully todolistDba");
});



itemSchema = new  mongoose.Schema({name: {
  type: String,
  required: true,
}});

const Item = mongoose.model("Item",itemSchema);
const item1 = new Item({name:"Welcome to your todolist"});
const item2 = new Item({name:"Hit the + button to add a new item"});
const item3 = new Item({name:"<-- Hit this to delete an item"});

const defaultItem =[item1,item2,item3]


 listSchema =  new mongoose.Schema(
  {name :String, items:[itemSchema]})


const List = mongoose.model("List",listSchema,"List");



////////////////////////////////////////setting routes for the url /(root) path  /////////////////////////////////////////////////////


app.get("/",(req,res)=>{
  Item.find(function(err,foundList){
              if(!err){
                if (foundList.length ===0){
                   Item.insertMany(defaultItem,(err)=>{if(err){console.log(err)}else{console.log("item is saved in default list")}});
                res.redirect("/");
              }
                else{

                 res.render("list",{listTitle:"Today", newListItems:foundList})
              }


              }

  })


})





////////////////////////////////////////setting get(read) for the url /(root) path  /////////////////////////////////////////////////////


app.get("/:customListName", function(req, res) {

const customListName = _.capitalize(req.params.customListName);

  List.findOne({name:customListName},function(err,foundList){
              if(!err){
                if (!foundList){console.log(customListName+" list doesn't exist");
                const list = new List({
                name:customListName,
                items:defaultItem });
                list.save();
                res.redirect("/"+customListName);
              }
                else{console.log(customListName +" list exist");
                 console.log(foundList.name);
                 res.render("list",{listTitle:foundList.name, newListItems:foundList.items})
              }


              }

  })



// const day = date.getDate();
//
//   res.render("list", {listTitle: day, newListItems: items});

});


////////////////////////////////////////setting post(write/save) routes for the url /(root) path  /////////////////////////////////////////////////////


app.post("/", async function(req, res){

  const itemName = req.body.newItem;
  const listName = req.body.list;
  const listN =listName.slice(1,(listName.length -1));
  console.log(req.body);
  const item = new Item({name:itemName});

 if(listN == "Today"){
   item.save();
   res.redirect("/");
 }

 else{
  await List.findOne({name:listN},(err,foundList)=>

 {if(!err){
   if(foundList){ foundList.items.push(item);
   console.log(foundList);
                 foundList.save();
                 res.redirect("/"+listN);

 }}
else{console.log("There is no such list")}

}
).clone().catch(function(err1){ console.log(err1)});

}








   });

//
//   if (listName == 'Today'){}
//   else{
//     console.log( await List.findOne({name: listName}));}
//
//
//  // foundList.items.push(item);
//  // foundList.save();
//  // res.redirect("/"+listName);
//
// });
//
// //   }
//
//   // if (req.body.list === "Work") {
//   //   workItems.push(item);
//   //   res.redirect("/work");
//   // } else {
//   //   items.push(item);
//   //   res.redirect("/");
//   // }


  ////////////////////////////////////////creating routes for the url /delete path  /////////////////////////////////////////////////////

  app.post("/delete", function(req,res){
    const checkedItemId =req.body.item;
    const listName= req.body.listName;
     console.log(req.body);
    if(listName==="Today"){

      Item.findByIdAndRemove(checkedItemId,function(err){

         if(!err){res.redirect("/")}

      });

    }
    else{

     List.findOneAndUpdate({name:listName},{$pull:{items:{_id:checkedItemId}}},function(err,foundList){
      // foundList.findByIdAndRemove(checkedItemId,function(err){
      //
         if(!err){
           console.log("what");
            foundList.save();

           res.redirect("/"+listName)}}
         );
         }



      });




  ////////////////////////////////////////creating get(read) for the url /work path  /////////////////////////////////////////////////////

app.get("/work", function(req,res){
  res.render("list", {listTitle: "Work List", newListItems: workItems});
});

app.get("/about", function(req, res){
  res.render("about");
});


let port = process.env.PORT;
if(port ==null||port =="")
{port=3000;}
app.listen(port);
