import {render} from '../framework/render.js';
import TripEventsListView from '../view/trip-events-list-view.js';
import TripEventsSortingView from '../view/trip-events-sorting-view.js';
import NoPointsView from '../view/no-trip-events-view';
import {generateSorts} from '../mock/sort';
import {TripPointPresenter} from './tripPoint-presenter';
import {SortType} from '../utils/const';
import {sortByDay, sortByPrice, sortByTime} from '../utils/trip-poins';

class TripPresenter {
  #tripContainer = null;
  #tripPointsModel = null;
  #tripEventsListComponent = new TripEventsListView();

  #tripPoints = [];
  #sorts = generateSorts();
  #tripPointPresenter = new Map();
  #sortComponent = new TripEventsSortingView({sorts: this.#sorts});

  #currentSortType = SortType.DAY;


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
    console.log(tripPoint.id, tripPointPresenter)
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#sortTrips(sortType);
    this.#renderSortingView();
    this.#clearEventsList();
    this.#renderEventsList();
  };

  #renderSortingView = () => {
    render(this.#sortComponent, this.#tripContainer);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
  };

  #renderEventsList = () => {
    render(this.#tripEventsListComponent, this.#tripContainer);
    for (let i = 0; i < this.#tripPoints.length; i++) {
      this.#renderTripPoint(this.#tripPoints[i]);
    }
  };

  #clearEventsList = () => {
    console.log(this.#tripPointPresenter)
    this.#tripPointPresenter.forEach((presenter) => presenter.destroy());
    this.#tripPointPresenter.clear();
  };


  #sortTrips = (sortType) => {
    switch (sortType) {
      case SortType.PRICE:
        this.#tripPoints.sort(sortByPrice);
        break;
      case SortType.TIME:
        this.#tripPoints.sort(sortByTime);
        break;
      case SortType.DAY:
        this.#tripPoints.sort(sortByDay);
    }
    this.#currentSortType = sortType;
  };

  init() {
    this.#renderSortingView();

    if (this.#tripPoints.length === 0) {
      render(new NoPointsView(), this.#tripContainer);
      return;
    }

    this.#renderEventsList();
  }
}

export default TripPresenter;
