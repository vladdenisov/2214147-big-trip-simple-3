import AbstractView from '../framework/view/abstract-view';
import {makeLowercased} from '../utils/strings';

const createTripSortingBlock = (sortName) => `<div class="trip-sort__item  trip-sort__item--${makeLowercased(sortName)}">
      <input id="sort-${makeLowercased(sortName)}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-${makeLowercased(sortName)}" checked>
      <label class="trip-sort__btn" for="sort-${makeLowercased(sortName)}">${sortName}</label>
    </div>`;


const createTripEventsSortingTemplate = (sorts) => `
  <form class="trip-events__trip-sort  trip-sort" action="#" method="get">
    ${sorts.map((sort) => createTripSortingBlock(sort)).join('')}
  </form>
`;

class TripEventsSortingView extends AbstractView {
  #sorts = [];
  constructor({sorts}) {
    super();
    this.#sorts = sorts;
  }

  get template() {
    return createTripEventsSortingTemplate(this.#sorts);
  }
}

export default TripEventsSortingView;
