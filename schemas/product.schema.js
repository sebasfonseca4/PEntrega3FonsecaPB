import mongoose from "mongoose";

const productsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: false
  },    
  price: {
    type: Number,
    required: false
  },
});


export default mongoose.model("Products", productsSchema);