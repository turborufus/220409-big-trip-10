import PointComponent from "../components/point.js";
import PointEditComponent, {getDestinationByName} from "../components/point-edit.js";
import PointModel from '../models/point.js';
import {render, replace, RENDER_POSITION, remove} from "../utils/render.js";

export const MODE = {
  DEFAULT: `default`,
  ADDING: `add`
};

export const EMPTY_POINT = {
  type: ``,
  destination: null,
  start: null,
  stop: null,
  price: 0,
  offers: [],
  isFavorite: false
};

const parseFormData = (formData, destinations) => {
  const type = formData.get(`event-type`);

  const destinationName = formData.get(`event-destination`);
  const start = formData.get(`event-start-time`);
  const stop = formData.get(`event-end-time`);
  const isFavorite = formData.get(`event-favorite`);
  const price = formData.get(`event-price`);
  const offers = [];
  const OFFER_PREFIX = `event-offer-`;
  for (let pair of formData.entries()) {
    if (pair[0].includes(OFFER_PREFIX)) {
      const index = pair[0].indexOf(`|`);
      const offerName = pair[0].substring(OFFER_PREFIX.length, index).replace(/_/g, ` `);
      const offerPrice = pair[0].substring(index + 1);
      const offer = {
        name: offerName,
        price: offerPrice ? parseInt(offerPrice, 10) : 0
      };
      offers.push(offer);
    }
  }

  const destination = getDestinationByName(destinationName, destinations);

  return new PointModel({
    'base_price': price ? parseInt(price, 10) : 0,
    'date_from': start ? new Date(start) : null,
    'date_to': stop ? new Date(stop) : null,
    'destination': {
      'name': destination.name,
      'description': destination.description,
      'pictures': destination.images.map((image) => {
        return {
          'src': image.src,
          'description': image.description
        };
      })
    },
    'is_favorite': isFavorite,
    'offers': offers.map((offer) => {
      return {
        'title': offer.name,
        'price': offer.price
      };
    }),
    'type': type
  });
};

export default class PointController {
  constructor(container, changeDataHandler, changeViewHandler) {
    this._container = container;
    this._changeDataHandler = changeDataHandler;
    this._changeViewHandler = changeViewHandler;

    this._pointComponent = null;
    this._editComponent = null;

    this._mode = MODE.DEFAULT;

    this._onEscKeyDown = this._onEscKeyDown.bind(this);
  }

  destroy() {
    remove(this._editComponent);
    remove(this._pointComponent);
    document.removeEventListener(`keydown`, this._onEscKeyDown);
  }

  render(point, mode, destinations, offers) {
    const oldPointComponent = this._pointComponent;
    const oldEditComponent = this._editComponent;
    this._mode = mode;

    this._pointComponent = new PointComponent(point);
    this._editComponent = new PointEditComponent(point, destinations, offers);

    this._pointComponent.setRollupButtonHandler(() => {
      this._replacePointToEdit();
      document.addEventListener(`keydown`, this._onEscKeyDown);
    });

    this._editComponent.setSaveButtonHandler((evt) => {
      evt.preventDefault();
      const formData = this._editComponent.getData();
      const data = parseFormData(formData, destinations);

      this._changeDataHandler(this, point, data);
    });
    this._editComponent.setResetButtonHandler(() => {
      this._changeDataHandler(this, point, null);
    });
    this._editComponent.setRollupButtonHandler(() => {
      this._replaceEditToPoint();
    });

    this._editComponent.setFavoriteButtonHandler(() => {
      const newPoint = PointModel.clone(point);
      newPoint.isFavorite = !point.isFavorite;

      this._changeDataHandler(this, point, newPoint);
    });

    switch (mode) {
      case MODE.DEFAULT:
        if (oldEditComponent && oldPointComponent) {
          replace(this._pointComponent, oldPointComponent);
          replace(this._editComponent, oldEditComponent);
        } else {
          render(this._container, this._pointComponent.getElement(), RENDER_POSITION.BEFOREEND);
        }
        break;
      case MODE.ADDING:
        if (oldEditComponent && oldPointComponent) {
          remove(oldPointComponent);
          remove(oldEditComponent);
        }
        document.addEventListener(`keydown`, this._onEscKeyDown);
        render(this._container, this._editComponent.getElement(), RENDER_POSITION.AFTERBEGIN);
        break;
    }

  }

  setDefaultView() {
    if (this._mode !== MODE.DEFAULT) {
      this._replaceEditToPoint();
    }
  }

  _replaceEditToPoint() {
    document.removeEventListener(`keydown`, this._onEscKeyDown);

    replace(this._pointComponent, this._editComponent);
    this._mode = MODE.DEFAULT;
  }

  _replacePointToEdit() {
    this._changeViewHandler();

    replace(this._editComponent, this._pointComponent);
    this._mode = MODE.EDIT;
  }

  _onEscKeyDown(evt) {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      if (this._mode === MODE.ADDING) {
        this._changeDataHandler(this, EMPTY_POINT, null);
      }
      this._replaceEditToPoint();
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    }
  }
}
