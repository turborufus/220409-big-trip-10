import API from './api.js';
import AddPointButtonComponent from "./components/add-point-button.js";
import SiteMenuComponent, {MENU_TAB} from "./components/menu.js";
import StatisticsComponent from './components/statistics.js';
import TripController from "./controllers/trip.js";
import PointsModel from "./models/points.js";
import {render, RENDER_POSITION} from "./utils/render.js";
import FilterController from "./controllers/filter.js";
import TripInfoController from "./controllers/trip-info.js";

const AUTHORIZATION = `Basic eo0w590ik29889a`;
const END_POINT = `https://htmlacademy-es-10.appspot.com/big-trip/`;

const pointsModel = new PointsModel();

const api = new API(END_POINT, AUTHORIZATION);

Promise.all([api.getDestinations(), api.getOffers(), api.getPoints()])
  .then(([destinations, offers, points]) => {
    pointsModel.setPoints(points);
    pointsModel.setDestinations(destinations);
    pointsModel.setOffers(offers);
  });

const tripMainElement = document.querySelector(`.trip-main`);
const tripInfoMainElement = tripMainElement.querySelector(`.trip-info`);
tripInfoMainElement.remove();
const addPointButtonElement = tripMainElement.querySelector(`.trip-main__event-add-btn`);
addPointButtonElement.remove();
const addPointButtonComponent = new AddPointButtonComponent();
render(tripMainElement, addPointButtonComponent.getElement(), RENDER_POSITION.BEFOREEND);

const tripControlsElement = tripMainElement.querySelector(`.trip-controls`);
const menuTitleElement = tripControlsElement.querySelector(`h2:nth-of-type(1)`);
const filterTitleElement = tripControlsElement.querySelector(`h2:nth-of-type(2)`);
menuTitleElement.remove();
filterTitleElement.remove();

render(tripControlsElement, menuTitleElement, RENDER_POSITION.BEFOREEND);
const siteMenuComponent = new SiteMenuComponent();
render(tripControlsElement, siteMenuComponent.getElement(), RENDER_POSITION.BEFOREEND);
render(tripControlsElement, filterTitleElement, RENDER_POSITION.BEFOREEND);

const filterController = new FilterController(tripControlsElement, pointsModel);
filterController.render();

const tripEventsElement = document.querySelector(`.trip-events`);

const tripInfoController = new TripInfoController(tripMainElement);
const tripController = new TripController(tripEventsElement, pointsModel, tripInfoController, addPointButtonComponent);
tripController.render();
tripController.show();

const statisticsComponent = new StatisticsComponent(pointsModel.getAllPoints());
render(tripEventsElement, statisticsComponent.getElement(), RENDER_POSITION.BEFOREEND);
statisticsComponent.hide();

siteMenuComponent.setChangeMenuTabHandler((menuTab) => {
  switch (menuTab) {
    case MENU_TAB.DEFAULT:
      statisticsComponent.hide();
      tripController.show();
      break;
    case MENU_TAB.STATS:
      tripController.hide();
      statisticsComponent.rerender(pointsModel.getAllPoints());
      statisticsComponent.show();
      break;
  }
  siteMenuComponent.setActiveTab(menuTab);
});

