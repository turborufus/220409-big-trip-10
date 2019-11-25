import {createTripMenuTemplate} from "./components/menu.js";
import {createFilterTemplate} from "./components/filter.js";
import {createTripInfoTemplate} from "./components/trip-info.js";
import {createTripEventEditTemplate} from "./components/event-edit.js";
import {createTripDaysTemplate} from "./components/trip-days.js";
import {createTripDayItemTemplate} from "./components/trip-day-item.js";
import {createTripEventsListTemplate} from "./components/events-list.js";
import {createTripEventItemTemplate} from "./components/event.js";

const EVENT_COUNT = 3;

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const tripMainElement = document.querySelector(`.trip-main`);
const tripInfoMainElement = tripMainElement.querySelector(`.trip-info`);
render(tripInfoMainElement, createTripInfoTemplate(), `afterbegin`);

const tripControlsElement = tripMainElement.querySelector(`.trip-controls`);
const tripControlsH2MenuElement = tripControlsElement.querySelector(`h2:nth-of-type(1)`);
const tripControlsH2FilterElement = tripControlsElement.querySelector(`h2:nth-of-type(2)`);
render(tripControlsH2MenuElement, createTripMenuTemplate(), `afterend`);
render(tripControlsH2FilterElement, createFilterTemplate(), `afterend`);

const pageMainElement = document.querySelector(`.page-main`);
const tripEventsElement = pageMainElement.querySelector(`.trip-events`);

render(tripEventsElement, createTripEventEditTemplate(), `beforeend`);
render(tripEventsElement, createTripDaysTemplate(), `beforeend`);

const tripDaysElement = tripEventsElement.querySelector(`.trip-days`);
render(tripDaysElement, createTripDayItemTemplate(), `beforeend`);

const tripDayItemElement = tripDaysElement.querySelector(`.trip-days__item`);
render(tripDayItemElement, createTripEventsListTemplate(), `beforeend`);

const tripEventsListElement = tripDayItemElement.querySelector(`.trip-events__list`);
render(tripEventsListElement, createTripEventEditTemplate(), `beforeend`);

new Array(EVENT_COUNT)
    .fill(``)
    .map(
        () => render(tripEventsListElement, createTripEventItemTemplate(), `beforeend`)
    );
