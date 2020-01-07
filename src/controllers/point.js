import EventComponent from "../components/event.js";
import EventEditComponent from "../components/event-edit.js";
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

    this._eventComponent = null;
    this._editComponent = null;

    this._mode = MODE.DEFAULT;

    this._onEscKeyDown = this._onEscKeyDown.bind(this);
  }

  render(tripEvent) {
    const oldEventComponent = this._eventComponent;
    const oldEditComponent = this._editComponent;

    this._eventComponent = new EventComponent(tripEvent);
    this._editComponent = new EventEditComponent(tripEvent);

    this._eventComponent.setRollupButtonHandler(() => {
      this._replaceEventToEdit();
      document.addEventListener(`keydown`, this._onEscKeyDown);
    });

    this._editComponent.setSaveButtonHandler((evt) => {
      evt.preventDefault();
      this._replaceEditToEvent();
    });
    this._editComponent.setResetButtonHandler((evt) => {
      evt.preventDefault();
      this._replaceEditToEvent();
    });

    this._editComponent.setFavoriteButtonHandler(() => {
      this._onDataChange(this, tripEvent, Object.assign({}, tripEvent, {
        isFavorite: !tripEvent.isFavorite,
      }));
    });

    if (oldEditComponent && oldEventComponent) {
      replace(this._eventComponent, oldEventComponent);
      replace(this._editComponent, oldEditComponent);
    } else {
      render(this._container, this._eventComponent.getElement(), RENDER_POSITION.BEFOREEND);
    }
  }

  setDefaultView() {
    if (this._mode !== MODE.DEFAULT) {
      this._replaceEditToEvent();
    }
  }

  _replaceEditToEvent() {
    document.removeEventListener(`keydown`, this._onEscKeyDown);

    replace(this._eventComponent, this._editComponent);
    this._mode = MODE.DEFAULT;
  }

  _replaceEventToEdit() {
    this._onViewChange();

    replace(this._editComponent, this._eventComponent);
    this._mode = MODE.EDIT;
  }

  _onEscKeyDown(evt) {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      this._replaceEditToEvent();
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    }
  }
}
