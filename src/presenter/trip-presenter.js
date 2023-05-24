import {render} from '../framework/render.js';
import TripEventsListView from '../view/trip-events-list-view.js';
import TripEventsSortingView from '../view/trip-events-sorting-view.js';
import NoPointsView from '../view/no-trip-events-view';
import {generateSorts} from '../mock/sort';
import {TripPointPresenter} from './tripPoint-presenter';

class TripPresenter {
  #tripContainer = null;
  #tripPointsModel = null;
  #tripEventsListComponent = new TripEventsListView();

  #tripPoints = [];
  #sorts = generateSorts();
  #tripPointPresenter = new Map();

  constructor(container, tripPointsModel) {
    this.#tripContainer = container;
    this.#tripPointsModel = tripPointsModel;
    this.#tripPoints = [...this.#tripPointsModel.getTripPoints()];
  }

  #handleModeChange = () => {
    this.#tripPointPresenter.forEach((presenter) => presenter.resetView());
  };

  #renderTripPoint = (tripPoint) => {
    const container = this.#tripEventsListComponent.element;
    const tripPointPresenter = new TripPointPresenter(container, tripPoint, {handleModeChange: this.#handleModeChange});
    tripPointPresenter.init();
    this.#tripPointPresenter.set(tripPoint.id, tripPointPresenter);
  };

  #renderSortingView = () => {
    render(new TripEventsSortingView({sorts: this.#sorts}), this.#tripContainer);
  };

  #renderEventsList = () => {
    render(this.#tripEventsListComponent, this.#tripContainer);
  };

  init() {
    this.#renderSortingView();
    this.#renderEventsList();

    if (this.#tripPoints.length === 0) {
      render(new NoPointsView(), this.#tripContainer);
    }
    for (let i = 0; i < this.#tripPoints.length; i++) {
      this.#renderTripPoint(this.#tripPoints[i]);
    }
  }
}

export default TripPresenter;
