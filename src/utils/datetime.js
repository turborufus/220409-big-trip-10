import moment from 'moment';

export const DAYS_THROUGH = {
  AGO: `ago`,
  AFTER: `after`
};

export const getRandomDate = (startDate, endDate) => {
  return new Date(startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime()));
};

export const getDateDaysThrough = (dayCount, through) => {
  let date = new Date();
  switch (through) {
    case DAYS_THROUGH.AGO:
      date = moment(date).subtract(dayCount, `days`).toDate();
      break;
    case DAYS_THROUGH.AFTER:
      date = moment(date).add(dayCount, `days`).toDate();
      break;
  }

  return date;
};

export const calculateDuration = (start, stop) => {
  const momentStart = moment(start);
  const momentStop = moment(stop);
  if (momentStop.isAfter(momentStart)) {
    const diffDays = momentStop.diff(momentStart, `days`);
    momentStart.add(diffDays, `days`);

    const diffHours = momentStop.diff(momentStart, `hours`);
    momentStart.add(diffHours, `hours`);

    const diffMinutes = momentStop.diff(momentStart, `minutes`);

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

export const formatDateTime = (date, formatString) => {
  return moment(date).format(formatString);
};

export const isSame = (dateA, dateB, period) => {
  const a = moment(dateA);
  const b = moment(dateB);
  return a.isSame(b, period);
};

export const isDateAfter = (dateA, dateB) => {
  return moment(dateA).isAfter(dateB, `day`);
};

export const compareDates = (dateA, dateB) => {
  return dateA.getTime() - dateB.getTime();
};

export const getDayTimestamp = (date) => {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
};

