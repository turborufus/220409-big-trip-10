import TripInfoComponent from '../components/trip-info.js';
import {render, RenderPosition, remove} from '../utils/render.js';

export default class TripInfo {
  constructor(container) {
    this._container = container;
    this._tripInfoComponent = null;
  }

  render(points) {
    const oldInfoComponent = this._tripInfoComponent;
    this._tripInfoComponent = new TripInfoComponent(points);
    const tripInfoElement = this._tripInfoComponent.getElement();
    if (oldInfoComponent) {
      remove(oldInfoComponent);
    }
    render(this._container, tripInfoElement, RenderPosition.AFTERBEGIN);
  }
}
