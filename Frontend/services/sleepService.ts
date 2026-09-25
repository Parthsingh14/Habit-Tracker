import { apiClient } from "@/services/api";
import { API_ENDPOINTS, SLEEP_HISTORY_DAYS } from "@/constants/api";
import { SaveSleepPayload, SleepRecord } from "@/types/sleep";

export const sleepService = {
  async getRecentSleep(days: number = SLEEP_HISTORY_DAYS): Promise<SleepRecord[]> {
    const { data } = await apiClient.get<SleepRecord[]>(API_ENDPOINTS.SLEEP, {
      params: { days },
    });
    return data;
  },

  async saveSleep(payload: SaveSleepPayload): Promise<SleepRecord> {
    const { data } = await apiClient.post<SleepRecord>(API_ENDPOINTS.SLEEP, payload);
    return data;
  },
};
