import {formatDate} from "../utils";
import {MonthNames} from "../const";

export const createTripDayItemTemplate = (dayInMilliseconds, counter) => {
  const date = new Date(dayInMilliseconds);
  const dateValue = formatDate(date);
  const dateTitle = `${MonthNames[date.getMonth()].toUpperCase()} ${date.getDate()}`;
  return (`
      <li class="trip-days__item  day">
          <div class="day__info">
              <span class="day__counter">${counter}</span>
              <time class="day__date" datetime="${dateValue}">${dateTitle}</time>
          </div>
      </li>
  `);
};
