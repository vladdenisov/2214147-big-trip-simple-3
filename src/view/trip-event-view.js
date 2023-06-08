import {
  convertToDateTime,
  convertToEventDate,
  convertToEventDateTime,
  convertToTime
} from '../utils/date';
import AbstractView from '../framework/view/abstract-view';


const createOffersTemplate = (offers) => offers.map((offer) => `
    <li class="event__offer">
      <span class="event__offer-title">${offer.title}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${offer.price}</span>
    </li>
  `).join('');

const createTripEventTemplate = (eventPoint, destinations, offers) => {
  const {offersIDs, type} = eventPoint;

  const destination = destinations.find((d) => d.id === eventPoint.destination);

  const offersObj = offers.find((e) => e.type === type) || {offers: []};

  const eventDateTime = convertToEventDateTime(eventPoint.dateFrom);
  const eventDate = convertToEventDate(eventPoint.dateFrom);
  const fromDateTime = convertToDateTime(eventPoint.dateFrom);
  const fromTime = convertToTime(eventPoint.dateFrom);
  const toDateTime = convertToDateTime(eventPoint.dateTo);
  const toTime = convertToTime(eventPoint.dateTo);
  const offersTemplate = createOffersTemplate(offersObj.offers.filter((e) => offersIDs.includes(e.id)));

  return `<li class="trip-events__item">
    <div class="event">
        <time class="event__date" datetime="${eventDateTime}">${eventDate}</time>
        <div class="event__type">
            <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${destination.name}</h3>
        <div class="event__schedule">
            <p class="event__time">
                <time class="event__start-time" datetime="${fromDateTime}">${fromTime}</time>
                    &mdash;
                <time class="event__end-time" datetime="${toDateTime}">${toTime}</time>
            </p>
        </div>
        <p class="event__price">
        &euro;&nbsp;<span class="event__price-value">${eventPoint.basePrice}</span>
        </p>
        <h4 class="visually-hidden">Offers:</h4>
        <ul class="event__selected-offers">
            ${offersTemplate}
        </ul>
        <button class="event__rollup-btn" type="button">
            <span class="visually-hidden">Open event</span>
        </button>
    </div>
  </li>`;
};


class TripEventView extends AbstractView {
  #destinations;
  #offers;
  #tripEvent;

  constructor({tripEvent, onRollupClick, destinations, offers}) {
    super();
    this.#tripEvent = tripEvent;
    this.#offers = offers;
    this.#destinations = destinations;
    this._callback.onRollupClick = onRollupClick;

    this.element.querySelector('.event__rollup-btn',).addEventListener('click', this.#rollupHandler);
  }

  get template() {
    return createTripEventTemplate(this.#tripEvent, this.#destinations, this.#offers);
  }

  #rollupHandler = (event) => {
    event.preventDefault();
    this._callback.onRollupClick();
  };
}


export default TripEventView;
