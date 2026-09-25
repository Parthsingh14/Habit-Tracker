"use client";

import { useMemo } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler,
  ChartOptions,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { SleepRecord } from "@/types/sleep";
import { formatDateISO } from "@/utils/date";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler);

interface SleepChartProps {
  records: SleepRecord[];
  days: number;
}

/** Builds the trailing `days`-day date range ending today, so the chart
 * always shows a continuous axis even for dates with no recorded sleep
 * (rendered as a gap rather than a misleading zero). */
function buildTrailingDates(days: number): string[] {
  const today = new Date();
  const dates: string[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    dates.push(formatDateISO(d.getFullYear(), d.getMonth() + 1, d.getDate()));
  }
  return dates;
}

export default function SleepChart({ records, days }: SleepChartProps) {
  const { labels, values } = useMemo(() => {
    const trailingDates = buildTrailingDates(days);
    const byDate = new Map(records.map((r) => [r.date, r.durationMinutes]));
    return {
      labels: trailingDates.map((d) => Number(d.slice(-2))),
      values: trailingDates.map((d) => {
        const minutes = byDate.get(d);
        return minutes != null ? Math.round((minutes / 60) * 10) / 10 : null;
      }),
    };
  }, [records, days]);

  const hasAnyData = values.some((v) => v != null);

  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    spanGaps: false,
    scales: {
      y: {
        min: 0,
        suggestedMax: 10,
        ticks: { stepSize: 2, color: "#5B6660", font: { size: 11 } },
        grid: { color: "#DCDFD9" },
        title: { display: true, text: "Hours", color: "#5B6660", font: { size: 11 } },
      },
      x: {
        ticks: { color: "#5B6660", font: { size: 11 } },
        grid: { display: false },
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: (ctx) => (ctx.parsed.y == null ? "No data" : `${ctx.parsed.y}h`),
        },
      },
    },
  };

  if (!hasAnyData) {
    return (
      <div className="flex h-48 items-center justify-center text-sm text-ink-faint">
        No sleep data yet - log tonight&apos;s sleep to start the chart.
      </div>
    );
  }

  return (
    <div className="h-48">
      <Line
        data={{
          labels,
          datasets: [
            {
              data: values,
              borderColor: "#2F6F4E",
              backgroundColor: "#E4EEE7",
              pointBackgroundColor: "#2F6F4E",
              pointRadius: 3,
              tension: 0.3,
              fill: true,
            },
          ],
        }}
        options={options}
      />
    </div>
  );
}
