import {getRandomArrayItem, getRandomIntegerNumber} from "../utils.js";

const Offers = [`Order Uber`, `Add luggage`, `Switch to comfort`,
  `Add breakfast`, `Book tickets`, `Lunch in city`];

const generateOffer = (type, name) => {
  return {
    type,
    name,
    price: getRandomIntegerNumber(1, 10) * 10
  };
};

const generateOffers = (type) => {
  return Offers
    .map((it) => generateOffer(type, it));
};

export {generateOffers};
