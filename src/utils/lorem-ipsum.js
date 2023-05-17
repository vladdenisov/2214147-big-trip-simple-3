import {generateRandomInt} from './random';

const words = [
  'Got',
  'ability',
  'shop',
  'recall',
  'fruit',
  'easy',
  'dirty',
  'giant',
  'shaking',
  'ground',
  'weather',
  'lesson',
  'almost',
  'square',
  'forward',
  'bend',
  'cold',
  'broken',
  'distant',
  'adjective.'
];
const getRandomWord = (firstLetterToUppercase = false) => {
  const word = words[generateRandomInt(0, words.length - 1)];
  return firstLetterToUppercase ? word.charAt(0).toUpperCase() + word.slice(1) : word;
};
export const generateWords = (length = 10) => `${[...Array(length)].map((_, i) => getRandomWord(i === 0)).join(' ').trim() }.`;
