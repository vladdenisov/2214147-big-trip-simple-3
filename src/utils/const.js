export const SortType = {
  DAY: 'day',
  EVENT: 'event',
  TIME: 'time',
  PRICE: 'price',
  OFFERS: 'offers'
};

export const FilterType = {
  EVERYTHING: 'everything',
  FUTURE: 'future'
};

export const EventType = {
  TAXI: 'taxi',
  BUS: 'bus',
  SHIP: 'ship',
  DRIVE: 'drive',
  FLIGHT: 'flight',
  CHECK_IN: 'check-in',
  SIGHTSEEING: 'sightseeing',
  RESTAURANT: 'restaurant'
};

export const OffersType = {
  LUGGAGE: {
    text: 'Add luggage',
    price: '30'
  },
  COMFORT: {
    text: 'Switch to comfort class',
    price: '100'
  },
  MEAL: {
    text: 'Add meal',
    price: '15'
  },
  SEATS: {
    text: 'Choose seats',
    price: '5'
  },
  TRAIN: {
    text: 'Travel by train',
    price: '40'
  }
};

export const UpdateType = {
  INIT: 'INIT',
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
};
