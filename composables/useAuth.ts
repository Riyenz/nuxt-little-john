import { signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";

export const useAuth = () => {
  const auth = useFirebaseAuth()!;
  const user = useCurrentUser();
  const isLoading = ref<boolean>(true);
  const error = ref<string | null>(null);

  watch(
    user,
    () => {
      isLoading.value = false;
    },
    { immediate: true }
  );

  const signInWithGoogle = async () => {
    try {
      isLoading.value = true;
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      await navigateTo("/");
    } catch (e: any) {
      error.value = e?.message || "Sign in failed";
    } finally {
      isLoading.value = false;
    }
  };

  const logout = async () => {
    try {
      isLoading.value = true;
      await signOut(auth);
      await navigateTo("/login");
    } catch (e: any) {
      error.value = e?.message || "Sign out failed";
    } finally {
      isLoading.value = false;
    }
  };

  return {
    user,
    isLoading,
    error,
    signInWithGoogle,
    logout,
  };
};
