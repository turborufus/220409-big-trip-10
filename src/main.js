import {createTripMenuTemplate} from "./components/menu.js";
import {createFilterTemplate} from "./components/filter.js";
import {createTripInfoTemplate} from "./components/trip-info.js";
import {createTripEventEditTemplate} from "./components/event-edit.js";
import {createTripDaysTemplate} from "./components/trip-days.js";
import {createTripDayItemTemplate} from "./components/trip-day-item.js";
import {createTripEventsListTemplate} from "./components/events-list.js";
import {createTripEventItemTemplate} from "./components/event.js";
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
const tripDays = generateTripDays(events.map((event) => {
  return event.start;
}));

const tripMainElement = document.querySelector(`.trip-main`);
const tripInfoMainElement = tripMainElement.querySelector(`.trip-info`);
render(tripInfoMainElement, createTripInfoTemplate(events), `afterbegin`);


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

render(tripControlsH2MenuElement, createTripMenuTemplate(menuTabs), `afterend`);
render(tripControlsH2FilterElement, createFilterTemplate(filters), `afterend`);

const pageMainElement = document.querySelector(`.page-main`);
const tripEventsElement = pageMainElement.querySelector(`.trip-events`);

render(tripEventsElement, createTripDaysTemplate(), `beforeend`);

const tripDaysElement = tripEventsElement.querySelector(`.trip-days`);
Array.from(tripDays).sort()
  .forEach((dayInMilliseconds, i) =>
    render(tripDaysElement, createTripDayItemTemplate(dayInMilliseconds, i + 1), `beforeend`));

const tripDayItemElements = tripDaysElement.querySelectorAll(`.trip-days__item`);
tripDayItemElements.forEach((tripDayItemElement, i) => {
  const dayDateElement = tripDayItemElement.querySelector(`.day__date`);

  render(tripDayItemElement, createTripEventsListTemplate(), `beforeend`);
  const tripEventsListElement = tripDayItemElement.querySelector(`.trip-events__list`);

  if (i === 0) {
    render(tripEventsListElement, createTripEventEditTemplate(events[0]), `beforeend`);
  }

  events.slice(1, events.length)
    .filter((event) => {
      const dayDate = new Date(dayDateElement.dateTime);
      return (event.start.getDate() === dayDate.getDate()
        && event.start.getMonth() === dayDate.getMonth()
        && event.start.getFullYear() === dayDate.getFullYear());
    })
    .map((event) => render(tripEventsListElement, createTripEventItemTemplate(event), `beforeend`));
});
