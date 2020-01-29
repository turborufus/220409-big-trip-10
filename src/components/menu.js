import AbstractSmartComponent from "./abstract-smart-component.js";

export const MENU_TAB = {
  DEFAULT: `Table`,
  STATS: `Stats`
};

const ACTIVE_BTN_CLASS = `trip-tabs__btn--active`;

const createMenuTabMarkup = (tabName, isActive) => {
  return (`<a class="trip-tabs__btn  ${isActive ? ACTIVE_BTN_CLASS : ``}" href="#">${tabName}</a>
  `);
};

const createTripMenuTemplate = (menuTabs, activeTab) => {
  const menuTabsMarkup = menuTabs.map((it) => createMenuTabMarkup(it, it === activeTab)).join(`\n`);
  return (`<nav class="trip-controls__trip-tabs  trip-tabs">
          ${menuTabsMarkup}
      </nav>
  `);
};

export default class SiteMenu extends AbstractSmartComponent {

  constructor() {
    super();
    this._menuTabs = [MENU_TAB.DEFAULT, MENU_TAB.STATS];
    this._activeTab = MENU_TAB.DEFAULT;
    this._changeTabHandler = null;
  }

  getTemplate() {
    return createTripMenuTemplate(this._menuTabs, this._activeTab);
  }

  setActiveTab(menuTab) {
    if (this._activeTab === menuTab) {
      return;
    }
    this._activeTab = menuTab;
    this.rerender();
  }

  setChangeMenuTabHandler(handler) {
    this.getElement().querySelectorAll(`.trip-tabs__btn`)
      .forEach((element) => {
        element.addEventListener(`click`, (evt) => {
          evt.preventDefault();

          if (evt.target.tagName !== `A`) {
            return;
          }
          const menuTab = evt.target.innerText;

          handler(menuTab);
        });
      });
    this._changeTabHandler = handler;
  }

  recoveryListeners() {
    this.setChangeMenuTabHandler(this._changeTabHandler);
  }
}
