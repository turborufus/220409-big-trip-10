export default class Destination {
  constructor(data) {
    this.name = data[`name`];
    this.description = data[`description`];
    this.images = [];
    if (data[`pictures`].length) {
      this.images = data[`pictures`].map((picture) => {
        return {
          src: picture[`src`],
          description: picture[`description`]
        };
      });
    }
  }

  toRAW() {
    const imagesToRAW = this.images.map((img) => {
      return {
        'src': img.src,
        'description': img.description
      };
    });

    return {
      'description': this.description,
      'name': this.name,
      'pictures': imagesToRAW
    };
  }

  static parseDestination(data) {
    return new Destination(data);
  }

  static parseDestinations(data) {
    return data.map(Destination.parseDestination);
  }
}

