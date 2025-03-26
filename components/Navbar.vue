<template>
  <header class="bg-white dark:bg-gray-700 shadow px-6 py-4 sticky top-0 z-40">
    <div
      class="flex items-center justify-between flex-row-reverse lg:flex-row lg:justify-end"
    >
      <button
        class="lg:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        @click="navigation.toggleSidebar"
      >
        <UIcon
          :name="
            navigation.isSidebarOpen
              ? 'i-heroicons-x-mark'
              : 'i-heroicons-bars-3'
          "
          class="w-6 h-6"
        />
      </button>
      <div class="flex items-center space-x-4">
        <div class="flex items-center gap-2">
          <img
            v-if="user?.photoURL"
            :src="user.photoURL"
            alt="DP"
            class="w-8 h-8 rounded-full object-cover bg-gray-200"
          />
          <div
            v-else
            class="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center"
          >
            <UIcon name="i-heroicons-user" class="w-5 h-5 text-gray-500" />
          </div>
          <span class="text-sm">{{ user?.displayName || "Guest" }}</span>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
const { user, logout } = useAuth();
const navigation = useNavigationStore();

const profileItems = computed(() => [
  [
    {
      label: "Profile",
      icon: "i-heroicons-user-circle",
      click: () => navigateTo("/profile"),
    },
    {
      label: "Settings",
      icon: "i-heroicons-cog-6-tooth",
      click: () => navigateTo("/settings"),
    },
  ],
  [
    {
      label: "Logout",
      icon: "i-heroicons-arrow-left-on-rectangle",
      click: logout,
    },
  ],
]);
</script>
