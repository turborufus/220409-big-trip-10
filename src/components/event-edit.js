import {generateOffers} from "../mock/offer.js";
import {TRANSER_TYPES, ACTIVITY_TYPES, TYPE_PLACEHOLDER, DESTINATIONS} from "../const.js";
import {formatTime} from "../utils/datetime.js";
import AbstractComponent from "./abstract-component.js";

const createEventTypeItemMarkup = (type, isChecked) => {
  return (`
    <div class="event__type-item">
      <input id="event-type-${type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}" ${isChecked ? `checked` : ``} >
      <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-1">${type}</label>
    </div>
  `);
};

const createDestinationListMarkup = (destinations) => {
  return destinations
    .map((destination) => {
      return (`
        <option value="${destination}"></option>
      `);
    });
};

const formatDateValue = (date) => {
  return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear() % 1000 % 100} ${formatTime(date)}`;
};

const createTimeMarkup = (start, stop) => {
  const startValue = formatDateValue(start);
  const stopValue = formatDateValue(stop);
  return (`<label class="visually-hidden" for="event-start-time-1">
      From
    </label>
    <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${startValue}">
    &mdash;
    <label class="visually-hidden" for="event-end-time-1">
      To
    </label>
    <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${stopValue}">
  `);
};

const createPriceMarkup = (price) => {
  return (`<label class="event__label" for="event-price-1">
      <span class="visually-hidden">Price</span>
      &euro;
    </label>
    <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${price}">
  `);
};

const createOfferMarkup = (offer, isChecked) => {
  const {type, name, price} = offer;
  return (`<div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="event-offer-${type}-1" type="checkbox" name="event-offer-${type}" ${isChecked ? `checked` : ``}>
      <label class="event__offer-label" for="event-offer-${type}-1">
          <span class="event__offer-title">${name}</span>
          &plus;
          &euro;&nbsp;<span class="event__offer-price">${price}</span>
      </label>
    </div>
  `);
};

const createPhotosMarkup = (photoURLs) => {
  return photoURLs
    .map((photoURL) => {
      return (
        `<img class="event__photo" src="${photoURL}" alt="Event photo">`
      );
    });
};

const createTripEventEditTemplate = (event) => {
  const {type, destination, start, stop, price, offers: selectedOffers} = event;
  const {name: destName, description, imgURLs} = destination;
  const availableOffers = generateOffers();
  const transferTypesGroupMarkup = TRANSER_TYPES.map((it) => createEventTypeItemMarkup(it, it === type)).join(`\n`);
  const activityTypesGroupMarkup = ACTIVITY_TYPES.map((it) => createEventTypeItemMarkup(it, it === type)).join(`\n`);
  const destinationList = createDestinationListMarkup(DESTINATIONS).join(`\n`);
  const timeMarkup = createTimeMarkup(start, stop);
  const priceMarkup = createPriceMarkup(price);
  const offersMarkup = availableOffers.map((offer) => createOfferMarkup(offer, Array.from(selectedOffers)
    .map((it) => {
      return it.name;
    }).includes(offer.name))).join(`\n`);
  const photosMarkup = createPhotosMarkup(imgURLs).join(`\n`);

  return (`<form class="trip-events__item  event  event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

          <div class="event__type-list">
            <fieldset class="event__type-group">
                <legend class="visually-hidden">Transfer</legend>
                ${transferTypesGroupMarkup}
            </fieldset>

            <fieldset class="event__type-group">
                <legend class="visually-hidden">Activity</legend>
                ${activityTypesGroupMarkup}
            </fieldset>
          </div>
        </div>

        <div class="event__field-group  event__field-group--destination">
        <label class="event__label  event__type-output" for="event-destination-1">
            ${TYPE_PLACEHOLDER[type]}
        </label>
        <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destName}" list="destination-list-1">
        <datalist id="destination-list-1">
          ${destinationList}
        </datalist>
        </div>

        <div class="event__field-group  event__field-group--time">
          ${timeMarkup}
        </div>

        <div class="event__field-group  event__field-group--price">
          ${priceMarkup}
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
        <button class="event__reset-btn" type="reset">Cancel</button>
      </header>

      <section class="event__details">

        <section class="event__section  event__section--offers">
          <h3 class="event__section-title  event__section-title--offers">Offers</h3>

          <div class="event__available-offers">
            ${offersMarkup}
          </div>
        </section>

        <section class="event__section  event__section--destination">
        <h3 class="event__section-title  event__section-title--destination">Destination</h3>
        <p class="event__destination-description">${description}</p>

        <div class="event__photos-container">
            <div class="event__photos-tape">
            ${photosMarkup}
            </div>
        </div>
        </section>
      </section>
    </form>
  `);
};

export default class EventEdit extends AbstractComponent {
  constructor(event) {
    super();
    this._event = event;
  }

  getTemplate() {
    return createTripEventEditTemplate(this._event);
  }
}
