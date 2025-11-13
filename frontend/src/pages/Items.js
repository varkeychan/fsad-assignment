import React, { useEffect, useState } from "react";
import API from "../api/api";

export default function Items() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({
    name: "",
    category: "",
    quantity: "",
    available: "",
  
  });

  const role = localStorage.getItem("role");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const fetchItems = async () => {
    const res = await API.get("/items");
    const list = Array.isArray(res.data) ? res.data : res.data.data || [];
    setItems(list);
  };

  const addItem = async (e) => {
    e.preventDefault();

    const qty = Number(form.quantity);
    const avail =
      form.available === "" || form.available === undefined
        ? qty
        : Number(form.available);

    const payload = {
      name: form.name.trim(),
      category: form.category.trim(),
      quantity: qty,
      available: avail,
    
    };

    await API.post("/items", payload);
    setForm({ name: "", category: "", quantity: "", available: ""});
    fetchItems();
  };

  useEffect(() => {
    fetchItems();
  }, []);

  return (
    <div className="container mt-4">
      <h2>Items</h2>

      {role === "admin" && (
        <form onSubmit={addItem} style={{ display: "flex", gap: 8, marginBottom: 12 }}>
          <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
          <input name="category" placeholder="Category" value={form.category} onChange={handleChange} required />
          <input name="quantity" type="number" placeholder="Total Quantity" value={form.quantity} onChange={handleChange} required min="1" />
          <input name="available" type="number" placeholder="Available" value={form.available} onChange={handleChange} min="0" />
          <button type="submit">Add Item</button>
        </form>
      )}

      <table border="1" cellPadding="5" style={{ marginTop: "10px", minWidth: 600 }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Category</th>
            <th>Available</th>
          
          </tr>
        </thead>
        <tbody>
          {items.map((i) => (
            <tr key={i._id}>
              <td>{i.name}</td>
              <td>{i.category}</td>
              <td>{i.available}</td>
            
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
