import { render } from '../render.js';
import TripEventsListView from '../view/trip-events-list-view.js';
import TripEventsSortingView from '../view/trip-events-sorting-view.js';
import TripEventsFormView from '../view/trip-events-form-view.js';
import TripEvent from '../view/trip-event-view.js';

class TripPresenter {
  #tripContainer = null;
  #tripPointsModel = null;
  #tripEventsListComponent = new TripEventsListView();

  #tripPoints = [];

  constructor(container, tripPointsModel) {
    this.#tripContainer = container;
    this.#tripPointsModel = tripPointsModel;
    this.#tripPoints = [...this.#tripPointsModel.getTripPoints()];
  }


  #renderTripPoint = (tripPoint) => {
    const tripPointComponent = new TripEvent({tripPoint});
    const tripPointFormComponent = new TripEventsFormView({tripPoint});

    const replacePointToForm = () => {
      this.#tripEventsListComponent.element.replaceChild(tripPointFormComponent.element, tripPointComponent.element);
    };

    const replaceFormToPoint = () => {
      this.#tripEventsListComponent.element.replaceChild(tripPointComponent.element, tripPointFormComponent.element);
    };

    const closeEditFormOnEcsapeKey = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        replaceFormToPoint();
        document.body.removeEventListener('keydown', closeEditFormOnEcsapeKey);
      }
    };

    tripPointComponent.element.querySelector('.event__rollup-btn').addEventListener('click', () => {
      replacePointToForm();
      document.body.addEventListener('keydown', closeEditFormOnEcsapeKey);
    });

    tripPointFormComponent.element.querySelector('.event__save-btn').addEventListener('click', (evt) => {
      evt.preventDefault();
      replaceFormToPoint();
      document.body.removeEventListener('keydown', closeEditFormOnEcsapeKey);
    });

    tripPointFormComponent.element.querySelector('.event__reset-btn').addEventListener('click', () => {
      replaceFormToPoint();
      document.body.removeEventListener('keydown', closeEditFormOnEcsapeKey);
    });

    render(tripPointComponent, this.#tripEventsListComponent.element);
  };

  init() {
    render(new TripEventsSortingView(), this.#tripContainer);
    render(this.#tripEventsListComponent, this.#tripContainer);
    for (let i = 0; i < this.#tripPoints.length; i++) {
      this.#renderTripPoint(this.#tripPoints[i]);
    }
  }
}

export default TripPresenter;
