import {render, replace} from '../framework/render.js';
import TripEventsListView from '../view/trip-events-list-view.js';
import TripEventsSortingView from '../view/trip-events-sorting-view.js';
import TripEventsFormView from '../view/trip-events-form-view.js';
import TripEvent from '../view/trip-event-view.js';
import NoPointsView from '../view/no-trip-events-view';
import {generateFilter} from '../mock/filters';

class TripPresenter {
  #tripContainer = null;
  #tripPointsModel = null;
  #tripEventsListComponent = new TripEventsListView();

  #tripPoints = [];
  #filters = generateFilter();

  constructor(container, tripPointsModel) {
    this.#tripContainer = container;
    this.#tripPointsModel = tripPointsModel;
    this.#tripPoints = [...this.#tripPointsModel.getTripPoints()];
  }


  #renderTripPoint = (tripPoint) => {

    const tripPointFormComponent = new TripEventsFormView({
      tripPoint
    });

    const tripPointComponent = new TripEvent({
      tripPoint
    });

    const replacePointToForm = () => {
      replace(tripPointFormComponent, tripPointComponent);
    };

    const replaceFormToPoint = () => {
      replace(tripPointComponent, tripPointFormComponent);
    };

    const closeEditFormOnEcsapeKey = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        replacePointToForm();
        document.body.removeEventListener('keydown', closeEditFormOnEcsapeKey);
      }
    };

    tripPointComponent.addEventListener('.event__rollup-btn', 'click', () => {
      replacePointToForm();
      document.body.addEventListener('keydown', closeEditFormOnEcsapeKey);
    });

    tripPointFormComponent.addEventListener('.event__save-btn', 'click', (evt) => {
      evt.preventDefault();
      replaceFormToPoint();
      document.body.removeEventListener('keydown', closeEditFormOnEcsapeKey);
    });

    tripPointFormComponent.addEventListener('.event__reset-btn','click', () => {
      replaceFormToPoint();
      document.body.removeEventListener('keydown', closeEditFormOnEcsapeKey);
    });

    render(tripPointComponent, this.#tripEventsListComponent.element);
  };

  init() {
    render(new TripEventsSortingView(), this.#tripContainer);
    render(this.#tripEventsListComponent, this.#tripContainer);
    if (this.#tripPoints.length === 0) {
      render(new NoPointsView(), this.#tripContainer);
    }
    for (let i = 0; i < this.#tripPoints.length; i++) {
      this.#renderTripPoint(this.#tripPoints[i]);
    }
  }
}

export default TripPresenter;
