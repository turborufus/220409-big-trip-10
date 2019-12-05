const formatDate = (date) => {
  const year = date.getFullYear();
  const month = (date.getMonth() < 9) ? `0${date.getMonth() + 1}` : `${date.getMonth() + 1}`;
  const day = (date.getDate() < 10) ? `0${date.getDate()}` : `${date.getDate()}`;
  const minute = (date.getMinutes() < 10) ? `0${date.getMinutes()}` : `${date.getMinutes()}`;
  const hour = (date.getHours() < 10) ? `0${date.getHours()}` : `${date.getHours()}`

  return `${year}-${month}-${day}T${hour}:${minute}`;
};

const formatTime = (date) => {
  const minute = (date.getMinutes() < 10) ? `0${date.getMinutes()}` : `${date.getMinutes()}`;
  const hour = (date.getHours() < 10) ? `0${date.getHours()}` : `${date.getHours()}`
  return `${hour}:${minute}`;
}

const createScheduleMarkup = (start, stop) => {
  const startDate = formatDate(start);
  const stopDate = formatDate(stop);
  const startTime = formatTime(start);
  const stopTime = formatTime(stop);
  // TODO доделать duration
  return (
    `<div class="event__schedule">
      <p class="event__time">
      <time class="event__start-time" datetime="${startDate}">${startTime}</time>
      &mdash;
      <time class="event__end-time" datetime="${stopDate}">${stopTime}</time>
      </p>
      <p class="event__duration">1H 30M</p>
    </div>`
  );
};

const createOffersMarkup = (offers) => {
  return (
    `<h4 class="visually-hidden">Offers:</h4>
        <ul class="event__selected-offers">
            <li class="event__offer">
            <span class="event__offer-title">Order Uber</span>
            &plus;
            &euro;&nbsp;<span class="event__offer-price">20</span>
            </li>
        </ul>`
  );
}

export const createTripEventItemTemplate = (event) => {
  const {type, destination, start, stop, price, offers} = event;
  const {destName, destDescription, imgURLs} = destination;
  const schedule = createScheduleMarkup(start, stop);
  const offersMarkup = createOffersMarkup(offers);
  // todo title
  return (`
      <div class="event">
        <div class="event__type">
            <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">Taxi to airport</h3>
  
        ${schedule}

        <p class="event__price">
            &euro;&nbsp;<span class="event__price-value">${price}</span>
        </p>
  
        ${offersMarkup}
  
        <button class="event__rollup-btn" type="button">
            <span class="visually-hidden">Open event</span>
        </button>
      </div>
  `);
};
