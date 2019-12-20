import AbstractComponent from "./abstract-component.js";

const createTripEventsListTemplate = () => {
  return (`<ul class="trip-events__list"></ul>`);
};

export default class EventList extends AbstractComponent {
  getTemplate() {
    return createTripEventsListTemplate();
  }
}
