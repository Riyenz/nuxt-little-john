<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
    <Sidebar />
    <div class="flex flex-col w-full">
      <Navbar />
      <Transition name="fade">
        <div
          v-if="navigation.isSidebarOpen"
          class="fixed inset-0 bg-gray-900/50 lg:hidden"
          @click="navigation.closeSidebar"
        />
      </Transition>
      <main class="flex-1 p-6 max-w-screen overflow-x-hidden">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useInactivityTimer } from "../composables/useInactivityTimer";

const navigation = useNavigationStore();

useInactivityTimer({ timeoutMinutes: 5, warningMinutes: 3 });
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
