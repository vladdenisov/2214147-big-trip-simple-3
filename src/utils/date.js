import dayjs from 'dayjs';

const EVENT_DATE_FORMAT = 'MMM D';
const TIME_FORMAT = 'H:mm';
const EVENT_FORMAT = 'DD/MM/YY HH:mm';

export const convertToEventDateTime = (date) => date.substring(0, date.indexOf('T'));
export const convertToEventDate = (date) => dayjs(date).format(EVENT_DATE_FORMAT);
export const convertToDateTime = (date) => date.substring(0, date.indexOf('.'));
export const convertToTime = (date) => dayjs(date).format(TIME_FORMAT);
export const convertToFormDate = (date) => dayjs(date).format(EVENT_FORMAT);
export const compareDates = (a, b) => dayjs(a).isBefore(dayjs(b)) ? -1 : 1;

export const compareTime = (a, b) => {
  const aDate = dayjs(a);
  const bDate = dayjs(b);

  if (aDate.hour() > bDate.hour()) {
    return aDate.hour() - bDate.hour();
  }

  return aDate.minute() - bDate.minute();
};
