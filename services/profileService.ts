import api from "./api";

// --- Type Definitions ---

export type MilitaryServiceStatus =
  | "served"
  | "not_served"
  | "exempted"
  | "serving";

export interface MilitaryService {
  id: number;
  status: MilitaryServiceStatus;
}

export interface Patriot {
  id: number;
  patriot_code: string;
}

export type DisabilitySeverity = "mild" | "severe";

export interface Disability {
  id: number;
  disability_type: string;
  severity: DisabilitySeverity;
}

export type SchoolType =
  | "elementary_school"
  | "middle_school"
  | "high_school"
  | "junior_college"
  | "university";
export type EducationStatus = "attending" | "graduated" | "completed" | "dropout";

export type DegreeType = "associate" | "bachelor" | "master" | "doctorate";

export interface Education {
  id: number;
  school_type: SchoolType;
  school_name: string;
  major?: string | null;
  degree?: DegreeType | null;
  status: EducationStatus;
  admission_date: string; // YYYY-MM
  graduation_date?: string; // YYYY-MM
}

export type ExperienceType = "newcomer" | "experienced";

export interface Career {
  id: number;
  company_name: string;
  experience_type: ExperienceType;
  is_attending: boolean;
  start_date: string; // YYYY-MM-DD
  end_date?: string; // YYYY-MM-DD
  department?: string;
  responsibilities?: string;
  reason_for_leaving?: string;
  task: string;
}

export interface JobInterest {
  id: number;
  job_title: string;
}

// --- Generic Service Factory ---

const createProfileService = <T, C>(resource: string) => ({
  getAll: (): Promise<T[]> => api.get(`/profile/${resource}/`).then((res) => res.data),
  get: (id?: number): Promise<T> =>
    api.get(`/profile/${resource}/${id ?? ""}`).then((res) => res.data),
  create: (data: C): Promise<T> =>
    api.post(`/profile/${resource}/`, data).then((res) => res.data),
  update: (id: number, data: Partial<C>): Promise<T> =>
    api.patch(`/profile/${resource}/${id}/`, data).then((res) => res.data),
  put: (id: number, data: C): Promise<T> =>
    api.put(`/profile/${resource}/${id}/`, data).then((res) => res.data),
  delete: (id: number): Promise<void> =>
    api.delete(`/profile/${resource}/${id}/`).then((res) => res.data),
});

// --- API Service Instances ---

export const militaryServiceApi = createProfileService<
  MilitaryService,
  Omit<MilitaryService, "id">
>("military-services");
export const patriotApi = createProfileService<Patriot, Omit<Patriot, "id">>(
  "patriots",
);
export const disabilityApi = createProfileService<
  Disability,
  Omit<Disability, "id">
>("disabilities");
export const educationApi = createProfileService<
  Education,
  Omit<Education, "id">
>("educations");
export const careerApi = createProfileService<Career, Omit<Career, "id">>(
  "careers",
);
export const jobInterestApi = createProfileService<
  JobInterest,
  Omit<JobInterest, "id">
>("job-interests");
