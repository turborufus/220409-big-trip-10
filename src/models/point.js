export default class Point {
  constructor(data) {
    this.id = data[`id`];
    this.type = data[`type`];
    this.destination = this._getDestination(data[`destination`]);
    this.start = data[`date_from`] ? new Date(data[`date_from`]) : null;
    this.stop = data[`date_to`] ? new Date(data[`date_to`]) : null;
    this.price = data[`base_price`];
    this.isFavorite = Boolean(data[`is_favorite`]);
    this.offers = data[`offers`] ? data[`offers`].map((offer) => {
      return {
        type: data[`type`],
        name: offer[`title`],
        price: offer[`price`]
      };
    }) : [];
  }

  toRAW() {
    return {
      'base_price': this.price,
      'date_from': this.start ? this.start.toISOString() : null,
      'date_to': this.stop ? this.stop.toISOString() : null,
      'destination': {
        'name': this.destination.name,
        'description': this.destination.description,
        'pictures': this.destination.images.map((image) => {
          return {
            'src': image.src,
            'description': image.description
          };
        })
      },
      'id': this.id,
      'is_favorite': this.isFavorite,
      'offers': this.offers.map((offer) => {
        return {
          'title': offer.name,
          'price': offer.price
        };
      }),
      'type': this.type
    };
  }

  static parsePoint(data) {
    return new Point(data);
  }

  static parsePoints(data) {
    return data.map(Point.parsePoint);
  }

  static clone(point) {
    return new Point(point.toRAW());
  }

  _getDestination(data) {
    if (data) {
      return {
        name: data[`name`],
        description: data[`description`],
        images: data[`pictures`].map((picture) => {
          return {
            src: picture[`src`],
            description: picture[`description`]
          };
        })
      };
    }

    return null;
  }

  _getSelectedOffers(data, availableOffers) {
    const offerNames = data.map((offer) => offer[`title`]);
    const offers = availableOffers.filter((offer) => {
      const index = offerNames.indexOf(offer.name);
      return index >= 0;
    });
    return offers;
  }
}
