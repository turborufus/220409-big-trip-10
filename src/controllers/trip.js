import DayItemComponent from "../components/trip-day-item.js";
import DayListComponent from "../components/trip-days.js";
import PointListComponent from "../components/point-list.js";
import NoPointsComponent from "../components/no-points.js";
import PointController from "./point.js";
import SortComponent from "../components/sort.js";
import {SORT_TYPE} from "../components/sort.js";
import {render, RENDER_POSITION} from "../utils/render.js";
import {isSame, getDayTimestamp} from "../utils/datetime.js";
import {MODE, EMPTY_POINT} from "../controllers/point.js";

const renderPoints = (pointListElement, points, changeDataHandler, changeViewHandler, destinations, offers) => {
  return points.map((point) => {
    const pointController = new PointController(pointListElement, changeDataHandler, changeViewHandler);
    pointController.render(point, MODE.DEFAULT, destinations, offers);
    return pointController;
  });
};

export default class TripController {
  constructor(container, pointsModel, tripInfoController, addPointButtonComponent) {
    this._pointsModel = pointsModel;
    this._pointControllers = [];
    this._tripInfoController = tripInfoController;

    this._container = container;
    this._noPointsComponent = new NoPointsComponent();
    this._dayListComponent = new DayListComponent();
    this._sortComponent = new SortComponent();
    this._addPointButtonComponent = addPointButtonComponent;

    this._changeDataHandler = this._changeDataHandler.bind(this);
    this._changeFilterHandler = this._changeFilterHandler.bind(this);
    this._changeSortTypeHandler = this._changeSortTypeHandler.bind(this);
    this._changeViewHandler = this._changeViewHandler.bind(this);
    this._clickAddPointButtonHandler = this._clickAddPointButtonHandler.bind(this);

    this._creatingPoint = null;

    this._pointsModel.setChangeFilterHandler(this._changeFilterHandler);
    this._sortComponent.setSortTypeChangeHandler(this._changeSortTypeHandler);

    this._addPointButtonComponent.setAddPointButtonClickHandler(this._clickAddPointButtonHandler);
  }

  hide() {
    this._sortComponent.hide();
    this._dayListComponent.hide();
  }

  show() {
    this._sortComponent.show();
    this._dayListComponent.show();
  }

  render() {
    const points = this._pointsModel.getPoints();
    const container = this._container;

    if (!points.length) {
      render(container, this._noPointsComponent.getElement(), RENDER_POSITION.BEFOREEND);
    } else {
      render(container, this._sortComponent.getElement(), RENDER_POSITION.BEFOREEND);
      this._sortComponent.setSortTypeChangeHandler(this._changeSortTypeHandler);

      const tripDayListElement = this._dayListComponent.getElement();
      render(container, tripDayListElement, RENDER_POSITION.BEFOREEND);
      this._renderPoints(points);
    }
    this._updateTripInfo();
  }

  _createPoint() {
    if (this._creatingPoint) {
      return;
    }

    const tripDayListElement = this._dayListComponent.getElement();
    const dayItemElement = new DayItemComponent(null, 0).getElement();
    const pointListElement = new PointListComponent().getElement();
    render(tripDayListElement, dayItemElement, RENDER_POSITION.AFTERBEGIN);
    render(dayItemElement, pointListElement, RENDER_POSITION.BEFOREEND);

    const offers = this._pointsModel.getOffers();
    const destinations = this._pointsModel.getDestinations();
    this._creatingPoint = new PointController(pointListElement, this._changeDataHandler, this._changeViewHandler);
    this._creatingPoint.render(EMPTY_POINT, MODE.ADDING, destinations, offers);
  }

  _renderPoints(points) {
    const tripDayListElement = this._dayListComponent.getElement();
    const destinations = this._pointsModel.getDestinations();
    const offers = this._pointsModel.getOffers();
    if (this._sortComponent.currentSortType === SORT_TYPE.EVENT) {
      const tripDays = new Set(points.map((point) => getDayTimestamp(point.start)));

      Array.from(tripDays).sort().forEach((dayInMilliseconds, i) => {
        const dayItemComponent = new DayItemComponent(new Date(dayInMilliseconds), i + 1);
        render(tripDayListElement, dayItemComponent.getElement(), RENDER_POSITION.BEFOREEND);

        const pointListComponent = new PointListComponent();
        render(dayItemComponent.getElement(), pointListComponent.getElement(), RENDER_POSITION.BEFOREEND);

        const dayPoints = points.filter((point) => {
          return (isSame(point.start, dayItemComponent.date, `day`));
        });
        const newPoints = renderPoints(pointListComponent.getElement(), dayPoints, this._changeDataHandler, this._changeViewHandler, destinations, offers);
        this._pointControllers = this._pointControllers.concat(newPoints);
      });
    } else {
      const dayItemComponent = new DayItemComponent(null, 0);
      render(tripDayListElement, dayItemComponent.getElement(), RENDER_POSITION.BEFOREEND);

      const pointListComponent = new PointListComponent();
      render(dayItemComponent.getElement(), pointListComponent.getElement(), RENDER_POSITION.BEFOREEND);

      this._pointControllers = renderPoints(pointListComponent.getElement(), points, this._changeDataHandler, this._changeViewHandler, destinations, offers);
    }
  }

  _removePoints() {
    this._pointControllers.forEach((controller) => controller.destroy());
    this._pointControllers = [];
    const dayListElement = this._dayListComponent.getElement();
    dayListElement.innerHTML = ``;
  }

  _changeDataHandler(pointController, oldData, newData) {
    let isSuccess = false;
    if (oldData === EMPTY_POINT) {
      this._creatingPoint = null;
      if (newData === null) {
        pointController.destroy();
      } else {
        this._pointsModel.addPoint(newData);
        this._updatePoints();
        this._updateTripInfo();
      }
    } else if (newData) {
      isSuccess = this._pointsModel.updatePoint(oldData.id, newData);
      if (isSuccess) {
        this._updatePoints();
        this._updateTripInfo();
      }
    } else {
      isSuccess = this._pointsModel.removePoint(oldData.id);
      if (isSuccess) {
        this._updateTripInfo();
        this._updatePoints();
      }
    }
  }

  _updatePoints() {
    this._removePoints();
    this._renderPoints(this._pointsModel.getPoints());
  }

  _updateTripInfo() {
    this._tripInfoController.render(this._pointsModel.getPoints());
  }

  _changeFilterHandler() {
    this._updatePoints();
  }

  _changeSortTypeHandler(sortType) {
    let sortedPoints = [];
    switch (sortType) {
      case SORT_TYPE.EVENT:
        sortedPoints = this._pointsModel.getPoints();
        break;
      case SORT_TYPE.TIME:
        sortedPoints = this._pointsModel.getPoints().slice().sort((a, b) => {
          const aDur = a.stop.getTime() - a.start.getTime();
          const bDur = b.stop.getTime() - b.start.getTime();
          return bDur - aDur;
        });
        break;
      case SORT_TYPE.PRICE:
        sortedPoints = this._pointsModel.getPoints().slice().sort((a, b) => b.price - a.price);
    }
    this._sortComponent.rerender();
    this._removePoints();
    this._renderPoints(sortedPoints);
  }

  _changeViewHandler() {
    this._pointControllers.forEach((it) => it.setDefaultView());
  }

  _clickAddPointButtonHandler() {
    this._createPoint();
  }
}
