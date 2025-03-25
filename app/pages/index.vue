<template>
  <div class="space-y-6">
    <div>
      <p class="text-xl font-bold text-gray-700 dark:text-gray-300">
        Welcome, {{ user?.displayName }}
      </p>
      <p class="text-sm text-gray-700 dark:text-gray-300">
        {{ currentDate }}
      </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-base font-semibold">Total Tasks</h3>
            <UIcon name="i-heroicons-clipboard-document-list" class="w-5 h-5" />
          </div>
        </template>
        <p class="text-3xl font-bold">{{ dashboardData.totalTasks }}</p>
        <p class="text-sm text-gray-500">
          <span class="text-emerald-500"
            >↑ {{ dashboardData.taskIncrease }}%</span
          >
          vs last week
        </p>
      </UCard>

      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-base font-semibold">In Progress</h3>
            <UIcon name="i-heroicons-clock" class="w-5 h-5" />
          </div>
        </template>
        <p class="text-3xl font-bold">{{ dashboardData.inProgress }}</p>
        <p class="text-sm text-gray-500">Tasks being worked on</p>
      </UCard>

      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-base font-semibold">Completed Today</h3>
            <UIcon name="i-heroicons-check-circle" class="w-5 h-5" />
          </div>
        </template>
        <p class="text-3xl font-bold">{{ dashboardData.completedToday }}</p>
        <p class="text-sm text-gray-500">
          <span class="text-emerald-500"
            >↑ {{ dashboardData.completionRate }}%</span
          >
          completion rate
        </p>
      </UCard>

      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-base font-semibold">Overdue</h3>
            <UIcon
              name="i-heroicons-exclamation-circle"
              class="w-5 h-5 text-red-500"
            />
          </div>
        </template>
        <p class="text-3xl font-bold">{{ dashboardData.overdueTasks }}</p>
        <p class="text-sm text-gray-500">Tasks past due date</p>
      </UCard>
    </div>

    <TasksTable />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "authenticated",
});

const { user } = useAuth();
const { currentTime } = useDayTime();

const currentDate = currentTime("dddd, MMMM D h:mm A");

const dashboardData = reactive({
  totalTasks: 48,
  taskIncrease: 12,
  inProgress: 15,
  completedToday: 8,
  completionRate: 85,
  overdueTasks: 3,
});
</script>
