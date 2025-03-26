<template>
  <Transition name="slide">
    <aside
      v-show="navigation.isSidebarOpen || !isMobile"
      class="fixed lg:sticky h-dvh top-0 flex flex-col py-6 z-50 w-64 shrink-0 bg-gray-100 dark:bg-gray-800 transform lg:transform-none transition-transform duration-300"
    >
      <div class="px-4">
        <h1 class="text-xl font-bold">Little John</h1>
      </div>
      <nav class="mt-4 px-2">
        <UNavigationMenu :items="menuItems" orientation="vertical" />
      </nav>
      <div class="mt-auto px-4">
        <UButton
          block
          color="neutral"
          variant="outline"
          icon="i-heroicons-arrow-left-on-rectangle"
          @click="logout"
        >
          Logout
        </UButton>
      </div>
    </aside>
  </Transition>
</template>

<script setup lang="ts">
const { logout } = useAuth();
const navigation = useNavigationStore();

const isMobile = ref(false);
const abortController = new AbortController();

const menuItems = [
  [
    {
      label: "Navigation",
      type: "label",
    },
    {
      label: "Dashboard",
      icon: "i-heroicons-home",
      to: "/",
    },
    {
      label: "Analytics",
      icon: "i-heroicons-chart-bar",
      to: "/analytics",
    },
  ],
  [
    {
      label: "Settings",
      type: "label",
    },
    {
      label: "User Settings",
      icon: "i-heroicons-cog-6-tooth",
      to: "/settings",
    },
  ],
];

function updateIsMobile() {
  isMobile.value = window.innerWidth < 1024;
  if (!isMobile.value) {
    navigation.closeSidebar();
  }
}

onMounted(() => {
  updateIsMobile();
  window.addEventListener("resize", updateIsMobile, {
    signal: abortController.signal,
  });
});

onUnmounted(() => {
  abortController.abort();
});
</script>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(-100%);
}
</style>
