const createMenuTabMarkup = (tabName, isActive) => {
  return (`
    <a class="trip-tabs__btn  ${isActive ? `trip-tabs__btn--active` : ``}" href="#">${tabName}</a>
  `);
};

export const createTripMenuTemplate = (menuTabs) => {
  const menuTabsMarkup = menuTabs.map((it, i) => createMenuTabMarkup(it, i === 0)).join(`\n`);
  return (`
      <nav class="trip-controls__trip-tabs  trip-tabs">
          ${menuTabsMarkup}
      </nav>
  `);
};
