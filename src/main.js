import DayItemComponent from "./components/trip-day-item.js";
import DayListComponent from "./components/trip-days.js";
import EventComponent from "./components/event.js";
import EventEditComponent from "./components/event-edit.js";
import EventListComponent from "./components/events-list.js";
import FilterComponent from "./components/filter.js";
import SiteMenuComponent from "./components/menu.js";
import TripInfoComponent from "./components/trip-info.js";
import {generateMenuTabs} from "./mock/menuTab.js";
import {generateFilters} from "./mock/filter.js";
import {generateEvents} from "./mock/event.js";
import {generateTripDays} from "./mock/trip-day.js";
import {render, RENDER_POSITION} from "./utils.js";

const EVENT_COUNT = 10;

const compareDates = (dateA, dateB) => {
  return dateA.getTime() - dateB.getTime();
};

const events = generateEvents(EVENT_COUNT);
events.sort((eventA, eventB) => compareDates(eventA.start, eventB.start));

const tripMainElement = document.querySelector(`.trip-main`);
const tripInfoMainElement = tripMainElement.querySelector(`.trip-info`);
render(tripInfoMainElement, new TripInfoComponent(events).getElement(), RENDER_POSITION.AFTERBEGIN);


const tripCost = events.map((event) => {
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
const tripControlsH2MenuElement = tripControlsElement.querySelector(`h2:nth-of-type(1)`);
const tripControlsH2FilterElement = tripControlsElement.querySelector(`h2:nth-of-type(2)`);
tripControlsH2MenuElement.remove();
tripControlsH2FilterElement.remove();

render(tripControlsElement, tripControlsH2MenuElement, RENDER_POSITION.BEFOREEND);
render(tripControlsElement, new SiteMenuComponent(menuTabs).getElement(), RENDER_POSITION.BEFOREEND);
render(tripControlsElement, tripControlsH2FilterElement, RENDER_POSITION.BEFOREEND);
render(tripControlsElement, new FilterComponent(filters).getElement(), RENDER_POSITION.BEFOREEND);

const pageMainElement = document.querySelector(`.page-main`);
const tripEventsElement = pageMainElement.querySelector(`.trip-events`);

const tripDayListElement = new DayListComponent().getElement();
render(tripEventsElement, tripDayListElement, RENDER_POSITION.BEFOREEND);

const tripDays = generateTripDays(events.map((event) => {
  return event.start;
}));

const tripDayItemElements = Array.from(tripDays).sort().map((dayInMilliseconds, i) => {
  return new DayItemComponent(new Date(dayInMilliseconds), i + 1).getElement();
});

tripDayItemElements.forEach((tripDayItemElement, i) => {
  const tripEventListElement = new EventListComponent().getElement();
  const dayDateElement = tripDayItemElement.querySelector(`.day__date`);
  render(tripDayItemElement, tripEventListElement, RENDER_POSITION.BEFOREEND);

  if (i === 0) {
    render(tripEventListElement, new EventEditComponent(events[0]).getElement(), RENDER_POSITION.BEFOREEND);
  }

  events.slice(1, events.length)
    .filter((event) => {
      const dayDate = new Date(dayDateElement.dateTime);
      return (event.start.getDate() === dayDate.getDate()
        && event.start.getMonth() === dayDate.getMonth()
        && event.start.getFullYear() === dayDate.getFullYear());
    })
    .map((event) => render(tripEventListElement, new EventComponent(event).getElement(), RENDER_POSITION.BEFOREEND));

  render(tripDayListElement, tripDayItemElement, RENDER_POSITION.BEFOREEND);
});
