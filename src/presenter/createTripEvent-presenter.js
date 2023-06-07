import TripEventFormView from '../view/trip-event-form-view';
import {remove, RenderPosition} from '../framework/render';
import {render} from '../render';
import {UpdateType, UserAction} from '../utils/const';

export default class CreateTripEventPresenter {
  #tripEventsListContainer;
  #tripEventsFormComponent;

  #handleChange;
  #handelDestroy;
  constructor({tripEventsListContainer, onChange, onDestroy}) {
    this.#tripEventsListContainer = tripEventsListContainer;
    this.#handleChange = onChange;
    this.#handelDestroy = onDestroy;
  }

  init = ({destinations, offers}) => {
    if (this.#tripEventsFormComponent) {
      return;
    }

    this.#tripEventsFormComponent = new TripEventFormView({
      destinations,
      offers,
      onSave: this.#onSubmit,
      onDelete: this.#onDeleteClick
    });

    render(this.#tripEventsFormComponent, this.#tripEventsListContainer,
      RenderPosition.AFTERBEGIN);

    document.body.addEventListener('keydown', this.#ecsKeyHandler);
  };

  setSaving() {
    this.#tripEventsFormComponent.updateElement({
      isDisabled: true,
      isSaving: true,
    });
  }

  setAborting() {
    const resetFormState = () => {
      this.#tripEventsFormComponent.updateElement({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    this.#tripEventsFormComponent.shake(resetFormState);
  }

  destroy() {
    if (this.#tripEventsFormComponent === null) {
      return;
    }

    this.#handelDestroy();

    remove(this.#tripEventsFormComponent);
    this.#tripEventsFormComponent = null;

    document.body.removeEventListener('keydown', this.#ecsKeyHandler);
  }

  #ecsKeyHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.destroy();
    }
  };

  #onSubmit = (tripEvent) => {
    this.#handleChange(
      UserAction.CREATE_EVENT,
      UpdateType.MINOR,
      this.#deleteId(tripEvent)
    );
    this.destroy();
  };

  #onDeleteClick = () => {
    this.destroy();
  };

  #deleteId = (tripEvent) => {
    delete tripEvent.id;
    return tripEvent;
  };
}
