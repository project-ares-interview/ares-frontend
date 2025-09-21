export interface InterviewStartRequest {
  jd_context: string;
  resume_context: string;
  research_context?: string;
  difficulty?: "easy" | "normal" | "hard";
  language?: "ko" | "en";
  interviewer_mode?: "team_lead" | "executive";
  meta?: {
    company_name: string;
    job_title: string;
    person_name?: string;
    division?: string;
    skills?: string[];
    jd_kpis?: string[];
  };
  ncs_context?: any; // Define more strictly if needed
}

export interface InterviewStartResponse {
  message: string;
  question: string;
  session_id: string;
  turn_label: string;
  context?: any;
  language: string;
  difficulty: string;
  interviewer_mode: string;
}

export interface InterviewAnswerRequest {
  session_id: string;
  question: string;
  answer: string;
}

export interface InterviewAnswerResponse {
  message: string;
}

export interface InterviewNextRequest {
  session_id: string;
}

export interface InterviewNextResponse {
  question: string | null;
  done: boolean;
}

