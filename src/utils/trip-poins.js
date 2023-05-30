import {compareDates, compareTime} from './date';

export const sortByDay = (a, b) => compareDates(a.date_from, b.date_from);
export const sortByTime = (a, b) => compareTime(a.date_from, b.date_from);
export const sortByPrice = (a, b) => {
  return b.base_price - a.base_price;
};
