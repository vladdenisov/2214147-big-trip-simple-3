export const generateRandomInt = (min, max) => {
  min = Math.ceil(min);
  if (min < 0) {
    min = 0;
  }
  max = Math.floor(max);
  if (max < 0) {
    return 1;
  }
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
export const getRandomImageUrl = () =>
  `http://picsum.photos/248/152?r=${generateRandomInt(0, 1000)}`;

export const getRandomDate = (maxDate = Date.now()) => {
  const timestamp = Math.floor(Math.random() * maxDate);
  return new Date(timestamp).toISOString();
};
