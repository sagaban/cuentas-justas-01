export const round = (value = 0, decimals = 0) =>
  Math.round(+value * Math.pow(10, decimals)) / Math.pow(10, decimals);
