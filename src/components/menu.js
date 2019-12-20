import AbstractComponent from "./abstract-component.js";

const createMenuTabMarkup = (tabName, isActive) => {
  return (`<a class="trip-tabs__btn  ${isActive ? `trip-tabs__btn--active` : ``}" href="#">${tabName}</a>
  `);
};

const createTripMenuTemplate = (menuTabs) => {
  const menuTabsMarkup = menuTabs.map((it, i) => createMenuTabMarkup(it, i === 0)).join(`\n`);
  return (`<nav class="trip-controls__trip-tabs  trip-tabs">
          ${menuTabsMarkup}
      </nav>
  `);
};

export default class SiteMenu extends AbstractComponent {

  constructor(menuTabs) {
    super();
    this._menuTabs = menuTabs;
  }

  getTemplate() {
    return createTripMenuTemplate(this._menuTabs);
  }
}
