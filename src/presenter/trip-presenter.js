import {render} from '../framework/render.js';
import TripEventsListView from '../view/trip-events-list-view.js';
import TripEventsSortingView from '../view/trip-events-sorting-view.js';
import NoPointsView from '../view/no-trip-events-view';
import {generateSorts} from '../mock/sort';
import {TripEventPresenter} from './tripEvent-presenter';
import {SortType} from '../utils/const';
import {sortByDay, sortByPrice, sortByTime} from '../utils/trip-poins';
import UiBlocker from '../framework/ui-blocker/ui-blocker';

const TimeLimit = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1000,
};

export default class TripPresenter {
  #tripContainer;
  #tripPointsModel;
  #destinationModel;
  #offerModel;
  #filterModel;

  #tripEventsListComponent = new TripEventsListView();

  #tripEvents = [];
  #sorts = generateSorts();
  #tripPointPresenter = new Map();
  #sortComponent = new TripEventsSortingView({sorts: this.#sorts});
  #uiBlocker = new UiBlocker({
    lowerLimit: TimeLimit.LOWER_LIMIT,
    upperLimit: TimeLimit.UPPER_LIMIT
  });

  #currentSortType = SortType.DAY;
  constructor(
    container,
    {
      tripPointsModel,
      destinationModel,
      offerModel,
      filterModel
    }) {
    this.#tripContainer = container;
    this.#tripPointsModel = tripPointsModel;
    this.#destinationModel = destinationModel;
    this.#offerModel = offerModel;
    this.#filterModel = filterModel;
    this.#tripEvents = [...tripPointsModel.tripPoints];
  }

  // createPoint = (callback) => {
  //   this.#currentSortType = SortType.DAY;
  //   this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
  //
  // }

  #handleModeChange = () => {
    this.#tripPointPresenter.forEach((presenter) => presenter.resetView());
  };

  #renderTripPoint = (tripPoint) => {
    const container = this.#tripEventsListComponent.element;
    const tripPointPresenter = new TripEventPresenter(container, tripPoint, {handleModeChange: this.#handleModeChange});
    tripPointPresenter.init();
    this.#tripPointPresenter.set(tripPoint.id, tripPointPresenter);
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
    for (let i = 0; i < this.#tripEvents.length; i++) {
      this.#renderTripPoint(this.#tripEvents[i]);
    }
  };

  #clearEventsList = () => {
    this.#tripPointPresenter.forEach((presenter) => presenter.destroy());
    this.#tripPointPresenter.clear();
  };


  #sortTrips = (sortType) => {
    switch (sortType) {
      case SortType.PRICE:
        this.#tripEvents.sort(sortByPrice);
        break;
      case SortType.TIME:
        this.#tripEvents.sort(sortByTime);
        break;
      case SortType.DAY:
        this.#tripEvents.sort(sortByDay);
    }
    this.#currentSortType = sortType;
  };

  init() {
    this.#renderSortingView();

    if (this.#tripEvents.length === 0) {
      render(new NoPointsView(), this.#tripContainer);
      return;
    }

    this.#renderEventsList();
  }
}
