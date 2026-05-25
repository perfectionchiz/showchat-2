const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

type DOB = {
  day: string;
  month: string;
  year: string;
};

export const formatDOB = (dob: DOB) => {
  const monthIndex = months.indexOf(dob.month);

  if (monthIndex === -1) {
    throw new Error("Invalid month provided");
  }

  const formattedMonth = (monthIndex + 1).toString().padStart(2, "0");
  const formattedDay = dob.day.padStart(2, "0");

  return `${dob.year}-${formattedMonth}-${formattedDay}`;
};
