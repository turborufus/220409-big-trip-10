import AbstractComponent from "./abstract-component";

export const SORT_TYPE = {
  EVENT: `sort-event`,
  TIME: `sort-time`,
  PRICE: `sort-price`
};

const createSortTemplate = () => {
  return (`<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
    <span class="trip-sort__item  trip-sort__item--day"></span>

    <div class="trip-sort__item  trip-sort__item--event">
        <input id="${SORT_TYPE.EVENT}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="${SORT_TYPE.EVENT}">
        <label class="trip-sort__btn" for="${SORT_TYPE.EVENT}">Event</label>
    </div>

    <div class="trip-sort__item  trip-sort__item--time">
        <input id="${SORT_TYPE.TIME}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="${SORT_TYPE.TIME}" checked="">
        <label class="trip-sort__btn  trip-sort__btn--active  trip-sort__btn--by-increase" for="${SORT_TYPE.TIME}">
        Time
        </label>
    </div>

    <div class="trip-sort__item  trip-sort__item--price">
        <input id="${SORT_TYPE.PRICE}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="${SORT_TYPE.PRICE}">
        <label class="trip-sort__btn" for="${SORT_TYPE.PRICE}">
        Price
        </label>
    </div>

    <span class="trip-sort__item  trip-sort__item--offers">Offers</span>
    </form>
  `);
};

export default class Sort extends AbstractComponent {
  getTemplate() {
    return createSortTemplate();
  }

}
