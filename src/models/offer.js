export default class Offer {
  constructor(data) {
    this.type = data[`type`];
    this.offers = data[`offers`].map((offer) => {
      return {
        type: data[`type`],
        name: offer[`title`],
        price: offer[`price`]
      };
    });
  }

  getAllOffers() {
    return this.offers;
  }

  toRAW() {
    return {
      'type': this.type,
      'offers': this.offers.map(this.offerToRAW)
    };
  }

  offerToRAW(offer) {
    return {
      'title': offer.name,
      'price': offer.price
    };
  }

  static parseOffer(data) {
    return new Offer(data);
  }

  static parseOffers(data) {
    return data.map(Offer.parseOffer);
  }
}


