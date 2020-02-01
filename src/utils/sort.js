import {SortType} from "../const.js";

export const sortByType = (points, sortType) => {
  let sortedPoints = [];
  switch (sortType) {
    case SortType.EVENT:
      sortedPoints = points;
      break;
    case SortType.TIME:
      sortedPoints = points.slice().sort((a, b) => {
        const aDur = a.stop.getTime() - a.start.getTime();
        const bDur = b.stop.getTime() - b.start.getTime();
        return bDur - aDur;
      });
      break;
    case SortType.PRICE:
      sortedPoints = points.slice().sort((a, b) => b.price - a.price);
  }
  return sortedPoints;
};
