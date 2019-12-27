import {MS} from "../const.js";

export const DAYS_THROUGH = {
  AGO: `ago`,
  AFTER: `after`
};

export const getRandomDate = (startDate, endDate) => {
  return new Date(startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime()));
};

export const getDateDaysThrough = (dayCount, through) => {
  const daysCountInMilliseconds = dayCount * MS.IN_DAY;
  const date = new Date();
  switch (through) {
    case DAYS_THROUGH.AGO:
      date.setTime(date.getTime() - daysCountInMilliseconds);
      break;
    case DAYS_THROUGH.AFTER:
      date.setTime(date.getTime() + daysCountInMilliseconds);
      break;
  }

  return date;
};

export const calculateDuration = (start, stop) => {
  if (start.getTime() < stop.getTime()) {
    const diff = stop.getTime() - start.getTime();
    const diffDays = Math.floor(diff / MS.IN_DAY);
    const diffHours = Math.floor((diff % MS.IN_DAY) / MS.IN_HOUR);
    const diffMinutes = Math.floor(((diff % MS.IN_DAY) % MS.IN_HOUR) / MS.IN_MINUTE);

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
