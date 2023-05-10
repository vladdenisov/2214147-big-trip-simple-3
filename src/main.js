import TripPresenter from './presenter/trip-presenter.js';
import { render } from './render.js';
import FiltersView from './view/filter-view.js';

const tripControlsFiltersBlock = document.querySelector('.trip-controls__filters');
const tripEventsSection = document.querySelector('.trip-events');

const tripPresenter = new TripPresenter();

render(new FiltersView(), tripControlsFiltersBlock);

tripPresenter.init(tripEventsSection);
