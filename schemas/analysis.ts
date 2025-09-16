
import { DocumentPickerAsset } from "expo-document-picker";

export interface CompanyData {
  name: string;
  job_title: string;
  department?: string;
  location?: string;
  kpi?: string[];
  requirements?: string[];
}

export interface AnalysisInput {
  company: CompanyData;
  jd_file?: DocumentPickerAsset | null;
  jd_text?: string;
  resume_file?: DocumentPickerAsset | null;
  resume_text?: string;
  research_file?: DocumentPickerAsset | null;
  research_text?: string;
}

// Based on the backend response structure
export interface AnalysisResult {
  "심층분석": string;
  "교차분석": string;
  "정합성점검": string;
  "NCS요약": string;
  ncs_context: any; // Define more strictly if the structure is known
  input_contexts: {
    raw: {
      jd_context: string;
      resume_context: string;
      research_context: string;
    };
    refined: {
      jd_context: string;
      resume_context: string;
      research_context: string;
      meta: CompanyData;
      ncs_context: any;
    };
  };
}
