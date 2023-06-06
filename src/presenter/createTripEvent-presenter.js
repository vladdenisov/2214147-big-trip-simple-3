import TripEventFormView from '../view/trip-event-form-view';

export default class CreateTripEventPresenter {
  #tripEventsListContainer;
  #tripEventsFormComponent;
  constructor({tripEventsListContainer}) {
    this.#tripEventsListContainer = tripEventsListContainer;
  }

  init = () => {
    if (this.#tripEventsListContainer) {
      return;
    }

    this.#tripEventsFormComponent = new TripEventFormView()
  }
}
