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
import { generateTripDays } from "./mock/trip-day.js";

const EVENT_COUNT = 10;

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const compareEvents = (eventA, eventB) => {
  return eventA.start.getTime() - eventB.start.getTime();
};

const events = generateEvents(EVENT_COUNT);
events.sort(compareEvents);
const tripDays = generateTripDays(events.map((event) => {
  return event.start;
}));

const tripMainElement = document.querySelector(`.trip-main`);
const tripInfoMainElement = tripMainElement.querySelector(`.trip-info`);
render(tripInfoMainElement, createTripInfoTemplate(), `afterbegin`);

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
tripDays.map((day) => render(tripDaysElement, createTripDayItemTemplate(day), `beforeend`));

const tripDayItemElement = tripDaysElement.querySelector(`.trip-days__item`);
render(tripDayItemElement, createTripEventsListTemplate(), `beforeend`);

const tripEventsListElement = tripDayItemElement.querySelector(`.trip-events__list`);
render(tripEventsListElement, createTripEventEditTemplate(events[0]), `beforeend`);

events.slice(1, events.length)
  .map((event) => render(tripEventsListElement, createTripEventItemTemplate(event), `beforeend`));
