import Point from './models/point.js';

const METHOD = {
  GET: `GET`,
  POST: `POST`,
  PUT: `PUT`,
  DELETE: `DELETE`
};

const checkStatus = (response) => {
  if (response.status >= 200 && response.status < 300) {
    return status;
  } else {
    throw new Error(`${response.status}: ${response.statusText}`);
  }
};

const API = class {
  constructor(endPoint, autorisation) {
    this._endPoint = endPoint;
    this._autorization = autorisation;
  }

  getPoints() {
    return this._load({url: `points`})
      .then((response) => response.json())
      .then(Point.parsePoint());
  }

  createPoint() {
    
  }

  updatePoint() {
    
  }

  deletePoint() {
    
  }

  _load({url, method = METHOD.GET, body = null, headers = new Headers()}) {
    headers.append(`Authorization`, this._autorization);

    return fetch(`${this._endPoint}/${url}`, {method, body, headers})
      .then(checkStatus)
      .catch((err) => {
        throw err;
      });
  }
};

export default API;
