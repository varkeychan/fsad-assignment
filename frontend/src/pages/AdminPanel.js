import React, { useEffect, useState } from "react";
import API from "../api/api";

export default function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersRes = await API.get("/auth/users"); // optional
        const reqRes = await API.get("/requests");
        setUsers(usersRes.data || []);
        setRequests(reqRes.data || []);
      } catch (err) {
        console.error("Error fetching admin data", err);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="container mt-4">
      <h2>Admin Panel</h2>

      <section>
        <h3>Users</h3>
        <table border="1" cellPadding="5">
          <thead>
            <tr><th>Name</th><th>Email</th><th>Role</th></tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u._id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section style={{ marginTop: "20px" }}>
        <h3>Requests Overview</h3>
        <table border="1" cellPadding="5">
          <thead>
            <tr><th>Item</th><th>User</th><th>Status</th></tr>
          </thead>
          <tbody>
            {requests.map(r => (
              <tr key={r._id}>
                <td>{r.itemId?.name}</td>
                <td>{r.userId?.email}</td>
                <td>{r.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
