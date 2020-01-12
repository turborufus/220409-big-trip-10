import PointComponent from "../components/point.js";
import PointEditComponent from "../components/point-edit.js";
import {render, replace, RENDER_POSITION} from "../utils/render.js";

const MODE = {
  DEFAULT: `default`,
  EDIT: `edit`
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

  render(point) {
    const oldPointComponent = this._pointComponent;
    const oldEditComponent = this._editComponent;

    this._pointComponent = new PointComponent(point);
    this._editComponent = new PointEditComponent(point);

    this._pointComponent.setRollupButtonHandler(() => {
      this._replacePointToEdit();
      document.addEventListener(`keydown`, this._onEscKeyDown);
    });

    this._editComponent.setSaveButtonHandler((evt) => {
      evt.preventDefault();
      this._replaceEditToPoint();
    });
    this._editComponent.setResetButtonHandler((evt) => {
      evt.preventDefault();
      this._replaceEditToPoint();
    });

    this._editComponent.setFavoriteButtonHandler(() => {
      this._onDataChange(this, point, Object.assign({}, point, {
        isFavorite: !point.isFavorite,
      }));
    });

    if (oldEditComponent && oldPointComponent) {
      replace(this._pointComponent, oldPointComponent);
      replace(this._editComponent, oldEditComponent);
    } else {
      render(this._container, this._pointComponent.getElement(), RENDER_POSITION.BEFOREEND);
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
      this._replaceEditToPoint();
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    }
  }
}
