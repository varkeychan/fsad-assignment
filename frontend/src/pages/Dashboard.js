import React from "react";
export default function Dashboard() {
  const role = localStorage.getItem("role");
  return (
    <div className="container mt-5">
      <h2>Welcome, {role}</h2>
      <p>Select an option from the navbar to continue.</p>
    </div>
  );
}
