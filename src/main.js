import TripPresenter from './presenter/trip-presenter.js';
import { render } from './render.js';
import FiltersView from './view/filter-view.js';
import TripPointModel from './model/trip-point-model';
import {generateFilter} from './mock/filters';
import {randomDesinations} from './mock/destination';

const tripControlsFiltersBlock = document.querySelector('.trip-controls__filters');
const tripEventsSection = document.querySelector('.trip-events');

const tripPoints = ge

const tripPointsModel = new TripPointModel();
const tripPresenter = new TripPresenter(tripEventsSection, tripPointsModel);


const filters = generateFilter(tripPointsModel.tripPoints);

render(new FiltersView({filters}), tripControlsFiltersBlock);

tripPresenter.init();
