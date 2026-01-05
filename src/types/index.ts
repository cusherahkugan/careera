export type UserRole = 'CANDIDATE' | 'EMPLOYER' | 'ADMIN';

export type JobType = 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERNSHIP' | 'REMOTE';

export type JobStatus = 'ACTIVE' | 'CLOSED' | 'DRAFT';

export type ApplicationStatus = 'PENDING' | 'REVIEWED' | 'SHORTLISTED' | 'REJECTED' | 'ACCEPTED';

export interface User {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface Profile {
  id: string;
  userId: string;
  phone: string | null;
  location: string | null;
  bio: string | null;
  resumeUrl: string | null;
  skills: string[];
  experience: number | null;
  education: string | null;
  linkedIn: string | null;
  github: string | null;
  portfolio: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Job {
  id: string;
  title: string;
  description: string;
  company: string;
  location: string;
  type: JobType;
  salary: string | null;
  requirements: string[];
  skills: string[];
  status: JobStatus;
  employerId: string;
  createdAt: Date;
  updatedAt: Date;
  employer?: User;
  _count?: {
    applications: number;
  };
}

export interface Application {
  id: string;
  jobId: string;
  candidateId: string;
  coverLetter: string | null;
  resumeUrl: string;
  status: ApplicationStatus;
  aiMatchScore: number | null;
  aiInsights: string | null;
  createdAt: Date;
  updatedAt: Date;
  job?: Job;
  candidate?: User & { profile?: Profile };
}

export interface JobFilters {
  search?: string;
  type?: JobType;
  location?: string;
  skills?: string[];
}

export interface DashboardStats {
  totalJobs: number;
  activeJobs: number;
  totalApplications: number;
  pendingApplications: number;
}