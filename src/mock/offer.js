import {getRandomArrayItem, getRandomIntegerNumber} from "../utils/common.js";

const OfferTypes = [`luggage`, `comfort`, `tickets`, `train`, `seats`, `lunch`, `breakfast`, `meal`];
const OfferNames = [`Order Uber`, `Add luggage`, `Switch to comfort`,
  `Add breakfast`, `Book tickets`, `Lunch in city`];

const generateOffer = (type) => {
  return {
    type,
    name: getRandomArrayItem(OfferNames),
    price: getRandomIntegerNumber(1, 10) * 10
  };
};

const generateOffers = () => {
  return OfferTypes
    .map((type) => generateOffer(type));
};

export {generateOffers};
