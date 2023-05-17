import { createElement, render } from '../render.js';
import BaseView from './base-view.js';

const createTripEventsListTemplate = () => `
  <ul class="trip-events__list"></ul>
`;

const createElementWrapperTemplate = () => `
  <li class="trip-events__item"></li>
`;

class TripEventsListView extends BaseView {
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
