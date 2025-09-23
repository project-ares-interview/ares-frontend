
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

export interface StrengthsMatrixItem {
  theme: string;
  evidence: string[];
}

export interface WeaknessesMatrixItem {
  theme: string;
  severity: 'low' | 'medium' | 'high' | string;
  evidence: string[];
}

export interface ScoreAggregation {
  main_avg: Record<string, number>;
  ext_avg: Record<string, number>;
  calibration: string;
}

export interface QuestionEvaluation {
  applied_framework: string;
  scores_main: Record<string, number>;
  scores_ext: Record<string, number>;
  feedback: string;
  evidence_quote?: string;
}

export interface NcsItem {
  major_code: string;
  ability_level: string;
  detail_code: string;
  ability_name: string;
  element_name: string;
  middle_code: string;
  ability_code: string;
  knowledge: string | null;
  element_code: string;
  skills: string | null;
  minor_code: string;
  attitudes: string | null;
  source: string;
  doc_id: string;
  criteria_text: string;
  content_concat: string;
  updated_at: string;
  '@search.score': number;
  '@search.reranker_score': number | null;
  '@search.highlights': string | null;
  '@search.captions': string | null;
  _score: number | null;
}

export interface NcsContext {
  ncs: NcsItem[];
  ncs_query: string;
  jd_keywords: string[];
}

export interface FullResumeAnalysis {
  "심층분석": string;
  "교차분석": string;
  "정합성점검": string;
  "NCS요약": string;
  ncs_context: NcsContext;
}

export interface OriginalSourceDocuments {
  jd_context: string;
  resume_context: string;
  research_context: string;
}

export interface RubricItem {
  label: string;
  score: number;
  desc: string;
}

export interface InterviewPlanItem {
  question_type: string;
  question: string;
  followups: string[];
  expected_points: string[];
  rubric: RubricItem[];
  kpi?: string[];
}

export interface InterviewPlanStage {
  items: InterviewPlanItem[];
  stage: string;
}

export interface OriginalInterviewPlan {
  interview_plan: InterviewPlanStage[];
}

export interface QuestionFeedbackDetail {
  question_id: string;
  question: string;
  question_intent: string | null;
  evaluation: QuestionEvaluation;
  model_answer: string;
  coaching: Record<string, any>;
}

export interface QuestionByQuestionFeedbackItem {
  main_question_id: string;
  thematic_summary: string;
  details: QuestionFeedbackDetail[];
}

export interface TextAnalysisReportData {
  overall_summary: string;
  interview_flow_rationale: string;
  strengths_matrix: StrengthsMatrixItem[];
  weaknesses_matrix: WeaknessesMatrixItem[];
  score_aggregation: ScoreAggregation;
  missed_opportunities: string[];
  potential_followups_global: string[];
  full_resume_analysis: FullResumeAnalysis;
  hiring_recommendation: string;
  next_actions: string[];
  question_by_question_feedback: QuestionByQuestionFeedbackItem[];
  original_source_documents: OriginalSourceDocuments;
  original_interview_plan: OriginalInterviewPlan;
}
