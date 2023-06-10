import {remove, render, RenderPosition} from '../framework/render.js';
import TripEventsListView from '../view/trip-events-list-view.js';
import TripEventsSortingView from '../view/trip-events-sorting-view.js';
import NoPointsView from '../view/no-trip-events-view';
import {TripEventPresenter} from './trip-event-presenter';
import {FilterType, SortType, UpdateType, UserAction} from '../utils/const';
import UiBlocker from '../framework/ui-blocker/ui-blocker';
import {filters} from '../utils/filters';
import {sorts} from '../utils/sorts';
import CreateTripEventPresenter from './create-trip-event-presenter';
import PreloaderView from '../view/preloader-view';

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

  #sortComponent = new TripEventsSortingView({sorts, current: DEFAULT_SORT_TYPE});
  #uiBlocker = new UiBlocker({
    lowerLimit: TimeLimit.LOWER_LIMIT,
    upperLimit: TimeLimit.UPPER_LIMIT
  });

  #preloaderView = new PreloaderView();

  #currentSortType = DEFAULT_SORT_TYPE;

  #onCreateTripEventDestroy;

  constructor(
    container,
    {
      tripEventModel,
      destinationModel,
      offerModel,
      filterModel,
      onCreateTripEventDestroy
    }) {
    this.#tripContainer = container;
    this.#tripEventModel = tripEventModel;
    this.#destinationModel = destinationModel;
    this.#offerModel = offerModel;
    this.#filterModel = filterModel;
    this.#onCreateTripEventDestroy = onCreateTripEventDestroy;

    tripEventModel.init();
    this.#tripEvents = [...tripEventModel.tripEvents];

    this.#tripEventModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
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

  createEvent = () => {
    this.#currentSortType = DEFAULT_SORT_TYPE;
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this.#createTripEventPresenter = new CreateTripEventPresenter({
      tripEventsListContainer: this.#tripEventsListComponent.element,
      onChange: this.#handleUserAction,
      onDestroy: this.#onCreateTripEventDestroy,
      onReset: this.#handleCreateEventFormClose
    });
    this.#createTripEventPresenter.init({destinations: this.destinations, offers: this.offers});
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

  #renderSortingView = () => {
    this.#sortComponent.changeCurrentType(this.#currentSortType);
    render(this.#sortComponent, this.#tripContainer, RenderPosition.AFTERBEGIN);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
  };

  #renderEventsList = () => {
    render(this.#tripEventsListComponent, this.#tripContainer);
    const tripEventsList = this.tripEvents;
    for (let i = 0; i < this.#tripEvents.length; i++) {
      try {
        this.#renderTripPoint(tripEventsList[i]);
      } catch (e) { /* empty */
      }
    }
  };

  #renderPreloader = () => {
    render(this.#preloaderView, this.#tripContainer, RenderPosition.AFTERBEGIN);
  };

  #renderNoEvents = () => {
    if (this.#filter === FilterType.FUTURE) {
      this.#noEventsView = new NoPointsView('There are no future events now');
    } else {
      this.#noEventsView = new NoPointsView();
    }
    render(this.#noEventsView, this.#tripContainer);
  };

  #render = () => {
    if (this.#isLoading || !this.destinations || !this.offers) {
      this.#renderPreloader();
      return;
    }

    this.#tripEvents = this.#tripEventModel.tripEvents;

    if (this.tripEvents.length === 0) {
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
    remove(this.#sortComponent);
  };

  init() {
    this.#render();
  }

  #handleModelEvent = (updateType, data) => {
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
        remove(this.#preloaderView);
        this.#clear();
        this.#render();
        break;
    }
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clear();
    this.#renderSortingView();
    this.#renderEventsList();
  };

  #handleUserAction = async (actionType, updateType, update) => {
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

  #handleCreateEventFormClose = () => {
    this.#createTripEventPresenter.destroy();
    this.#createTripEventPresenter = null;
  };

  #handleModeChange = () => {
    if (this.#createTripEventPresenter) {
      this.#handleCreateEventFormClose();
    }
    this.#tripEventPresenter.forEach((presenter) => presenter.resetView());
  };
}
