import DayItemComponent from "./components/trip-day-item.js";
import DayListComponent from "./components/trip-days.js";
import EventComponent from "./components/event.js";
import EventEditComponent from "./components/event-edit.js";
import EventListComponent from "./components/events-list.js";
import FilterComponent from "./components/filter.js";
import NoEventsComponent from "./components/no-events.js";
import SiteMenuComponent from "./components/menu.js";
import TripInfoComponent from "./components/trip-info.js";
import {generateMenuTabs} from "./mock/menuTab.js";
import {generateFilters} from "./mock/filter.js";
import {generateEvents} from "./mock/event.js";
import {generateTripDays} from "./mock/trip-day.js";
import {render, RENDER_POSITION} from "./utils.js";

const EVENT_COUNT = 10;

const renderEvent = (tripEventListElement, event) => {
  const onEscKeyDown = (evt) => {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      replaceEditToEvent();
      document.removeEventListener(`keydown`, onEscKeyDown);
    }
  };

  const replaceEditToEvent = () => {
    tripEventListElement.replaceChild(eventComponent.getElement(), editComponent.getElement());
  };

  const replaceEventToEdit = () => {
    tripEventListElement.replaceChild(editComponent.getElement(), eventComponent.getElement());
  };

  const eventComponent = new EventComponent(event);
  const rollupButton = eventComponent.getElement().querySelector(`.event__rollup-btn`);
  rollupButton.addEventListener(`click`, () => {
    replaceEventToEdit();
    document.addEventListener(`keydown`, onEscKeyDown);
  });

  const editComponent = new EventEditComponent(event);
  const saveEventButton = editComponent.getElement().querySelector(`.event__save-btn`);
  const resetEventButton = editComponent.getElement().querySelector(`.event__reset-btn`);
  saveEventButton.addEventListener(`click`, replaceEditToEvent);
  resetEventButton.addEventListener(`click`, replaceEditToEvent);

  render(tripEventListElement, eventComponent.getElement(), RENDER_POSITION.BEFOREEND);
};

const compareDates = (dateA, dateB) => {
  return dateA.getTime() - dateB.getTime();
};

const events = generateEvents(EVENT_COUNT);
events.sort((eventA, eventB) => compareDates(eventA.start, eventB.start));

const tripMainElement = document.querySelector(`.trip-main`);
const tripInfoMainElement = tripMainElement.querySelector(`.trip-info`);
render(tripInfoMainElement, new TripInfoComponent(events).getElement(), RENDER_POSITION.AFTERBEGIN);

const isEmptyEventList = events.length === 0;
const tripCost = isEmptyEventList ? 0 : events.map((event) => {
  const offers = Array.from(event.offers);
  const offersPrice = offers.map((offer) => offer.price).reduce((price, it) => {
    return price + it;
  });
  return event.price + offersPrice;
}).reduce((cost, price) => {
  return cost + price;
});
const tripCostElement = tripMainElement.querySelector(`.trip-info__cost-value`);
tripCostElement.innerHTML = tripCost;

const menuTabs = generateMenuTabs();
const filters = generateFilters();
const tripControlsElement = tripMainElement.querySelector(`.trip-controls`);
const menuTitleElement = tripControlsElement.querySelector(`h2:nth-of-type(1)`);
const filterTitleElement = tripControlsElement.querySelector(`h2:nth-of-type(2)`);
menuTitleElement.remove();
filterTitleElement.remove();

render(tripControlsElement, menuTitleElement, RENDER_POSITION.BEFOREEND);
render(tripControlsElement, new SiteMenuComponent(menuTabs).getElement(), RENDER_POSITION.BEFOREEND);
render(tripControlsElement, filterTitleElement, RENDER_POSITION.BEFOREEND);
render(tripControlsElement, new FilterComponent(filters).getElement(), RENDER_POSITION.BEFOREEND);

const pageMainElement = document.querySelector(`.page-main`);
const tripEventsElement = pageMainElement.querySelector(`.trip-events`);

if (isEmptyEventList) {
  render(tripEventsElement, new NoEventsComponent().getElement(), RENDER_POSITION.BEFOREEND);
} else {
  const tripDayListElement = new DayListComponent().getElement();
  render(tripEventsElement, tripDayListElement, RENDER_POSITION.BEFOREEND);

  const tripDays = generateTripDays(events.map((event) => {
    return event.start;
  }));

  const tripDayItemElements = Array.from(tripDays).sort().map((dayInMilliseconds, i) => {
    return new DayItemComponent(new Date(dayInMilliseconds), i + 1).getElement();
  });

  tripDayItemElements.forEach((tripDayItemElement) => {
    const tripEventListElement = new EventListComponent().getElement();
    const dayDateElement = tripDayItemElement.querySelector(`.day__date`);
    render(tripDayItemElement, tripEventListElement, RENDER_POSITION.BEFOREEND);

    events.filter((event) => {
      const dayDate = new Date(dayDateElement.dateTime);
      return (event.start.getDate() === dayDate.getDate()
          && event.start.getMonth() === dayDate.getMonth()
          && event.start.getFullYear() === dayDate.getFullYear());
    })
    .map((event) => renderEvent(tripEventListElement, event));

    render(tripDayListElement, tripDayItemElement, RENDER_POSITION.BEFOREEND);
  });
}

