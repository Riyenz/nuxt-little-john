import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { Task } from "~/types/task";

export const useTasksStore = defineStore("tasks", () => {
  const tasks = ref<Task[]>([]);
  const page = ref(1);
  const itemsPerPage = ref(10);
  const sortBy = ref<{ column: keyof Task; desc: boolean }>({
    column: "createdAt",
    desc: true,
  });
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const totalPages = computed(() =>
    Math.ceil(tasks.value.length / itemsPerPage.value)
  );

  const paginatedTasks = computed(() => {
    let sortedTasks = [...tasks.value];

    sortedTasks.sort((a, b) => {
      const aValue = a[sortBy.value.column];
      const bValue = b[sortBy.value.column];

      if (aValue < bValue) return sortBy.value.desc ? 1 : -1;
      if (aValue > bValue) return sortBy.value.desc ? -1 : 1;
      return 0;
    });

    const start = (page.value - 1) * itemsPerPage.value;
    const end = start + itemsPerPage.value;
    return sortedTasks.slice(start, end);
  });

  const totalTasks = computed(() => tasks.value.length);

  const inProgressTasks = computed(
    () => tasks.value.filter((task) => task.status === "in-progress").length
  );

  const completedTasks = computed(
    () => tasks.value.filter((task) => task.status === "completed").length
  );

  const overdueTasks = computed(() => {
    const today = new Date();
    return tasks.value.filter((task) => {
      const dueDate = new Date(task.dueDate);
      return (
        dueDate < today &&
        task.status !== "completed" &&
        task.status !== "cancelled"
      );
    }).length;
  });

  async function fetchTasks() {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await $fetch<Task[]>("/api/tasks");
      tasks.value = response;
    } catch (e) {
      error.value = "Failed to fetch tasks";
      console.error("Error fetching tasks:", e);
    } finally {
      isLoading.value = false;
    }
  }

  async function addTask(task: Omit<Task, "id" | "createdAt" | "updatedAt">) {
    isLoading.value = true;
    error.value = null;
    try {
      const newTask = await $fetch<Task>("/api/tasks", {
        method: "POST",
        body: task,
      });
      tasks.value.unshift(newTask);
    } catch (e) {
      error.value = "Failed to create task";
      console.error("Error creating task:", e);
      throw e;
    } finally {
      isLoading.value = false;
    }
  }

  async function updateTask(task: Task) {
    isLoading.value = true;
    error.value = null;

    try {
      const updatedTask = await $fetch<Task>("/api/tasks", {
        method: "PATCH",
        body: task,
      });

      // Update the task in the local array
      const taskIndex = tasks.value.findIndex((t) => t.id === updatedTask.id);
      if (taskIndex !== -1) {
        tasks.value[taskIndex] = updatedTask;
      }

      return updatedTask;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to update task";
      error.value = errorMessage;
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  async function deleteTask(taskId: string) {
    error.value = null;

    // Find the task and its index
    const taskIndex = tasks.value.findIndex((t) => t.id === taskId);
    if (taskIndex === -1) {
      error.value = "Task not found";
      return;
    }

    // Store the task and remove it immediately (optimistic)
    const deletedTask = tasks.value[taskIndex];
    tasks.value = tasks.value.filter((t) => t.id !== taskId);

    try {
      await $fetch(`/api/tasks/${taskId}`, {
        method: "delete",
      });
    } catch (err) {
      // Rollback on error - we know deletedTask exists since we found it earlier
      tasks.value = [
        ...tasks.value.slice(0, taskIndex),
        deletedTask as Task,
        ...tasks.value.slice(taskIndex),
      ];
      error.value =
        err instanceof Error ? err.message : "Failed to delete task";
      throw error.value;
    }
  }

  function updatePage(newPage: number) {
    page.value = newPage;
  }

  function updateSort(column: keyof Task) {
    if (sortBy.value.column === column) {
      sortBy.value.desc = !sortBy.value.desc;
    } else {
      sortBy.value = { column, desc: false };
    }
  }

  function updateItemsPerPage(items: number) {
    itemsPerPage.value = items;
    page.value = 1;
  }

  fetchTasks();

  return {
    tasks,
    page,
    itemsPerPage,
    sortBy,
    isLoading,
    error,
    totalPages,
    paginatedTasks,
    totalTasks,
    inProgressTasks,
    completedTasks,
    overdueTasks,
    fetchTasks,
    addTask,
    updateTask,
    deleteTask,
    updatePage,
    updateSort,
    updateItemsPerPage,
  };
});
