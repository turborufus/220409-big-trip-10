import {FilterType} from "../const.js";
import {isDateAfter, compareDates} from "./datetime.js";

export const getFuturePoints = (points, date) => {
  return points.filter((point) => isDateAfter(point.start, date));
};

export const getPastPoints = (points, date) => {
  return points.filter((point) => isDateAfter(date, point.stop));
};

export const getPointsByFilter = (points, filterType) => {
  const nowDate = new Date();

  switch (filterType) {
    case FilterType.ALL:
      return points.sort((pointA, pointB) => compareDates(pointA.start, pointB.start));
    case FilterType.FUTURE:
      return getFuturePoints(points, nowDate);
    case FilterType.PAST:
      return getPastPoints(points, nowDate);
  }

  return points;
};
