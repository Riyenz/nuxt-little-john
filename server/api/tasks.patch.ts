import { z } from "zod";
import type { Task } from "~/types/task";
import { tasks } from "./tasks.get";

const taskUpdateSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Title is required").optional(),
  description: z.string().min(1, "Description is required").optional(),
  status: z.enum(["todo", "in-progress", "completed", "cancelled"]).optional(),
  priority: z.enum(["low", "medium", "high"]).optional(),
  dueDate: z.string().datetime().optional(),
  assignedTo: z.string().min(1, "Assignee is required").optional(),
});

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const validatedData = taskUpdateSchema.parse(body);

    const taskIndex = tasks.findIndex((task) => task.id === validatedData.id);
    if (taskIndex === -1) {
      throw createError({
        statusCode: 404,
        message: `Task with ID ${validatedData.id} not found`,
      });
    }

    const updatedTask: Task = {
      ...tasks[taskIndex],
      ...validatedData,
      updatedAt: new Date().toISOString(),
    };

    tasks[taskIndex] = updatedTask;

    return updatedTask;
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw createError({
        statusCode: 400,
        message: "Invalid task data",
        data: error.errors,
      });
    }

    throw createError({
      statusCode: 500,
      message: "Failed to update task",
    });
  }
});
