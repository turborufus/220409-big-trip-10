import AbstractComponent from "./abstract-component.js";
import moment from "moment";

const createInfoDatesString = (start, stop) => {
  const momentStart = moment(start);
  const momentStop = moment(stop);
  if (momentStart.isSame(momentStop, `month`)) {
    return `${momentStart.format(`MMM D`).toUpperCase()}&nbsp;&mdash;&nbsp;${momentStop.format(`D`)}`;
  } else {
    const startDate = momentStart.format(`MMM D`).toUpperCase();
    const stopDate = momentStop.format(`MMM D`).toUpperCase();
    return `${startDate}&nbsp;&mdash;&nbsp;${stopDate}`;
  }
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
