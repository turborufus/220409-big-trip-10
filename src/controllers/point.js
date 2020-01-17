import PointComponent from "../components/point.js";
import PointEditComponent from "../components/point-edit.js";
import {render, replace, RENDER_POSITION, remove} from "../utils/render.js";

export const MODE = {
  DEFAULT: `default`,
  EDIT: `edit`,
  ADD: `add`
};

export const EMPTY_POINT = {
  type: ``,
  destination: ``,
  start: null,
  stop: null,
  price: 0,
  offers: [],
  isFavorite: false
};

export default class PointController {
  constructor(container, onDataChange, onViewChange) {
    this._container = container;
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;

    this._pointComponent = null;
    this._editComponent = null;

    this._mode = MODE.DEFAULT;

    this._onEscKeyDown = this._onEscKeyDown.bind(this);
  }

  render(point, mode) {
    const oldPointComponent = this._pointComponent;
    const oldEditComponent = this._editComponent;
    this._mode = mode;

    this._pointComponent = new PointComponent(point);
    this._editComponent = new PointEditComponent(point);

    this._pointComponent.setRollupButtonHandler(() => {
      this._replacePointToEdit();
      document.addEventListener(`keydown`, this._onEscKeyDown);
    });

    this._editComponent.setSaveButtonHandler((evt) => {
      evt.preventDefault();
      const data = this._editComponent.getData();
      this._onDataChange(this, point, data);
    });
    this._editComponent.setResetButtonHandler(() => {
      this._onDataChange(this, point, null);
    });
    this._editComponent.setRollupButtonHandler(() => {
      this._replaceEditToPoint();
    });

    this._editComponent.setFavoriteButtonHandler(() => {
      this._onDataChange(this, point, Object.assign({}, point, {
        isFavorite: !point.isFavorite,
      }));
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
      case MODE.ADD:
        if (oldEditComponent && oldPointComponent) {
          remove(oldPointComponent);
          remove(oldEditComponent);
        }
        document.addEventListener(`keydown`, this._onEscKeyDown);
        render(this._container, this.PointComponent.getElement(), RENDER_POSITION.AFTERBEGIN);
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
    this._onViewChange();

    replace(this._editComponent, this._pointComponent);
    this._mode = MODE.EDIT;
  }

  _onEscKeyDown(evt) {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      if (this._mode === MODE.ADD) {
        this._onDataChange(this, EMPTY_POINT, null);
      }
      this._replaceEditToPoint();
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    }
  }
}
