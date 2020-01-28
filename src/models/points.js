import {FILTER_TYPE} from "../const.js";
import {generateID} from '../utils/common.js';
import {getPointsByFilter} from "../utils/filter.js";

export default class Points {
  constructor() {
    this._points = [];
    this._offers = [];
    this._destinations = [];
    this._activeFilterType = FILTER_TYPE.ALL;

    this._filterChangeHandlers = [];
  }

  getOffers() {
    return this._offers;
  }

  getDestinations() {
    return this._destinations;
  }

  getPoints() {
    return getPointsByFilter(this._points, this._activeFilterType);
  }

  getAllPoints() {
    return this._points;
  }

  setFilter(filterType) {
    this._activeFilterType = filterType;
    this._callHandlers(this._filterChangeHandlers);
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
    point.id = generateID();
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
