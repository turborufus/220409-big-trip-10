import {FILTER_TYPE} from "../const.js";
import {isDateAfter} from "./datetime.js";

export const getFuturePoints = (points, date) => {
  return points.filter((point) => isDateAfter(point.start, date));
};

export const getPastPoints = (points, date) => {
  return points.filter((point) => isDateAfter(date, point.stop));
};

export const getPointsByFilter = (points, filterType) => {
  const nowDate = new Date();

  switch (filterType) {
    case FILTER_TYPE.ALL:
      return points;
    case FILTER_TYPE.FUTURE:
      return getFuturePoints(points, nowDate);
    case FILTER_TYPE.PAST:
      return getPastPoints(points, nowDate);
  }

  return points;
};
