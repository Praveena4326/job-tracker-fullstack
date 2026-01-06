export type ApplicationStatus = "APPLIED"|"INTERVIEW"|"OFFER"|"REJECTED";

export type JobApplication = {
  id: number;
  companyName: string;
  roleTitle: string;
  status: ApplicationStatus;
  dateApplied?: string;
  notes?: string;
};