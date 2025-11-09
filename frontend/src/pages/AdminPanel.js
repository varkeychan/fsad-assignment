import React, { useEffect, useState } from "react";
import API from "../api/api";

export default function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);
  const [error, setError] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");
      const [uRes, rRes] = await Promise.all([
        API.get("/auth/users"),
        API.get("/requests"),
      ]);
      setUsers(uRes.data || []);
      // requests API may return array or {data: []}; handle both
      const reqData = Array.isArray(rRes.data) ? rRes.data : (rRes.data?.data || []);
      setRequests(reqData);
    } catch (e) {
      console.error(e);
      setError(e.response?.data?.message || "Failed to load admin data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      setBusyId(id);
      await API.put(`/requests/${id}`, { status });
      await fetchData();
    } catch (e) {
      alert(e.response?.data?.message || "Failed to update status");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Admin Panel</h2>

      {error && <p className="text-danger">{error}</p>}
      {loading && <p>Loading…</p>}

      {/* USERS */}
      <section style={{ marginTop: 20 }}>
        <h3>Users</h3>
        <table border="1" cellPadding="6" style={{ width: "100%", background: "#fff" }}>
          <thead>
            <tr>
              <th>Name</th><th>Email</th><th>Role</th><th>Created</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 && (
              <tr><td colSpan="4">No users found.</td></tr>
            )}
            {users.map(u => (
              <tr key={u._id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.role}</td>
                <td>{new Date(u.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* REQUESTS */}
      <section style={{ marginTop: 30 }}>
        <h3>Requests Overview</h3>
        <table border="1" cellPadding="6" style={{ width: "100%", background: "#fff" }}>
          <thead>
            <tr>
              <th>Item</th>
              <th>User</th>
              <th>Qty</th>
              <th>From</th>
              <th>To</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.length === 0 && (
              <tr><td colSpan="7">No requests found.</td></tr>
            )}
            {requests.map(r => (
              <tr key={r._id}>
                <td>{r.itemId?.name}</td>
                <td>{r.userId?.email}</td>
                <td>{r.quantity}</td>
                <td>{new Date(r.startDate).toLocaleDateString()}</td>
                <td>{new Date(r.endDate).toLocaleDateString()}</td>
                <td>{r.status}</td>
                <td style={{ whiteSpace: "nowrap" }}>
                  <button disabled={busyId===r._id} onClick={() => updateStatus(r._id, "APPROVED")}>Approve</button>{" "}
                  <button disabled={busyId===r._id} onClick={() => updateStatus(r._id, "REJECTED")}>Reject</button>{" "}
                  <button disabled={busyId===r._id} onClick={() => updateStatus(r._id, "ISSUED")}>Issue</button>{" "}
                  <button disabled={busyId===r._id} onClick={() => updateStatus(r._id, "RETURNED")}>Return</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
