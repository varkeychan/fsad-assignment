import mongoose from "mongoose";

const itemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    quantity: { type: Number, required: true, min: 1 },
    available: { type: Number, required: true, min: 0 },
  
  },
  { timestamps: true }
);

const Item = mongoose.model("Item", itemSchema);
export default Item;    

