import type { Task } from "~/types/task";
import type { TaskAnalytics } from "~/types/analytics";
import { useDayTime } from "~/composables/useDayTime";
import type { Dayjs } from "dayjs";

export const useAnalytics = (tasks: Task[]): TaskAnalytics => {
  const { dayTime } = useDayTime();
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const today = dayTime();
  const lastWeek = Array.from({ length: 7 }, (_, i) => {
    return today.subtract(6 - i, "day");
  });

  const tasksByDay = lastWeek.map((date) => {
    return tasks.filter((task) => {
      const taskDate = dayTime(task.createdAt);
      return taskDate.isSame(date, "day") && task.status === "completed";
    }).length;
  });

  const tasksPerDayData = {
    labels: lastWeek.map((date) => days[date.day()]),
    datasets: [
      {
        label: "Completed Tasks",
        data: tasksByDay,
        backgroundColor: "#3B82F6",
      },
    ],
  };

  const statusCounts = tasks.reduce(
    (acc, task) => {
      const status =
        task.status === "in-progress"
          ? "In Progress"
          : task.status === "completed"
            ? "Completed"
            : task.status === "todo"
              ? "To Do"
              : "Pending";
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const taskStatusData = {
    labels: ["Completed", "In Progress", "To Do", "Pending"],
    datasets: [
      {
        data: [
          statusCounts["Completed"] || 0,
          statusCounts["In Progress"] || 0,
          statusCounts["To Do"] || 0,
          statusCounts["Pending"] || 0,
        ],
        backgroundColor: ["#10B981", "#3B82F6", "#F59E0B", "#EF4444"],
      },
    ],
  };

  const weeks = Array.from({ length: 4 }, (_, i) => {
    const weekStart = today.subtract(3 - i, "week");
    return {
      start: weekStart.startOf("week"),
      end: weekStart.endOf("week"),
    };
  });

  const getTasksByStatus = (
    start: Dayjs,
    end: Dayjs,
    status: Task["status"]
  ) => {
    return tasks.filter((task) => {
      const taskDate = dayTime(task.createdAt);
      return (
        taskDate.isBetween(start, end, "day", "[]") && task.status === status
      );
    }).length;
  };

  const weeklyTasksByStatus = weeks.map(({ start, end }) => ({
    completed: getTasksByStatus(start, end, "completed"),
    inProgress: getTasksByStatus(start, end, "in-progress"),
    todo: getTasksByStatus(start, end, "todo"),
  }));

  const weeklyProductivityData = {
    labels: weeks.map(({ start }) => start.format("MMM D")),
    datasets: [
      {
        label: "Completed",
        data: weeklyTasksByStatus.map((week) => week.completed),
        borderColor: "#10B981",
        backgroundColor: "#10B981",
        tension: 0.4,
        fill: false,
      },
      {
        label: "In Progress",
        data: weeklyTasksByStatus.map((week) => week.inProgress),
        borderColor: "#3B82F6",
        backgroundColor: "#3B82F6",
        tension: 0.4,
        fill: false,
      },
      {
        label: "To Do",
        data: weeklyTasksByStatus.map((week) => week.todo),
        borderColor: "#F59E0B",
        backgroundColor: "#F59E0B",
        tension: 0.4,
        fill: false,
      },
    ],
  };

  return {
    tasksPerDayData,
    taskStatusData,
    weeklyProductivityData,
  };
};
