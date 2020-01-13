import AbstractComponent from "./abstract-component.js";
import {isSame, formatDateTime} from "../utils/datetime.js";

const createInfoDatesString = (start, stop) => {
  let startStr = ``;
  let stopStr = ``;
  if (isSame(start, stop, `month`)) {
    startStr = formatDateTime(start, `MMM D`).toUpperCase();
    stopStr = formatDateTime(stop, `D`);
  } else {
    startStr = formatDateTime(start, `MMM D`).toUpperCase();
    stopStr = formatDateTime(stop, `MMM D`).toUpperCase();
  }
  return `${startStr}&nbsp;&mdash;&nbsp;${stopStr}`;
};

const createTripInfoTemplate = (points) => {
  let title = ``;
  let infoDates = ``;
  if (points.length > 0) {
    const destinations = points.map((point) => {
      return point.destination;
    });

    if (destinations.length > 3) {
      title = `${destinations[0]} &mdash; ...  &mdash; ${destinations[destinations.length - 1]}`;
    } else {
      title = destinations.reduce((accumulator, destination, i) => {
        accumulator += (i === 0) ? `${destination}` : ` &mdash; ${destination}`;
        return accumulator;
      });
    }

    const startDate = points[0].start;
    const stopDate = points[points.length - 1].stop;
    infoDates = createInfoDatesString(startDate, stopDate);
  }

  return (`<div class="trip-info__main">
          <h1 class="trip-info__title">${title}</h1>
          <p class="trip-info__dates">${infoDates}</p>
      </div>
  `);
};

export default class TripInfo extends AbstractComponent {
  constructor(points) {
    super();
    this._points = points;
  }

  getTemplate() {
    return createTripInfoTemplate(this._points);
  }

}
