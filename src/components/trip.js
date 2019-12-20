import DayItemComponent from "./trip-day-item.js";
import DayListComponent from "./trip-days.js";
import NoEventsComponent from "./no-events.js";
import {generateTripDays} from "../mock/trip-day.js";
import {render, RENDER_POSITION} from "../utils/render.js";

export default class TripController {
  constructor(container) {
    this._container = container;
    this._noEventsComponent = new NoEventsComponent();
    this._dayListComponent = new DayListComponent();
  }

  render(events) {
    const container = this._container;
    const isEmptyEventList = events.length === 0;

    if (isEmptyEventList) {
      render(container, this._noEventsComponent.getElement(), RENDER_POSITION.BEFOREEND);
    } else {
      const tripDayListElement = this._dayListComponent.getElement();
      render(container, tripDayListElement, RENDER_POSITION.BEFOREEND);

      const tripDays = generateTripDays(events.map((event) => {
        return event.start;
      }));

      Array.from(tripDays).sort().map((dayInMilliseconds, i) => {
        const tripDayItemComponent = new DayItemComponent(new Date(dayInMilliseconds), i + 1);
        tripDayItemComponent.render(events);
        render(tripDayListElement, tripDayItemComponent.getElement(), RENDER_POSITION.BEFOREEND);
      });
    }
  }

}
