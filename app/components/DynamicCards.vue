<template>
  <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <h3
            class="text-base font-semibold leading-6 text-gray-900 dark:text-white"
          >
            Total Tasks
          </h3>
          <UIcon
            name="i-heroicons-clipboard-document-list"
            class="h-5 w-5 text-gray-400"
          />
        </div>
      </template>
      <p class="text-2xl font-semibold text-gray-900 dark:text-white">
        {{ tasks.totalTasks }}
      </p>
      <p class="text-sm text-gray-500">Total tasks in the system</p>
    </UCard>

    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <h3
            class="text-base font-semibold leading-6 text-gray-900 dark:text-white"
          >
            In Progress
          </h3>
          <UIcon name="i-heroicons-arrow-path" class="h-5 w-5 text-blue-400" />
        </div>
      </template>
      <p class="text-2xl font-semibold text-gray-900 dark:text-white">
        {{ tasks.inProgressTasks }}
      </p>
      <p class="text-sm text-gray-500">Tasks currently in progress</p>
    </UCard>

    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <h3
            class="text-base font-semibold leading-6 text-gray-900 dark:text-white"
          >
            Completed
          </h3>
          <UIcon
            name="i-heroicons-check-circle"
            class="h-5 w-5 text-green-400"
          />
        </div>
      </template>
      <p class="text-2xl font-semibold text-gray-900 dark:text-white">
        {{ tasks.completedTasks }}
      </p>
      <p class="text-sm text-gray-500">Tasks completed successfully</p>
    </UCard>

    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <h3
            class="text-base font-semibold leading-6 text-gray-900 dark:text-white"
          >
            Overdue
          </h3>
          <UIcon name="i-heroicons-clock" class="h-5 w-5 text-red-400" />
        </div>
      </template>
      <p class="text-2xl font-semibold text-gray-900 dark:text-white">
        {{ tasks.overdueTasks }}
      </p>
      <p class="text-sm text-gray-500">Tasks past their due date</p>
    </UCard>
  </div>
</template>

<script setup lang="ts">
const tasks = useTasksStore();
</script>
