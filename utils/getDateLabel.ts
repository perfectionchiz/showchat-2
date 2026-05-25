export const getDateLabel = (date: Date) => {
  const now = new Date();

  const diffDays = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24),
  );

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7)
    return date.toLocaleDateString("en-US", {
      weekday: "long",
    });

  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
  });
};
