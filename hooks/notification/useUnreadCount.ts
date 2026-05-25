import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";

export const useUnreadCount = () => {
  const queryClient = useQueryClient();
  const [count, setCount] = useState(0);

  const compute = () => {
    const data = queryClient.getQueryData<any>(["notifications"]);

    if (!data) return 0;

    const all = [
      ...(data.notifications?.today || []),
      ...(data.notifications?.earlier || []),
    ];

    return all.filter((n) => !n.read).length;
  };

  useEffect(() => {
    setCount(compute());
    const unsubscribe = queryClient.getQueryCache().subscribe(() => {
      setCount(compute());
    });

    return unsubscribe;
  }, [queryClient]);

  return { data: count };
};
