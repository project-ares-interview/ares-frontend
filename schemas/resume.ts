export interface Resume {
  id: number;
  user: number;
  title: string;
  created_at: string;
  updated_at: string;
}

export interface Career {
  id: number;
  company_name: string;
  department: string;
  start_date: string; // date
  end_date?: string | null; // date
  is_current: boolean;
  responsibilities: string;
  task: string;
  experience_type: "newcomer" | "experienced";
  reason_for_leaving?: string | null;
}

export type SchoolType =
  | "elementary_school"
  | "middle_school"
  | "high_school"
  | "junior_college"
  | "university";

export type DegreeType = "associate" | "bachelor" | "master" | "doctorate";

export type EducationStatus =
  | "attending"
  | "graduated"
  | "completed"
  | "dropout";

export interface Education {
  id: number;
  school_name: string;
  major?: string | null;
  degree?: DegreeType | null;
  school_type: SchoolType;
  status: EducationStatus;
  admission_date: string; // date
  graduation_date?: string | null; // date
}

export interface Award {
  id: number;
  title: string;
  issuer: string;
  date_awarded: string; // date
}

export interface Language {
  id: number;
  language: string;
  proficiency: string;
}

export interface Link {
  id: number;
  title: string;
  url: string;
}

// For POST/PUT requests (without id)
export type ResumeCreate = Pick<Resume, "title">;
export type CareerCreate = Omit<Career, "id">;
export type EducationCreate = Omit<Education, "id">;
export type AwardCreate = Omit<Award, "id">;
export type LanguageCreate = Omit<Language, "id">;
export type LinkCreate = Omit<Link, "id">;

// For PATCH requests
export type ResumeUpdate = Partial<ResumeCreate>;
export type CareerUpdate = Partial<CareerCreate>;
export type EducationUpdate = Partial<EducationCreate>;
export type AwardUpdate = Partial<AwardCreate>;
export type LanguageUpdate = Partial<LanguageCreate>;
export type LinkUpdate = Partial<LinkCreate>;

// A full resume with all details
export interface FullResume extends Resume {
  careers: Career[];
  educations: Education[];
  awards: Award[];
  languages: Language[];
  links: Link[];
}
