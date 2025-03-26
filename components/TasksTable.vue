<template>
  <UCard>
    <template #header>
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-semibold">Tasks</h3>
        <LazyTaskFormModal
          key="create-task"
          @task-created="pagination.pageIndex = 0"
        >
          <UButton icon="i-heroicons-plus" label="Add New Task" />
        </LazyTaskFormModal>
      </div>
    </template>

    <div class="space-y-4">
      <div class="flex items-center gap-4 pb-4">
        <UInput
          :model-value="
            table?.tableApi?.getColumn('title')?.getFilterValue() as string
          "
          class="max-w-sm"
          icon="i-heroicons-magnifying-glass"
          placeholder="Search tasks..."
          @update:model-value="
            table?.tableApi?.getColumn('title')?.setFilterValue($event)
          "
        />
        <USelect
          :model-value="
            table?.tableApi?.getColumn('status')?.getFilterValue() as string
          "
          class="w-40"
          placeholder="Filter by status"
          :items="statusOptions"
          @update:model-value="
            table?.tableApi?.getColumn('status')?.setFilterValue($event)
          "
        />
      </div>

      <UTable
        ref="table"
        v-model:pagination="pagination"
        v-model:column-filters="columnFilters"
        :data="sortedTasks"
        :columns="columns"
        :pagination-options="{
          getPaginationRowModel: getPaginationRowModel(),
        }"
      >
        <template #status-cell="{ row }">
          <UBadge
            :color="getStatusColor(row.getValue('status'))"
            :label="row.getValue('status')"
            size="sm"
            variant="subtle"
          />
        </template>

        <template #priority-cell="{ row }">
          <UBadge
            :color="getPriorityColor(row.getValue('priority'))"
            :label="row.getValue('priority')"
            size="sm"
            variant="subtle"
          />
        </template>

        <template #actions-cell="{ row }">
          <div class="flex items-center gap-2">
            <LazyTaskFormModal
              :key="`edit-task-${row.original.id}`"
              :task="row.original"
              mode="edit"
              @task-updated="handleTaskUpdated"
            >
              <UButton
                color="primary"
                variant="ghost"
                icon="i-heroicons-pencil-square"
                size="sm"
              />
            </LazyTaskFormModal>
            <UButton
              color="error"
              variant="ghost"
              icon="i-heroicons-trash"
              size="sm"
              @click="handleDeleteTask(row.original)"
            />
          </div>
        </template>

        <template #empty>
          <div class="flex flex-col-reverse items-center justify-center gap-4">
            <p class="font-semibold">No tasks found</p>
            <LazyTaskFormModal key="create-task">
              <UButton icon="i-heroicons-plus" label="Create My First Task" />
            </LazyTaskFormModal>
          </div>
        </template>
      </UTable>

      <div class="flex justify-center border-t border-(--ui-border) pt-4">
        <UPagination
          :default-page="
            (table?.tableApi?.getState().pagination.pageIndex || 0) + 1
          "
          :items-per-page="table?.tableApi?.getState().pagination.pageSize"
          :total="table?.tableApi?.getFilteredRowModel().rows.length"
          @update:page="(p) => table?.tableApi?.setPageIndex(p - 1)"
        />
      </div>
    </div>

    <UModal
      v-model:open="isDeleteModalOpen"
      :title="`Delete Task: ${taskToDelete?.title}`"
      :ui="{ footer: 'justify-end' }"
    >
      <template #body>
        <p>
          Are you sure you want to delete this task? This action cannot be
          undone.
        </p>
      </template>
      <template #footer>
        <UButton
          color="neutral"
          variant="soft"
          label="Cancel"
          @click="isDeleteModalOpen = false"
        />
        <UButton
          color="error"
          variant="solid"
          label="Delete"
          @click="confirmDeleteTask"
        />
      </template>
    </UModal>
  </UCard>
</template>

<script setup lang="ts">
import { getPaginationRowModel } from "@tanstack/vue-table";
import type { TableColumn } from "@nuxt/ui";
import { useTasksStore } from "~~/stores/tasks";
import type { Task } from "~~/types/task";

const table = useTemplateRef("table");
const tasks = useTasksStore();
const { dayTime } = useDayTime();

const columnFilters = ref([]);
const isDeleteModalOpen = ref(false);
const taskToDelete = ref<Task | null>(null);

const statusOptions = [
  { label: "All", value: null },
  { label: "To Do", value: "todo" },
  { label: "In Progress", value: "in-progress" },
  { label: "Completed", value: "completed" },
  { label: "Cancelled", value: "cancelled" },
];

const columns: TableColumn<Task>[] = [
  {
    accessorKey: "title",
    header: "Title",
    filterFn: (row, columnId, filterValue) => {
      const title = row.getValue(columnId) as string;
      return title.toLowerCase().includes(filterValue.toLowerCase());
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: "status-cell",
    filterFn: (row, columnId, filterValue) => {
      if (filterValue === null) return true;
      return row.getValue(columnId) === filterValue;
    },
  },
  {
    accessorKey: "priority",
    header: "Priority",
    cell: "priority-cell",
  },
  {
    accessorKey: "dueDate",
    header: "Due Date",
    cell: ({ row }) => formatDate(row.getValue("dueDate")),
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => formatDate(row.getValue("createdAt")),
  },
  {
    accessorKey: "actions",
    header: "Actions",
    cell: "actions-cell",
  },
];

const pagination = ref({
  pageIndex: 0,
  pageSize: 10,
});

const sortedTasks = computed(() => {
  return [...tasks.tasks].sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
});

function handleTaskUpdated() {
  isDeleteModalOpen.value = false;
}

function handleDeleteTask(task: Task) {
  taskToDelete.value = task;
  isDeleteModalOpen.value = true;
}

async function confirmDeleteTask() {
  if (!taskToDelete.value) return;

  try {
    await tasks.deleteTask(taskToDelete.value.id);

    const currentPage =
      table.value?.tableApi?.getState().pagination.pageIndex || 0;
    const totalPages = Math.ceil(
      tasks.tasks.length / pagination.value.pageSize
    );

    if (currentPage >= totalPages && currentPage > 0) {
      pagination.value.pageIndex = currentPage - 1;
    }
  } catch (error) {
    console.error("Failed to delete task:", error);
  } finally {
    isDeleteModalOpen.value = false;
    taskToDelete.value = null;
  }
}

function getStatusColor(
  status: Task["status"]
):
  | "error"
  | "primary"
  | "neutral"
  | "secondary"
  | "success"
  | "info"
  | "warning" {
  const colors: Record<
    Task["status"],
    | "error"
    | "primary"
    | "neutral"
    | "secondary"
    | "success"
    | "info"
    | "warning"
  > = {
    todo: "neutral",
    "in-progress": "info",
    completed: "success",
    cancelled: "error",
  };
  return colors[status];
}

function getPriorityColor(
  priority: Task["priority"]
):
  | "error"
  | "primary"
  | "neutral"
  | "secondary"
  | "success"
  | "info"
  | "warning" {
  const colors: Record<
    Task["priority"],
    | "error"
    | "primary"
    | "neutral"
    | "secondary"
    | "success"
    | "info"
    | "warning"
  > = {
    low: "success",
    medium: "warning",
    high: "error",
  };
  return colors[priority];
}

function formatDate(date: string): string {
  return dayTime(date).format("MMM D, YYYY");
}
</script>
