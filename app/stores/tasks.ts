import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { getCurrentUser } from "vuefire";
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
  const toast = useToast();

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

  async function getAuthHeaders() {
    const user = await getCurrentUser();
    if (!user) {
      throw createError({
        statusCode: 401,
        message: "User not authenticated",
      });
    }
    const token = await user.getIdToken();
    return {
      Authorization: `Bearer ${token}`,
    };
  }

  async function fetchTasks() {
    isLoading.value = true;
    error.value = null;
    try {
      const headers = await getAuthHeaders();
      const response = await $fetch<Task[]>("/api/tasks", {
        headers,
      });
      tasks.value = response;
    } catch (e) {
      error.value = "Failed to fetch tasks";
      console.error("Error fetching tasks:", e);
      toast.add({
        title: "Error",
        description: "Failed to fetch tasks. Please try again.",
        color: "error",
      });
    } finally {
      isLoading.value = false;
    }
  }

  async function addTask(task: Omit<Task, "id" | "createdAt" | "updatedAt">) {
    isLoading.value = true;
    error.value = null;
    try {
      const headers = await getAuthHeaders();
      const newTask = await $fetch<Task>("/api/tasks", {
        method: "POST",
        body: task,
        headers,
      });
      tasks.value.unshift(newTask);
      toast.add({
        title: "Task Created",
        description: `"${task.title}" has been created successfully`,
        color: "success",
      });
    } catch (e) {
      error.value = "Failed to create task";
      console.error("Error creating task:", e);
      toast.add({
        title: "Error",
        description: `Failed to create task "${task.title}". Please try again.`,
        color: "error",
      });
      throw e;
    } finally {
      isLoading.value = false;
    }
  }

  async function updateTask(task: Task) {
    isLoading.value = true;
    error.value = null;

    try {
      const headers = await getAuthHeaders();
      const updatedTask = await $fetch<Task>("/api/tasks", {
        method: "PATCH",
        body: task,
        headers,
      });

      const taskIndex = tasks.value.findIndex((t) => t.id === updatedTask.id);
      if (taskIndex !== -1) {
        tasks.value[taskIndex] = updatedTask;
      }

      toast.add({
        title: "Task Updated",
        description: `"${task.title}" has been updated successfully`,
        color: "success",
      });

      return updatedTask;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to update task";
      error.value = errorMessage;
      toast.add({
        title: "Error",
        description: `Failed to update task "${task.title}". Please try again.`,
        color: "error",
      });
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  async function deleteTask(taskId: string) {
    error.value = null;

    const taskIndex = tasks.value.findIndex((t) => t.id === taskId);
    if (taskIndex === -1) {
      error.value = "Task not found";
      toast.add({
        title: "Error",
        description: "Task not found",
        color: "error",
      });
      return;
    }

    const deletedTask = tasks.value[taskIndex];
    if (!deletedTask) return;

    tasks.value = tasks.value.filter((t) => t.id !== taskId);

    try {
      const headers = await getAuthHeaders();
      await $fetch(`/api/tasks/${taskId}`, {
        method: "DELETE",
        headers,
      });
      toast.add({
        title: "Task Deleted",
        description: `"${deletedTask.title}" has been deleted successfully`,
        color: "success",
      });
    } catch (err) {
      tasks.value = [
        ...tasks.value.slice(0, taskIndex),
        deletedTask,
        ...tasks.value.slice(taskIndex),
      ];
      error.value =
        err instanceof Error ? err.message : "Failed to delete task";
      toast.add({
        title: "Error",
        description: `Failed to delete task "${deletedTask.title}". Please try again.`,
        color: "error",
      });
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
