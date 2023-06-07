import {SortType} from './const';
import {sortByDay, sortByPrice, sortByTime} from './trip-poins';

export const sorts = {
  [SortType.DAY]: sortByDay,
  [SortType.EVENT]: undefined,
  [SortType.OFFERS]: undefined,
  [SortType.PRICE]: sortByPrice,
  [SortType.TIME]: sortByTime,
};

