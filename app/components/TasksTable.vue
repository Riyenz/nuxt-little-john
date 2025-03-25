<template>
  <UCard>
    <template #header>
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-semibold">Tasks</h3>
        <TaskFormModal @task-created="pagination.pageIndex = 0">
          <UButton icon="i-heroicons-plus" label="Add New Task" />
        </TaskFormModal>
      </div>
    </template>

    <div class="space-y-4">
      <UTable
        ref="table"
        v-model:pagination="pagination"
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
  </UCard>
</template>

<script setup lang="ts">
import { getPaginationRowModel } from "@tanstack/vue-table";
import type { TableColumn } from "@nuxt/ui";
import { useTasksStore } from "~/stores/tasks";
import type { Task } from "~/types/task";

const table = useTemplateRef("table");
const tasks = useTasksStore();
const { dayTime } = useDayTime();

const columns: TableColumn<Task>[] = [
  {
    accessorKey: "id",
    header: "#",
    cell: ({ row }) => `#${row.getValue("id")}`,
  },
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: "status-cell",
  },
  {
    accessorKey: "priority",
    header: "Priority",
    cell: "priority-cell",
  },
  {
    accessorKey: "assignedTo",
    header: "Assigned To",
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

function getStatusColor(status: Task["status"]): string {
  const colors: Record<Task["status"], string> = {
    todo: "neutral",
    "in-progress": "info",
    completed: "success",
    cancelled: "error",
  };
  return colors[status];
}

function getPriorityColor(priority: Task["priority"]): string {
  const colors: Record<Task["priority"], string> = {
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
