import {
  Award,
  AwardCreate,
  AwardUpdate,
  Career,
  CareerCreate,
  CareerUpdate,
  Education,
  EducationCreate,
  EducationUpdate,
  FullResume,
  Language,
  LanguageCreate,
  LanguageUpdate,
  Link,
  LinkCreate,
  LinkUpdate,
  Resume,
  ResumeCreate,
  ResumeUpdate,
} from "../schemas/resume";
import api from "./api";

import {
  AnalysisInput,
  AnalysisResult,
} from "../schemas/analysis";

const BASE_URL = "/resumes/";

// --- Generic Factory for Nested Resources ---
const createNestedResourceService = <
  T,
  TCreate extends object,
  TUpdate extends object,
>(
  resource: string,
) => {
  const resourceUrl = (resumeId: number) => `${BASE_URL}${resumeId}/${resource}/`;
  const resourceDetailUrl = (resumeId: number, id: number) =>
    `${resourceUrl(resumeId)}${id}/`;

  return {
    getAll: async (resumeId: number): Promise<T[]> => {
      const response = await api.get<T[]>(resourceUrl(resumeId));
      return response.data;
    },
    getById: async (resumeId: number, id: number): Promise<T> => {
      const response = await api.get<T>(resourceDetailUrl(resumeId, id));
      return response.data;
    },
    create: async (resumeId: number, data: TCreate): Promise<T> => {
      const response = await api.post<T>(resourceUrl(resumeId), data);
      return response.data;
    },
    update: async (
      resumeId: number,
      id: number,
      data: TUpdate,
    ): Promise<T> => {
      const response = await api.put<T>(resourceDetailUrl(resumeId, id), data);
      return response.data;
    },
    partialUpdate: async (
      resumeId: number,
      id: number,
      data: TUpdate,
    ): Promise<T> => {
      const response = await api.patch<T>(
        resourceDetailUrl(resumeId, id),
        data,
      );
      return response.data;
    },
    delete: async (resumeId: number, id: number): Promise<void> => {
      await api.delete(resourceDetailUrl(resumeId, id));
    },
  };
};

// --- Resume Base Service ---
const resumeBaseService = {
  getAll: async (): Promise<Resume[]> => {
    const response = await api.get<Resume[]>(BASE_URL);
    return response.data;
  },
  getById: async (id: number): Promise<Resume> => {
    const response = await api.get<Resume>(`${BASE_URL}${id}/`);
    return response.data;
  },
  create: async (data: ResumeCreate): Promise<Resume> => {
    const response = await api.post<Resume>(BASE_URL, data);
    return response.data;
  },
  update: async (id: number, data: ResumeUpdate): Promise<Resume> => {
    const response = await api.put<Resume>(`${BASE_URL}${id}/`, data);
    return response.data;
  },
  delete: async (id: number): Promise<void> => {
    await api.delete(`${BASE_URL}${id}/`);
  },
};

// --- Combined Service ---
export const resumeService = {
  ...resumeBaseService,
  careers: createNestedResourceService<Career, CareerCreate, CareerUpdate>(
    "careers",
  ),
  educations: createNestedResourceService<
    Education,
    EducationCreate,
    EducationUpdate
  >("educations"),
  awards: createNestedResourceService<Award, AwardCreate, AwardUpdate>("awards"),
  languages: createNestedResourceService<
    Language,
    LanguageCreate,
    LanguageUpdate
  >("languages"),
  links: createNestedResourceService<Link, LinkCreate, LinkUpdate>("links"),

  getFullResume: async (id: number): Promise<FullResume> => {
    const resume = await resumeBaseService.getById(id);
    const [careers, educations, awards, languages, links] = await Promise.all([
      resumeService.careers.getAll(id),
      resumeService.educations.getAll(id),
      resumeService.awards.getAll(id),
      resumeService.languages.getAll(id),
      resumeService.links.getAll(id),
    ]);
    return { ...resume, careers, educations, awards, languages, links };
  },

  analyzeResume: async (data: AnalysisInput): Promise<AnalysisResult> => {
    const formData = new FormData();

    formData.append("company", JSON.stringify(data.company));

    if (data.jd_text) formData.append("jd_text", data.jd_text);
    if (data.resume_text) formData.append("resume_text", data.resume_text);
    if (data.research_text) formData.append("research_text", data.research_text);

    // Helper to append files as blobs with correct type
    const appendFileAsTypedBlob = async (
      fieldName: string,
      file: { uri: string; name: string; mimeType?: string } | null | undefined
    ) => {
      if (file) {
        try {
          const response = await fetch(file.uri);
          const blob = await response.blob();
          // Re-create blob with the correct mimeType to ensure it's set
          const typedBlob = new Blob([blob], { type: file.mimeType || 'application/octet-stream' });
          formData.append(fieldName, typedBlob, file.name);
        } catch (err) {
          console.error(`Failed to fetch and blob file: ${file.name}`, err);
          throw new Error(`Failed to process file: ${file.name}`);
        }
      }
    };

    // Append files using the helper
    await appendFileAsTypedBlob("jd_file", data.jd_file);
    await appendFileAsTypedBlob("resume_file", data.resume_file);
    await appendFileAsTypedBlob("research_file", data.research_file);

    const response = await api.post<AnalysisResult>(
      "/resume/analyze/",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return response.data;
  },
};
