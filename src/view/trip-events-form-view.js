import {randomDesinations} from '../mock/destination';
import {convertToFormDate, convertToTime} from '../utils/date';
import AbstractStatefulView from '../framework/view/abstract-stateful-view';
import {convertToUpperCase} from '../utils/strings';
import {EventType, OffersType} from '../utils/const';
import {getRandomOffers} from '../mock/offer';

const BLANK_TRIPEVENT = {
  basePrice: 1000,
  dateFrom: (new Date()).toISOString(),
  dateTo: (new Date()).toISOString(),
  destination: undefined,
  id: 0,
  offersIDs: [],
  type: 'flight'
};

const createPhotosTemplate = (photos) => photos.map((photo) => `<img class="event__photo" src="${photo.src}" alt="${photo.description}">`).join('');

const createDestinationsDataList = (destinations) => destinations.map((e) => `<option value=${e.name}></option>`).join('');

const createEventTypeListItem = (id, type, checked = false) => `
           <div class="event__type-item">
              <input class="event__type-input  visually-hidden" id="event-type-${type}-${id}" name="event-type" type="radio" value="${type}" ${checked && 'checked'}>
              <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-${id}">${convertToUpperCase(type)}</label>
            </div>`;

const createEventTypeList = (id, currentType) => `<div class="event__type-list">
          <fieldset class="event__type-group">
            <legend class="visually-hidden">Event type</legend>
            ${Object.values(EventType).map((type) => createEventTypeListItem(id, type, currentType === type)).join('')}
          </fieldset>
        </div>`;

const createEventOfferSelector = (id, offerName, isSelected = false) => {
  const offer = OffersType[offerName];

  return `<div class="event__offer-selector">
            <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offerName}-${id}" type="checkbox" name="event-offer-${offerName}" ${isSelected && 'checked'}>
            <label class="event__offer-label" for="event-offer-${offerName}-${id}">
              <span class="event__offer-title">${offer.text}</span>
              &plus;&euro;&nbsp;
              <span class="event__offer-price">${offer.price}</span>
            </label>
          </div>`;
};

const createEventOffersList = (id, selectedIds) => `<section class="event__section  event__section--offers">
        <h3 class="event__section-title  event__section-title--offers">Offers</h3>

        <div class="event__available-offers">
        ${Object.keys(OffersType).map((offerName, i) => createEventOfferSelector(id, offerName, i in selectedIds))}
        </div>
      </section>`;


const createTripEventsFormTemplate = (eventPoint = {}) => {

  const {type, id} = eventPoint;

  const allDestinations = randomDesinations.getAllDestinations();
  const destination = randomDesinations.getDestination(eventPoint.destination);

  const destinationsDataList = createDestinationsDataList(allDestinations);

  return `
  <form class="event event--edit" action="#" method="post">
    <header class="event__header">
      <div class="event__type-wrapper">
        <label class="event__type  event__type-btn" for="event-type-toggle-${id}">
          <span class="visually-hidden">Choose event type</span>
          <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="${type} event.">
        </label>
        <input class="event__type-toggle  visually-hidden" id="event-type-toggle-${id}" type="checkbox">
         ${createEventTypeList(eventPoint.id, type)}
      </div>

      <div class="event__field-group  event__field-group--destination">
        <label class="event__label  event__type-output" for="event-destination-${id}">
          ${type}
        </label>
        <input class="event__input  event__input--destination" id="event-destination-${id}" type="text" name="event-destination" value="${destination.name}" list="destination-list-${id}">
        <datalist id="destination-list-1">
          ${destinationsDataList}
        </datalist>
      </div>

      <div class="event__field-group  event__field-group--time">
        <label class="visually-hidden" for="event-start-time-${id}">From</label>
        <input class="event__input  event__input--time" id="event-start-time-${id}" type="text" name="event-start-time" value="${convertToFormDate(eventPoint.date_from)} ${convertToTime(eventPoint.date_from)}">
        &mdash;
        <label class="visually-hidden" for="event-end-time-${id}">To</label>
        <input class="event__input  event__input--time" id="event-end-time-${id}" type="text" name="event-end-time" value="${convertToFormDate(eventPoint.date_to)} ${convertToTime(eventPoint.date_to)}">
      </div>

      <div class="event__field-group  event__field-group--price">
        <label class="event__label" for="event-price-${id}">
          <span class="visually-hidden">Price</span>
          &euro;
        </label>
        <input class="event__input  event__input--price" id="event-price-${id}" type="text" name="event-price" value="${eventPoint.base_price}">
      </div>

      <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
      <button class="event__reset-btn" type="reset">Cancel</button>
    </header>
    <section class="event__details">
       ${createEventOffersList(id, eventPoint.offers)}

      <section class="event__section  event__section--destination">
        <h3 class="event__section-title  event__section-title--destination">Destination</h3>
        <p class="event__destination-description">${destination.description}</p>

        <div class="event__photos-container">
          <div class="event__photos-tape">
            ${createPhotosTemplate(destination.pictures)}
          </div>
        </div>
      </section>
    </section>
  </form>
`;
};

class TripEventsFormView extends AbstractStatefulView {

  #offers;
  #tripEvent;
  constructor({tripEvent = BLANK_TRIPEVENT, onSave, onReset}) {
    super();
    this.#tripEvent = tripEvent;
    this._callback.onSave = onSave;
    this._callback.onReset = onReset;
    this.#offers = getRandomOffers();
    this._restoreHandlers();
  }

  get template() {
    return createTripEventsFormTemplate(this.#tripEvent);
  }

  #saveHandler = (event) => {
    event.preventDefault();
    this._callback.onSave();
  };

  #resetHandler = (event) => {
    event.preventDefault();
    this._callback.onReset();
  };

  _restoreHandlers() {
    this.element.addEventListener('submit', this.#saveHandler);
    this.element.querySelector('.event__reset-btn').addEventListener('click', this.#resetHandler);
    this.element.querySelector('.event__type-group').addEventListener('change', this.#eventTypeHandler);
    this.element.querySelector('.event__available-offers')
      .addEventListener('change', this.#offersHandler);
  }

  static parseTripPointToState(tripPoint, offers) {
    return {...tripPoint,
      currentTypeOffers: offers.find((el) => el.type === tripPoint.type).offers
    };
  }

  #offersHandler = (evt) => {
    evt.preventDefault();
    const clickedOfferId = this._state.currentTypeOffers.find((offer) => offer.title.split(' ').at(-1) === evt.target.name.split('-').at(-1)).id;
    const newOffersIds = this._state.offersIDs.slice();
    if (newOffersIds.includes(clickedOfferId)) {
      newOffersIds.splice(newOffersIds.indexOf(clickedOfferId), 1);
    } else {
      newOffersIds.push(clickedOfferId);
    }
    this._setState({
      offersIDs: newOffersIds
    });
  };

  #eventTypeHandler = (evt) => {
    evt.preventDefault();
    this.updateElement({
      type: evt.target.value,
      offersIDs: [],
      currentTypeOffers: this.#offers.find((el) => el.type === evt.target.value).offers
    });
  };


  static parseStateToTripEvent(state) {
    const trip = {...state};

    delete trip.currentTypeOffers;
    return trip;
  }
}

export default TripEventsFormView;
