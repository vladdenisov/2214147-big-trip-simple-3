import AbstractView from '../framework/view/abstract-view';
import {makeLowercased} from '../utils/strings';

const createTripSortingBlock = (sortName, current) => (
  `
    <div class="trip-sort__item  trip-sort__item--${makeLowercased(sortName)}">
      <input
        id="sort-${makeLowercased(sortName)}"
        class="trip-sort__input visually-hidden"
        type="radio" name="trip-sort"
        value="sort-${makeLowercased(sortName)}"
        ${sortName === current ? 'checked' : ''}
      >
      <label class="trip-sort__btn" for="sort-${makeLowercased(sortName)}" data-sort-type="${sortName}">${sortName}</label>
    </div>`
);


const createTripEventsSortingTemplate = (sorts, current) => `
  <form class="trip-events__trip-sort  trip-sort" action="#" method="get">
    ${Object.keys(sorts).map((sort) => createTripSortingBlock(sort, current)).join('')}
  </form>
`;

class TripEventsSortingView extends AbstractView {
  #sorts = [];
  #current;

  constructor({sorts, current}) {
    super();
    this.#sorts = sorts;
    this.#current = current;
  }

  changeCurrentType = (type) => {
    this.#current = type;
  };

  setSortTypeChangeHandler = (callback) => {
    this._callback.sortTypeChange = callback;
    this.element.addEventListener('click', this.#sortTypeChangeHandler);
  };

  #sortTypeChangeHandler = (evt) => {
    if (evt.target.tagName !== 'LABEL') {
      return;
    }

    this._callback.sortTypeChange(evt.target.dataset.sortType);
  };

  get template() {
    return createTripEventsSortingTemplate(this.#sorts, this.#current);
  }
}

export default TripEventsSortingView;
