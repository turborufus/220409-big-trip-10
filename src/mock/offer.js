import {getRandomArrayItem, getRandomIntegerNumber} from "../utils/common.js";

const OfferNames = [`Order Uber`, `Add luggage`, `Switch to comfort`,
  `Add breakfast`, `Book tickets`, `Lunch in city`];

const generateOffer = (type) => {
  return {
    type,
    name: getRandomArrayItem(OfferNames),
    price: getRandomIntegerNumber(1, 10) * 10
  };
};

const generateOffers = (type) => {
  return new Array(getRandomIntegerNumber(1, 5))
    .fill(``)
    .map(() => generateOffer(type));
};

export {generateOffers};
