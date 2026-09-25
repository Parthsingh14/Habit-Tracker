export interface MonthlyNotes {
  id: string;
  month: number;
  year: number;
  content: string;
  updatedAt: string;
}

export interface UpdateNotesPayload {
  month: number;
  year: number;
  content: string;
}
