import { until } from "@vueuse/core";

export default defineNuxtRouteMiddleware(async (to, from) => {
  const { user, isLoading } = useAuth();

  if (
    !user.value &&
    to.meta.layout === "authenticated" &&
    to.path !== "/login"
  ) {
    return navigateTo({
      path: "/login",
      query: {
        redirect: to.fullPath,
      },
    });
  }
});
