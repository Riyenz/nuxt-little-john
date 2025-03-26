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

    const body = await readBody(event);
    const now = new Date().toISOString();

    const newTask: Task = {
      ...body,
      id: `task-${tasks.length + 1}`,
      createdAt: now,
      updatedAt: now,
      createdBy: userEmail,
    };

    tasks.push(newTask);
    return newTask;
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: "Failed to create task",
    });
  }
});
