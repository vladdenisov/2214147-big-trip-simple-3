import {generateRandomInt, getRandomDate} from '../utils/random';

const TRIP_TYPES = ['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];

export const getRandomType = () => TRIP_TYPES[generateRandomInt(0, TRIP_TYPES.length - 1)];


export const generateTripPoint = () => ({
  'base_price': generateRandomInt(1000, 2000),
  'date_from': getRandomDate(),
  'date_to': getRandomDate(),
  'destination': generateRandomInt(0, 9),
  'id': generateRandomInt(0, 3),
  'offers': [1, 3, 5],
  'type': getRandomType()
});
