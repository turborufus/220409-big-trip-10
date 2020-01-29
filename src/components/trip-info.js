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
  let tripCost = 0;
  if (points.length > 0) {
    const destinations = points.map((point) => {
      return point.destination.name;
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

    tripCost = points.map((point) => {
      const offers = Array.from(point.offers);
      const offersPrice = !offers.length ? 0 : offers.map((offer) => offer.price).reduce((price, it) => {
        return price + it;
      });
      return point.price + offersPrice;
    }).reduce((cost, price) => {
      return cost + price;
    });
  }

  return (`<section class="trip-main__trip-info  trip-info">
        <div class="trip-info__main">
          <h1 class="trip-info__title">${title}</h1>
          <p class="trip-info__dates">${infoDates}</p>
        </div>

        <p class="trip-info__cost">
          Total: &euro;&nbsp;<span class="trip-info__cost-value">${tripCost}</span>
        </p>
      </section>
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
