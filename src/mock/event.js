import {getRandomArrayItem, getRandomIntegerNumber, getDateDaysAgo,  getRandomDate} from "../utils.js";
import {generateOffers} from "./offer.js";
import {generateDestination} from "./destination.js";

const Types = [`bus`, `check-in`, `drive`, `flight`, `restaurant`, 
  `ship`, `sightseeing`, `taxi`, `train`, `transport`];

const TypePlaceholder = {
  'bus': `Bus to `,
  'check-in': `Check into `,
  'drive': `Drive to `,
  'flight': `Flight to `,
  'restaurant': `Restaurant in `,
  'ship': `Ship to `,
  'sightseeing': `Sightseeing in `,
  'taxi': `Taxi to `,
  'train': `Train to `,
  'transport': `Transport to `
};

const Destinations = [`Geneva`, `Amsterdam`, `Saint Petersburg`, `Moscow`, `Brugge`];

const generateEvent = () => {
  const daysAgo = getRandomIntegerNumber(1, 10);
  const startDate = getRandomDate(getDateDaysAgo(daysAgo), new Date());
  const stopDate = getRandomDate(startDate, new Date());

  return {
    type: getRandomArrayItem(Types),
    destination: generateDestination(getRandomArrayItem(Destinations)),
    start: startDate,
    stop: stopDate,
    price: getRandomIntegerNumber(1, 15) * 10,
    offers: new Set(generateOffers(getRandomIntegerNumber(0, 2)))
  };
};

export {generateEvent};
