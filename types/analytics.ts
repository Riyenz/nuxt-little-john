import type { ChartData } from "chart.js";

export interface TaskAnalytics {
  tasksPerDayData: ChartData<"bar">;
  taskStatusData: ChartData<"pie">;
  weeklyProductivityData: ChartData<"line">;
}

export type TaskStatus = "completed" | "in-progress" | "pending";
export type TaskPriority = "low" | "medium" | "high";
