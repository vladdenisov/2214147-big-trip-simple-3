import TripEventsFormView from '../view/trip-events-form-view';
import TripEvent from '../view/trip-event-view';
import {remove, render, replace} from '../framework/render';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export class TripPointPresenter {
  #container = null;
  #tripPoint = null;

  #tripPointFormComponent = null;

  #tripPointComponent = null;

  #handleModeChange = null;

  #mode = Mode.DEFAULT;

  constructor(container, tripPoint, {handleModeChange}) {
    this.#tripPoint = tripPoint;
    this.#container = container;
    this.#handleModeChange = handleModeChange;
  }

  #closeEditFormOnEcsapeKey(event) {
    if (event.key === 'Escape') {
      event.preventDefault();
      this.#replacePointToForm();
      document.body.removeEventListener('keydown', this.#closeEditFormOnEcsapeKey);
    }
  }

  #replacePointToForm() {
    replace(this.#tripPointFormComponent, this.#tripPointComponent);
    document.addEventListener('keydown', this.#closeEditFormOnEcsapeKey);
    this.#handleModeChange();
    this.#mode = Mode.EDITING;
  }

  #replaceFormToPoint() {
    replace(this.#tripPointComponent, this.#tripPointFormComponent);
    document.removeEventListener('keydown', this.#closeEditFormOnEcsapeKey);
    this.#mode = Mode.DEFAULT;
  }


  init() {
    const prevTripPointComponent = this.#tripPointComponent;
    const prevTripPointFormComponent = this.#tripPointFormComponent;

    this.#tripPointFormComponent = new TripEventsFormView({
      tripPoint: this.#tripPoint
    });

    this.#tripPointComponent = new TripEvent({
      tripPoint: this.#tripPoint
    });

    this.#tripPointComponent.addEventListener('.event__rollup-btn', 'click', () => {
      this.#replacePointToForm();
      document.body.addEventListener('keydown', this.#closeEditFormOnEcsapeKey);
    });

    this.#tripPointFormComponent.addEventListener('.event__save-btn', 'click', (evt) => {
      evt.preventDefault();
      this.#replaceFormToPoint();
      document.body.removeEventListener('keydown', this.#closeEditFormOnEcsapeKey);
    });

    this.#tripPointFormComponent.addEventListener('.event__reset-btn','click', () => {
      this.#replaceFormToPoint();
      document.body.removeEventListener('keydown', this.#closeEditFormOnEcsapeKey);
    });

    if (prevTripPointComponent === null || prevTripPointFormComponent === null) {
      render(this.#tripPointComponent, this.#container);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#tripPointComponent, prevTripPointComponent);
    }

    if (this.#mode === Mode.EDITING) {
      replace(this.#tripPointFormComponent, prevTripPointFormComponent);
    }

    remove(prevTripPointComponent);
    remove(prevTripPointFormComponent);
  }

  destroy() {
    remove(this.#tripPointComponent);
    remove(this.#tripPointFormComponent);
  }

  resetView() {
    if (this.#mode !== Mode.DEFAULT) {
      this.#replaceFormToPoint();
    }
  }
}
