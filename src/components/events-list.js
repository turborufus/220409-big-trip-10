import {createElement} from "../utils.js";

const createTripEventsListTemplate = () => {
  return (`
      <ul class="trip-events__list"></ul>
  `);
};

export default class EventList {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createTripEventsListTemplate();
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
