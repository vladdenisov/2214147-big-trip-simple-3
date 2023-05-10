import { render } from '../render.js';
import TripEventsListView from '../view/trip-events-list-view.js';
import TripEventsSortingView from '../view/trip-events-sorting-view.js';
import TripEventsFormView from '../view/trip-events-form-view.js';
import TripEvent from '../view/trip-event-view.js';

class TripPresenter {
  tripListComponent = new TripEventsListView();

  constructor(tripPointsModel) {
    this.tripPointsModel = tripPointsModel;
  }

  init(container) {
    this.tripPoints = [...this.tripPointsModel.getTripPoints()];
    this.container = container;

    render(new TripEventsSortingView(), this.container);
    render(this.tripListComponent, this.container);
    this.tripListComponent.addComponent(new TripEventsFormView({tripPoint: this.tripPoints[0]}));

    for (let i = 0; i < this.tripPoints.length; i++) {
      this.tripListComponent.addComponent(new TripEvent({tripPoint: this.tripPoints[i]}));
    }
  }
}

export default TripPresenter;
