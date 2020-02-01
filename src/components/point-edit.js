import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import 'flatpickr/dist/themes/light.css';
import moment from "moment";
import {TransferTypes, ActivityTypes, TypePlaceholder, ButtonText} from "../const.js";
import {formatDateTime} from "../utils/datetime.js";
import AbstractSmartComponent from "./abstract-smart-component.js";
import {EMPTY_POINT} from '../controllers/point.js';

export const getDestinationByName = (destinationName, destinations) => {
  const index = destinations.map((destination) => destination.name).indexOf(destinationName);

  if (index < 0) {
    return null;
  }

  return destinations[index];
};

const getOffersByType = (type, availableOffers) => {
  const index = availableOffers.map((offerModel) => offerModel.type).indexOf(type);
  if (index < 0) {
    return [];
  }

  return availableOffers[index].getAllOffers();
};


const createEventTypeItemMarkup = (type, index, isChecked) => {
  return (`
    <div class="event__type-item">
      <input id="event-type-${type}-${index + 1}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}" ${isChecked ? `checked` : ``} >
      <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-${index + 1}">${type}</label>
    </div>
  `);
};

const createDestinationListMarkup = (destinations) => {
  return destinations
    .map((destination) => {
      return (`
        <option value="${destination.name}"></option>
      `);
    });
};

const formatDateValue = (date) => {
  return formatDateTime(date, `DD/MM/yy HH:mm`);
};

const createTimeMarkup = (start, stop) => {
  const startValue = (start) ? formatDateValue(start) : ``;
  const stopValue = (stop) ? formatDateValue(stop) : ``;
  return (`<label class="visually-hidden" for="event-start-time-1">
      From
    </label>
    <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${startValue}" required>
    &mdash;
    <label class="visually-hidden" for="event-end-time-1">
      To
    </label>
    <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${stopValue}" required>
  `);
};

const createPriceMarkup = (price) => {
  return (`<label class="event__label" for="event-price-1">
      <span class="visually-hidden">Price</span>
      &euro;
    </label>
    <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${price}" pattern="[1-9]+[0-9]*" required>
  `);
};

const createOfferMarkup = (offer, index, isChecked) => {
  const {type, name, price} = offer;
  const suffix = name.replace(/ /g, `_`) + `|` + `${price}`;
  return (`<div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="event-offer-${type}-${index + 1}" type="checkbox" name="event-offer-${suffix}" ${isChecked ? `checked` : ``}>
      <label class="event__offer-label" for="event-offer-${type}-${index + 1}">
          <span class="event__offer-title">${name}</span>
          &plus;
          &euro;&nbsp;<span class="event__offer-price">${price}</span>
      </label>
    </div>
  `);
};

const createPhotosMarkup = (images) => {
  return images
    .map((image) => {
      const {src, description} = image;
      return (
        `<img class="event__photo" src="${src}" alt="${description}">`
      );
    });
};

const isOfferChecked = (offer, selectedOffers) => {
  const offerNames = selectedOffers.map((selectedOffer) => selectedOffer.name);
  return offerNames.includes(offer.name);
};

const createPointDetailsMarkup = (point, offersByType = [], destination = null) => {
  const createOffersMarkup = (offers, selectedOffers) => {
    if (offers && offers.length > 0) {
      const offersMarkup = offers.map((offer, i) => createOfferMarkup(offer, i, isOfferChecked(offer, selectedOffers))).join(`\n`);
      return (`
        <section class="event__section  event__section--offers">
            <h3 class="event__section-title  event__section-title--offers">Offers</h3>
            <div class="event__available-offers">
              ${offersMarkup}
            </div>
          </section>`);
    }
    return ``;
  };

  const createDestinationSection = (dest) => {
    if (dest) {
      const {description, images} = dest;
      const photosMarkup = createPhotosMarkup(images).join(`\n`);
      return (`
        <section class="event__section  event__section--destination">
          <h3 class="event__section-title  event__section-title--destination">Destination</h3>
          <p class="event__destination-description">${description}</p>

          <div class="event__photos-container">
              <div class="event__photos-tape">
              ${photosMarkup}
              </div>
          </div>
        </section>`);
    }
    return ``;
  };

  const selectedOffers = point ? point.offers : [];
  const offersSection = createOffersMarkup(offersByType, selectedOffers);
  const destinationSection = createDestinationSection(destination);

  return (`
    <section class="event__details">
      ${offersSection}
      ${destinationSection}        
    </section>
  `);
};

const createPointEditTemplate = (point, options = {}) => {
  const isNewPoint = point === EMPTY_POINT;
  const {eventType, offersByType: currentOffersByType, destination: currentDestination, allDestinations} = options;
  const {type, start, stop, price, isFavorite} = point;
  const currentType = (eventType !== type) ? eventType : type;
  const typeIconName = (currentType.length) ? currentType : `trip`;
  const eventTypePlaceholder = (currentType.length) ? TypePlaceholder[currentType] : ``;

  const destinationList = createDestinationListMarkup(allDestinations).join(`\n`);
  const destinationName = currentDestination ? currentDestination.name : ``;

  const transferTypesGroupMarkup = TransferTypes.map((it, i) => createEventTypeItemMarkup(it, i, it === eventType)).join(`\n`);
  const activityTypesGroupMarkup = ActivityTypes.map((it, i) => createEventTypeItemMarkup(it, TransferTypes.length + i, it === eventType)).join(`\n`);

  const timeMarkup = createTimeMarkup(start, stop);
  const priceMarkup = createPriceMarkup(price);

  const pointDetailsMarkup = createPointDetailsMarkup(point, currentOffersByType, currentDestination);

  const deleteButtonText = ButtonText.DELETE;
  const saveButtonText = ButtonText.SAVE;
  const cancelButtonText = ButtonText.CANCEL;

  return (`<form class="trip-events__item  event  event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${typeIconName}.png" alt="Event type icon">
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
            ${eventTypePlaceholder}
        </label>
        <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destinationName}" list="destination-list-1">
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

        <button class="event__save-btn  btn  btn--blue" type="submit">${saveButtonText}</button>
        <button class="event__reset-btn" type="reset">${isNewPoint ? `${cancelButtonText}` : `${deleteButtonText}`}</button>
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
  constructor(point, destinations, availableOffers) {
    super();
    this._point = point;

    this._eventType = this._point.type;
    this._offersByType = getOffersByType(this._eventType, availableOffers);
    this._availableOffers = availableOffers;

    this._destination = this._point.destination;
    this._allDestinations = destinations;

    this._submitHandler = null;
    this._resetHandler = null;
    this._rollupHandler = null;
    this._favoriteButtonHandler = null;

    this._startFatpickr = null;
    this._endFlatpickr = null;

    this._subscribeOnEvents();
    this._applyFlatpickr();
  }

  getTemplate() {
    return createPointEditTemplate(this._point,
        {
          eventType: this._eventType,
          offersByType: this._offersByType,
          destination: this._destination,
          allDestinations: this._allDestinations});
  }

  enableWarningFrame() {
    this.getElement().style.outline = `10px solid red`;
  }

  disableWarningFrame() {
    this.getElement().style.outline = ``;
  }

  getData() {
    const form = this.getElement();
    return new FormData(form);
  }

  recoveryListeners() {
    this.setFavoriteButtonHandler(this._favoriteButtonHandler);
    this.setSaveButtonHandler(this._submitHandler);
    this.setResetButtonHandler(this._resetHandler);
    this.setRollupButtonHandler(this._rollupHandler);
    this._subscribeOnEvents();
  }

  removeElement() {
    if (this._flatpickr) {
      this._flatpickr.destroy();
      this._flatpickr = null;
    }
    super.removeElement();
  }

  rerender() {
    super.rerender();

    this._applyFlatpickr();
  }

  setDeleteButtonText(text) {
    this.getElement().querySelector(`.event__reset-btn`).textContent = text;
  }

  setSaveButtonText(text) {
    this.getElement().querySelector(`.event__save-btn`).textContent = text;
  }

  setDisabledButtons(isDisabled) {
    const element = this.getElement();
    element.querySelector(`.event__save-btn`).disabled = isDisabled;
    element.querySelector(`.event__reset-btn`).disabled = isDisabled;
    element.querySelector(`.event__favorite-checkbox`).disabled = isDisabled;
  }

  setDisabledForm(isDisabled) {
    this.getElement().disabled = isDisabled;
    this.setDisabledButtons(isDisabled);
  }

  setSaveButtonHandler(handler) {
    this.getElement().addEventListener(`submit`, handler);
    this._submitHandler = handler;
  }

  setResetButtonHandler(handler) {
    this.getElement().addEventListener(`reset`, handler);
    this._resetHandler = handler;
  }

  setRollupButtonHandler(handler) {
    this.getElement().querySelector(`.event__rollup-btn`)
      .addEventListener(`click`, handler);
    this._rollupHandler = handler;
  }

  setFavoriteButtonHandler(handler) {
    this.getElement().querySelector(`.event__favorite-checkbox`)
      .addEventListener(`click`, handler);
    this._favoriteButtonHandler = handler;
  }

  _subscribeOnEvents() {
    const element = this.getElement();

    const elementTypes = element.querySelectorAll(`.event__type-input`);
    elementTypes.forEach((eventType) => eventType.addEventListener(`change`, (evt) => {
      if (evt.target.value !== this._eventType) {
        this._eventType = evt.target.value;
        this._offersByType = getOffersByType(this._eventType, this._availableOffers);
        this.rerender();
      }
    }));

    element.querySelector(`.event__input--destination`)
      .addEventListener(`change`, (evt) => {
        const destName = evt.target.value;
        if (destName !== this._destination) {
          this._destination = getDestinationByName(destName, this._allDestinations);
          this.rerender();
        }
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
      'altInput': true,
      'allowInput': true,
      'enableTime': true,
      'dateFormat': `Y-m-dTH:i:S`,
      'altFormat': `d/m/Y H:i`,
      'time_24hr': true,
      'defaultDate': date
    });
  }

  isFormValid(formData) {
    const isTypeValid = this._isTypeValid(formData);
    const isDestinationValid = this._isDestinationValid(formData);
    const isDatesValid = this._isDatesvalid(formData);
    const isPriceValid = this._isPriceValid(formData);
    return (isTypeValid && isDestinationValid && isDatesValid && isPriceValid);
  }

  _isTypeValid(formData) {
    const eventType = formData.get(`event-type`);
    const eventTypeToggle = this.getElement().querySelector(`.event__type-toggle`);
    eventTypeToggle.setCustomValidity(eventType ? `` : `Please select a type from the list`);
    return (!!eventType);
  }

  _isDestinationValid(formData) {
    const destinationName = formData.get(`event-destination`);
    const destinationInput = this.getElement().querySelector(`.event__input--destination`);

    const isValidDestinationName = this._allDestinations.some((it) => it.name === destinationName);
    destinationInput.setCustomValidity(isValidDestinationName ? `` : `Please select a destination from the list`);
    return isValidDestinationName;
  }

  _isDatesvalid(formData) {
    const start = formData.get(`event-start-time`);
    const stop = formData.get(`event-end-time`);

    const startDate = start ? new Date(start) : null;
    const stopDate = stop ? new Date(stop) : null;

    const startDateElement = this.getElement().querySelector(`input[name="event-start-time"]`);
    const endDateElement = this.getElement().querySelector(`input[name="event-end-time"]`);

    if (startDate === null || stopDate === null) {
      startDateElement.setCustomValidity(startDate ? `` : `Please add date of event start`);
      endDateElement.setCustomValidity(stopDate ? `` : `Please add date of event end`);
      return false;
    }

    if (moment(stopDate).isAfter(moment(startDate))) {
      startDateElement.setCustomValidity(``);
      endDateElement.setCustomValidity(``);
      return true;
    } else {
      endDateElement.setCustomValidity(`Please select stop date afte start date`);
      return false;
    }
  }

  _isPriceValid(formData) {
    const price = Number(formData.get(`event-price`));
    const isValid = (price > 0);
    return isValid;
  }

}
