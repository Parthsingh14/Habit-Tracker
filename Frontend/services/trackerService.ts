import { apiClient } from "@/services/api";
import { API_ENDPOINTS } from "@/constants/api";
import {
  MonthlyTracker,
  ToggleEntryPayload,
  TrackerEntry,
} from "@/types/tracker";

export const trackerService = {
  async getMonthlyTracker(
    month: number,
    year: number,
  ): Promise<MonthlyTracker> {
    const { data } = await apiClient.get<MonthlyTracker>(
      API_ENDPOINTS.TRACKER,
      {
        params: { month, year },
      },
    );
    return data;
  },

  async toggleEntry(payload: ToggleEntryPayload): Promise<TrackerEntry> {
    console.log("Toggle entry payload:", payload);

    const { data } = await apiClient.post<TrackerEntry>(
      API_ENDPOINTS.TRACKER_TOGGLE,
      payload,
    );

    return data;
  },
};
