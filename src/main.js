import TripPresenter from './presenter/trip-presenter.js';
import { render } from './render.js';
import FiltersView from './view/filter-view.js';
import TripEventModel from './model/trip-event-model';
import {generateFilter} from './mock/filters';

const tripControlsFiltersBlock = document.querySelector('.trip-controls__filters');
const tripEventsSection = document.querySelector('.trip-events');


const tripPointsModel = new TripEventModel();
const tripPresenter = new TripPresenter(tripEventsSection, tripPointsModel);


const filters = generateFilter(tripPointsModel.tripPoints);

render(new FiltersView({filters}), tripControlsFiltersBlock);

tripPresenter.init();
