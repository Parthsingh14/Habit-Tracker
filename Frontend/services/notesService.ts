import { apiClient } from "@/services/api";
import { API_ENDPOINTS } from "@/constants/api";
import { MonthlyNotes, UpdateNotesPayload } from "@/types/notes";

export const notesService = {
  async getNotes(month: number, year: number): Promise<MonthlyNotes> {
    const { data } = await apiClient.get<MonthlyNotes>(API_ENDPOINTS.NOTES, {
      params: { month, year },
    });
    return data;
  },

  async updateNotes(payload: UpdateNotesPayload): Promise<MonthlyNotes> {
    const { data } = await apiClient.put<MonthlyNotes>(API_ENDPOINTS.NOTES, payload);
    return data;
  },
};
