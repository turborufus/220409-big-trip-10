import {FILTER_TYPE} from "../const.js";
import {getPointsByFilter} from "../utils/filter.js";

export default class Points {
  constructor() {
    this._points = [];
    this._activeFilterType = FILTER_TYPE.ALL;

    this._filterChangeHandlers = [];
  }

  getPoints() {
    return getPointsByFilter(this._points, this._activeFilterType);
  }

  getAllPoints() {
    return this._points;
  }

  setFilter(filterType) {
    this._activeFilterType = filterType;
    this._filterChangeHandlers.forEach((handler) => handler());
  }

  setPoints(points) {
    this._points = points;
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
}
