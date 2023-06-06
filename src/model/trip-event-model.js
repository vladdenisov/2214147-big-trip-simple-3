import { UpdateType } from '../utils/const';
import Observable from '../framework/observable';
export default class TripEventModel extends Observable {
  #tripPoints = [];
  #tripPointApiService = null;

  constructor ({tripPointApiService}) {
    super();
    this.#tripPointApiService = tripPointApiService;
  }

  init = async () => {
    try {
      const tripPoints = await this.#tripPointApiService.tripPoints;
      this.#tripPoints = tripPoints.map(this.#adaptToClient);
    } catch(error) {
      this.#tripPoints = [];
    }
    this._notify(UpdateType.INIT);
  };

  updateTripPoint = async (updateType, update) => {
    const index = this.#tripPoints.findIndex((tripPoint) => tripPoint.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting tripPoint');
    }

    try {
      const response = await this.#tripPointApiService.updateTripPoint(update);
      const updatedTripPoint = this.#adaptToClient(response);
      this.#tripPoints = [
        ...this.tripPoints.slice(0, index),
        updatedTripPoint,
        ...this.#tripPoints.slice(index + 1),
      ];

      this._notify(updateType, updatedTripPoint);
    } catch(err) {
      throw new Error('Can\'t update tripPoint');
    }
  };

  addTripPoint = async (updateType, update) => {
    try {
      const response = await this.#tripPointApiService.addTripPoint(update);
      const newTripPoint = this.#adaptToClient(response);
      this.#tripPoints = [newTripPoint, ...this.#tripPoints];
      this._notify(updateType, newTripPoint);
    } catch(err) {
      throw new Error('Can\'t add tripPoint');
    }
  };

  deleteTripPoint = async (updateType, update) => {
    const index = this.#tripPoints.findIndex((tripPoint) => tripPoint.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete not existing tripPoint');
    }

    try {
      await this.#tripPointApiService.deleteTripPoint(update);
      this.#tripPoints = [
        ...this.tripPoints.slice(0, index),
        ...this.#tripPoints.slice(index + 1),
      ];
      this._notify(updateType);
    } catch(err) {
      throw new Error('Can\'t delete tripPoint');
    }
  };

  #adaptToClient = (tripPoint) => {
    const adaptedTripPoint = {...tripPoint,
      dateFrom: tripPoint['date_from'],
      dateTo: tripPoint['date_to'],
      offersIDs: tripPoint['offers'],
      basePrice: tripPoint['base_price'],
    };

    delete adaptedTripPoint['date_from'];
    delete adaptedTripPoint['date_to'];
    delete adaptedTripPoint['base_price'];
    delete adaptedTripPoint['offers'];

    return adaptedTripPoint;
  };
}
