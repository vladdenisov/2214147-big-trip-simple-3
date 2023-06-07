import Observable from '../framework/observable';

export default class DestinationModel extends Observable {
  #tripEventApiService = null;
  #destinations = [];

  constructor ({tripEventApiService}) {
    super();
    this.#tripEventApiService = tripEventApiService;
    this.init();
  }

  init = async () => {
    try {
      this.#destinations = await this.#tripEventApiService.destinations;
    } catch(err) {
      this.#destinations = [];
    }
  };

  get destinations() {
    return this.#destinations;
  }
}
