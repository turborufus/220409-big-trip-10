import AddPointButtonComponent from "./components/add-point-button.js";
import SiteMenuComponent, {MENU_TAB} from "./components/menu.js";
import StatisticsComponent from './components/statistics.js';
import TripController from "./controllers/trip.js";
import PointsModel from "./models/points.js";
import {generateMenuTabs} from "./mock/menuTab.js";
import {generatePoints} from "./mock/point.js";
import {render, RENDER_POSITION} from "./utils/render.js";
import FilterController from "./controllers/filter.js";
import TripInfoController from "./controllers/trip-info.js";

const EVENT_COUNT = 10;

const points = generatePoints(EVENT_COUNT);

const pointsModel = new PointsModel();
pointsModel.setPoints(points);

const tripMainElement = document.querySelector(`.trip-main`);
const tripInfoMainElement = tripMainElement.querySelector(`.trip-info`);
tripInfoMainElement.remove();
const addPointButtonElement = tripMainElement.querySelector(`.trip-main__event-add-btn`);
addPointButtonElement.remove();
const addPointButtonComponent = new AddPointButtonComponent();
render(tripMainElement, addPointButtonComponent.getElement(), RENDER_POSITION.BEFOREEND);

const menuTabs = generateMenuTabs();
const tripControlsElement = tripMainElement.querySelector(`.trip-controls`);
const menuTitleElement = tripControlsElement.querySelector(`h2:nth-of-type(1)`);
const filterTitleElement = tripControlsElement.querySelector(`h2:nth-of-type(2)`);
menuTitleElement.remove();
filterTitleElement.remove();

render(tripControlsElement, menuTitleElement, RENDER_POSITION.BEFOREEND);
const siteMenuComponent = new SiteMenuComponent(menuTabs);
render(tripControlsElement, siteMenuComponent.getElement(), RENDER_POSITION.BEFOREEND);
render(tripControlsElement, filterTitleElement, RENDER_POSITION.BEFOREEND);

const filterController = new FilterController(tripControlsElement, pointsModel);
filterController.render();

const tripEventsElement = document.querySelector(`.trip-events`);

const tripInfoController = new TripInfoController(tripMainElement);
const tripController = new TripController(tripEventsElement, pointsModel, tripInfoController, addPointButtonComponent);
tripController.render();
tripController.hide();

const statisticsComponent = new StatisticsComponent(pointsModel.getAllPoints());
render(tripEventsElement, statisticsComponent.getElement(), RENDER_POSITION.BEFOREEND);
statisticsComponent.show();

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

