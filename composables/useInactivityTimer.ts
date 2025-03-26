import { ref, onMounted, onUnmounted } from "vue";

export function useInactivityTimer(timeoutMinutes = 30) {
  const toast = useToast();
  let inactivityTimeout: NodeJS.Timeout;
  let warningTimeout: NodeJS.Timeout;
  const WARNING_BEFORE_TIMEOUT = 5; // Show warning 5 minutes before timeout
  const isWarningShown = ref(false);

  function resetTimer() {
    if (isWarningShown.value) {
      toast.remove("inactivity-warning");
      isWarningShown.value = false;
    }
    clearTimeout(inactivityTimeout);
    clearTimeout(warningTimeout);

    // Set warning timeout (5 minutes before inactivity timeout)
    warningTimeout = setTimeout(
      () => {
        isWarningShown.value = true;
        toast.add({
          id: "inactivity-warning",
          title: "Inactivity Warning",
          description: `You have been inactive for ${timeoutMinutes - WARNING_BEFORE_TIMEOUT} minutes. You will be logged out in ${WARNING_BEFORE_TIMEOUT} minutes.`,
          color: "warning",
          duration: WARNING_BEFORE_TIMEOUT * 60 * 1000, // Convert to milliseconds
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
                // Call your logout function here
                const auth = useAuth();
                auth.logout();
              },
            },
          ],
        });
      },
      (timeoutMinutes - WARNING_BEFORE_TIMEOUT) * 60 * 1000
    );

    // Set inactivity timeout
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
        // Call your logout function here
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

    // Initial timer setup
    resetTimer();

    // Cleanup function
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
