import { create } from 'zustand';
import { Job, Application, Profile } from '@/types';

interface StoreState {
  // User state
  currentUser: any | null;
  setCurrentUser: (user: any) => void;
  
  // Jobs state
  jobs: Job[];
  setJobs: (jobs: Job[]) => void;
  addJob: (job: Job) => void;
  updateJob: (id: string, job: Partial<Job>) => void;
  deleteJob: (id: string) => void;
  
  // Applications state
  applications: Application[];
  setApplications: (applications: Application[]) => void;
  addApplication: (application: Application) => void;
  updateApplication: (id: string, application: Partial<Application>) => void;
  
  // Profile state
  profile: Profile | null;
  setProfile: (profile: Profile | null) => void;
  
  // UI state
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  
  // Filters
  jobFilters: {
    search: string;
    type: string;
    location: string;
  };
  setJobFilters: (filters: any) => void;
}

export const useStore = create<StoreState>((set) => ({
  // User
  currentUser: null,
  setCurrentUser: (user) => set({ currentUser: user }),
  
  // Jobs
  jobs: [],
  setJobs: (jobs) => set({ jobs }),
  addJob: (job) => set((state) => ({ jobs: [...state.jobs, job] })),
  updateJob: (id, updatedJob) =>
    set((state) => ({
      jobs: state.jobs.map((job) => (job.id === id ? { ...job, ...updatedJob } : job)),
    })),
  deleteJob: (id) => set((state) => ({ jobs: state.jobs.filter((job) => job.id !== id) })),
  
  // Applications
  applications: [],
  setApplications: (applications) => set({ applications }),
  addApplication: (application) =>
    set((state) => ({ applications: [...state.applications, application] })),
  updateApplication: (id, updatedApplication) =>
    set((state) => ({
      applications: state.applications.map((app) =>
        app.id === id ? { ...app, ...updatedApplication } : app
      ),
    })),
  
  // Profile
  profile: null,
  setProfile: (profile) => set({ profile }),
  
  // UI
  isLoading: false,
  setIsLoading: (loading) => set({ isLoading: loading }),
  
  // Filters
  jobFilters: {
    search: '',
    type: '',
    location: '',
  },
  setJobFilters: (filters) =>
    set((state) => ({ jobFilters: { ...state.jobFilters, ...filters } })),
}));