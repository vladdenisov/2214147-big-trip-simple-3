import AbstractView from '../framework/view/abstract-view';
import {makeLowercased} from '../utils/strings';

const createFilter = (filterName) => `
    <div class="trip-filters__filter">
        <input id="filter-${makeLowercased(filterName)}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${makeLowercased(filterName)}">
        <label class="trip-filters__filter-label" for="filter-${makeLowercased(filterName)}">${filterName}</label>
    </div>
`;


const createFilterTemplate = (filters) =>
  `<form class="trip-filters" action="#" method="get">
    ${filters.map((filterName) => createFilter(filterName)).join('')}
    <button class="visually-hidden" type="submit">Accept filter</button>
  </form>`;


class FiltersView extends AbstractView {
  #filters = null;
  constructor({filters}) {
    super();
    this.#filters = filters;
  }

  get template() {
    return createFilterTemplate(this.#filters);
  }
}

export default FiltersView;
