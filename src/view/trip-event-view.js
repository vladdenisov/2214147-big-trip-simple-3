import BaseView from './base-view.js';
import {
  convertToDateTime,
  convertToEventDate,
  convertToEventDateTime,
  convertToTime
} from '../utils/converters';
import {getRandomOffers} from '../mock/offer.js';
import {randomDesinations} from '../mock/destination';


const createOffersTemplate = (offers) => {
  return offers.map((offer) => `
    <li class="event__offer">
      <span class="event__offer-title">${offer.title}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${offer.price}</span>
    </li>
  `).join('');
};

const createTripEventTemplate = (eventPoint) => {
  const {destination, offers, type} = eventPoint;
  const offersArray = getRandomOffers()
    .find((e) => (e.type === type))['offers']
    .filter((e) => (e.id in offers));
  const eventDateTime = convertToEventDateTime(eventPoint.date_from);
  const eventDate = convertToEventDate(eventPoint.date_from);
  const fromDateTime = convertToDateTime(eventPoint.date_from);
  const fromTime = convertToTime(eventPoint.date_from);
  const toDateTime = convertToDateTime(eventPoint.date_to);
  const toTime = convertToTime(eventPoint.date_to);
  const offersTemplate = createOffersTemplate(offersArray);

  return `<li class="trip-events__item">
    <div class="event">
        <time class="event__date" datetime="${eventDateTime}">${eventDate}</time>
        <div class="event__type">
            <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${randomDesinations.getDestination(destination).name}</h3>
        <div class="event__schedule">
            <p class="event__time">
                <time class="event__start-time" datetime="${fromDateTime}">${fromTime}</time>
                    &mdash;
                <time class="event__end-time" datetime="${toDateTime}">${toTime}</time>
            </p>
        </div>
        <p class="event__price">
        &euro;&nbsp;<span class="event__price-value">${eventPoint.base_price}</span>
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


class TripEventView extends BaseView {
  constructor({tripPoint}) {
    super();
    this.tripPoint = tripPoint;
  }

  getTemplate() {
    return createTripEventTemplate(this.tripPoint);
  }
}


export default TripEventView;
