import { format, parseISO } from "date-fns";
import dayjs from "dayjs";
import calendar from "dayjs/plugin/calendar";

dayjs.extend(calendar);

export const formatTime = (date: string | Date) => {
  return dayjs(date).calendar(null, {
    sameDay: "[Today at] h:mm A",
    lastDay: "[Yesterday at] h:mm A",
    lastWeek: "MM/DD/YYYY",
    sameElse: "MM/DD/YYYY",
  });
};
export const formatISO = (dateString: string) => {
  if (!dateString) return null;
  try {
    return format(parseISO(dateString), "MMM d, yyyy");
  } catch (error) {
    return null;
  }
};
