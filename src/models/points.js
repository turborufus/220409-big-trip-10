import {FilterType, SortType} from "../const.js";
import {getPointsByFilter} from "../utils/filter.js";
import {sortByType} from "../utils/sort.js";

export default class Points {
  constructor() {
    this._points = [];
    this._offers = [];
    this._destinations = [];
    this._activeFilterType = FilterType.ALL;
    this._activeSortType = SortType.EVENT;

    this._filterChangeHandlers = [];
  }

  getOffers() {
    return this._offers;
  }

  getDestinations() {
    return this._destinations;
  }

  getPoints() {
    return sortByType(getPointsByFilter(this._points, this._activeFilterType), this._activeSortType);
  }

  getAllPoints() {
    return this._points;
  }

  setFilter(filterType) {
    this._activeFilterType = filterType;
    this._callHandlers(this._filterChangeHandlers);
  }

  setSortType(sortType) {
    this._activeSortType = sortType;
  }

  setDestinations(destinations) {
    this._destinations = destinations;
  }

  setOffers(offers) {
    this._offers = offers;
  }

  setPoints(points) {
    this._points = points;
  }

  addPoint(point) {
    this._points = [].concat(point, this._points);
  }

  removePoint(id) {
    const index = this._points.findIndex((it) => it.id === id);

    if (index === -1) {
      return false;
    }

    this._points = [].concat(this._points.slice(0, index), this._points.slice(index + 1));

    return true;
  }

  updatePoint(id, point) {
    const index = this._points.findIndex((it) => it.id === id);

    if (index === -1) {
      return false;
    }

    this._points = [].concat(this._points.slice(0, index), point, this._points.slice(index + 1));

    return true;
  }

  setChangeFilterHandler(handler) {
    this._filterChangeHandlers.push(handler);
  }

  _callHandlers(handlers) {
    handlers.forEach((handler) => handler());
  }

}
