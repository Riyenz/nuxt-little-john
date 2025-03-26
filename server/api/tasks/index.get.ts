import type { Task } from "~~/types/task";

// In-memory storage for tasks (simulating a database)
export const tasks: Task[] = Array.from({ length: 50 }, (_, index) => {
  const statuses = ["todo", "in-progress", "completed", "cancelled"];
  const priorities = ["low", "medium", "high"];
  const emails = [
    "john@example.com",
    "jane@example.com",
    "bob@example.com",
    "alice@example.com",
  ];

  const createdAt = new Date();
  createdAt.setDate(createdAt.getDate() - Math.floor(Math.random() * 30));

  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + Math.floor(Math.random() * 14));

  return {
    id: `task-${index + 1}`,
    title: `Task ${index + 1}`,
    description: `This is a description for task ${index + 1}. It contains some details about what needs to be done.`,
    status: statuses[
      Math.floor(Math.random() * statuses.length)
    ] as Task["status"],
    priority: priorities[
      Math.floor(Math.random() * priorities.length)
    ] as Task["priority"],
    dueDate: dueDate.toISOString(),
    createdAt: createdAt.toISOString(),
    createdBy: emails[Math.floor(Math.random() * emails.length)],
    updatedAt: new Date().toISOString(),
  };
});

export default defineEventHandler(async (event) => {
  try {
    const userEmail = event.context.auth?.email;

    if (!userEmail) {
      throw createError({
        statusCode: 401,
        message: "Unauthorized: User email not found",
      });
    }

    const userTasks = tasks.filter((task) => task.createdBy === userEmail);

    return userTasks.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: "Failed to fetch tasks",
    });
  }
});
