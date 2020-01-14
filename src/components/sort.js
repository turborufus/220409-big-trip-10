import AbstractSmartComponent from "./abstract-smart-component";

export const SORT_TYPE = {
  EVENT: `event`,
  TIME: `time`,
  PRICE: `price`
};

const sortTypeList = [SORT_TYPE.EVENT, SORT_TYPE.TIME, SORT_TYPE.PRICE];

const createSortItemMarkup = (sortType, isChecked) => {
  const sortId = `sort-${sortType}`;
  return (`<div class="trip-sort__item  trip-sort__item--event">
    <input id="${sortId}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="${sortId}" ${isChecked ? `checked` : ``}>
    <label class="trip-sort__btn" for="${sortId}">${sortType}</label>
  </div>`);
};

const createSortTemplate = (currentSortType) => {
  const sortItemsMarkup = sortTypeList.map((it) => createSortItemMarkup(it, it === currentSortType)).join(`\n`);

  return (`<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
    <span class="trip-sort__item  trip-sort__item--day"></span>
    ${sortItemsMarkup}
    <span class="trip-sort__item  trip-sort__item--offers">Offers</span>
    </form>
  `);
};

export default class Sort extends AbstractSmartComponent {
  constructor() {
    super();
    this._currentSortType = SORT_TYPE.EVENT;
    this._sortTypeChangeHangler = null;
  }

  getTemplate() {
    return createSortTemplate(this._currentSortType);
  }

  get currentSortType() {
    return this._currentSortType;
  }

  recoveryListeners() {
    this.setSortTypeChangeHandler(this._sortTypeChangeHangler);
  }

  setSortTypeChangeHandler(handler) {
    this.getElement().addEventListener(`click`, (evt) => {
      evt.preventDefault();

      if (evt.target.tagName !== `LABEL`) {
        return;
      }

      const sortType = evt.target.innerHTML;

      if (this._currentSortType === sortType) {
        return;
      }

      this._currentSortType = sortType;

      handler(this._currentSortType);
    });
    this._sortTypeChangeHangler = handler;
  }

}
