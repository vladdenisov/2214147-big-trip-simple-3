import TripEventFormView from '../view/trip-event-form-view';
import TripEvent from '../view/trip-event-view';
import {remove, render, replace} from '../framework/render';
import {UpdateType, UserAction} from '../utils/const';
import {compareDates} from '../utils/date';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export class TripEventPresenter {
  #container;
  #tripEvent;
  #destinations;
  #offers;

  #tripEventFormComponent;

  #tripEventComponent;

  #handleModeChange;
  #onDataChange;

  #mode = Mode.DEFAULT;


  constructor({
    container,
    tripEvent,
    handleModeChange,
    destinations,
    offers,
    onDataChange
  }) {
    this.#tripEvent = tripEvent;
    this.#container = container;
    this.#handleModeChange = handleModeChange;
    this.#destinations = destinations;
    this.#offers = offers;
    this.#onDataChange = onDataChange;
  }

  #closeEditFormOnEcsapeKey(event) {
    if (event.key === 'Escape') {
      event.preventDefault();
      this.#replaceFormToEvent();
    }
  }

  #replacePointToForm() {
    replace(this.#tripEventFormComponent, this.#tripEventComponent);
    document.addEventListener('keydown', this.#closeEditFormOnEcsapeKey);
    this.#handleModeChange();
    this.#mode = Mode.EDITING;
  }

  #replaceFormToEvent() {
    replace(this.#tripEventComponent, this.#tripEventFormComponent);
    document.removeEventListener('keydown', this.#closeEditFormOnEcsapeKey);
    this.#mode = Mode.DEFAULT;
  }

  #handleSave = (update) => {
    const isMinorUpdate = !compareDates(this.#tripEvent.dateFrom, update.dateFrom) === 0 || this.#tripEvent.basePrice !== update.basePrice;
    this.#onDataChange(
      UserAction.UPDATE_EVENT,
      isMinorUpdate ? UpdateType.MINOR : UpdateType.PATCH,
      update,
    );
    // document.body.removeEventListener('keydown', this.#ecsKeydown);
  };

  setSaving() {
    if (this.#mode === Mode.EDITING) {
      this.#tripEventFormComponent.updateElement({
        isDisabled: true,
        isSaving: true,
      });
    }
  }

  setDeleting() {
    if (this.#mode === Mode.EDITING) {
      this.#tripEventComponent.updateElement({
        isDisabled: true,
        isDeleting: true,
      });
    }
  }

  setAborting() {
    if (this.#mode === Mode.DEFAULT) {
      this.#tripEventComponent.shake();
      return;
    }

    const resetFormState = () => {
      this.#tripEventFormComponent.updateElement({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    this.#tripEventFormComponent.shake(resetFormState);
  }


  init() {
    const prevTripEventComponent = this.#tripEventComponent;
    const prevTripEventFormComponent = this.#tripEventFormComponent;

    this.#tripEventFormComponent = new TripEventFormView({
      tripEvent: this.#tripEvent,
      destinations: this.#destinations,
      offers: this.#offers,
      onSave: (update) => {
        this.#handleSave(update);
        this.#replaceFormToEvent();
      },
      onReset: () => {
        this.#replaceFormToEvent();
      }
    });

    this.#tripEventComponent = new TripEvent({
      tripEvent: this.#tripEvent,
      destinations: this.#destinations,
      offers: this.#offers,
      onRollupClick: () => {
        this.#tripEventFormComponent.reset(this.#tripEvent);
        this.#replacePointToForm();
      }
    });


    if (!prevTripEventComponent || !prevTripEventFormComponent) {
      render(this.#tripEventComponent, this.#container);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#tripEventComponent, prevTripEventComponent);
    }

    if (this.#mode === Mode.EDITING) {
      replace(this.#tripEventFormComponent, prevTripEventFormComponent);
      this.#mode = Mode.DEFAULT;
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
