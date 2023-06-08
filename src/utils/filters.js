import {FilterType} from './const';
import {isTripDateBeforeToday} from './date';

export const filters = {
  [FilterType.FUTURE]: (tripPoints) => tripPoints.filter((tripPoint) => !isTripDateBeforeToday(tripPoint.dateFrom)),
  [FilterType.EVERYTHING]: (tripPoints) => tripPoints,
};

