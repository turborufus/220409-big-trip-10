import {formatDate, createElement} from "../utils.js";
import {MONTH_NAMES} from "../const.js";

const createTripDayItemTemplate = (dayInMilliseconds, counter) => {
  const date = new Date(dayInMilliseconds);
  const dateValue = formatDate(date);
  const dateTitle = `${MONTH_NAMES[date.getMonth()].toUpperCase()} ${date.getDate()}`;
  return (`
      <li class="trip-days__item  day">
          <div class="day__info">
              <span class="day__counter">${counter}</span>
              <time class="day__date" datetime="${dateValue}">${dateTitle}</time>
          </div>
      </li>
  `);
};
export default class {
  constructor(date, counter) {
    this._date = date;
    this._counter = counter;
    this._element = null;
  }

  getTemplate() {
    return createTripDayItemTemplate(this._date.getTime(), this._counter);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate);
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
