import AbstractComponent from "./abstract-component.js";

const createTripDaysTemplate = () => {
  return (`<ul class="trip-days"></ul>`);
};

export default class DayList extends AbstractComponent {

  getTemplate() {
    return createTripDaysTemplate();
  }

}
