import {getRandomArrayItem, getRandomIntegerNumber, getDateDaysAgo, getRandomDate} from "../utils.js";
import {generateOffers} from "./offer.js";
import {generateDestination} from "./destination.js";
import {Destinations, TransferTypes, ActivityTypes} from "../const.js";

const generateEvent = () => {
  const daysAgo = getRandomIntegerNumber(1, 10);
  const startDate = getRandomDate(getDateDaysAgo(daysAgo), new Date());
  const stopDate = getRandomDate(startDate, new Date());
  const types = TransferTypes.concat(ActivityTypes);
  const type = getRandomArrayItem(types);
  const selectedOffers = generateOffers().filter(Math.random > 0.5).slice(0, 2);

  return {
    type,
    destination: generateDestination(getRandomArrayItem(Destinations)),
    start: startDate,
    stop: stopDate,
    price: getRandomIntegerNumber(1, 15) * 10,
    offers: new Set(selectedOffers)
  };
};

const generateEvents = (count) => {
  return new Array(count)
    .fill(generateEvent());
};

export {generateEvent, generateEvents};
