import Item from "../models/itemModel.js";


export const createItem = async (req, res) => {
  try {
    const item = await Item.create(req.body);
    res.status(201).json({ message: "Item created successfully", item });
  } catch (error) {
    res.status(500).json({ message: "Error creating item", error: error.message });
  }
};


export const getItems = async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: "Error fetching items" });
  }
};


export const getItemById = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: "Error fetching item" });
  }
};

export const updateItem = async (req, res) => {
  try {
    const item = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ message: "Item updated successfully", item });
  } catch (error) {
    res.status(500).json({ message: "Error updating item" });
  }
};


export const deleteItem = async (req, res) => {
  try {
    await Item.findByIdAndDelete(req.params.id);
    res.json({ message: "Item deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting item" });
  }
};
