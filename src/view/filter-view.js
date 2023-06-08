import AbstractView from '../framework/view/abstract-view';
import {makeLowercased} from '../utils/strings';

const createFilter = (filter, current) => `
    <div class="trip-filters__filter">
        <input
            id="filter-${makeLowercased(filter.type)}"
            class="trip-filters__filter-input visually-hidden"
            type="radio"
            name="trip-filter"
            value="${filter.type}"
            ${filter.type === current ? 'checked' : ''}
        >
        <label class="trip-filters__filter-label" for="filter-${makeLowercased(filter.type)}">${filter.type}</label>
    </div>
`;


const createFilterTemplate = (filters, current) =>
  `<form class="trip-filters" action="#" method="get">
    ${filters.map((filter) => createFilter(filter, current)).join('')}
    <button class="visually-hidden" type="submit">Accept filter</button>
  </form>`;


class FiltersView extends AbstractView {
  #filters;
  #current;

  constructor({filters, current, onFilterChange}) {
    super();
    this.#filters = filters;
    this.#current = current;
    this._callback.onFilterChange = onFilterChange;

    this.element.addEventListener('change', this.#filterChangeHandler);
  }

  get template() {
    return createFilterTemplate(this.#filters, this.#current);
  }

  #filterChangeHandler = (evt) => {
    evt.preventDefault();
    this._callback.onFilterChange(evt.target.value);
  };
}

export default FiltersView;
