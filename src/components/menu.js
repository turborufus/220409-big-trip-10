import {createElement} from "../utils.js";

const createMenuTabMarkup = (tabName, isActive) => {
  return (`
    <a class="trip-tabs__btn  ${isActive ? `trip-tabs__btn--active` : ``}" href="#">${tabName}</a>
  `);
};

const createTripMenuTemplate = (menuTabs) => {
  const menuTabsMarkup = menuTabs.map((it, i) => createMenuTabMarkup(it, i === 0)).join(`\n`);
  return (`
      <nav class="trip-controls__trip-tabs  trip-tabs">
          ${menuTabsMarkup}
      </nav>
  `);
};

export default class SiteMenu {

  constructor(menuTabs) {
    this._menuTabs = menuTabs;
    this._element = null;
  }

  getTemplate() {
    return createTripMenuTemplate(this._menuTabs);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate);
    }
    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
