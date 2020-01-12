import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import 'flatpickr/dist/themes/light.css';
import {generateOffers} from "../mock/offer.js";
import {generateDestination} from "../mock/destination.js";
import {TRANSER_TYPES, ACTIVITY_TYPES, TYPE_PLACEHOLDER, DESTINATIONS} from "../const.js";
import {formatDateTime} from "../utils/datetime.js";
import AbstractSmartComponent from "./abstract-smart-component.js";


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
  return formatDateTime(date, `DD/MM/yy HH:mm`);
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

const createPointDetailsMarkup = (point, availableOffers, destinationInfo) => {
  const hasDestination = !!destinationInfo;
  if (hasDestination) {
    const {description, imgURLs} = destinationInfo;
    const photosMarkup = createPhotosMarkup(imgURLs).join(`\n`);

    const offersMarkup = availableOffers.map((offer) => createOfferMarkup(offer, Array.from(point.offers)
    .map((it) => {
      return it.name;
    }).includes(offer.name))).join(`\n`);

    return (`
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
    `);

  } else {
    return (``);
  }
};

const createPointEditTemplate = (point, eventType, availableOffers, destinationInfo) => {
  const {type, start, stop, price, isFavorite} = point;
  const currentType = (eventType !== type) ? eventType : type;

  const destinationList = createDestinationListMarkup(DESTINATIONS).join(`\n`);
  const destName = destinationInfo ? destinationInfo.name : ``;

  const transferTypesGroupMarkup = TRANSER_TYPES.map((it) => createEventTypeItemMarkup(it, it === currentType)).join(`\n`);
  const activityTypesGroupMarkup = ACTIVITY_TYPES.map((it) => createEventTypeItemMarkup(it, it === currentType)).join(`\n`);

  const timeMarkup = createTimeMarkup(start, stop);
  const priceMarkup = createPriceMarkup(price);

  const pointDetailsMarkup = createPointDetailsMarkup(point, availableOffers, destinationInfo);

  return (`<form class="trip-events__item  event  event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${currentType}.png" alt="Event type icon">
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
            ${TYPE_PLACEHOLDER[currentType]}
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
        <input id="event-favorite-1" class="event__favorite-checkbox  visually-hidden" type="checkbox" name="event-favorite" ${isFavorite ? `checked` : ``}>
        <label class="event__favorite-btn" for="event-favorite-1">
          <span class="visually-hidden">Add to favorite</span>
          <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
            <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"></path>
          </svg>
        </label>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </header>

      ${pointDetailsMarkup}

    </form>
  `);
};

export default class PointEdit extends AbstractSmartComponent {
  constructor(point) {
    super();
    this._point = point;

    this._eventType = this._point.type;
    this._eventTypeOffers = generateOffers(this._eventType);
    this._destinationInfo = generateDestination(this._point.destination);

    this._submitHandler = null;
    this._favoriteButtonHandler = null;

    this._startFatpickr = null;
    this._endFlatpickr = null;

    this._subscribeOnEvents();
    this._applyFlatpickr();
  }

  getTemplate() {
    return createPointEditTemplate(this._point, this._eventType, this._eventTypeOffers, this._destinationInfo);
  }

  rerender() {
    super.rerender();

    this._applyFlatpickr();
  }

  setSaveButtonHandler(handler) {
    this.getElement().addEventListener(`submit`, handler);
    this._submitHandler = handler;
  }

  setResetButtonHandler(handler) {
    this.getElement().addEventListener(`reset`, handler);
  }

  setFavoriteButtonHandler(handler) {
    this.getElement().querySelector(`.event__favorite-checkbox`)
      .addEventListener(`click`, handler);
    this._favoriteButtonHandler = handler;
  }

  recoveryListeners() {
    this.setFavoriteButtonHandler(this._favoriteButtonHandler);
    this.setSaveButtonHandler(this._submitHandler);
    this.setResetButtonHandler(this._submitHandler);
    this._subscribeOnEvents();
  }

  _subscribeOnEvents() {
    const element = this.getElement();

    const elementTypes = element.querySelectorAll(`.event__type-input`);
    elementTypes.forEach((eventType) => eventType.addEventListener(`change`, (evt) => {
      if (evt.target.value !== this._eventType) {
        this._eventType = evt.target.value;
        this._eventTypeOffers = generateOffers(this._eventType);
      }
      this.rerender();
    }));

    element.querySelector(`.event__input--destination`)
      .addEventListener(`change`, (evt) => {
        const destName = evt.target.value;
        if (this._destinationInfo === null || destName !== this._destinationInfo.name) {
          this._destinationInfo = destName.length > 0 ? generateDestination(destName) : null;
        }
        this.rerender();
      });
  }

  _applyFlatpickr() {
    if (this._startFatpickr) {
      this._startFatpickr.destroy();
      this._startFatpickr = null;
    }

    if (this._endFlatpickr) {
      this._endFlatpickr.destroy();
      this._endFlatpickr = null;
    }

    const startDateElement = this.getElement().querySelector(`input[name="event-start-time"]`);
    this._startFatpickr = this._initFlatpickr(startDateElement, this._point.start);

    const endDateElement = this.getElement().querySelector(`input[name="event-end-time"]`);
    this._endFlatpickr = this._initFlatpickr(endDateElement, this._point.stop);
  }

  _initFlatpickr(dateElement, date) {
    return flatpickr(dateElement, {
      altInput: true,
      allowInput: true,
      enableTime: true,
      dateFormat: `d/m/y H:i`,
      altFormat: `d/m/Y H:i`,
      // eslint-disable-next-line camelcase
      time_24hr: true,
      defaultDate: date
    });
  }


}
