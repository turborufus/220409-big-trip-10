import {formatDate} from "../utils";
import {MonthNames} from "../const";

export const createTripDayItemTemplate = (tripDay) => {
  const dateValue = formatDate(tripDay.date);
  const dateTitle = `${MonthNames[tripDay.date.getMonth()].toUpperCase()} ${tripDay.date.getDate()}`;
  return (`
      <li class="trip-days__item  day">
          <div class="day__info">
              <span class="day__counter">${tripDay.counter}</span>
              <time class="day__date" datetime="${dateValue}">${dateTitle}</time>
          </div>
      </li>
  `);
};
