import React, { useEffect, useState } from "react";
import API from "../api/api";

export default function Requests() {
  const [requests, setRequests] = useState([]);
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ itemId: "", startDate: "", endDate: "", quantity: 1 });
  const role = localStorage.getItem("role");

  const fetchData = async () => {
    const [r, i] = await Promise.all([API.get("/requests"), API.get("/items")]);
    setRequests(r.data);
    setItems(i.data);
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const makeRequest = async (e) => {
    e.preventDefault();
    const userId = "dummy"; // not used if backend reads from token; else replace
    await API.post("/requests", { ...form, userId });
    fetchData();
  };

  const updateStatus = async (id, status) => {
    await API.put(`/requests/${id}`, { status });
    fetchData();
  };

  useEffect(() => { fetchData(); }, []);

  return (
    <div className="container mt-4">
      <h2>Requests</h2>
      {role !== "admin" && (
        <form onSubmit={makeRequest}>
          <select name="itemId" onChange={handleChange}>
            <option>Select Item</option>
            {items.map(i => <option key={i._id} value={i._id}>{i.name}</option>)}
          </select>
          <input name="startDate" type="date" onChange={handleChange} />
          <input name="endDate" type="date" onChange={handleChange} />
          <input name="quantity" type="number" onChange={handleChange} />
          <button type="submit">Request</button>
        </form>
      )}

      <table border="1" cellPadding="5" style={{ marginTop: "10px" }}>
        <thead><tr><th>Item</th><th>User</th><th>Status</th><th>Action</th></tr></thead>
        <tbody>
          {requests.map(r => (
            <tr key={r._id}>
              <td>{r.itemId?.name}</td>
              <td>{r.userId?.email}</td>
              <td>{r.status}</td>
              <td>
                {role === "admin" && (
                  <>
                    <button onClick={() => updateStatus(r._id, "APPROVED")}>Approve</button>
                    <button onClick={() => updateStatus(r._id, "REJECTED")}>Reject</button>
                    <button onClick={() => updateStatus(r._id, "ISSUED")}>Issue</button>
                    <button onClick={() => updateStatus(r._id, "RETURNED")}>Return</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
