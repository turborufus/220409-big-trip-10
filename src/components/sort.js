import AbstractComponent from "./abstract-component";

export const SORT_TYPE = {
  EVENT: {
    id: `sort-event`,
    name: `Event`,
  },
  TIME: {
    id: `sort-time`,
    name: `Time`,
  },
  PRICE: {
    id: `sort-price`,
    name: `Price`,
  }
};

const createSortItemMarkup = (sortType, isChecked) => {
  const sortId = `sort-${sortType}`;
  return (`<div class="trip-sort__item  trip-sort__item--event">
    <input id="${sortId}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="${sortId}" ${isChecked ? `checked` : ``}>
    <label class="trip-sort__btn" for="${sortId}">${sortType}</label>
  </div>`);
};

const createSortTemplate = (sortTypeList) => {
  const sortItemsMarkup = sortTypeList.map((it, i) => createSortItemMarkup(it, i === 0)).join(`\n`);

  return (`<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
    <span class="trip-sort__item  trip-sort__item--day"></span>
    ${sortItemsMarkup}
    <span class="trip-sort__item  trip-sort__item--offers">Offers</span>
    </form>
  `);
};

export default class Sort extends AbstractComponent {
  constructor(sortTypeList) {
    super();
    this._sortTypeList = sortTypeList;
  }

  getTemplate() {
    return createSortTemplate(this._sortTypeList);
  }

}
