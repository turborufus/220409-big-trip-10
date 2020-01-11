import {TYPE_PLACEHOLDER} from "../const.js";
import {formatDateTime, calculateDuration} from "../utils/datetime.js";
import AbstractComponent from "./abstract-component.js";

const createScheduleMarkup = (start, stop) => {
  const startDateTime = formatDateTime(start, `DD-MM-YYYYTHH:mm`);
  const stopDateTime = formatDateTime(stop, `DD-MM-YYYYTHH:mm`);
  const startTime = formatDateTime(start, `HH:mm`);
  const stopTime = formatDateTime(stop, `HH:mm`);
  const duration = calculateDuration(start, stop);

  return (
    `<div class="event__schedule">
      <p class="event__time">
      <time class="event__start-time" datetime="${startDateTime}">${startTime}</time>
      &mdash;
      <time class="event__end-time" datetime="${stopDateTime}">${stopTime}</time>
      </p>
      <p class="event__duration">${duration}</p>
    </div>`
  );
};

const createOffersMarkup = (offers) => {
  return offers
    .map((offer) => {
      return (`<li class="event__offer">
          <span class="event__offer-title">${offer.name}</span>
          &plus;
          &euro;&nbsp;<span class="event__offer-price">${offer.price}</span>
        </li>`
      );
    });
};

const createTripEventItemTemplate = (event) => {
  const {type, destination, start, stop, price, offers} = event;
  const schedule = createScheduleMarkup(start, stop);
  const offersMarkup = createOffersMarkup(Array.from(offers).slice(0, 3)).join(`\n`);
  const title = TYPE_PLACEHOLDER[type] + destination;
  return (`<div class="event">
        <div class="event__type">
            <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${title}</h3>
  
        ${schedule}

        <p class="event__price">
            &euro;&nbsp;<span class="event__price-value">${price}</span>
        </p>
  
        <h4 class="visually-hidden">Offers:</h4>
        <ul class="event__selected-offers">
          ${offersMarkup}
        </ul>
 
        <button class="event__rollup-btn" type="button">
            <span class="visually-hidden">Open event</span>
        </button>
      </div>
  `);
};

export default class Event extends AbstractComponent {
  constructor(event) {
    super();
    this._event = event;
  }

  getTemplate() {
    return createTripEventItemTemplate(this._event);
  }

  setRollupButtonHandler(handler) {
    this.getElement().querySelector(`.event__rollup-btn`)
      .addEventListener(`click`, handler);
  }
}
