import {getRandomArrayItem, getRandomIntegerNumber} from "../utils/common.js";
import {getDateDaysThrough, getRandomDate, DAYS_THROUGH} from "../utils/datetime.js";
import {generateOffers} from "./offer.js";
import {DESTINATIONS, TRANSER_TYPES, ACTIVITY_TYPES} from "../const.js";

const generatePoint = () => {
  const id = String(new Date() + Math.random());
  const daysAgo = getRandomIntegerNumber(1, 10);
  const daysAfter = getRandomIntegerNumber(1, 10);
  const startDate = getRandomDate(getDateDaysThrough(daysAgo, DAYS_THROUGH.AGO), new Date());
  const stopDate = getRandomDate(startDate, getDateDaysThrough(daysAfter, DAYS_THROUGH.AFTER));
  const types = TRANSER_TYPES.concat(ACTIVITY_TYPES);
  const type = getRandomArrayItem(types);
  const selectedOffers = generateOffers(type).filter(() => Math.random() > 0.5).slice(0, 2);

  return {
    id,
    type,
    destination: getRandomArrayItem(DESTINATIONS),
    start: startDate,
    stop: stopDate,
    price: getRandomIntegerNumber(1, 15) * 10,
    offers: new Set(selectedOffers),
    isFavorite: Math.random() > 0.5
  };
};

const generatePoints = (count) => {
  return new Array(count)
    .fill(``)
    .map(() => generatePoint());
};

export {generatePoint, generatePoints};
