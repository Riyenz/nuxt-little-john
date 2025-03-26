<template>
  <div class="min-h-screen flex items-center justify-center">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold">
          Sign in to Little John
        </h2>
      </div>
      <div class="mt-8 space-y-6">
        <UButton
          :loading="loading"
          block
          color="neutral"
          variant="outline"
          class="relative"
          @click="signInWithGoogle"
        >
          <img
            class="absolute left-3 w-5 h-5"
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google logo"
          />
          <span>Continue with Google</span>
        </UButton>
        <UAlert
          v-if="error"
          color="red"
          variant="soft"
          title="Error"
          :description="error"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "default",
});

const { signInWithGoogle, loading, error } = useAuth();
</script>
