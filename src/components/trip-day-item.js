import {formatDate} from "../utils.js";
import {MONTH_NAMES} from "../const.js";
import AbstractComponent from "./abstract-component.js";

const createTripDayItemTemplate = (dayInMilliseconds, counter) => {
  const date = new Date(dayInMilliseconds);
  const dateValue = formatDate(date);
  const dateTitle = `${MONTH_NAMES[date.getMonth()].toUpperCase()} ${date.getDate()}`;
  return (`<li class="trip-days__item  day">
          <div class="day__info">
              <span class="day__counter">${counter}</span>
              <time class="day__date" datetime="${dateValue}">${dateTitle}</time>
          </div>
      </li>
  `);
};
export default class DayItem extends AbstractComponent {
  constructor(date, counter) {
    super();
    this._date = date;
    this._counter = counter;
  }

  getTemplate() {
    return createTripDayItemTemplate(this._date.getTime(), this._counter);
  }
}
