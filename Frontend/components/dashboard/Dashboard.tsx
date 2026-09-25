"use client";

import { useState } from "react";
import MonthSelector from "@/components/dashboard/MonthSelector";
import TrackerTable from "@/components/tracker/TrackerTable";
import SleepTracker from "@/components/sleep/SleepTracker";
import MonthlyNotes from "@/components/notes/MonthlyNotes";
import Toast from "@/components/common/Toast";
import { useToast } from "@/hooks/useToast";
import { getCurrentMonthYear, shiftMonth } from "@/utils/date";

export default function Dashboard() {
  const [{ month, year }, setMonthYear] = useState(getCurrentMonthYear());
  const { toast, showToast, dismissToast } = useToast();

  const goToPrevious = () => setMonthYear(shiftMonth(month, year, -1));
  const goToNext = () => setMonthYear(shiftMonth(month, year, 1));
  const goToToday = () => setMonthYear(getCurrentMonthYear());

  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col gap-5 px-4 py-6 sm:px-6">
      <div className="flex flex-col gap-1">
        <p className="text-sm font-medium text-ink-muted">Personal Tracker</p>
        <MonthSelector
          month={month}
          year={year}
          onPrevious={goToPrevious}
          onNext={goToNext}
          onToday={goToToday}
        />
      </div>

      <TrackerTable month={month} year={year} onFeedback={showToast} />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <SleepTracker onFeedback={showToast} />
        <MonthlyNotes month={month} year={year} />
      </div>

      <Toast toast={toast} onDismiss={dismissToast} />
    </main>
  );
}
