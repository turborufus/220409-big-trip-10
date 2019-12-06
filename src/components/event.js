import {typePlaceholder} from "./const.js";
import {formatDate, formatTime, calculateDuration} from "../utils.js";

const createScheduleMarkup = (start, stop) => {
  const startDate = formatDate(start);
  const stopDate = formatDate(stop);
  const startTime = formatTime(start);
  const stopTime = formatTime(stop);
  const duration = calculateDuration(start, stop);
  return (
    `<div class="event__schedule">
      <p class="event__time">
      <time class="event__start-time" datetime="${startDate}">${startTime}</time>
      &mdash;
      <time class="event__end-time" datetime="${stopDate}">${stopTime}</time>
      </p>
      <p class="event__duration">${duration}</p>
    </div>`
  );
};

const createOffersMarkup = (offers) => {
  return offers
    .map((offer) => {
      return (`
        <li class="event__offer">
          <span class="event__offer-title">${offer.title}</span>
          &plus;
          &euro;&nbsp;<span class="event__offer-price">${offer.price}</span>
        </li>`
      );
    });
};

export const createTripEventItemTemplate = (event) => {
  const {type, destination, start, stop, price, offers} = event;
  const destName = destination.name;
  const schedule = createScheduleMarkup(start, stop);
  const offersMarkup = createOffersMarkup(Array.from(offers).slice(0, 3)).join(`\n`);
  const title = typePlaceholder[type] + destName;
  return (`
      <div class="event">
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
