import { z } from "zod";
import type { Task } from "~/types/task";
import { tasks } from "./tasks.get";

const taskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  status: z.enum(["todo", "in-progress", "completed", "cancelled"]),
  priority: z.enum(["low", "medium", "high"]),
  dueDate: z.string().datetime(),
  assignedTo: z.string().min(1, "Assignee is required"),
});

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const validatedData = taskSchema.parse(body);

    const newTask: Task = {
      id: `task-${tasks.length + 1}`,
      ...validatedData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    tasks.unshift(newTask);

    return newTask;
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
      message: "Failed to create task",
    });
  }
});
