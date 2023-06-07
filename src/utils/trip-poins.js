import {compareDates, compareTime} from './date';

export const sortByDay = (a, b) => compareDates(a.dateFrom, b.dateFrom);
export const sortByTime = (a, b) => compareTime(a.dateFrom, b.dateFrom);
export const sortByPrice = (a, b) => b.basePrice - a.basePrice;
