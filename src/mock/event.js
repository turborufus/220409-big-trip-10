import {getRandomArrayItem, getRandomIntegerNumber, getDateDaysThrough, getRandomDate, DAYS_THROUGH} from "../utils.js";
import {generateOffers} from "./offer.js";
import {generateDestination} from "./destination.js";
import {DESTINATIONS, TRANSER_TYPES, ACTIVITY_TYPES} from "../const.js";

const generateEvent = () => {
  const daysAgo = getRandomIntegerNumber(1, 10);
  const daysAfter = getRandomIntegerNumber(1, 10);
  const startDate = getRandomDate(getDateDaysThrough(daysAgo, DAYS_THROUGH.AGO), new Date());
  const stopDate = getRandomDate(startDate, getDateDaysThrough(daysAfter, DAYS_THROUGH.AFTER));
  const types = TRANSER_TYPES.concat(ACTIVITY_TYPES);
  const type = getRandomArrayItem(types);
  const selectedOffers = generateOffers().filter(() => Math.random() > 0.5).slice(0, 2);

  return {
    type,
    destination: generateDestination(getRandomArrayItem(DESTINATIONS)),
    start: startDate,
    stop: stopDate,
    price: getRandomIntegerNumber(1, 15) * 10,
    offers: new Set(selectedOffers)
  };
};

const generateEvents = (count) => {
  return new Array(count)
    .fill(``)
    .map(() => generateEvent());
};

export {generateEvent, generateEvents};
