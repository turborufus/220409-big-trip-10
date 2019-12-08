export const getRandomArrayItem = (array) => {
  const randomIndex = getRandomIntegerNumber(0, array.length - 1);
  return array[randomIndex];
};

export const getRandomIntegerNumber = (min, max) => {
  return Math.floor(min + Math.random() * (max + 1 - min));
};


export const getRandomDate = (startDate, endDate) => {
  return new Date(startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime()));
};

export const getDateDaysAgo = (dayCount) => {
  const daysCountInMilliseconds = dayCount * 3600 * 1000 * 24;
  const date = new Date();
  date.setTime(date.getTime() - daysCountInMilliseconds);
  return date;
};

export const calculateDuration = (start, stop) => {
  if (start.getTime() < stop.getTime()) {
    const MillisecsInMinute = 1000 * 60;
    const MillisecsInHour = MillisecsInMinute * 60;
    const MillisecsInDay = MillisecsInHour * 24;

    const diff = stop.getTime() - start.getTime();
    const diffDays = Math.floor(diff / MillisecsInDay);
    const diffHours = Math.floor((diff % MillisecsInDay) / MillisecsInHour);
    const diffMinutes = Math.floor(((diff % MillisecsInDay) % MillisecsInHour) / MillisecsInMinute);

    const minutesStr = (diffMinutes < 10) ? `0${diffMinutes}M` : `${diffMinutes}M`;
    let daysStr = ``;
    let hoursStr = ``;

    if (diffDays > 0) {
      daysStr = (diffDays < 10) ? `0${diffDays}D ` : `${diffDays}D `;
      hoursStr = (diffHours < 10) ? `0${diffHours}H ` : `${diffHours}H `;
    } else {
      if (diffHours > 0) {
        hoursStr = (diffHours < 10) ? `0${diffHours}H ` : `${diffHours}H `;
      }
    }

    return `${daysStr}${hoursStr}${minutesStr}`;
  } else {
    return `00M`;
  }
};

export const formatDate = (date) => {
  const year = date.getFullYear();
  const month = (date.getMonth() < 9) ? `0${date.getMonth() + 1}` : `${date.getMonth() + 1}`;
  const day = (date.getDate() < 10) ? `0${date.getDate()}` : `${date.getDate()}`;

  return `${year}-${month}-${day}`;
};

export const formatTime = (date) => {
  const minute = (date.getMinutes() < 10) ? `0${date.getMinutes()}` : `${date.getMinutes()}`;
  const hour = (date.getHours() < 10) ? `0${date.getHours()}` : `${date.getHours()}`;
  return `${hour}:${minute}`;
};
