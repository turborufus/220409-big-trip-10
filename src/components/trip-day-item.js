import {formatDateTime} from "../utils/datetime.js";
import AbstractComponent from "./abstract-component.js";
import EventListComponent from "./events-list.js";

const createDayInfoMarkup = (dayInMilliseconds, counter) => {
  const isEmptyDay = dayInMilliseconds === 0;
  if (!isEmptyDay) {
    const date = new Date(dayInMilliseconds);
    const dateValue = formatDateTime(date, `DD-MM-YYYY`);
    const dateTitle = formatDateTime(date, `MMM D`).toUpperCase();

    return (`<span class="day__counter">${counter}</span>
      <time class="day__date" datetime="${dateValue}">${dateTitle}</time>`);
  } else {
    return ``;
  }
};

const createTripDayItemTemplate = (dayInMilliseconds, counter) => {
  const dayInfo = createDayInfoMarkup(dayInMilliseconds, counter);

  return (`
    <li class="trip-days__item  day">
      <div class="day__info">
        ${dayInfo}
      </div>
    </li>
  `);
};
export default class DayItem extends AbstractComponent {
  constructor(date, counter) {
    super();
    this._date = date;
    this._counter = counter;
    this._eventListComponent = new EventListComponent();
  }

  getTemplate() {
    const dateInMS = (this._date) ? this._date.getTime() : 0;
    return createTripDayItemTemplate(dateInMS, this._counter);
  }

  get date() {
    return this._date;
  }
}
