import mongoose from "mongoose";

const itemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String, required: true },
    Quantity: { type: Number, required: true },
    available: { type: Number, required: true },
    condition: { type: String, default: "Good" },
    
  },
  { timestamps: true }
);

const Item = mongoose.model("Item", itemSchema);
export default Item;
