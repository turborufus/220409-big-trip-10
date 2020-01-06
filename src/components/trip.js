import DayItemComponent from "./trip-day-item.js";
import DayListComponent from "./trip-days.js";
import EventListComponent from "./events-list.js";
import NoEventsComponent from "./no-events.js";
import PointController from "./point.js";
import SortComponent from "./sort.js";
import {SORT_TYPE} from "./sort.js";
import {generateTripDays} from "../mock/trip-day.js";
import {render, remove, RENDER_POSITION} from "../utils/render.js";

const renderEvents = (eventListElement, events, onDataChange) => {
  return events.map((tripEvent) => {
    const pointController = new PointController(eventListElement, onDataChange);
    pointController.render(tripEvent);
    return pointController;
  });
};

export default class TripController {
  constructor(container) {
    this._events = [];

    this._container = container;
    this._noEventsComponent = new NoEventsComponent();
    this._dayListComponent = new DayListComponent();
    this._sortComponent = new SortComponent();

    this._onDataChange = this._onDataChange.bind(this);
    this._onSortTypeChange = this._onSortTypeChange.bind(this);
  }

  render(events) {
    this._events = events;

    const container = this._container;

    if (!this._events.length) {
      render(container, this._noEventsComponent.getElement(), RENDER_POSITION.BEFOREEND);
    } else {
      render(container, this._sortComponent.getElement(), RENDER_POSITION.BEFOREEND);
      this._sortComponent.setSortTypeChangeHandler(this._onSortTypeChange);

      const tripDayListElement = this._dayListComponent.getElement();
      render(container, tripDayListElement, RENDER_POSITION.BEFOREEND);

      if (this._sortComponent.currentSortType === SORT_TYPE.EVENT) {
        const tripDays = generateTripDays(this._events.map((tripEvent) => {
          return tripEvent.start;
        }));

        Array.from(tripDays).sort().forEach((dayInMilliseconds, i) => {
          const dayItemComponent = new DayItemComponent(new Date(dayInMilliseconds), i + 1);
          render(tripDayListElement, dayItemComponent.getElement(), RENDER_POSITION.BEFOREEND);

          const tripEventListComponent = new EventListComponent();
          render(dayItemComponent.getElement(), tripEventListComponent.getElement(), RENDER_POSITION.BEFOREEND);

          const dayEvents = this._events.filter((tripEvent) => {
            return (tripEvent.start.getDate() === dayItemComponent.date.getDate()
                && tripEvent.start.getMonth() === dayItemComponent.date.getMonth()
                && tripEvent.start.getFullYear() === dayItemComponent.date.getFullYear());
          });
          renderEvents(tripEventListComponent.getElement(), dayEvents, this._onDataChange);

        });
      } else {
        const dayItemComponent = new DayItemComponent(null, 0);
        const tripEventListComponent = new EventListComponent();
        render(dayItemComponent.getElement(), tripEventListComponent.getElement(), RENDER_POSITION.BEFOREEND);
        render(tripDayListElement, dayItemComponent.getElement(), RENDER_POSITION.BEFOREEND);
        renderEvents(tripEventListComponent.getElement(), this._events, this._onDataChange);
      }
    }
  }

  _onDataChange(pointController, oldData, newData) {
    const index = this._events.findIndex((it) => it === oldData);

    if (index === -1) {
      return;
    }

    this._events = [].concat(this._events.slice(0, index), newData, this._events.slice(index + 1));

    pointController.render(this._events[index]);
  }

  _onSortTypeChange(sortType) {
    let sortedEvents = [];
    switch (sortType) {
      case SORT_TYPE.EVENT:
        sortedEvents = this._events;
        break;
      case SORT_TYPE.TIME:
        sortedEvents = this._events.slice().sort((a, b) => {
          const aDur = a.stop.getTime() - a.start.getTime();
          const bDur = b.stop.getTime() - b.start.getTime();
          return bDur - aDur;
        });
        break;
      case SORT_TYPE.PRICE:
        sortedEvents = this._events.slice().sort((a, b) => b.price - a.price);
    }
    this._dayListComponent.getElement().innerHTML = ``;
    remove(this._sortComponent);

    this.render(sortedEvents);
  }
}
