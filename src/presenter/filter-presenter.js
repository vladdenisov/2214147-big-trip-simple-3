import {FilterType, UpdateType} from '../utils/const';
import FilterView from '../view/filter-view';
import {render} from '../framework/render';
import {remove, replace} from '../framework/render';
import {filters} from '../utils/filters';

export default class FilterPresenter {
  #filterContainer;
  #filterModel;
  #tripEventsModel;
  #filterComponent;

  constructor({filterContainer, filterModel, tripEventModel}) {
    this.#filterContainer = filterContainer;
    this.#filterModel = filterModel;
    this.#tripEventsModel = tripEventModel;

    this.#tripEventsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get filters() {
    return [FilterType.EVERYTHING, FilterType.FUTURE].map((type) => ({
      type,
      count: filters[type](this.#tripEventsModel.tripEvents).length
    }));
  }

  init() {
    const prevFilterComponent = this.#filterComponent;

    this.#filterComponent = new FilterView({
      filters: this.filters,
      current: this.#filterModel.filter,
      onFilterChange: this.#handleFilterTypeChange
    });

    if (!prevFilterComponent) {
      render(this.#filterComponent, this.#filterContainer);
      return;
    }

    replace(this.#filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  }

  #handleModelEvent = () => {
    this.init();
  };

  #handleFilterTypeChange = (filterType) => {
    if (this.#filterModel.filter === filterType) {
      return;
    }
    this.#filterModel.setFilter(UpdateType.MAJOR, filterType);
  };
}
