import { UpdateType } from '../utils/const';
import Observable from '../framework/observable';
export default class TripEventModel extends Observable {
  #tripEvents = [];
  #tripEventApiService = null;

  constructor ({tripEventApiService}) {
    super();
    this.#tripEventApiService = tripEventApiService;
  }

  get tripEvents() {
    return this.#tripEvents;
  }

  init = async () => {
    try {
      const tripEvents = await this.#tripEventApiService.tripEvents;
      this.#tripEvents = tripEvents.map(this.#adaptToClient);
    } catch(error) {
      this.#tripEvents = [];
    }
    this._notify(UpdateType.INIT);
  };

  updateTripPoint = async (updateType, update) => {
    const index = this.#tripEvents.findIndex((event) => event.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting tripPoint');
    }

    try {
      const response = await this.#tripEventApiService.updateTripEvent(update);
      const updatedTripEvents = this.#adaptToClient(response);
      this.#tripEvents = [
        ...this.tripEvents.slice(0, index),
        updatedTripEvents,
        ...this.#tripEvents.slice(index + 1),
      ];

      this._notify(updateType, updatedTripEvents);
    } catch(err) {
      throw new Error('Can\'t update tripPoint');
    }
  };

  addTripPoint = async (updateType, update) => {
    try {
      const response = await this.#tripEventApiService.addTripEvent(update);
      const newTripPoint = this.#adaptToClient(response);
      this.#tripEvents = [newTripPoint, ...this.#tripEvents];
      this._notify(updateType, newTripPoint);
    } catch(err) {
      throw new Error('Can\'t add tripPoint');
    }
  };

  deleteTripPoint = async (updateType, update) => {
    const index = this.#tripEvents.findIndex((tripPoint) => tripPoint.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete not existing tripPoint');
    }

    try {
      await this.#tripEventApiService.deleteTripEvent(update);
      this.#tripEvents = [
        ...this.tripEvents.slice(0, index),
        ...this.#tripEvents.slice(index + 1),
      ];
      this._notify(updateType);
    } catch(err) {
      throw new Error('Can\'t delete tripPoint');
    }
  };

  #adaptToClient = (tripEvent) => {
    const adaptedTripEvent = {...tripEvent,
      dateFrom: tripEvent['date_from'],
      dateTo: tripEvent['date_to'],
      offersIDs: tripEvent['offers'],
      basePrice: tripEvent['base_price'],
    };

    delete adaptedTripEvent['date_from'];
    delete adaptedTripEvent['date_to'];
    delete adaptedTripEvent['base_price'];
    delete adaptedTripEvent['offers'];

    return adaptedTripEvent;
  };
}
