import lowerCase from 'lodash/lowerCase';

const getColor = label => {
  const color = /^[a-zA-Z]+/.exec(label);
  if (color) {
    return color[0].toLowerCase();
  }

  return 'black';
};

const sentenceCase = inputString => {
  const newString = lowerCase(inputString);

  return newString.charAt(0).toUpperCase() + newString.slice(1);
};

const fixBearing = bearing => bearing - 40;

export { getColor, sentenceCase, fixBearing };
