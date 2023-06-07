import {remove, render} from '../framework/render.js';
import TripEventsListView from '../view/trip-events-list-view.js';
import TripEventsSortingView from '../view/trip-events-sorting-view.js';
import NoPointsView from '../view/no-trip-events-view';
import {TripEventPresenter} from './tripEvent-presenter';
import {FilterType, SortType, UpdateType, UserAction} from '../utils/const';
import {sortByDay, sortByPrice, sortByTime} from '../utils/trip-poins';
import UiBlocker from '../framework/ui-blocker/ui-blocker';
import {filters} from '../utils/filters';
import {sorts} from '../utils/sorts';
import CreateTripEventPresenter from './createTripEvent-presenter';

const TimeLimit = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1000,
};

const DEFAULT_SORT_TYPE = SortType.DAY;

export default class TripPresenter {
  #tripContainer;
  #tripEventModel;
  #destinationModel;
  #offerModel;
  #filterModel;

  #tripEventPresenter = new Map();
  #createTripEventPresenter;

  #tripEventsListComponent = new TripEventsListView();

  #tripEvents = [];
  #filter = FilterType.EVERYTHING;

  #isLoading = true;

  #noEventsView;

  #sortComponent = new TripEventsSortingView({sorts});
  #uiBlocker = new UiBlocker({
    lowerLimit: TimeLimit.LOWER_LIMIT,
    upperLimit: TimeLimit.UPPER_LIMIT
  });

  #currentSortType = SortType.DAY;
  constructor(
    container,
    {
      tripEventModel,
      destinationModel,
      offerModel,
      filterModel
    }) {
    this.#tripContainer = container;
    this.#tripEventModel = tripEventModel;
    this.#destinationModel = destinationModel;
    this.#offerModel = offerModel;
    this.#filterModel = filterModel;
    tripEventModel.init();
    console.log(tripEventModel.tripEvents);
    this.#tripEvents = [...tripEventModel.tripEvents];

    this.#tripEventModel.addObserver(this.#handleModelEvent);
    this.#destinationModel.addObserver(this.#handleModelEvent);

  }

  get tripEvents() {
    this.#filter = this.#filterModel.filter;
    const filteredEvents = filters[this.#filter](
      this.#tripEventModel.tripEvents.sort(sorts[DEFAULT_SORT_TYPE])
    );
    return (sorts[this.#currentSortType]) ? filteredEvents.sort(sorts[this.#currentSortType]) : filteredEvents;
  }

  get destinations() {
    return this.#destinationModel.destinations;
  }

  get offers() {
    return this.#offerModel.offers;
  }

  createEvent = (callback) => {
    this.#currentSortType = SortType.DAY;
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this.#createTripEventPresenter = new CreateTripEventPresenter({
      tripEventsListContainer: this.#tripContainer,
      onChange: this.#handleUserAction,
      onDestroy: (c) => console.log(c)
    });
    this.#createTripEventPresenter.init({destinations: this.destinations, offers: this.offers});
  };

  #handleModeChange = () => {
    this.#tripEventPresenter.forEach((presenter) => presenter.resetView());
  };

  #renderTripPoint = (tripEvent) => {
    const container = this.#tripEventsListComponent.element;
    const tripEventPresenter = new TripEventPresenter({
      container,
      tripEvent,
      handleModeChange: this.#handleModeChange,
      destinations: this.destinations,
      offers: this.offers,
      onDataChange: this.#handleUserAction
    });
    tripEventPresenter.init();
    this.#tripEventPresenter.set(tripEvent.id, tripEventPresenter);
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#sortTrips(sortType);
    this.#clear();
    this.#renderSortingView();
    this.#renderEventsList();
  };

  #handleUserAction = async (actionType, updateType, update) => {
    console.log(update)
    this.#uiBlocker.block();
    switch (actionType) {
      case UserAction.CREATE_EVENT:
        this.#createTripEventPresenter.setSaving();
        try {
          await this.#tripEventModel.addTripPoint(updateType, update);
        } catch (err) {
          this.#tripEventPresenter.get(update.id).setAborting();
        }
        break;
      case UserAction.UPDATE_EVENT:
        this.#tripEventPresenter.get(update.id).setSaving();
        try {
          await this.#tripEventModel.updateTripPoint(updateType, update);
        } catch (err) {
          this.#tripEventPresenter.get(update.id).setAborting();
        }
        break;
      case UserAction.DELETE_EVENT:
        this.#tripEventPresenter.get(update.id).setDeleting();
        try {
          await this.#tripEventModel.deleteTripPoint(updateType, update);
        } catch (err) {
          this.#tripEventPresenter.get(update.id).setAborting();
        }
        break;
    }
    this.#uiBlocker.unblock();
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

  #render = () => {
    if (this.#isLoading) {
      return;
    }

    this.#tripEvents = this.#tripEventModel.tripEvents;

    if (this.#tripEvents.length === 0) {
      this.#renderNoEvents();
      return;
    }
    this.#renderSortingView();
    this.#renderEventsList();
  };

  #clear = (resetSortType) => {

    this.#tripEventPresenter.forEach((presenter) => presenter.destroy());
    this.#tripEventPresenter.clear();

    if (this.#noEventsView) {
      remove(this.#noEventsView);
    }

    if (resetSortType) {
      this.#currentSortType = DEFAULT_SORT_TYPE;
    }
  };

  // #renderPreloader = () => {
  //   render(this.#preloaderComponent, this.#tripContainer, RenderPosition.AFTERBEGIN)
  // }

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

  #handleModelEvent = (updateType, data) => {
    console.log(updateType, data);
    switch (updateType) {
      case UpdateType.PATCH:
        this.#tripEventPresenter.get(data.id).init(data, this.destinations, this.offers);
        break;
      case UpdateType.MINOR:
        this.#clear();
        this.#render();
        break;
      case UpdateType.MAJOR:
        this.#clear(true);
        this.#render();
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        // remove(this.#loadingComponent);
        this.#clear();
        this.#render();
        break;
    }
  };

  #renderNoEvents = () => {
    this.#noEventsView = new NoPointsView();
    render(this.#noEventsView, this.#tripContainer);
  };

  init() {
    this.#render();
  }
}
