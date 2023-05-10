import { render } from '../render.js';
import TripEventsListView from '../view/trip-events-list-view.js';
import TripEventsSortingView from '../view/trip-events-sorting-view.js';
import TripEventsFormView from '../view/trip-events-form-view.js';
import TripEvent from '../view/trip-event-view.js';

class TripPresenter {
  tripListComponent = new TripEventsListView();

  init(container) {
    this.container = container;

    render(new TripEventsSortingView(), this.container);
    render(this.tripListComponent, this.container);
    this.tripListComponent.addComponent(new TripEventsFormView());

    for (let i = 0; i < 3; i++) {
      this.tripListComponent.addComponent(new TripEvent());
    }
  }
}

export default TripPresenter;
