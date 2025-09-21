import api from "./api";
import {
  InterviewAnswerRequest,
  InterviewAnswerResponse,
  InterviewNextRequest,
  InterviewNextResponse,
  InterviewStartRequest,
  InterviewStartResponse,
} from "../schemas/interview";

const startInterview = async (
  data: InterviewStartRequest
): Promise<InterviewStartResponse> => {
  const response = await api.post<InterviewStartResponse>(
    "/interviews/start/",
    data
  );
  return response.data;
};

const submitAnswer = async (
  data: InterviewAnswerRequest
): Promise<InterviewAnswerResponse> => {
  const response = await api.post<InterviewAnswerResponse>(
    "/interviews/answer/",
    data
  );
  return response.data;
};

const getNextQuestion = async (
  data: InterviewNextRequest
): Promise<InterviewNextResponse> => {
  const response = await api.post<InterviewNextResponse>(
    "/interviews/next/",
    data
  );
  return response.data;
};

export const interviewService = {
  startInterview,
  submitAnswer,
  getNextQuestion,
};
