
const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
  product_id:{
     type:String,
     required:true
  },
  product_name: {
    type: String,
    required: true
  },
  price: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  desc: {
    type: String,
    required: false
  },
  created_ts: {
    type: Date,
    default: Date.now()
  }
});

// export model user with UserSchema
module.exports = mongoose.model("Products", productSchema);
