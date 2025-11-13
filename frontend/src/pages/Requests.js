import React, { useEffect, useState } from "react";
import API from "../api/api";

export default function Requests() {
  const [requests, setRequests] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  const [form, setForm] = useState({
    itemId: "",
    startDate: "",
    endDate: "",
    quantity: 1,
  });

  const role = localStorage.getItem("role");
  const userId = localStorage.getItem("userId");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const fetchItems = async () => {
    // Supports both: GET /items -> []   OR   { data: [...], pagination: {...} }
    const res = await API.get("/items", { params: { page: 1, limit: 200 } });
    const maybeArray = res.data;
    const list = Array.isArray(maybeArray) ? maybeArray : maybeArray?.data || [];
    setItems(list);
  };

  const fetchRequests = async () => {
    // Students see only their own; admins see all
    const params = role === "admin" ? {} : { userId };
    const res = await API.get("/requests", { params });
    setRequests(res.data);
  };

  const fetchData = async () => {
    setErrMsg("");
    try {
      await Promise.all([fetchItems(), fetchRequests()]);
    } catch (e) {
      setErrMsg(
        e?.response?.data?.message ||
          e?.message ||
          "Failed to load items/requests"
      );
    }
  };

  const validateForm = () => {
    if (!userId) return "Missing userId. Please log out and log in again.";
    if (!form.itemId) return "Please select an item.";
    if (!form.startDate || !form.endDate)
      return "Please select both start and end dates.";
    const q = Number(form.quantity);
    if (Number.isNaN(q) || q < 1) return "Quantity must be a positive number.";
    const sd = new Date(form.startDate);
    const ed = new Date(form.endDate);
    if (isNaN(sd.getTime()) || isNaN(ed.getTime()))
      return "Invalid dates selected.";
    if (sd > ed) return "Start date cannot be after end date.";
    return null;
  };

  const makeRequest = async (e) => {
    e.preventDefault();
    setErrMsg("");

    const problem = validateForm();
    if (problem) {
      setErrMsg(problem);
      return;
    }

    setLoading(true);
    try {
      // Backend expects { userId, itemId, startDate, endDate, quantity }
      const payload = {
        userId,
        itemId: form.itemId,
        startDate: form.startDate,
        endDate: form.endDate,
        quantity: Number(form.quantity),
      };
      await API.post("/requests", payload);
      // Reset light
      setForm({ itemId: "", startDate: "", endDate: "", quantity: 1 });
      await fetchRequests();
      alert("Request submitted!");
    } catch (e) {
      setErrMsg(e?.response?.data?.message || e?.message || "Request failed");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    setErrMsg("");
    setLoading(true);
    try {
      await API.put(`/requests/${id}`, { status });
      await fetchRequests();
    } catch (e) {
      setErrMsg(e?.response?.data?.message || e?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="container mt-4" style={{ maxWidth: 900 }}>
      <h2>Requests</h2>

      {errMsg && (
        <div
          style={{
            background: "#ffe5e5",
            border: "1px solid #ffb3b3",
            color: "#a30000",
            padding: "8px 12px",
            margin: "10px 0",
            borderRadius: 6,
          }}
        >
          {errMsg}
        </div>
      )}

      {role !== "admin" && (
        <form onSubmit={makeRequest} style={{ marginBottom: 16 }}>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <select
              name="itemId"
              value={form.itemId}
              onChange={handleChange}
              className="form-select"
              style={{ minWidth: 220 }}
              required
            >
              <option value="">Select Item</option>
              {items.map((i) => (
                <option key={i._id} value={i._id}>
                  {i.name} {i.category ? `(${i.category})` : ""}
                </option>
              ))}
            </select>

            <input
              name="startDate"
              type="date"
              className="form-control"
              value={form.startDate}
              onChange={handleChange}
              required
            />
            <input
              name="endDate"
              type="date"
              className="form-control"
              value={form.endDate}
              onChange={handleChange}
              required
            />
            <input
              name="quantity"
              type="number"
              min="1"
              className="form-control"
              placeholder="Quantity"
              value={form.quantity}
              onChange={handleChange}
              required
              style={{ width: 120 }}
            />

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Request"}
            </button>
          </div>
        </form>
      )}

      <div style={{ overflowX: "auto" }}>
        <table border="1" cellPadding="6" style={{ marginTop: 10, width: "100%" }}>
          <thead>
            <tr>
              <th>Item</th>
              <th>User</th>
              <th>Dates</th>
              <th>Qty</th>
              <th>Status</th>
              {role === "admin" && <th>Action</th>}
            </tr>
          </thead>
          <tbody>
            {requests.map((r) => (
              <tr key={r._id}>
                <td>{r.itemId?.name || "-"}</td>
                <td>{r.userId?.email || "-"}</td>
                <td>
                  {r.startDate
                    ? new Date(r.startDate).toLocaleDateString()
                    : "-"}{" "}
                  →{" "}
                  {r.endDate ? new Date(r.endDate).toLocaleDateString() : "-"}
                </td>
                <td>{r.quantity}</td>
                <td>{r.status}</td>
                {role === "admin" && (
                  <td style={{ whiteSpace: "nowrap" }}>
                    <button
                      className="btn btn-sm btn-success"
                      onClick={() => updateStatus(r._id, "APPROVED")}
                      disabled={loading}
                      style={{ marginRight: 6 }}
                    >
                      Approve
                    </button>
                    <button
                      className="btn btn-sm btn-warning"
                      onClick={() => updateStatus(r._id, "REJECTED")}
                      disabled={loading}
                      style={{ marginRight: 6 }}
                    >
                      Reject
                    </button>
                    <button
                      className="btn btn-sm btn-info"
                      onClick={() => updateStatus(r._id, "ISSUED")}
                      disabled={loading}
                      style={{ marginRight: 6 }}
                    >
                      Issue
                    </button>
                    <button
                      className="btn btn-sm btn-secondary"
                      onClick={() => updateStatus(r._id, "RETURNED")}
                      disabled={loading}
                    >
                      Return
                    </button>
                  </td>
                )}
              </tr>
            ))}
            {requests.length === 0 && (
              <tr>
                <td colSpan={role === "admin" ? 6 : 5} style={{ textAlign: "center" }}>
                  No requests found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
