import {
    CoverLetter,
    CoverLetterCreate,
    CoverLetterUpdate,
} from "../schemas/coverLetter";
import api from "./api";

const BASE_URL = "/cover-letters/";

export const coverLetterService = {
  getAll: async (): Promise<CoverLetter[]> => {
    const response = await api.get<CoverLetter[]>(BASE_URL);
    return response.data;
  },

  getById: async (id: number): Promise<CoverLetter> => {
    const response = await api.get<CoverLetter>(`${BASE_URL}${id}/`);
    return response.data;
  },

  create: async (data: CoverLetterCreate): Promise<CoverLetter> => {
    const response = await api.post<CoverLetter>(BASE_URL, data);
    return response.data;
  },

  update: async (id: number, data: CoverLetterUpdate): Promise<CoverLetter> => {
    const response = await api.put<CoverLetter>(`${BASE_URL}${id}/`, data);
    return response.data;
  },

  partialUpdate: async (
    id: number,
    data: CoverLetterUpdate,
  ): Promise<CoverLetter> => {
    const response = await api.patch<CoverLetter>(`${BASE_URL}${id}/`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`${BASE_URL}${id}/`);
  },
};
