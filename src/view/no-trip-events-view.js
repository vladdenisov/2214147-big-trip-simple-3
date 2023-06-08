import AbstractView from '../framework/view/abstract-view';

const createNoTripEventsTemplate = (text) => `<p class="trip-events__msg">${text}</p>`;

export default class NoPointsView extends AbstractView {
  #text;

  constructor(text = 'Click New Event to create your first point') {
    super();
    this.#text = text;
  }

  get template() {
    return createNoTripEventsTemplate(this.#text);
  }
}
