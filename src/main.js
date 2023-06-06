import TripPresenter from './presenter/trip-presenter.js';
import { render } from './render.js';
import FiltersView from './view/filter-view.js';
import TripEventModel from './model/trip-event-model';
import {TripEventApiService} from './api/trip-event-api-service';
import OfferModel from './model/offer-model';
import DestinationModel from './model/destination-model';
import FilterModel from './model/filter-model';
import {filters} from './utils/filters';

const tripControlsFiltersBlock = document.querySelector('.trip-controls__filters');
const tripEventsSection = document.querySelector('.trip-events');
const headerBlock = document.querySelector('.trip-main');

const AUTHORIZATION = 'Basic ipogramme';
const END_POINT = 'https://18.ecmascript.pages.academy/big-trip';

const tripEventApiService = new TripEventApiService(END_POINT, AUTHORIZATION);

const tripEventModel = new TripEventModel({tripEventApiService});
const offerModel = new OfferModel({tripEventApiService});
const destinationModel = new DestinationModel({tripEventApiService});
const filterModel = new FilterModel();

const tripPresenter = new TripPresenter(tripEventsSection, {tripEventModel, destinationModel, offerModel, filterModel});

render(new FiltersView({filters}), tripControlsFiltersBlock);

tripPresenter.init();
