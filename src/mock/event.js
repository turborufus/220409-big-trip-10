import {getRandomArrayItem, getRandomIntegerNumber, getDateDaysAgo, getDateDaysAfter, getRandomDate} from "../utils.js";
import {generateOffers} from "./offer.js";
import {generateDestination} from "./destination.js";
import {DESTINATIONS, TRANSER_TYPES, ACTIVITY_TYPES} from "../const.js";

const generateEvent = () => {
  const daysAgo = getRandomIntegerNumber(1, 10);
  const daysAfter = getRandomIntegerNumber(1, 10);
  const startDate = getRandomDate(getDateDaysAgo(daysAgo), new Date());
  const stopDate = getRandomDate(startDate, getDateDaysAfter(daysAfter));
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
