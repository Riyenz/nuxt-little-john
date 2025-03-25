<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
const router = useRouter();
const route = useRoute();
const { user } = useAuth();

onMounted(() => {
  watch(user, (user, prevUser) => {
    if (prevUser && !user) {
      router.push("/login");
    } else if (user && typeof route.query.redirect === "string") {
      router.push(route.query.redirect);
    }
  });
});
</script>
