export const getValidValue = (min, max, value) => {
  if (value >= min && value <= max) {
    return value;
  }
  const step = max - min + 1;
  while (value < min || value > max) {
    value += value < min ? step : -step;
  }
  return value;
};
