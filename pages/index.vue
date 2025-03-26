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

    <DynamicCards />

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
</script>
