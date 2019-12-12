export const generateTripDay = (date) => {
  const dayInMilliseconds = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
  return dayInMilliseconds;
};

export const generateTripDays = (dates) => {
  return new Set(dates
    .map((date) => generateTripDay(date)));
};
