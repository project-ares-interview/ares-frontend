export interface CoverLetter {
  id: number;
  user: number;
  title: string;
  content: string;
  created_at: string;
}

export type CoverLetterCreate = Pick<CoverLetter, "title" | "content">;
export type CoverLetterUpdate = Partial<CoverLetterCreate>;
