'use strict';

const EVENT_COUNT = 3;

const createTripMenuTemplate = () => {
  return (`
        <h2 class="visually-hidden">Switch trip view</h2>
        <nav class="trip-controls__trip-tabs  trip-tabs">
            <a class="trip-tabs__btn  trip-tabs__btn--active" href="#">Table</a>
            <a class="trip-tabs__btn" href="#">Stats</a>
        </nav>`);
};

const createFilterTemplate = () => {
  return (`
        <h2 class="visually-hidden">Filter events</h2>
        <form class="trip-filters" action="#" method="get">
            <div class="trip-filters__filter">
                <input id="filter-everything" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="everything" checked>
                <label class="trip-filters__filter-label" for="filter-everything">Everything</label>
            </div>

            <div class="trip-filters__filter">
                <input id="filter-future" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="future">
                <label class="trip-filters__filter-label" for="filter-future">Future</label>
            </div>

            <div class="trip-filters__filter">
                <input id="filter-past" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="past">
                <label class="trip-filters__filter-label" for="filter-past">Past</label>
            </div>

            <button class="visually-hidden" type="submit">Accept filter</button>
        </form>
    `);
};

const createTripInfoTemplate = () => {
  return (`
        <div class="trip-info__main">
            <h1 class="trip-info__title">Amsterdam &mdash; Geneva &mdash; Chamonix &mdash; Geneva &mdash; Amsterdam</h1>
            <p class="trip-info__dates">Mar 18&nbsp;&mdash;&nbsp;21</p>
        </div>
    `);
};

const createTripDaysTemplate = () => {

};

const createTripDayItemTemplate = () => {

};

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const tripMainElement = document.querySelector(`.trip-main`);
const tripInfoMainElement = tripMainElement.querySelector(`.trip-info`);

render(tripInfoMainElement, createTripInfoTemplate(), `afterbegin`);

const tripControlsElement = tripMainElement.querySelector(`.trip-controls`);

render(tripControlsElement, createTripMenuTemplate(), `afterbegin`);
render(tripControlsElement, createFilterTemplate(), `beforeend`);
