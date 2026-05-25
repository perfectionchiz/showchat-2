import { useEffect, useState } from "react";

export function useShowProgress(startsAt: string, endsAt: string) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const compute = () => {
      const now = Date.now();
      const start = new Date(startsAt).getTime();
      const end = new Date(endsAt).getTime();
      const duration = end - start;
      if (duration <= 0) return 0;
      return Math.min(100, Math.max(0, ((now - start) / duration) * 100));
    };

    setProgress(compute());
    const interval = setInterval(() => setProgress(compute()), 10000);
    return () => clearInterval(interval);
  }, [startsAt, endsAt]);

  return progress;
}
