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

  static parseDestination(data) {
    return new Destination(data);
  }

  static parseDestinations(data) {
    return data.map(Destination.parseDestination);
  }
}

