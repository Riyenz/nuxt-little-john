import type { Task } from "~~/types/task";
import { tasks } from "./index.get";

export default defineEventHandler(async (event) => {
  try {
    const userEmail = event.context.auth?.email;

    if (!userEmail) {
      throw createError({
        statusCode: 401,
        message: "Unauthorized: User email not found",
      });
    }

    const id = getRouterParam(event, "id");
    const body = await readBody(event);
    const taskIndex = tasks.findIndex((t) => t.id === id);

    if (taskIndex === -1) {
      throw createError({
        statusCode: 404,
        message: "Task not found",
      });
    }

    // Verify task ownership
    if (tasks[taskIndex].createdBy !== userEmail) {
      throw createError({
        statusCode: 403,
        message: "Forbidden: You can only update your own tasks",
      });
    }

    const updatedTask: Task = {
      ...tasks[taskIndex],
      ...body,
      id, // Ensure we keep the original ID
      createdBy: userEmail, // Ensure we keep the original creator
      updatedAt: new Date().toISOString(),
    };

    tasks[taskIndex] = updatedTask;
    return updatedTask;
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: "Failed to update task",
    });
  }
});
