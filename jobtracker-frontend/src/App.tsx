import { useEffect, useState } from "react";
import { JobApplication, ApplicationStatus } from "./types/JobApplication";
import { API_BASE_URL } from "./config.ts";
import {
  getApplications,
  createApplication,
  deleteApplication,
  updateStatus,
} from "./services/jobApplicationApi";


function App() {
  const [applications, setApplications] = useState<JobApplication[]>([]);

  // form fields
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | JobApplication["status"]>("ALL");
  const [sortBy, setSortBy] = useState<"NEWEST" | "COMPANY_AZ" | "STATUS">("NEWEST");
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);


  const [companyName, setCompanyName] = useState("");
  const [roleTitle, setRoleTitle] = useState("");
  const [status, setStatus] = useState("APPLIED");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // load existing data once
  useEffect(() => {
  setIsLoading(true);
  setLoadError(null);

  fetch(`${API_BASE_URL}/applications`)
    .then((res) => {
      if (!res.ok) throw new Error("Failed to load applications");
      return res.json();
    })
    .then((data: JobApplication[]) => setApplications(data))
    .catch(() => setLoadError("Could not load applications. Is the backend running?"))
    .finally(() => setIsLoading(false));
}, []);


  // submit handler
 const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  setIsSubmitting(true);

  try {
    const newApp = { companyName, roleTitle, status };

    const res = await fetch(`${API_BASE_URL}/applications`, {
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
    setApplications((prev) => [...prev, created]);

    // clear form
    setCompanyName("");
    setRoleTitle("");
    setStatus("APPLIED");
  } catch (err) {
    alert("Network error: could not reach backend");
  } finally {
    setIsSubmitting(false);
  }
};

 const handleDelete = async (id: number) => {
  const res = await fetch(`${API_BASE_URL}/applications/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    alert("Failed to delete application");
    return;
  }

  //remove from UI instantly
  setApplications((prev) => prev.filter((app) => app.id !== id));
};

const handleStatusChange = async (id:number, newStatus:JobApplication["status"])=>{

  const res = await fetch(`${API_BASE_URL}/applications/${id}/status?status=${newStatus}`,
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

const statusBadgeClass = (s: JobApplication["status"])=> {
  if (s === "APPLIED") return "bg-blue-50 text-blue-700 ring-blue-200";
  if (s === "INTERVIEW") return "bg-amber-50 text-amber-700 ring-amber-200";
  if (s === "OFFER") return "bg-emerald-50 text-emerald-700 ring-emerald-200";
  return "bg-rose-50 text-rose-700 ring-rose-200"; // REJECTED
};

const counts = {
  APPLIED: applications.filter((a) => a.status === "APPLIED").length,
  INTERVIEW: applications.filter((a) => a.status === "INTERVIEW").length,
  OFFER: applications.filter((a) => a.status === "OFFER").length,
  REJECTED: applications.filter((a) => a.status === "REJECTED").length,
};

const filteredApplications = applications.filter((app) => {
  const q = query.trim().toLowerCase();
  const matchesQuery=q === ""||app.companyName.toLowerCase().includes(q) ||(app.roleTitle || "").toLowerCase().includes(q);

  const matchesStatus =
    statusFilter === "ALL"||app.status === statusFilter;

  return matchesQuery && matchesStatus;
});

const sortedApplications = [...filteredApplications].sort((a, b) => {
  if (sortBy==="COMPANY_AZ") {
    return a.companyName.localeCompare(b.companyName);
  }
  if (sortBy==="STATUS") {
    return a.status.localeCompare(b.status);
  }
  return (b.id ?? 0) - (a.id ?? 0);
});

const shownCounts={
  APPLIED: sortedApplications.filter((a) => a.status === "APPLIED").length,
  INTERVIEW: sortedApplications.filter((a) => a.status === "INTERVIEW").length,
  OFFER: sortedApplications.filter((a) => a.status === "OFFER").length,
  REJECTED: sortedApplications.filter((a) => a.status === "REJECTED").length,
};

  return (
  <div className="min-h-screen bg-slate-50">
    <div className="mx-auto max-w-6xl px-4 py-8">
      {/* Header */}
      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
  <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
    <div className="text-xs font-medium text-slate-500">Applied</div>
    <div className="mt-1 text-2xl font-bold text-slate-900">{shownCounts.APPLIED}</div>
  </div>

  <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
    <div className="text-xs font-medium text-slate-500">Interview</div>
    <div className="mt-1 text-2xl font-bold text-slate-900">{shownCounts.INTERVIEW}</div>
  </div>

  <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
    <div className="text-xs font-medium text-slate-500">Offer</div>
    <div className="mt-1 text-2xl font-bold text-slate-900">{shownCounts.OFFER}</div>
  </div>

  <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
    <div className="text-xs font-medium text-slate-500">Rejected</div>
    <div className="mt-1 text-2xl font-bold text-slate-900">{shownCounts.REJECTED}</div>
  </div>
</div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Form */}
        <div className="lg:col-span-1">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">
              Add application
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Add a company + role, then keep the status updated.
            </p>

            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Company Name <span className="text-slate-400">(required)</span>
                </label>
                <input
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Amazon"
                  className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Role Title
                </label>
                <input
                  value={roleTitle}
                  onChange={(e) => setRoleTitle(e.target.value)}
                  placeholder="Software Engineer Intern"
                  className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Status </label>

                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                >
                  <option value="APPLIED">APPLIED</option>
                  <option value="INTERVIEW">INTERVIEW</option>
                  <option value="OFFER">OFFER</option>
                  <option value="REJECTED">REJECTED</option>
                </select>
                 </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 active:bg-slate-950 focus:outline-none focus:ring-4 focus:ring-slate-200 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? "Adding..." : "Add Application"}
              </button>


              <div className="text-xs text-slate-500">
                Tip: keep statuses updated weekly, Be consistent 😉
              </div>
              </form>
             </div>
               </div>

        {/* List */}
        <div className="lg:col-span-2">
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-5 py-4">
  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
    <div>
      <h2 className="text-lg font-semibold text-slate-900">Applications</h2>
      <p className="text-sm text-slate-600">
        Search, filter and sort your applications.
      </p>
      </div>

    <div className="flex items-center gap-2">
      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
        {sortedApplications.length} shown
      </span>
      <button
        type="button"
        onClick={() => {
          setQuery("");
          setStatusFilter("ALL");
          setSortBy("NEWEST");
        }}
        className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
      >
        Clear
      </button>
      </div>
      </div>

  <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
    <div className="sm:col-span-1">
      <label className="block text-xs font-medium text-slate-600">Search</label>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Company or role..."
        className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
      />
    </div>

    <div className="sm:col-span-1">
      <label className="block text-xs font-medium text-slate-600">Status</label>
      <select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value as any)}
        className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
      >
        <option value="ALL">All</option>
        <option value="APPLIED">Applied</option>
        <option value="INTERVIEW">Interview</option>
        <option value="OFFER">Offer</option>
        <option value="REJECTED">Rejected</option>
      </select>
    </div>

    <div className="sm:col-span-1">
      <label className="block text-xs font-medium text-slate-600">Sort</label>
      <select
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value as any)}
        className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
      >
        <option value="NEWEST">Newest</option>
        <option value="COMPANY_AZ">Company (A-Z)</option>
        <option value="STATUS">Status</option>
      </select>
     </div>
   </div>
 </div>


            {sortedApplications.length === 0 ? (
              <div className="p-8">
                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
                  <div className="text-base font-semibold text-slate-900">
                    No applications yet
                  </div>
                  <div className="mt-1 text-sm text-slate-600">
                    Add your first application on the left to get started.
                  </div>
                </div>
              </div>
            ) : (
              <ul className="divide-y divide-slate-200">
                {sortedApplications.map((app) => (
                  <li
                    key={app.id}
                    className="flex flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <div className="truncate text-sm font-semibold text-slate-900">
                          {app.companyName}
                        </div>

                        {/* Status pill (simple version for now) */}
                      <span
                        className={
                          "rounded-full px-2.5 py-1 text-xs font-semibold ring-1 " +
                          statusBadgeClass(app.status)
                        }
                      >
                        {app.status}
                      </span>
                      </div>

                      <div className="mt-1 truncate text-sm text-slate-600">
                        {app.roleTitle || "—"}
                      </div>
                      </div>

                    <div className="flex items-center gap-3">
                      <select
                        value={app.status}
                        onChange={(e) =>
                          handleStatusChange(
                            app.id,
                            e.target.value as JobApplication["status"]
                          )
                        }
                        className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                      >
                        <option value="APPLIED">APPLIED</option>
                        <option value="INTERVIEW">INTERVIEW</option>
                        <option value="OFFER">OFFER</option>
                        <option value="REJECTED">REJECTED</option>
                      </select>

                      <button
                        onClick={() => setDeleteId(app.id)}
                        className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 active:bg-slate-100"
                      >
                        Delete
                      </button>
                      </div>
                      </li>
                    ))}
                      </ul>
                          )}
                      </div>
                    </div>
                  </div>
                </div>
    {deleteId !== null ? (
     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
    <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-lg">
      <h3 className="text-lg font-semibold text-slate-900">Delete application?</h3>
      <p className="mt-1 text-sm text-slate-600">
        This action can't be undone.
      </p>

      <div className="mt-5 flex justify-end gap-3">
        <button
          onClick={() => setDeleteId(null)}
          className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          Cancel
        </button>

        <button
          onClick={async () => {
            await handleDelete(deleteId);
            setDeleteId(null);
          }}
          className="rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
) : null}

  </div>
);

}

export default App;
