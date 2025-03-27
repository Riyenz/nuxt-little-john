<template>
  <div class="space-y-6">
    <h2 class="text-2xl font-semibold">Analytics</h2>

    <div
      v-if="tasksStore.isLoading"
      class="flex justify-center items-center min-h-[400px]"
    >
      <ULoadingBar />
    </div>

    <div
      v-else-if="tasksStore.error"
      class="flex justify-center items-center min-h-[400px]"
    >
      <UAlert :title="tasksStore.error" color="error" variant="solid" />
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <UCard>
        <template #header>
          <h3 class="text-lg font-medium">Tasks Completed Per Day</h3>
        </template>
        <div class="h-[300px]">
          <Bar :data="analytics.tasksPerDayData" :options="barOptions" />
        </div>
      </UCard>

      <UCard>
        <template #header>
          <h3 class="text-lg font-medium">Task Status Distribution</h3>
        </template>
        <div class="h-[300px] flex justify-center items-center">
          <Pie :data="analytics.taskStatusData" :options="pieOptions" />
        </div>
      </UCard>

      <UCard class="md:col-span-2">
        <template #header>
          <h3 class="text-lg font-medium">Weekly Productivity</h3>
        </template>
        <div class="h-[300px] w-full relative">
          <Line
            :data="analytics.weeklyProductivityData"
            :options="lineOptions"
            class="w-full h-full"
          />
        </div>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Bar, Line, Pie } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  ArcElement,
} from "chart.js";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  ArcElement
);

definePageMeta({
  layout: "authenticated",
});

const tasksStore = useTasksStore();
const analytics = computed(() => useAnalytics(tasksStore.tasks));

const barOptions = {
  responsive: true,
  scales: {
    y: {
      beginAtZero: true,
      min: 0,
    },
  },
  plugins: {
    legend: {
      display: false,
    },
  },
};

const lineOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      beginAtZero: true,
      min: 0,
    },
  },
  plugins: {
    legend: {
      position: "top" as const,
      display: true,
    },
  },
};

const pieOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const,
    },
  },
};
</script>
