const mongoose = require("mongoose");

const orderSchema = mongoose.Schema({
  order_id:{
     type:String,
     required:false
  },
  product_id: {
    type: String,
    required: false
  },
  quantity: {
    type: String,
    required: false
  },
  ordered_date:{
    type:Date,
    default:new Date().getTime()
  },
 
  customer_name: {
    type: String,
    required: false
  },
  unit_price: {
    type: String,
    required: false
  },
  created_date: {
    type: Date,
    default: Date.now()
  },
  customer_id:{
    type: String,
    required: false
  },
  customer_email:{
    type: String,
    required: false  
  },
  product_name:{
    type: String,
    required: false  
  },
  product_price:{
    type: String,
    required: false  
  },
  created_by:{
    type:String
  }
});

// export model user with UserSchema
module.exports = mongoose.model("Order", orderSchema);
