import {formatDate} from "../utils/datetime.js";
import {render, replace, RENDER_POSITION} from "../utils/render.js";
import {MONTH_NAMES} from "../const.js";
import AbstractComponent from "./abstract-component.js";
import EventComponent from "./event.js";
import EventEditComponent from "./event-edit.js";
import EventListComponent from "./events-list.js";

const renderEvent = (tripEventListElement, event) => {
  const onEscKeyDown = (evt) => {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      replaceEditToEvent();
      document.removeEventListener(`keydown`, onEscKeyDown);
    }
  };

  const replaceEditToEvent = () => {
    replace(eventComponent, editComponent);
  };

  const replaceEventToEdit = () => {
    replace(editComponent, eventComponent);
  };

  const eventComponent = new EventComponent(event);
  eventComponent.setRollupButtonHandler(() => {
    replaceEventToEdit();
    document.addEventListener(`keydown`, onEscKeyDown);
  });

  const editComponent = new EventEditComponent(event);
  editComponent.setSaveButtonHandler(replaceEditToEvent);
  editComponent.setResetButtonHandler(replaceEditToEvent);

  render(tripEventListElement, eventComponent.getElement(), RENDER_POSITION.BEFOREEND);
};

const createTripDayItemTemplate = (dayInMilliseconds, counter) => {
  const date = new Date(dayInMilliseconds);
  const dateValue = formatDate(date);
  const dateTitle = `${MONTH_NAMES[date.getMonth()].toUpperCase()} ${date.getDate()}`;
  return (`<li class="trip-days__item  day">
          <div class="day__info">
              <span class="day__counter">${counter}</span>
              <time class="day__date" datetime="${dateValue}">${dateTitle}</time>
          </div>
      </li>
  `);
};
export default class DayItem extends AbstractComponent {
  constructor(date, counter) {
    super();
    this._date = date;
    this._counter = counter;
    this._eventListComponent = new EventListComponent();
  }

  getTemplate() {
    return createTripDayItemTemplate(this._date.getTime(), this._counter);
  }

  render(events) {
    const tripEventListElement = this._eventListComponent.getElement();
    const tripDayItemElement = this.getElement();
    render(tripDayItemElement, tripEventListElement, RENDER_POSITION.BEFOREEND);
    events.filter((event) => {
      return (event.start.getDate() === this._date.getDate()
          && event.start.getMonth() === this._date.getMonth()
          && event.start.getFullYear() === this._date.getFullYear());
    })
    .map((event) => renderEvent(tripEventListElement, event));
  }
}
