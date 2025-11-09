import React, { useEffect, useState } from "react";
import API from "../api/api";

export default function Items() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ name: "", category: "", totalQuantity: 1, availableQuantity: 1, condition: "Good" });
  const role = localStorage.getItem("role");

  const fetchItems = async () => {
    const res = await API.get("/items");
    setItems(res.data);
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const addItem = async (e) => {
    e.preventDefault();
    await API.post("/items", form);
    fetchItems();
  };

  useEffect(() => { fetchItems(); }, []);

  return (
    <div className="container mt-4">
      <h2>Items</h2>
      {role === "admin" && (
        <form onSubmit={addItem}>
          <input name="name" placeholder="Name" onChange={handleChange} />
          <input name="category" placeholder="Category" onChange={handleChange} />
          <input name="Quantity" type="number" onChange={handleChange} />
          <input name="Available" type="number" onChange={handleChange} />

          <button type="submit">Add Item</button>
        </form>
      )}
      <table border="1" cellPadding="5" style={{ marginTop: "10px" }}>
        <thead>
          <tr><th>Name</th><th>Category</th><th>Available</th><th>Condition</th></tr>
        </thead>
        <tbody>
          {items.map(i => (
            <tr key={i._id}><td>{i.name}</td><td>{i.category}</td><td>{i.availableQuantity}</td><td>{i.condition}</td></tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

