import TripPresenter from './presenter/trip-presenter.js';
import { render } from './render.js';
import FiltersView from './view/filter-view.js';
import TripPointModel from './model/trip-point-model';

const tripControlsFiltersBlock = document.querySelector('.trip-controls__filters');
const tripEventsSection = document.querySelector('.trip-events');

const tripPointsModel = new TripPointModel();
const tripPresenter = new TripPresenter(tripEventsSection, tripPointsModel);

render(new FiltersView(), tripControlsFiltersBlock);

tripPresenter.init();
