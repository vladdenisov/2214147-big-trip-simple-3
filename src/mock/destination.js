import {generateWords} from '../utils/lorem-ipsum';
import {generateRandomInt, getRandomImageUrl} from '../utils/random';

const names = ['Chamonix', 'Berlin', 'Moscow', 'Tver', 'NY'];


const generatePicture = () => ({
  src: getRandomImageUrl(),
  description: generateWords(generateRandomInt(5, 10))
});

export const generateDestination = (id) => ({
  id,
  description: generateWords(generateRandomInt(10, 20)),
  name: names[generateRandomInt(0, names.length - 1)],
  pictures:
    Array.from({length: generateRandomInt(2, 10)}, generatePicture)
});


export const randomDesinations = (() => {
  const destinations = [];

  for (let i = 0; i <= 10; i++) {
    destinations.push(generateDestination(i));
  }

  return {
    getDestination: (id) => destinations[id],
    getAllDestinations: () => destinations,
  };
})();
