export type RoomState = "LIVE" | "GRACE" | "CLOSED";
export function getRoomState(endsAt: string | number | Date): RoomState {
  const end = new Date(endsAt).getTime();
  const now = Date.now();

  const graceEnd = end + 30 * 1000;

  if (now < end) return "LIVE";
  if (now < graceEnd) return "GRACE";
  return "CLOSED";
}
