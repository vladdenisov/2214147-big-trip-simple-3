import Observable from '../framework/observable';

export class DestinationsModel extends Observable {
  #tripPointApiService = null;
  #destinations = [];

  constructor ({tripPointApiService}) {
    super();
    this.#tripPointApiService = tripPointApiService;
    this.init();
  }

  init = async () => {
    try {
      this.#destinations = await this.#tripPointApiService.destinations;
    } catch(err) {
      this.#destinations = [];
    }
  };

  get destinations() {
    return this.#destinations;
  }
}
