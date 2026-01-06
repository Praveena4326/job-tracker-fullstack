import { useEffect, useState } from "react";
import { JobApplication, ApplicationStatus } from "./types/JobApplication";
import {
  getApplications,
  createApplication,
  deleteApplication,
  updateStatus,
} from "./services/jobApplicationApi";


function App() {
  const [applications, setApplications] = useState<JobApplication[]>([]);

  // form fields
  const [companyName, setCompanyName] = useState("");
  const [roleTitle, setRoleTitle] = useState("");
  const [status, setStatus] = useState("APPLIED");

  // load existing data once
  useEffect(() => {
    fetch("http://localhost:8080/applications")
      .then((res) => res.json())
      .then((data: JobApplication[]) => setApplications(data))
      .catch((err) => console.error("Error fetching data:", err));
  }, []);

  // submit handler
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newApp = { companyName, roleTitle, status };

    const res = await fetch("http://localhost:8080/applications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newApp),
    });

    if (!res.ok) {
      const errorBody = await res.json().catch(() => ({}));
      alert("Failed to create: " + JSON.stringify(errorBody));
      return;
    }

    const created: JobApplication = await res.json();

    // update UI instantly without re-fetch
    setApplications((prev) => [...prev, created]);

    // clear form
    setCompanyName("");
    setRoleTitle("");
    setStatus("APPLIED");
  };

 const handleDelete = async (id: number) => {
  const res = await fetch(`http://localhost:8080/applications/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    alert("Failed to delete application");
    return;
  }

  // remove from UI instantly
  setApplications((prev) => prev.filter((app) => app.id !== id));
};

const handleStatusChange = async (id:number, newStatus:JobApplication["status"])=>{

  const res = await fetch(
    `http://localhost:8080/applications/${id}/status?status=${newStatus}`,
    {
      method: "PUT",
    }
  );

  if (!res.ok) 
  {
    alert("Failed to update status");
    return;
  }

 const updated:JobApplication = await res.json();

  setApplications((prev) =>
    prev.map((app) => (app.id === id ? updated : app))
  );
};


  return (
    <div style={{ padding: "20px" }}>
      <h1>Job Applications</h1>

      {/* FORM */}
      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        <div style={{ marginBottom: "10px" }}>
          <label>Company Name: </label>
          <input
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            placeholder="Amazon"
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>Role Title: </label>
          <input
            value={roleTitle}
            onChange={(e) => setRoleTitle(e.target.value)}
            placeholder="Software Engineer Intern"
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>Status: </label>
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="APPLIED">APPLIED</option>
            <option value="INTERVIEW">INTERVIEW</option>
            <option value="OFFER">OFFER</option>
            <option value="REJECTED">REJECTED</option>
          </select>
        </div>

        <button type="submit">Add Application</button>
      </form>

      {/* LIST */}
      {applications.length === 0 ? (
        <p>No applications found</p>
      ) : (
        <ul>
          {applications.map((app) => (
           <li key={app.id}>
           <strong>{app.companyName}</strong> - {app.roleTitle}
           <select
                value={app.status}
                onChange={(e) => handleStatusChange(app.id, e.target.value as JobApplication["status"])}
                style={{ marginLeft: "5px" }}
>
          <option value="APPLIED">APPLIED</option>
          <option value="INTERVIEW">INTERVIEW</option>
          <option value="OFFER">OFFER</option>
          <option value="REJECTED">REJECTED</option>
</select>
           <button
               onClick={() => handleDelete(app.id)}
               style={{ marginLeft: "10px" }}
  >
    Delete
  </button>
</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
