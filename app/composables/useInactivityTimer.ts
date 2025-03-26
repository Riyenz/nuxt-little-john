import { ref, onMounted, onUnmounted } from "vue";

interface UseInactivityTimerOptions {
  timeoutMinutes?: number;
  warningMinutes?: number;
}

export function useInactivityTimer(options: UseInactivityTimerOptions = {}) {
  const { timeoutMinutes = 10, warningMinutes = 5 } = options;
  const toast = useToast();
  let inactivityTimeout: NodeJS.Timeout;
  let warningTimeout: NodeJS.Timeout;
  const isWarningShown = ref(false);

  function resetTimer() {
    if (isWarningShown.value) {
      toast.remove("inactivity-warning");
      isWarningShown.value = false;
    }
    clearTimeout(inactivityTimeout);
    clearTimeout(warningTimeout);

    warningTimeout = setTimeout(
      () => {
        isWarningShown.value = true;
        toast.add({
          id: "inactivity-warning",
          title: "Inactivity Warning",
          description: `You have been inactive for ${timeoutMinutes - warningMinutes} minutes. You will be logged out in ${warningMinutes} minutes.`,
          color: "warning",
          duration: warningMinutes * 60 * 1000,
          actions: [
            {
              label: "Stay Logged In",
              onClick: () => {
                resetTimer();
              },
            },
            {
              label: "Logout Now",
              onClick: () => {
                const auth = useAuth();
                auth.logout();
              },
            },
          ],
        });
      },
      (timeoutMinutes - warningMinutes) * 60 * 1000
    );

    inactivityTimeout = setTimeout(
      () => {
        if (!isWarningShown.value) {
          toast.add({
            id: "inactivity-logout",
            title: "Session Expired",
            description: "You have been logged out due to inactivity.",
            color: "error",
            duration: 5000,
          });
        }

        const auth = useAuth();
        auth.logout();
      },
      timeoutMinutes * 60 * 1000
    );
  }

  function setupInactivityDetection() {
    const events = [
      "mousedown",
      "mousemove",
      "keydown",
      "scroll",
      "touchstart",
      "click",
      "keypress",
    ];

    events.forEach((event) => {
      window.addEventListener(event, resetTimer, { passive: true });
    });

    resetTimer();

    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, resetTimer);
      });
      clearTimeout(inactivityTimeout);
      clearTimeout(warningTimeout);
    };
  }

  onMounted(() => {
    const cleanup = setupInactivityDetection();
    onUnmounted(cleanup);
  });

  return {
    resetTimer,
    isWarningShown,
  };
}
