const getColor = (label) => {
  const color = /^[a-zA-Z]+/.exec(label);
  if (color) {
    return color[0].toLowerCase();
  }

  return 'black';
};

export default getColor;
