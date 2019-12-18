import {MONTH_NAMES} from "../const.js";
import AbstractComponent from "./abstract-component.js";

const createInfoDatesString = (start, stop) => {
  if (start.getMonth() === stop.getMonth()) {
    return `${MONTH_NAMES[start.getMonth()].toUpperCase()} ${start.getDate()}&nbsp;&mdash;&nbsp;${stop.getDate()}`;
  } else {
    const startDate = `${MONTH_NAMES[start.getMonth()].toUpperCase()} ${start.getDate()}`;
    const stopDate = `${MONTH_NAMES[stop.getMonth()].toUpperCase()} ${stop.getDate()}`;
    return `${startDate}&nbsp;&mdash;&nbsp;${stopDate}`;
  }
};

const createTripInfoTemplate = (events) => {
  let title = ``;
  let infoDates = ``;
  if (events.length > 0) {
    const destinations = events.map((event) => {
      return event.destination.name;
    });

    if (destinations.length > 3) {
      title = `${destinations[0]} &mdash; ...  &mdash; ${destinations[destinations.length - 1]}`;
    } else {
      title = destinations.reduce((accumulator, destination, i) => {
        accumulator += (i === 0) ? `${destination}` : ` &mdash; ${destination}`;
        return accumulator;
      });
    }

    const startDate = events[0].start;
    const stopDate = events[events.length - 1].stop;
    infoDates = createInfoDatesString(startDate, stopDate);
  }

  return (`<div class="trip-info__main">
          <h1 class="trip-info__title">${title}</h1>
          <p class="trip-info__dates">${infoDates}</p>
      </div>
  `);
};

export default class TripInfo extends AbstractComponent {
  constructor(events) {
    super();
    this._events = events;
  }

  getTemplate() {
    return createTripInfoTemplate(this._events);
  }

}
