import Observable from '../framework/observable';

export default class OfferModel extends Observable {
  #tripEventApiService = null;
  #offers = [];

  constructor ({tripEventApiService}) {
    super();
    this.#tripEventApiService = tripEventApiService;
    this.init();
  }

  get offers() {
    return this.#offers;
  }

  init = async () => {
    try {
      this.#offers = await this.#tripEventApiService.offers;
    } catch(err) {
      this.#offers = [];
    }
  };
}
