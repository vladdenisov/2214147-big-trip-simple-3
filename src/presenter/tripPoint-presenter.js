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
      this.#replaceFormToPoint();
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
      tripPoint: this.#tripPoint,
      onSave: () => {
        this.#replaceFormToPoint();
      },
      onReset: () => {
        this.#replaceFormToPoint();
      }
    });

    this.#tripPointComponent = new TripEvent({
      tripPoint: this.#tripPoint,
      onRollupClick: () => {
        this.#replacePointToForm();
      }
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
