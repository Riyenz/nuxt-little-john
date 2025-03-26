<script setup lang="ts">
import { useInactivityTimer } from "@/composables/useInactivityTimer";

const { user } = useAuth();

// Initialize inactivity timer with 30 minutes timeout
useInactivityTimer(30);

// Redirect to login if not authenticated
onMounted(() => {
  if (!user.value) {
    navigateTo("/login");
  }
});
</script>
