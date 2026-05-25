import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import duration from "dayjs/plugin/duration";
dayjs.extend(relativeTime);

dayjs.extend(relativeTime);

export const formatTimeslot = (
  startTime?: string | null,
  endTime?: string | null,
) => {
  if (!startTime || !endTime) {
    return {
      timeslot: "",
      endsAt: "",
      dateLabel: "",
    };
  }

  const start = dayjs(startTime);
  const end = dayjs(endTime);
  const now = dayjs();

  let dateLabel = "";
  if (start.isSame(now, "day")) {
    dateLabel = "Today";
  } else {
    dateLabel = start.format("ddd");
  }

  const timeslot = `${start.format("h:mm A")} - ${end.format("h:mm A")}`;

  let endsAt = "";
  if (end.isAfter(now)) {
    endsAt = `ends ${end.fromNow()}`;
  } else {
    endsAt = "ended";
  }

  return {
    timeslot: `${dateLabel}, ${timeslot}`,
    endsAt,
    dateLabel,
  };
};

export const formatTime = (date?: Date | string | number | null) => {
  if (!date) return "";

  const d = dayjs(date);

  if (!d.isValid()) return "";

  return d.format("h:mm A");
};

dayjs.extend(duration);

dayjs.extend(duration);

export function getTimeLeft(targetDate: string | number | Date) {
  const end = dayjs(targetDate);

  if (!end.isValid()) {
    return {
      total: 0,
      expired: true,
      label: "Invalid",
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    };
  }

  const now = dayjs();
  const diff = end.diff(now);

  if (diff <= 0) {
    return {
      total: 0,
      expired: true,
      label: "Ended",
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    };
  }

  const dur = dayjs.duration(diff);

  const days = dur.days();
  const hours = dur.hours();
  const minutes = dur.minutes();
  const seconds = dur.seconds();

  let label = "";

  if (days > 0) label = `${days}d ${hours}h left`;
  else if (hours > 0) label = `${hours}h ${minutes}m left`;
  else if (minutes > 0) label = `${minutes}m ${seconds}s left`;
  else label = `${seconds}s left`;

  return {
    total: diff,
    expired: false,
    days,
    hours,
    minutes,
    seconds,
    label,
  };
}
