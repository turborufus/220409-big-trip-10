import Destination from './models/destination.js';
import Offer from './models/offer.js';
import Point from './models/point.js';


const METHOD = {
  GET: `GET`,
  POST: `POST`,
  PUT: `PUT`,
  DELETE: `DELETE`
};

const checkStatus = (response) => {
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    throw new Error(`${response.status}: ${response.statusText}`);
  }
};

const API = class {
  constructor(endPoint, authorization) {
    this._endPoint = endPoint;
    this._authorization = authorization;
  }

  getDestinations() {
    return this._load({url: `destinations`})
      .then((response) => response.json())
      .then(Destination.parseDestinations);
  }

  getOffers() {
    return this._load({url: `offers`})
      .then((response) => response.json())
      .then(Offer.parseOffers);
  }

  getPoints(availableDestinations, availableOffers) {
    return this._load({url: `points`})
      .then((response) => response.json())
      .then((data) => Point.parsePoints(data, availableDestinations, availableOffers));
  }

  createPoint() {

  }

  updatePoint(id, data) {
    return this._load({
      url: `points/${id}`,
      method: METHOD.PUT,
      body: JSON.stringify(data.toRAW()),
      headers: new Headers({'Content-Type': `application/json`})
    })
    .then((response) => response.json())
    .then(Point.parsePoint);
  }

  deletePoint() {

  }

  _load({url, method = METHOD.GET, body = null, headers = new Headers()}) {
    headers.append(`Authorization`, this._authorization);

    return fetch(`${this._endPoint}/${url}`, {method, body, headers})
      .then(checkStatus)
      .catch((err) => {
        throw err;
      });
  }
};

export default API;
