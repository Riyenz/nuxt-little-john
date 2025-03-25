import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export const useDayTime = () => {
  const time = ref(dayjs());
  const timer = ref<NodeJS.Timeout | null>(null);

  onMounted(() => {
    timer.value = setInterval(() => {
      time.value = dayjs();
    }, 60000);
  });

  onUnmounted(() => {
    if (timer.value) {
      clearInterval(timer.value);
    }
  });

  const currentTime = (format: string) => {
    return computed(() => time.value.format(format));
  };

  return {
    time,
    currentTime,
    dayTime: dayjs,
  };
};
