import TripEventsFormView from '../view/trip-events-form-view';
import TripEvent from '../view/trip-event-view';
import {remove, render, replace} from '../framework/render';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export class TripEventPresenter {
  #container = null;
  #tripEvent = null;

  #tripEventFormComponent = null;

  #tripEventComponent = null;

  #handleModeChange = null;

  #mode = Mode.DEFAULT;

  constructor(container, tripEvent, {handleModeChange}) {
    this.#tripEvent = tripEvent;
    this.#container = container;
    this.#handleModeChange = handleModeChange;
  }

  #closeEditFormOnEcsapeKey(event) {
    if (event.key === 'Escape') {
      event.preventDefault();
      this.#replaceFormToEvent();
    }
  }

  #replacePointToForm() {
    replace(this.#tripEventComponent, this.#tripEventComponent);
    document.addEventListener('keydown', this.#closeEditFormOnEcsapeKey);
    this.#handleModeChange();
    this.#mode = Mode.EDITING;
  }

  #replaceFormToEvent() {
    replace(this.#tripEventComponent, this.#tripEventFormComponent);
    document.removeEventListener('keydown', this.#closeEditFormOnEcsapeKey);
    this.#mode = Mode.DEFAULT;
  }


  init() {
    const prevTripEventComponent = this.#tripEventComponent;
    const prevTripEventFormComponent = this.#tripEventFormComponent;

    this.#tripEventFormComponent = new TripEventsFormView({
      tripPoint: this.#tripEvent,
      onSave: () => {
        this.#replaceFormToEvent();
      },
      onReset: () => {
        this.#replaceFormToEvent();
      }
    });

    this.#tripEventComponent = new TripEvent({
      tripPoint: this.#tripEvent,
      onRollupClick: () => {
        this.#replacePointToForm();
      }
    });


    if (prevTripEventComponent === null || prevTripEventFormComponent === null) {
      render(this.#tripEventComponent, this.#container);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#tripEventComponent, prevTripEventComponent);
    }

    if (this.#mode === Mode.EDITING) {
      replace(this.#tripEventFormComponent, prevTripEventFormComponent);
    }

    remove(prevTripEventComponent);
    remove(prevTripEventFormComponent);
  }

  destroy() {
    remove(this.#tripEventComponent);
    remove(this.#tripEventFormComponent);
  }

  resetView() {
    if (this.#mode !== Mode.DEFAULT) {
      this.#replaceFormToEvent();
    }
  }
}
