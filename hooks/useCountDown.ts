import { getTimeLeft } from "@/utils/getTimeSlot";
import { useEffect, useState } from "react";

export function useCountdown(target?: string | number | Date) {
  const [time, setTime] = useState(() => (target ? getTimeLeft(target) : null));

  useEffect(() => {
    if (!target) return;

    const interval = setInterval(() => {
      const next = getTimeLeft(target);
      setTime(next);

      if (next.total <= 0) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [target]);

  return time;
}
