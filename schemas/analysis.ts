
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

export interface CoreCompetency {
  competency: string;
  assessment: string;
  evidence: string;
}

export interface ResumeFeedback {
  job_fit_assessment: string;
  strengths_and_opportunities: string;
  gaps_and_improvements: string;
}

export interface StrengthsWeaknessesItem {
  theme: string;
  evidence: string[];
}

export interface WeaknessesMatrixItem extends StrengthsWeaknessesItem {
  severity: string;
}

export interface ScoreAggregation {
  calibration: string;
}

export interface QuestionFeedback {
  question: string;
  evaluation: {
    applied_framework: string;
    feedback: string;
    evidence_quote?: string;
    model_answer?: string;
  };
}

export interface TextAnalysisReportData {
  overall_summary: string;
  interview_flow_rationale: string;
  strengths_matrix?: StrengthsWeaknessesItem[];
  weaknesses_matrix?: WeaknessesMatrixItem[];
  score_aggregation?: ScoreAggregation;
  missed_opportunities?: string[];
  potential_followups_global?: string[];
  resume_feedback: ResumeFeedback;
  hiring_recommendation?: 'hire' | 'no_hire';
  next_actions?: string[];
  question_by_question_feedback: QuestionFeedback[];
}
