import DayItemComponent from "./trip-day-item.js";
import DayListComponent from "./trip-days.js";
import EventListComponent from "./events-list.js";
import NoEventsComponent from "./no-events.js";
import PointController from "./point.js";
import SortComponent from "./sort.js";
import {SORT_TYPE} from "./sort.js";
import {generateTripDays} from "../mock/trip-day.js";
import {render, remove, RENDER_POSITION} from "../utils/render.js";

export default class TripController {
  constructor(container) {
    this._container = container;
    this._noEventsComponent = new NoEventsComponent();
    this._dayListComponent = new DayListComponent();
    this._sortComponent = new SortComponent();
  }

  render(events) {
    const container = this._container;

    if (!events.length) {
      render(container, this._noEventsComponent.getElement(), RENDER_POSITION.BEFOREEND);
    } else {
      render(container, this._sortComponent.getElement(), RENDER_POSITION.BEFOREEND);
      const tripDayListElement = this._dayListComponent.getElement();
      render(container, tripDayListElement, RENDER_POSITION.BEFOREEND);

      if (this._sortComponent.currentSortType === SORT_TYPE.EVENT) {
        const tripDays = generateTripDays(events.map((event) => {
          return event.start;
        }));

        Array.from(tripDays).sort().forEach((dayInMilliseconds, i) => {
          const tripEventListComponent = new EventListComponent();
          const dayItemComponent = new DayItemComponent(new Date(dayInMilliseconds), i + 1);
          render(dayItemComponent.getElement(), tripEventListComponent.getElement(), RENDER_POSITION.BEFOREEND);
          render(tripDayListElement, dayItemComponent.getElement(), RENDER_POSITION.BEFOREEND);
          events.filter((event) => {
            return (event.start.getDate() === dayItemComponent.date.getDate()
                && event.start.getMonth() === dayItemComponent.date.getMonth()
                && event.start.getFullYear() === dayItemComponent.date.getFullYear());
          })
          .forEach((event) => new PointController(tripEventListComponent.getElement()).render(event));
        });
      } else {
        const dayItemComponent = new DayItemComponent(null, 0);
        const tripEventListComponent = new EventListComponent();
        render(dayItemComponent.getElement(), tripEventListComponent.getElement(), RENDER_POSITION.BEFOREEND);
        render(tripDayListElement, dayItemComponent.getElement(), RENDER_POSITION.BEFOREEND);
        events.forEach((event) => new PointController(tripEventListComponent.getElement()).render(event));
      }
    }

    this._sortComponent.setSortTypeChangeHandler((sortType) => {
      let sortedEvents = [];

      switch (sortType) {
        case SORT_TYPE.EVENT:
          sortedEvents = events;
          break;
        case SORT_TYPE.TIME:
          sortedEvents = events.slice().sort((a, b) => {
            const aDur = a.stop.getTime() - a.start.getTime();
            const bDur = b.stop.getTime() - b.start.getTime();
            return bDur - aDur;
          });
          break;
        case SORT_TYPE.PRICE:
          sortedEvents = events.slice().sort((a, b) => b.price - a.price);
      }

      this._dayListComponent.getElement().innerHTML = ``;
      remove(this._sortComponent);

      this.render(sortedEvents);
    });
  }
}
