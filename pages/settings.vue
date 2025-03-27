<template>
  <div class="space-y-6">
    <UCard>
      <template #header>
        <h2 class="text-xl font-semibold">Profile Settings</h2>
      </template>
      <div class="space-y-6">
        <div class="flex items-center gap-4">
          <div class="relative">
            <img
              v-if="user?.photoURL"
              :src="user.photoURL"
              alt="Profile"
              class="w-24 h-24 rounded-full object-cover bg-gray-200"
            />
            <div
              v-else
              class="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center"
            >
              <UIcon name="i-heroicons-user" class="w-12 h-12 text-gray-500" />
            </div>
          </div>
          <div>
            <h3 class="font-medium">Profile Picture</h3>
            <p class="text-sm text-gray-500">
              Profile picture cannot be changed
            </p>
          </div>
        </div>

        <UForm
          class="space-y-4 flex-col flex"
          :schema="formSchema"
          :state="formState"
          @submit="updateUserProfile"
        >
          <UFormGroup label="Display Name" name="displayName">
            <ULabel>Display Name: </ULabel>
            <UInput v-model="formState.displayName" />
          </UFormGroup>

          <UFormGroup label="Email" name="email">
            <ULabel>Email: </ULabel>
            <UInput v-model="formState.email" type="email" disabled />
            <span class="text-sm text-gray-500 ml-2">
              Email cannot be changed
            </span>
          </UFormGroup>

          <div class="flex justify-end">
            <UButton type="submit" :loading="isUpdating" :disabled="isUpdating">
              Save Changes
            </UButton>
          </div>
        </UForm>
      </div>
    </UCard>

    <UCard>
      <template #header>
        <h2 class="text-xl font-semibold">Appearance</h2>
      </template>
      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="font-medium">Dark Mode</h3>
            <p class="text-sm text-gray-500">
              Toggle between light and dark theme
            </p>
          </div>
          <USwitch v-model="isDarkMode" />
        </div>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { z } from "zod";
import { updateProfile as firebaseUpdateProfile } from "firebase/auth";

definePageMeta({
  layout: "authenticated",
});

const { user } = useAuth();
const colorMode = useColorMode();
const toast = useToast();
const isUpdating = ref(false);

const formSchema = z.object({
  displayName: z.string().min(1, "Display name is required"),
  email: z.string().email("Invalid email").min(1, "Email is required"),
});

const formState = reactive({
  displayName: user.value?.displayName || "",
  email: user.value?.email || "",
});

const isDarkMode = computed({
  get: () => colorMode.value === "dark",
  set: (value) => {
    colorMode.preference = value ? "dark" : "light";
  },
});

async function updateUserProfile() {
  if (!user.value) return;

  try {
    isUpdating.value = true;
    await firebaseUpdateProfile(user.value, {
      displayName: formState.displayName,
    });

    toast.add({
      title: "Success",
      description: "Profile updated successfully",
      color: "success",
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    toast.add({
      title: "Error",
      description: "Failed to update profile",
      color: "error",
    });
  } finally {
    isUpdating.value = false;
  }
}
</script>
