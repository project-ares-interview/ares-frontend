import api from "./api";
import {
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

export const interviewService = {
  startInterview,
};
