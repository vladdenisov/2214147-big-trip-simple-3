import {isTripDateBeforeToday} from '../utils/date';

const FilterType = {
  EVERYTHING: 'everything',
  FUTURE: 'future'
};

const filter = {
  [FilterType.FUTURE]: (tripPoints) => tripPoints.filter((tripPoint) => isTripDateBeforeToday(tripPoint.dateFrom)),
  [FilterType.EVERYTHING]: (tripPoints) => tripPoints,
};


export const generateFilter = () =>
  Object.keys(filter);

