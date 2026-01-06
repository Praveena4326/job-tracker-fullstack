import { JobApplication, ApplicationStatus } from "../types/JobApplication";

const BASE_URL = "http://localhost:8080/applications";

export async function getApplications(): Promise<JobApplication[]> {
  const res = await fetch(BASE_URL);
  if (!res.ok) throw new Error("Failed to fetch applications");
  return res.json();
}

export async function createApplication(payload: {
  companyName: string;
  roleTitle: string;
  status: ApplicationStatus;
}): Promise<JobApplication> {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(JSON.stringify(error));
  }

  return res.json();
}

export async function deleteApplication(id: number): Promise<void> {
  const res = await fetch(`${BASE_URL}/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete application");
}

export async function updateStatus(
  id: number,
  status: ApplicationStatus
): Promise<JobApplication> {
  const res = await fetch(`${BASE_URL}/${id}/status?status=${status}`, {
    method: "PUT",
  });

  if (!res.ok) throw new Error("Failed to update status");
  return res.json();
}