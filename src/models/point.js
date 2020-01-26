export default class Point {
  constructor(data, destinations, offers) {
    this.id = data[`id`];
    this.type = data[`type`];
    this.destination = this._getDestination(data[`destination`], destinations);
    this.start = data[`date_from`] ? new Date(data[`date_from`]) : null;
    this.stop = data[`date_to`] ? new Date(data[`date_to`]) : null;
    this.price = data[`base_price`];
    this.isFavorite = Boolean(data[`is_favorite`]);
    this.offers = data[`offers`] ? this._getSelectedOffers(data[`offers`], offers) : new Set();
  }

  toRaw() {
    return {
      'base_price': this.price,
      'date_from': this.start ? this.start.toISOString() : null,
      'date_to': this.stop ? this.stop.toISOString() : null,
      'destination': this.destination,
      'id': this.id,
      'is_favorite': this.isFavorite,
      'offers': Array.from(this.offers),
      'type': this.type
    };
  }

  static parsePoint(data, availableDestinations, availableOffers) {
    return new Point(data, availableDestinations, availableOffers);
  }

  static parsePoints(data, availableDestinations, availableOffers) {
    return data.map((it) => Point.parsePoint(it, availableDestinations, availableOffers));
  }

  static clone(point) {
    return new Point(point.toRaw);
  }

  _getDestination(data, availableDestinations) {
    const destinationName = data[`name`];
    const index = availableDestinations.map((dest) => dest.name).indexOf(destinationName.name);

    if (index < 0) {
      return null;
    }

    return availableDestinations[index];
  }

  _getSelectedOffers(data, availableOffers) {
    const offerNames = data.map((offer) => offer[`title`]);
    const offers = availableOffers.filter((offer) => {
      const index = offerNames.indexOf(offer.name);
      return index >= 0;
    });
    return new Set(offers);
  }
}
