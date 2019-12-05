import {getRandomArrayItem, getRandomIntegerNumber} from "../utils.js";

const Offers = [`Order Uber`, `Add luggage`, `Switch to comfort`,
  `Add breakfast`, `Book tickets`, `Lunch in city`];

const generateOffer = (type) => {
  return {
    type,
    name: getRandomArrayItem(Offers),
    price: getRandomIntegerNumber(1, 10) * 10
  };
};

const generateOffers = (type, count) => {
  return new Array(count)
    .fill(``)
    .map(generateOffer(type));
};

export {generateOffers};
