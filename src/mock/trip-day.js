export const generateTripDay = (date, counter) => {
  return {
    date,
    counter
  };
};

export const generateTripDays = (dates) => {
  return dates
    .map((date, i) => generateTripDay(date, i + 1));
};
