import AbstractView from '../framework/view/abstract-view';

const createTripEventsListTemplate = () => `
  <ul class="trip-events__list"></ul>
`;

class TripEventsListView extends AbstractView {
  get template() {
    return createTripEventsListTemplate();
  }
}

export default TripEventsListView;
