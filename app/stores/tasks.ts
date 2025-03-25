import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { Task, TaskStatus, TaskPriority } from "~/types/task";

const mockTasks: Task[] = Array.from({ length: 50 }, (_, index) => {
  const statuses: TaskStatus[] = [
    "todo",
    "in-progress",
    "completed",
    "cancelled",
  ];
  const priorities: TaskPriority[] = ["low", "medium", "high"];
  const users = ["John Doe", "Jane Smith", "Bob Johnson", "Alice Brown"];

  const createdAt = new Date();
  createdAt.setDate(createdAt.getDate() - Math.floor(Math.random() * 30));

  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + Math.floor(Math.random() * 14));

  return {
    id: `task-${index + 1}`,
    title: `Task ${index + 1}`,
    description: `This is a description for task ${index + 1}. It contains some details about what needs to be done.`,
    status: statuses[Math.floor(Math.random() * statuses.length)] as TaskStatus,
    priority: priorities[
      Math.floor(Math.random() * priorities.length)
    ] as TaskPriority,
    dueDate: dueDate.toISOString(),
    createdAt: createdAt.toISOString(),
    assignedTo: users[Math.floor(Math.random() * users.length)] as string,
    updatedAt: new Date().toISOString(),
  };
});

export const useTasksStore = defineStore("tasks", () => {
  const tasks = ref<Task[]>(mockTasks);
  const page = ref(1);
  const itemsPerPage = ref(10);
  const sortBy = ref<{ column: keyof Task; desc: boolean }>({
    column: "createdAt",
    desc: true,
  });

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

  function addTask(task: Task) {
    tasks.value.unshift(task);
  }

  return {
    tasks,
    page,
    itemsPerPage,
    sortBy,
    totalPages,
    paginatedTasks,
    updatePage,
    updateSort,
    updateItemsPerPage,
    addTask,
  };
});
