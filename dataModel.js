const mongoose = require("mongoose");

const ItemSchema = new mongoose.Schema({
  listItem: {
    type: String,
    required: true,
  }
});

const toDoItem = mongoose.model("toDoItem", ItemSchema);
const wtoDoItem =mongoose.model("wtoDoItem",ItemSchema);

module.exports = {toDoItem,wtoDoItem};


// <% for (let i=0; i<newListItems.length; i++) { %>
//   <div class="item">
//     <input type="checkbox">
//     <p><%=  newListItems[i].listItem  %></p>
//   </div>
//   <% } %>
