import type { Task } from "~/types/task";
import { tasks } from "../tasks.get";

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, "id");
    if (!id) {
      throw createError({
        statusCode: 400,
        message: "Task ID is required",
      });
    }

    // Find the task to delete
    const taskIndex = tasks.findIndex((task) => task.id === id);
    if (taskIndex === -1) {
      throw createError({
        statusCode: 404,
        message: `Task with ID ${id} not found`,
      });
    }

    // Remove the task
    tasks.splice(taskIndex, 1);

    return { success: true };
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: "Failed to delete task",
    });
  }
});
