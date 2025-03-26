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
    const taskIndex = tasks.findIndex((t) => t.id === id);

    if (taskIndex === -1) {
      throw createError({
        statusCode: 404,
        message: "Task not found",
      });
    }

    if (tasks[taskIndex].createdBy !== userEmail) {
      throw createError({
        statusCode: 403,
        message: "Forbidden: You can only delete your own tasks",
      });
    }

    tasks.splice(taskIndex, 1);
    return { success: true };
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: "Failed to delete task",
    });
  }
});
