import EventComponent from "./event.js";
import EventEditComponent from "./event-edit.js";
import {render, replace, RENDER_POSITION} from "../utils/render.js";

export default class PointController {
  constructor(container) {
    this._container = container;
  }

  render(event) {
    const onEscKeyDown = (evt) => {
      const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

      if (isEscKey) {
        replaceEditToEvent();
        document.removeEventListener(`keydown`, onEscKeyDown);
      }
    };

    const replaceEditToEvent = () => {
      replace(eventComponent, editComponent);
    };

    const replaceEventToEdit = () => {
      replace(editComponent, eventComponent);
    };

    const eventComponent = new EventComponent(event);
    eventComponent.setRollupButtonHandler(() => {
      replaceEventToEdit();
      document.addEventListener(`keydown`, onEscKeyDown);
    });

    const editComponent = new EventEditComponent(event);
    editComponent.setSaveButtonHandler(replaceEditToEvent);
    editComponent.setResetButtonHandler(replaceEditToEvent);

    render(this._container, eventComponent.getElement(), RENDER_POSITION.BEFOREEND);
  }
}
