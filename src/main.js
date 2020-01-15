import SiteMenuComponent from "./components/menu.js";
import TripInfoComponent from "./components/trip-info.js";
import TripController from "./controllers/trip.js";
import PointsModel from "./models/points.js";
import {generateMenuTabs} from "./mock/menuTab.js";
import {generatePoints} from "./mock/point.js";
import {render, RENDER_POSITION} from "./utils/render.js";
import FilterController from "./controllers/filter.js";


const EVENT_COUNT = 10;

const points = generatePoints(EVENT_COUNT);

const pointsModel = new PointsModel();
pointsModel.setPoints(points);

const tripMainElement = document.querySelector(`.trip-main`);
const tripInfoMainElement = tripMainElement.querySelector(`.trip-info`);
render(tripInfoMainElement, new TripInfoComponent(points).getElement(), RENDER_POSITION.AFTERBEGIN);

const tripCost = !points.length ? 0 : points.map((point) => {
  const offers = Array.from(point.offers);
  const offersPrice = !offers.length ? 0 : offers.map((offer) => offer.price).reduce((price, it) => {
    return price + it;
  });
  return point.price + offersPrice;
}).reduce((cost, price) => {
  return cost + price;
});
const tripCostElement = tripMainElement.querySelector(`.trip-info__cost-value`);
tripCostElement.innerHTML = tripCost;

const menuTabs = generateMenuTabs();
const tripControlsElement = tripMainElement.querySelector(`.trip-controls`);
const menuTitleElement = tripControlsElement.querySelector(`h2:nth-of-type(1)`);
const filterTitleElement = tripControlsElement.querySelector(`h2:nth-of-type(2)`);
menuTitleElement.remove();
filterTitleElement.remove();

render(tripControlsElement, menuTitleElement, RENDER_POSITION.BEFOREEND);
render(tripControlsElement, new SiteMenuComponent(menuTabs).getElement(), RENDER_POSITION.BEFOREEND);
render(tripControlsElement, filterTitleElement, RENDER_POSITION.BEFOREEND);

const filterController = new FilterController(tripControlsElement, pointsModel);
filterController.render();

const tripEventsElement = document.querySelector(`.trip-events`);

const tripController = new TripController(tripEventsElement, pointsModel);
tripController.render();

