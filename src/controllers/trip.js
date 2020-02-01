import DayItemComponent from "../components/trip-day-item.js";
import DayListComponent from "../components/trip-days.js";
import LoadingComponent from "../components/loading.js";
import PointListComponent from "../components/point-list.js";
import NoPointsComponent from "../components/no-points.js";
import PointController from "./point.js";
import SortComponent from "../components/sort.js";
import {SortType} from "../const.js";
import {render, RenderPosition, remove} from "../utils/render.js";
import {isSame, getDayTimestamp} from "../utils/datetime.js";
import {Mode, EMPTY_POINT} from "../controllers/point.js";

const renderPoints = (pointListElement, points, changeDataHandler, changeViewHandler, destinations, offers) => {
  return points.map((point) => {
    const pointController = new PointController(pointListElement, changeDataHandler, changeViewHandler);
    pointController.render(point, Mode.DEFAULT, destinations, offers);
    return pointController;
  });
};

export default class TripController {
  constructor(container, pointsModel, tripInfoController, addPointButtonComponent, api) {
    this._pointsModel = pointsModel;
    this._pointControllers = [];
    this._tripInfoController = tripInfoController;

    this._container = container;
    this._loadingComponent = new LoadingComponent();
    this._noPointsComponent = new NoPointsComponent();
    this._dayListComponent = new DayListComponent();
    this._sortComponent = new SortComponent();
    this._addPointButtonComponent = addPointButtonComponent;

    this._changeDataHandler = this._changeDataHandler.bind(this);
    this._changeFilterHandler = this._changeFilterHandler.bind(this);
    this._changeSortTypeHandler = this._changeSortTypeHandler.bind(this);
    this._changeViewHandler = this._changeViewHandler.bind(this);
    this._clickAddPointButtonHandler = this._clickAddPointButtonHandler.bind(this);
    this._api = api;

    this._creatingPoint = null;

    this._pointsModel.setChangeFilterHandler(this._changeFilterHandler);
    this._sortComponent.setSortTypeChangeHandler(this._changeSortTypeHandler);

    this._addPointButtonComponent.setAddPointButtonClickHandler(this._clickAddPointButtonHandler);
  }

  hide() {
    this._sortComponent.hide();
    this._dayListComponent.hide();
    this._noPointsComponent.hide();
  }

  show() {
    this._sortComponent.show();
    this._dayListComponent.show();
    this._noPointsComponent.show();
  }

  render() {
    const points = this._pointsModel.getPoints();
    const container = this._container;

    remove(this._loadingComponent);

    if (!points.length) {
      remove(this._dayListComponent);
      remove(this._sortComponent);
      render(container, this._noPointsComponent.getElement(), RenderPosition.BEFOREEND);
    } else {
      render(container, this._sortComponent.getElement(), RenderPosition.BEFOREEND);
      this._sortComponent.setSortTypeChangeHandler(this._changeSortTypeHandler);

      const tripDayListElement = this._dayListComponent.getElement();
      render(container, tripDayListElement, RenderPosition.BEFOREEND);
      this._renderPoints(points);
    }
    this._updateTripInfo();
  }

  renderLoading() {
    render(this._container, this._loadingComponent.getElement(), RenderPosition.BEFOREEND);
  }

  _createPoint() {
    if (this._creatingPoint) {
      return;
    }

    this._changeViewHandler();

    const tripDayListElement = this._dayListComponent.getElement();
    const dayItemElement = new DayItemComponent(null, 0).getElement();
    const pointListElement = new PointListComponent().getElement();
    render(tripDayListElement, dayItemElement, RenderPosition.AFTERBEGIN);
    render(dayItemElement, pointListElement, RenderPosition.BEFOREEND);

    if (this._pointsModel.getAllPoints().length === 0) {
      render(this._container, tripDayListElement, RenderPosition.AFTERBEGIN);
      remove(this._noPointsComponent);
    }

    const offers = this._pointsModel.getOffers();
    const destinations = this._pointsModel.getDestinations();
    this._creatingPoint = new PointController(pointListElement, this._changeDataHandler, this._changeViewHandler);
    this._creatingPoint.render(EMPTY_POINT, Mode.ADDING, destinations, offers);
  }

  _renderPoints(points) {
    const tripDayListElement = this._dayListComponent.getElement();
    const destinations = this._pointsModel.getDestinations();
    const offers = this._pointsModel.getOffers();
    if (this._sortComponent.currentSortType === SortType.EVENT) {
      const tripDays = new Set(points.map((point) => getDayTimestamp(point.start)));

      Array.from(tripDays).sort().forEach((dayInMilliseconds, i) => {
        const dayItemComponent = new DayItemComponent(new Date(dayInMilliseconds), i + 1);
        render(tripDayListElement, dayItemComponent.getElement(), RenderPosition.BEFOREEND);

        const pointListComponent = new PointListComponent();
        render(dayItemComponent.getElement(), pointListComponent.getElement(), RenderPosition.BEFOREEND);

        const dayPoints = points.filter((point) => {
          return (isSame(point.start, dayItemComponent.date, `day`));
        });
        const newPoints = renderPoints(pointListComponent.getElement(), dayPoints, this._changeDataHandler, this._changeViewHandler, destinations, offers);
        this._pointControllers = this._pointControllers.concat(newPoints);
      });
    } else {
      const dayItemComponent = new DayItemComponent(null, 0);
      render(tripDayListElement, dayItemComponent.getElement(), RenderPosition.BEFOREEND);

      const pointListComponent = new PointListComponent();
      render(dayItemComponent.getElement(), pointListComponent.getElement(), RenderPosition.BEFOREEND);

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
        this._api.createPoint(newData)
          .then((pointModel) => {
            const pointsModel = this._pointsModel;
            pointsModel.addPoint(pointModel);
            pointController.render(pointModel, Mode.DEFAULT, pointsModel.getDestinations(), pointsModel.getOffers());
            this._updatePoints();
            this._updateTripInfo();
          })
          .catch(() => pointController.shake());
      }
    } else if (newData) {
      this._api.updatePoint(oldData.id, newData)
        .then((pointModel) => {
          const pointsModel = this._pointsModel;
          isSuccess = pointsModel.updatePoint(oldData.id, pointModel);

          if (isSuccess) {
            pointController.render(pointModel, Mode.EDIT, pointsModel.getDestinations(), pointsModel.getOffers());
            this._updateTripInfo();
          }
        })
        .catch(() => pointController.shake());
    } else {
      this._api.deletePoint(oldData.id)
        .then(() => {
          this._pointsModel.removePoint(oldData.id);
          if (this._pointsModel.getAllPoints().length > 0) {
            this._updatePoints();
          } else {
            this.render();
          }
          this._updateTripInfo();
        })
        .catch(() => pointController.shake());
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
    this._pointsModel.setSortType(sortType);
    const sortedPoints = this._pointsModel.getPoints();
    this._sortComponent.rerender();
    this._removePoints();
    this._renderPoints(sortedPoints);
  }

  _changeViewHandler() {
    this._pointControllers.forEach((it) => it.setDefaultView());
    if (this._creatingPoint) {
      this._creatingPoint.destroy();
      this._creatingPoint = null;
    }
  }

  _clickAddPointButtonHandler() {
    this._createPoint();
  }
}
