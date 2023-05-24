import { createElement, render } from '../render.js';
import AbstractView from '../framework/view/abstract-view';

const createTripEventsListTemplate = () => `
  <ul class="trip-events__list"></ul>
`;

const createElementWrapperTemplate = () => `
  <li class="trip-events__item"></li>
`;

class TripEventsListView extends AbstractView {
  get template() {
    return createTripEventsListTemplate();
  }

  addComponent(component) {
    const listElement = createElement(createElementWrapperTemplate());
    render(component, listElement);
    this.element.append(listElement);
  }
}

export default TripEventsListView;
