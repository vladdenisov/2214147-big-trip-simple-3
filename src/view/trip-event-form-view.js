import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.css';
import {convertToFormDate} from '../utils/date';
import AbstractStatefulView from '../framework/view/abstract-stateful-view';
import {convertToUpperCase} from '../utils/strings';
import {EventType} from '../utils/const';

const BLANK_TRIPEVENT = {
  basePrice: 1000,
  dateFrom: (new Date()).toISOString(),
  dateTo: (new Date()).toISOString(),
  destination: 1,
  id: 0,
  offersIDs: [],
  type: 'flight'
};

const createPhotosTemplate = (photos) => photos.map((photo) => `<img class="event__photo" src="${photo.src}" alt="${photo.description}">`).join('');

const createDestinationsDataList = (destinations) => destinations.map((e) => `<option value=${e.name}></option>`).join('');

const getTitle = (isEditForm, isDeleting) => {
  if (!isEditForm) {
    return 'Cancel';
  }
  return (isDeleting) ? 'Deleting...' : 'Delete';
};

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

const createEventOfferSelector = (id, offer, isSelected = false) => `<div class="event__offer-selector">
            <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offer.id}-${id}" type="checkbox" name="event-offer-${offer.id}" ${isSelected && 'checked'}>
            <label class="event__offer-label" for="event-offer-${offer.id}-${id}">
              <span class="event__offer-title">${offer.title}</span>
              &plus;&euro;&nbsp;
              <span class="event__offer-price">${offer.price}</span>
            </label>
          </div>`;

const createEventOffersList = (id, selectedIds, offers) => `<section class="event__section  event__section--offers">
        <h3 class="event__section-title  event__section-title--offers">Offers</h3>

        <div class="event__available-offers">
        ${offers.map((offer) => createEventOfferSelector(id, offer, selectedIds.includes(offer.id))).join('')}
        </div>
      </section>`;


const createTripEventsFormTemplate = (eventPoint = {}, destinations, offers, isEditForm) => {
  const {type, id} = eventPoint;
  const destination = destinations.find((d) => d.id === eventPoint.destination);
  const destinationsDataList = createDestinationsDataList(destinations);
  const currentTypeOffers = offers.find((o) => o.type === type);
  const offersArray = currentTypeOffers ? currentTypeOffers.offers : [];

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
        <input class="event__input  event__input--time" id="event-start-time-${id}" type="text" name="event-start-time" value="${convertToFormDate(eventPoint.date_from)}">
        &mdash;
        <label class="visually-hidden" for="event-end-time-${id}">To</label>
        <input class="event__input  event__input--time" id="event-end-time-${id}" type="text" name="event-end-time" value="${convertToFormDate(eventPoint.date_to)}">
      </div>

      <div class="event__field-group  event__field-group--price">
        <label class="event__label" for="event-price-${id}">
          <span class="visually-hidden">Price</span>
          &euro;
        </label>
        <input class="event__input  event__input--price" id="event-price-${id}" type="text" name="event-price" value="${eventPoint.basePrice}">
      </div>

      <button class="event__save-btn  btn  btn--blue" type="submit"${(eventPoint.isDisabled) ? 'disabled' : ''}>${(eventPoint.isSaving) ? 'Saving...' : 'Save'}</button>
      <button class="event__reset-btn" type="reset" ${(eventPoint.isDisabled) ? 'disabled' : ''}>${getTitle(isEditForm, eventPoint.isDeleting)}</button>
      ${isEditForm ? `
         <button class="event__rollup-btn" type="button">
            <span class="visually-hidden">Close event</span>
         </button>` : ''}
    </header>
    <section class="event__details">
       ${createEventOffersList(
    id,
    eventPoint.offersIDs,
    offersArray
  )}

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

class TripEventFormView extends AbstractStatefulView {
  #offers;
  #destinations;

  #isEditForm;

  #fromDatepicker;
  #toDatepicker;

  constructor({
    tripEvent = BLANK_TRIPEVENT,
    onSave,
    onReset = () => 0,
    onDelete,
    isEditForm = true,
    offers,
    destinations
  }) {
    super();
    this.#offers = offers;
    this.#destinations = destinations;

    this._setState(TripEventFormView.parseTripEventToState(tripEvent, offers));

    this._callback.onSave = onSave;
    this._callback.onReset = onReset;
    this._callback.onDelete = onDelete;

    this.#isEditForm = isEditForm;
    this._restoreHandlers();
  }

  get template() {
    if (!this.#destinations) {
      return '';
    }
    return createTripEventsFormTemplate(this._state, this.#destinations, this.#offers, this.#isEditForm);
  }

  _restoreHandlers() {
    this.element.addEventListener('submit', this.#saveHandler);
    this.element.querySelector('.event__type-group').addEventListener('change', this.#eventTypeHandler);
    this.element.querySelector('.event__input--destination').addEventListener('change', this.#destinationHandler);
    this.element.querySelector('.event__input--price').addEventListener('input', this.#priceInputHandler);
    this.element.querySelector('.event__available-offers').addEventListener('change', this.#offersHandler);
    this.element.querySelector('.event__reset-btn').addEventListener('click', this.#deleteHandler);
    if (this.#isEditForm) {
      this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#resetHandler);
    }
    this.#setFromDatePicker();
    this.#setToDatePicker();
  }

  reset = (tripEvent) => {
    this.updateElement(
      TripEventFormView.parseTripEventToState(tripEvent, this.#offers)
    );
  };

  removeElement() {
    super.removeElement();

    if (this.#fromDatepicker) {
      this.#fromDatepicker.destroy();
      this.#fromDatepicker = null;
    }

    if (this.#toDatepicker) {
      this.#toDatepicker.destroy();
      this.#toDatepicker = null;
    }
  }

  #setFromDatePicker() {
    this.#fromDatepicker = flatpickr(
      this.element.querySelector(`#event-start-time-${this._state.id}`),
      {
        enableTime: true,
        dateFormat: 'd/m/y H:i',
        defaultDate: convertToFormDate(this._state.dateFrom),
        onChange: this.#fromDateChangeHandler,
      },
    );
  }

  #setToDatePicker() {
    this.#toDatepicker = flatpickr(
      this.element.querySelector(`#event-end-time-${this._state.id}`),
      {
        enableTime: true,
        dateFormat: 'd/m/y H:i',
        defaultDate: convertToFormDate(this._state.dateTo),
        minDate: convertToFormDate(this._state.dateFrom),
        onChange: this.#toDateChangeHandler,
      },
    );
  }

  #offersHandler = (evt) => {
    evt.preventDefault();
    const clickedOfferId = Number(evt.target.name.split('-').at(-1));
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

  #priceInputHandler = (evt) => {
    evt.preventDefault();
    this._setState({
      basePrice: evt.target.value,
    });
  };

  #destinationHandler = (evt) => {
    evt.preventDefault();
    this.updateElement({
      destination: this.#destinations.find((destination) => destination.name === evt.target.value).id,
    });
  };

  #deleteHandler = (e) => {
    if (!this.#isEditForm) {
      this.#resetHandler(e);
      return;
    }
    e.preventDefault();
    this._callback.onDelete(TripEventFormView.parseStateToTripEvent(this._state));
  };

  #saveHandler = (event) => {
    event.preventDefault();
    this._callback.onSave(TripEventFormView.parseStateToTripEvent(this._state));
  };

  #resetHandler = (event) => {
    event.preventDefault();
    this._callback.onReset();
  };

  #fromDateChangeHandler = ([userDate]) => {
    if (userDate) {
      this._setState({
        dateFrom: userDate.toISOString(),
      });
      this.#toDatepicker.set('minDate', userDate);
    }
  };


  #toDateChangeHandler = ([userDate]) => {
    if (userDate) {
      this._setState({
        dateTo: userDate.toISOString(),
      });
    }
  };

  static parseTripEventToState(tripEvent, offers) {
    const currentTypeOffers = offers.find((el) => el.type === tripEvent.type);
    return {
      ...tripEvent,
      currentTypeOffers: currentTypeOffers ? currentTypeOffers.offers : [],
      isDisabled: false,
      isSaving: false,
      isDeleting: false,
    };
  }

  static parseStateToTripEvent(state) {
    const tripEvent = {...state};

    delete tripEvent.currentTypeOffers;
    delete tripEvent.isDisabled;
    delete tripEvent.isSaving;
    delete tripEvent.isDeleting;
    return tripEvent;
  }
}

export default TripEventFormView;
