export function formatViewers(num: number) {
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M";
  if (num >= 1_000) return (num / 1_000).toFixed(1) + "K";
  return num.toString();
}
export const formatEndsIn = (endsAt: string) => {
  if (!endsAt) return "";

  const end = new Date(endsAt).getTime();
  const now = Date.now();

  const diff = end - now;

  const absDiff = Math.abs(diff);

  const minutes = Math.floor(absDiff / (1000 * 60));
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  const formatted =
    hours > 0 ? `${hours}h ${remainingMinutes}m` : `${remainingMinutes}m`;

  return diff < 0 ? `Ended ${formatted} ago` : `Ends in ${formatted}`;
};
export const calculateProgress = (startsAt: string, endsAt: string) => {
  if (!startsAt || !endsAt) return 0;

  const start = new Date(startsAt).getTime();
  const end = new Date(endsAt).getTime();
  const now = Date.now();

  if (now <= start) return 0;
  if (now >= end) return 100;

  const total = end - start;
  const elapsed = now - start;

  return Math.min(100, Math.max(0, (elapsed / total) * 100));
};
